export type BasePresenter = "legacy" | "new";

/** Only the explicit `new` value enables the prepared presenter cutover. */
export function resolveBasePresenter(value: unknown): BasePresenter {
  return value === "new" ? "new" : "legacy";
}

export const configuredBasePresenter = resolveBasePresenter(
  import.meta.env.VITE_BASE_PRESENTER,
);
