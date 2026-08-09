export type BaseThemeVisuals = "core" | "theme";

/** Theme art is opt-in until the controlled visual cutover is accepted. */
export function resolveBaseThemeVisuals(value: unknown): BaseThemeVisuals {
  return value === "theme" ? "theme" : "core";
}

export const configuredBaseThemeVisuals = resolveBaseThemeVisuals(
  import.meta.env.VITE_BASE_THEME_VISUALS,
);
