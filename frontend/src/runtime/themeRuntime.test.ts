import { describe, expect, it } from "vitest";

import { cosmosTheme } from "../themes/cosmos";
import { ThemeRegistry, ThemeRegistryError } from "./themeRegistry";
import { ThemeRuntime, type ThemePresenter } from "./themeRuntime";
import { TransitionRuntime } from "./transitionRuntime";

class RecordingPresenter implements ThemePresenter {
  readonly applied: string[] = [];

  apply(definition: { objectId: string }): void {
    this.applied.push(definition.objectId);
  }
}

describe("ThemeRuntime", () => {
  it("loads validated Theme Objects through the registry", async () => {
    const registry = new ThemeRegistry();
    registry.register(cosmosTheme);
    const presenter = new RecordingPresenter();
    const runtime = new ThemeRuntime(
      registry,
      new TransitionRuntime(),
      cosmosTheme.objectId,
      presenter,
    );

    await expect(runtime.activate(cosmosTheme.objectId)).resolves.toMatchObject({
      objectId: cosmosTheme.objectId,
    });
    expect(runtime.active?.objectId).toBe(cosmosTheme.objectId);
    expect(presenter.applied).toEqual([cosmosTheme.objectId]);
  });

  it("falls back to the default Theme when resolution fails", async () => {
    const registry = new ThemeRegistry();
    registry.register(cosmosTheme);
    const runtime = new ThemeRuntime(registry, new TransitionRuntime(), cosmosTheme.objectId);

    await expect(runtime.activate("missing.theme")).resolves.toMatchObject({
      objectId: cosmosTheme.objectId,
    });
  });

  it("rejects duplicate or behavior-like unnamespaced definitions", () => {
    const registry = new ThemeRegistry();
    registry.register(cosmosTheme);

    expect(() => registry.register(cosmosTheme)).toThrowError(ThemeRegistryError);
    expect(() =>
      registry.register({
        ...cosmosTheme,
        objectId: "cosmos.theme.invalid",
        tokens: { navigationMode: "teleport" },
      }),
    ).toThrow("--cosmos-");
  });
});
