import type { ThemeDefinition } from "../runtime/themeRegistry";

export const cosmosTheme: ThemeDefinition = {
  objectId: "cosmos.theme.cosmos",
  displayName: "Cosmos",
  version: "1.0.0",
  tokens: {
    "--cosmos-color-background": "#050711",
    "--cosmos-color-surface": "rgba(15, 20, 38, 0.76)",
    "--cosmos-color-border": "rgba(226, 232, 240, 0.16)",
    "--cosmos-color-text": "#e2e8f0",
    "--cosmos-color-muted": "#94a3b8",
    "--cosmos-color-accent": "#8b5cf6",
    "--cosmos-window-shadow": "0 24px 80px rgba(0, 0, 0, 0.36)",
    "--cosmos-transition-duration": "180ms",
  },
};
