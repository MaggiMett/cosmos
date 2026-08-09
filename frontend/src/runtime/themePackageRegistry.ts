import type { CosmosApiClient } from "./apiClient";
import { ThemeRegistry, type ThemeDefinition } from "./themeRegistry";
import type { ThemeManifest, TypedToken } from "../theme-engine/types";
import {
  compareVersions,
  parseVersion,
  satisfiesVersionRange,
} from "../theme-engine/version";

const THEME_ENGINE_VERSION = "1.0.0";

export interface InstalledThemePackageRecord {
  readonly schemaVersion: 1;
  readonly packageId: string;
  readonly packageVersion: string;
  readonly themeId: string;
  readonly manifestVersion: 1;
  readonly displayName: string;
  readonly description: string | null;
  readonly author: unknown | null;
  readonly installStatus: "installed";
  readonly source: Readonly<{ kind: "prevalidated"; provenance: string }>;
  readonly manifestDigest: string;
  readonly manifest: unknown;
  readonly installedAt: string;
  readonly updatedAt: string;
}

export type ThemePackageLoadStatus =
  | "registered"
  | "superseded"
  | "invalid"
  | "unavailable"
  | "conflict"
  | "registry-unavailable";

export interface ThemePackageLoadDiagnostic {
  readonly packageId: string | null;
  readonly packageVersion: string | null;
  readonly themeId: string | null;
  readonly status: ThemePackageLoadStatus;
  readonly message: string;
}

export interface ThemePackageLoadReport {
  readonly diagnostics: readonly Readonly<ThemePackageLoadDiagnostic>[];
  readonly registeredThemeIds: readonly string[];
}

export interface ThemePackageRecordSource {
  listInstalled(): Promise<readonly unknown[]>;
}

export interface ThemePackageStartupLoader {
  readonly lastReport: Readonly<ThemePackageLoadReport> | null;
  load(): Promise<Readonly<ThemePackageLoadReport>>;
}

export class ApiThemePackageRecordSource implements ThemePackageRecordSource {
  constructor(private readonly api: CosmosApiClient) {}

  async listInstalled(): Promise<readonly unknown[]> {
    const result = await this.api.get<{ items: unknown }>("/theme-packages");
    if (!result.ok) throw new Error(result.error.message);
    if (!Array.isArray(result.data.items)) {
      throw new Error("Installed Theme Package response must contain an items array.");
    }
    return result.data.items;
  }
}

interface ValidatedCandidate {
  readonly record: Readonly<InstalledThemePackageRecord>;
  readonly manifest: Readonly<ThemeManifest>;
  readonly definition: Readonly<ThemeDefinition>;
}

export class InstalledThemePackageLoader implements ThemePackageStartupLoader {
  private report: Readonly<ThemePackageLoadReport> | null = null;

  constructor(
    private readonly source: ThemePackageRecordSource,
    private readonly registry: ThemeRegistry,
    private readonly coreThemeId: string,
  ) {}

  get lastReport(): Readonly<ThemePackageLoadReport> | null {
    return this.report;
  }

  async load(): Promise<Readonly<ThemePackageLoadReport>> {
    if (
      this.report &&
      !this.report.diagnostics.some((entry) => entry.status === "registry-unavailable")
    ) {
      return this.report;
    }

    let values: readonly unknown[];
    try {
      values = await this.source.listInstalled();
    } catch (error) {
      return this.commitReport([
        diagnostic(
          null,
          "registry-unavailable",
          error instanceof Error ? error.message : "Installed Theme Packages are unavailable.",
        ),
      ]);
    }

    const diagnostics: ThemePackageLoadDiagnostic[] = [];
    const candidates: ValidatedCandidate[] = [];
    const coreTheme = this.registry.resolve(this.coreThemeId);
    for (const value of values) {
      try {
        candidates.push(await validateCandidate(value, coreTheme.tokens));
      } catch (error) {
        diagnostics.push(
          diagnostic(
            identityFromUnknown(value),
            error instanceof ThemePackageCompatibilityError ? "unavailable" : "invalid",
            error instanceof Error ? error.message : "Installed Theme Package is invalid.",
          ),
        );
      }
    }

    const candidatesByTheme = new Map<string, ValidatedCandidate[]>();
    for (const candidate of candidates) {
      const group = candidatesByTheme.get(candidate.manifest.themeId) ?? [];
      group.push(candidate);
      candidatesByTheme.set(candidate.manifest.themeId, group);
    }

    const registeredThemeIds: string[] = [];
    for (const themeId of [...candidatesByTheme.keys()].sort()) {
      const versions = candidatesByTheme.get(themeId) ?? [];
      versions.sort(compareCandidates);
      const selected = versions[0];
      if (!selected) continue;

      for (const superseded of versions.slice(1)) {
        diagnostics.push(
          diagnostic(
            superseded.record,
            "superseded",
            `A newer installed version of ${themeId} was selected deterministically.`,
          ),
        );
      }

      if (this.registry.has(themeId)) {
        diagnostics.push(
          diagnostic(
            selected.record,
            "conflict",
            `Theme ${themeId} is already registered and cannot be overwritten by a package.`,
          ),
        );
        continue;
      }

      try {
        this.registry.register(selected.definition);
        registeredThemeIds.push(themeId);
        diagnostics.push(
          diagnostic(selected.record, "registered", `Theme ${themeId} is available.`),
        );
      } catch (error) {
        diagnostics.push(
          diagnostic(
            selected.record,
            "invalid",
            error instanceof Error ? error.message : `Theme ${themeId} could not be registered.`,
          ),
        );
      }
    }

    return this.commitReport(diagnostics, registeredThemeIds);
  }

  private commitReport(
    diagnostics: ThemePackageLoadDiagnostic[],
    registeredThemeIds: string[] = [],
  ): Readonly<ThemePackageLoadReport> {
    diagnostics.sort(
      (left, right) =>
        (left.themeId ?? "").localeCompare(right.themeId ?? "") ||
        (left.packageId ?? "").localeCompare(right.packageId ?? "") ||
        (left.packageVersion ?? "").localeCompare(right.packageVersion ?? ""),
    );
    this.report = Object.freeze({
      diagnostics: Object.freeze(diagnostics.map((entry) => Object.freeze({ ...entry }))),
      registeredThemeIds: Object.freeze([...registeredThemeIds].sort()),
    });
    return this.report;
  }
}

export async function createThemeManifestDigest(manifest: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(canonicalJson(manifest));
  const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function validateCandidate(
  value: unknown,
  coreTokens: Readonly<Record<string, string>>,
): Promise<ValidatedCandidate> {
  const record = validateRecordEnvelope(value);
  if (await createThemeManifestDigest(record.manifest) !== record.manifestDigest) {
    throw new Error(
      `Theme Package ${record.packageId}@${record.packageVersion} failed manifest integrity validation.`,
    );
  }

  const { validateThemeManifest } = await import("../theme-engine/validation");
  const manifest = validateThemeManifest(record.manifest);
  if (
    manifest.themeId !== record.themeId ||
    manifest.version !== record.packageVersion ||
    manifest.schemaVersion !== record.manifestVersion ||
    manifest.displayName !== record.displayName ||
    (manifest.description ?? null) !== record.description ||
    canonicalJson(manifest.author ?? null) !== canonicalJson(record.author)
  ) {
    throw new Error(
      `Theme Package ${record.packageId}@${record.packageVersion} metadata does not match its manifest.`,
    );
  }
  if (manifest.packageKind !== "full-theme") {
    throw new ThemePackageCompatibilityError(
      `Theme Package ${record.packageId}@${record.packageVersion} is not a full Theme.`,
    );
  }
  if (!satisfiesVersionRange(THEME_ENGINE_VERSION, manifest.compatibility.themeEngine)) {
    throw new ThemePackageCompatibilityError(
      `Theme ${manifest.themeId}@${manifest.version} is incompatible with Theme Engine ${THEME_ENGINE_VERSION}.`,
    );
  }

  return Object.freeze({
    record,
    manifest,
    definition: themeDefinitionFromManifest(manifest, coreTokens),
  });
}

function validateRecordEnvelope(value: unknown): Readonly<InstalledThemePackageRecord> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Installed Theme Package record must be an object.");
  }
  const record = value as Partial<InstalledThemePackageRecord>;
  const allowedKeys = new Set([
    "schemaVersion",
    "packageId",
    "packageVersion",
    "themeId",
    "manifestVersion",
    "displayName",
    "description",
    "author",
    "installStatus",
    "source",
    "manifestDigest",
    "manifest",
    "installedAt",
    "updatedAt",
  ]);
  if (
    Object.keys(record).some((key) => !allowedKeys.has(key)) ||
    record.schemaVersion !== 1 ||
    typeof record.packageId !== "string" ||
    !/^[a-z0-9]+(?:[._-][a-z0-9]+)+$/.test(record.packageId) ||
    typeof record.packageVersion !== "string" ||
    parseVersion(record.packageVersion) === null ||
    typeof record.themeId !== "string" ||
    record.manifestVersion !== 1 ||
    typeof record.displayName !== "string" ||
    record.installStatus !== "installed" ||
    typeof record.manifestDigest !== "string" ||
    !/^[a-f0-9]{64}$/.test(record.manifestDigest) ||
    typeof record.installedAt !== "string" ||
    typeof record.updatedAt !== "string" ||
    !record.source ||
    record.source.kind !== "prevalidated" ||
    typeof record.source.provenance !== "string"
  ) {
    throw new Error("Installed Theme Package record envelope is invalid.");
  }
  return Object.freeze(record as InstalledThemePackageRecord);
}

function themeDefinitionFromManifest(
  manifest: Readonly<ThemeManifest>,
  coreTokens: Readonly<Record<string, string>>,
): Readonly<ThemeDefinition> {
  const tokens: Record<string, string> = { ...coreTokens };
  let mappedTokenCount = 0;
  for (const [tokenId, token] of Object.entries(manifest.tokens)) {
    if (!tokenId.startsWith("cosmos.")) {
      throw new ThemePackageCompatibilityError(
        `Theme ${manifest.themeId} token ${tokenId} has no current Cosmos DOM alias.`,
      );
    }
    tokens[`--${tokenId.replace(/[._]/g, "-")}`] = tokenValue(token);
    mappedTokenCount += 1;
  }
  if (mappedTokenCount === 0) {
    throw new ThemePackageCompatibilityError(
      `Theme ${manifest.themeId} has no current Cosmos DOM-compatible tokens.`,
    );
  }
  return Object.freeze({
    objectId: manifest.themeId,
    displayName: manifest.displayName,
    version: manifest.version,
    description: manifest.description,
    author: manifest.author?.name,
    tokens: Object.freeze(tokens),
  });
}

function tokenValue(token: Readonly<TypedToken>): string {
  return typeof token.value === "string" ? token.value : String(token.value);
}

function compareCandidates(left: ValidatedCandidate, right: ValidatedCandidate): number {
  return (
    compareVersions(right.manifest.version, left.manifest.version) ||
    left.record.packageId.localeCompare(right.record.packageId) ||
    left.record.packageVersion.localeCompare(right.record.packageVersion)
  );
}

function diagnostic(
  identity: Partial<InstalledThemePackageRecord> | null,
  status: ThemePackageLoadStatus,
  message: string,
): ThemePackageLoadDiagnostic {
  return {
    packageId: typeof identity?.packageId === "string" ? identity.packageId : null,
    packageVersion:
      typeof identity?.packageVersion === "string" ? identity.packageVersion : null,
    themeId: typeof identity?.themeId === "string" ? identity.themeId : null,
    status,
    message,
  };
}

function identityFromUnknown(value: unknown): Partial<InstalledThemePackageRecord> | null {
  return value && typeof value === "object"
    ? (value as Partial<InstalledThemePackageRecord>)
    : null;
}

function canonicalJson(value: unknown): string {
  if (value === null || typeof value === "string" || typeof value === "boolean") {
    return JSON.stringify(value);
  }
  if (typeof value === "number" && Number.isFinite(value)) return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    return `{${Object.entries(value)
      .sort(([left], [right]) => (left < right ? -1 : left > right ? 1 : 0))
      .map(([key, entry]) => `${JSON.stringify(key)}:${canonicalJson(entry)}`)
      .join(",")}}`;
  }
  throw new Error("Theme Manifest contains a non-JSON value.");
}

class ThemePackageCompatibilityError extends Error {}
