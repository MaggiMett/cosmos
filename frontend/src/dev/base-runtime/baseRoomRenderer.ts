export type BaseRoomRenderer = "presenter" | "composition";

/** Only the explicit `composition` value enables the guarded renderer. */
export function resolveBaseRoomRenderer(value: unknown): BaseRoomRenderer {
  return value === "composition" ? "composition" : "presenter";
}

export const configuredBaseRoomRenderer = resolveBaseRoomRenderer(
  import.meta.env.VITE_BASE_ROOM_RENDERER,
);
