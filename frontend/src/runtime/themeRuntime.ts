import { ThemeRegistry, type ThemeDefinition } from "./themeRegistry";
import { TransitionRuntime } from "./transitionRuntime";

export interface ThemePresenter {
  apply(definition: Readonly<ThemeDefinition>): void | Promise<void>;
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

  constructor(
    private readonly registry: ThemeRegistry,
    private readonly transitions: TransitionRuntime,
    private readonly fallbackThemeId: string,
    private readonly presenter: ThemePresenter = new DomThemePresenter(),
  ) {}

  get active(): Readonly<ThemeDefinition> | null {
    return this.activeDefinition;
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
          this.activeDefinition = requested;
          return requested;
        } catch (error) {
          const fallback = this.registry.resolve(this.fallbackThemeId);
          if (requested.objectId === fallback.objectId) throw error;
          await this.presenter.apply(fallback);
          this.activeDefinition = fallback;
          return fallback;
        }
      },
    });
  }
}
