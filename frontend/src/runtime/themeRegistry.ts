export interface ThemeDefinition {
  objectId: string;
  displayName: string;
  version: string;
  description?: string;
  author?: string;
  tokens: Readonly<Record<string, string>>;
}

export class ThemeRegistryError extends Error {
  constructor(
    readonly code: "duplicate_theme" | "invalid_theme" | "unknown_theme",
    message: string,
  ) {
    super(message);
    this.name = "ThemeRegistryError";
  }
}

export class ThemeRegistry {
  private readonly definitions = new Map<string, Readonly<ThemeDefinition>>();

  register(definition: ThemeDefinition): Readonly<ThemeDefinition> {
    validateTheme(definition);
    if (this.definitions.has(definition.objectId)) {
      throw new ThemeRegistryError("duplicate_theme", `Theme is already registered: ${definition.objectId}`);
    }
    const registered = freezeDefinition(definition);
    this.definitions.set(registered.objectId, registered);
    return registered;
  }

  resolve(objectId: string): Readonly<ThemeDefinition> {
    const definition = this.definitions.get(objectId);
    if (!definition) {
      throw new ThemeRegistryError("unknown_theme", `Unknown Theme: ${objectId}`);
    }
    return definition;
  }

  has(objectId: string): boolean {
    return this.definitions.has(objectId);
  }

  list(): readonly Readonly<ThemeDefinition>[] {
    return [...this.definitions.values()].sort((left, right) =>
      left.objectId.localeCompare(right.objectId),
    );
  }
}

function validateTheme(definition: ThemeDefinition): void {
  if (!definition.objectId.trim() || !definition.displayName.trim() || !definition.version.trim()) {
    throw new ThemeRegistryError("invalid_theme", "Theme identity, display name and version are required.");
  }
  const entries = Object.entries(definition.tokens);
  if (entries.length === 0) {
    throw new ThemeRegistryError("invalid_theme", "A Theme must provide presentation tokens.");
  }
  if (entries.some(([name, value]) => !name.startsWith("--cosmos-") || !value.trim())) {
    throw new ThemeRegistryError(
      "invalid_theme",
      "Theme tokens must use the --cosmos- namespace and contain values.",
    );
  }
}

function freezeDefinition(definition: ThemeDefinition): Readonly<ThemeDefinition> {
  return Object.freeze({ ...definition, tokens: Object.freeze({ ...definition.tokens }) });
}
