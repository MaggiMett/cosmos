import { ThemeRegistry, type ThemeDefinition } from "./themeRegistry";
import {
  createThemeRuntimeReadSnapshot,
  type ThemeRuntimeReadSnapshot,
} from "./themeRuntimeReadSnapshot";
import { TransitionRuntime } from "./transitionRuntime";

export interface ThemePresenter {
  apply(definition: Readonly<ThemeDefinition>): void | Promise<void>;
}

export interface PreparedThemeActivation {
  readonly themeId: string;
  readonly lastKnownGoodThemeId: string;
}

export type ThemeActivationErrorCode =
  | "invalid_preflight"
  | "stale_preparation"
  | "apply_failed"
  | "rollback_failed";

export class ThemeActivationError extends Error {
  constructor(
    readonly code: ThemeActivationErrorCode,
    message: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "ThemeActivationError";
  }
}

export class DomThemePresenter implements ThemePresenter {
  private appliedTokens = new Set<string>();

  apply(definition: Readonly<ThemeDefinition>): void {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    for (const name of this.appliedTokens) {
      if (!(name in definition.tokens)) root.style.removeProperty(name);
    }
    for (const [name, value] of Object.entries(definition.tokens)) {
      root.style.setProperty(name, value);
    }
    this.appliedTokens = new Set(Object.keys(definition.tokens));
    root.dataset.themeObject = definition.objectId;
  }
}

export class ThemeRuntime {
  private activeDefinition: Readonly<ThemeDefinition> | null = null;
  private lastKnownGoodThemeId: string;

  constructor(
    private readonly registry: ThemeRegistry,
    private readonly transitions: TransitionRuntime,
    private readonly fallbackThemeId: string,
    private readonly presenter: ThemePresenter = new DomThemePresenter(),
  ) {
    const fallback = this.registry.resolve(this.fallbackThemeId);
    assertRuntimeReady(fallback);
    this.lastKnownGoodThemeId = fallback.objectId;
  }

  get active(): Readonly<ThemeDefinition> | null {
    return this.activeDefinition;
  }

  readSnapshot(): Readonly<ThemeRuntimeReadSnapshot> {
    return createThemeRuntimeReadSnapshot(
      this.registry.list(),
      this.activeDefinition?.objectId ?? null,
      this.lastKnownGoodThemeId,
      this.fallbackThemeId,
    );
  }

  prepareActivation(themeId: string): Readonly<PreparedThemeActivation> {
    const requested = this.registry.resolve(themeId);
    const lastKnownGood = this.registry.resolve(this.lastKnownGoodThemeId);
    assertRuntimeReady(requested);
    assertRuntimeReady(lastKnownGood);

    return Object.freeze({
      themeId: requested.objectId,
      lastKnownGoodThemeId: lastKnownGood.objectId,
    });
  }

  applyPreparedTheme(
    prepared: Readonly<PreparedThemeActivation>,
  ): Promise<Readonly<ThemeDefinition>> {
    const requested = this.registry.resolve(prepared.themeId);
    assertRuntimeReady(requested);

    return this.transitions.enqueue({
      kind: "theme",
      targetId: requested.objectId,
      run: async () => {
        if (prepared.lastKnownGoodThemeId !== this.lastKnownGoodThemeId) {
          throw new ThemeActivationError(
            "stale_preparation",
            `Prepared Theme activation is stale: ${prepared.themeId}`,
          );
        }

        const rollbackDefinition = this.registry.resolve(this.lastKnownGoodThemeId);
        assertRuntimeReady(rollbackDefinition);

        try {
          await this.presenter.apply(requested);
        } catch (applyError) {
          await this.restoreAfterFailedApply(rollbackDefinition, requested, applyError);
        }

        this.commit(requested);
        return requested;
      },
    });
  }

  rollbackToLastKnownGood(): Promise<Readonly<ThemeDefinition>> {
    const lastKnownGood = this.registry.resolve(this.lastKnownGoodThemeId);
    assertRuntimeReady(lastKnownGood);

    return this.transitions.enqueue({
      kind: "theme",
      targetId: lastKnownGood.objectId,
      run: async () => {
        try {
          await this.presenter.apply(lastKnownGood);
          this.activeDefinition = lastKnownGood;
          return lastKnownGood;
        } catch (error) {
          return this.restoreCoreFallback(lastKnownGood, error);
        }
      },
    });
  }

  load(objectId: string): Readonly<ThemeDefinition> {
    try {
      return this.registry.resolve(objectId);
    } catch {
      return this.registry.resolve(this.fallbackThemeId);
    }
  }

  activate(objectId: string): Promise<Readonly<ThemeDefinition>> {
    const requested = this.load(objectId);
    return this.transitions.enqueue({
      kind: "theme",
      targetId: requested.objectId,
      run: async () => {
        try {
          await this.presenter.apply(requested);
          this.commit(requested);
          return requested;
        } catch (error) {
          const fallback = this.registry.resolve(this.fallbackThemeId);
          if (requested.objectId === fallback.objectId) throw error;
          await this.presenter.apply(fallback);
          this.commit(fallback);
          return fallback;
        }
      },
    });
  }

  private commit(definition: Readonly<ThemeDefinition>): void {
    this.activeDefinition = definition;
    this.lastKnownGoodThemeId = definition.objectId;
  }

  private async restoreAfterFailedApply(
    rollbackDefinition: Readonly<ThemeDefinition>,
    requested: Readonly<ThemeDefinition>,
    applyError: unknown,
  ): Promise<never> {
    try {
      await this.presenter.apply(rollbackDefinition);
      this.activeDefinition = rollbackDefinition;
    } catch (rollbackError) {
      await this.restoreCoreFallback(rollbackDefinition, rollbackError);
    }

    throw new ThemeActivationError(
      "apply_failed",
      `Theme could not be applied and was rolled back: ${requested.objectId}`,
      { cause: applyError },
    );
  }

  private async restoreCoreFallback(
    failedRollback: Readonly<ThemeDefinition>,
    rollbackError: unknown,
  ): Promise<Readonly<ThemeDefinition>> {
    const fallback = this.registry.resolve(this.fallbackThemeId);
    assertRuntimeReady(fallback);
    if (fallback.objectId === failedRollback.objectId) {
      this.activeDefinition = null;
      throw new ThemeActivationError(
        "rollback_failed",
        `Could not restore Core fallback Theme: ${fallback.objectId}`,
        { cause: rollbackError },
      );
    }

    try {
      await this.presenter.apply(fallback);
      this.commit(fallback);
      return fallback;
    } catch (fallbackError) {
      this.activeDefinition = null;
      throw new ThemeActivationError(
        "rollback_failed",
        `Could not restore Core fallback Theme: ${fallback.objectId}`,
        { cause: fallbackError },
      );
    }
  }
}

function assertRuntimeReady(definition: Readonly<ThemeDefinition>): void {
  const tokenEntries = Object.entries(definition.tokens);
  const invalid =
    !definition.objectId.trim() ||
    !definition.displayName.trim() ||
    !definition.version.trim() ||
    tokenEntries.length === 0 ||
    tokenEntries.some(([name, value]) => !name.startsWith("--cosmos-") || !value.trim());

  if (invalid) {
    throw new ThemeActivationError(
      "invalid_preflight",
      `Theme is not ready for Runtime activation: ${definition.objectId || "unknown"}`,
    );
  }
}
