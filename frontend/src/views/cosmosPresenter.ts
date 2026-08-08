export type CosmosPresenter = "legacy" | "new";

export function resolveCosmosPresenter(value: unknown): CosmosPresenter {
  return value === "new" ? "new" : "legacy";
}

export const configuredCosmosPresenter = resolveCosmosPresenter(
  import.meta.env.VITE_COSMOS_PRESENTER,
);
