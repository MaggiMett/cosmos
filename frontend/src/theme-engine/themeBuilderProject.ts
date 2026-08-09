import type { CatalogObject, RoomShell } from "./roomCompositionTypes";
import type { SkinPack, ThemeManifest, VersionedRef } from "./types";
import { cloneAndFreeze } from "./immutable";

export interface ThemeBuilderProjectMetadata {
  name: string;
  description: string;
  author: string;
}

export interface ThemeBuilderProjectArtifacts {
  skinPacks: readonly SkinPack[];
  roomShells: readonly RoomShell[];
  catalogObjects: readonly CatalogObject[];
}

export interface ThemeBuilderProject {
  schemaVersion: 1;
  builderProjectId: string;
  revision: number;
  createdAt: string;
  updatedAt: string;
  contractVersions: Readonly<{ themeBuilder: string; themeEngine: string }>;
  themeId: string;
  packageId: string;
  name: string;
  description: string;
  author: string;
  packageType: "full-theme" | "group-pack";
  themeVersion: string;
  packageVersion: string;
  manifestDraft: ThemeManifest;
  artifacts: ThemeBuilderProjectArtifacts;
  assetRefs: readonly VersionedRef[];
}

export function validateThemeBuilderProject(value: unknown): Readonly<ThemeBuilderProject> {
  if (!isRecord(value) || value.schemaVersion !== 1) invalid();
  const project = value as unknown as ThemeBuilderProject;
  for (const key of ["builderProjectId", "themeId", "packageId", "name"] as const) {
    if (typeof project[key] !== "string" || !project[key].trim()) invalid();
  }
  for (const key of ["description", "author", "createdAt", "updatedAt"] as const) {
    if (typeof project[key] !== "string") invalid();
  }
  if (!Number.isInteger(project.revision) || project.revision < 1) invalid();
  if (!isRecord(project.contractVersions)) invalid();
  if (!isRecord(project.manifestDraft) || !isRecord(project.artifacts)) invalid();
  if (
    !Array.isArray(project.artifacts.skinPacks) ||
    !Array.isArray(project.artifacts.roomShells) ||
    !Array.isArray(project.artifacts.catalogObjects) ||
    !Array.isArray(project.assetRefs)
  ) invalid();
  if (
    project.manifestDraft.themeId !== project.themeId ||
    project.manifestDraft.displayName !== project.name ||
    project.manifestDraft.version !== project.themeVersion
  ) invalid();
  return cloneAndFreeze(project);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function invalid(): never {
  throw new Error("Theme Builder Project response is invalid.");
}
