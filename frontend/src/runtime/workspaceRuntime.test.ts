import { describe, expect, it } from "vitest";

import { WindowRuntime } from "./windowRuntime";
import { WorkspaceRuntime, WorkspaceRuntimeError } from "./workspaceRuntime";

const definition = {
  objectId: "cosmos.workspace.knowledge",
  displayName: "Knowledge Workspace",
  context: { projectScopeIds: ["project.alpha"], focusedProjectId: "project.alpha" },
  environmentBounds: { x: 100, y: 80, width: 1200, height: 800 },
};

describe("WorkspaceRuntime", () => {
  it("opens temporary sessions with distinct fixed Environment Windows", () => {
    const windows = new WindowRuntime();
    const ids = ["session-a", "session-b"];
    const runtime = new WorkspaceRuntime(windows, () => ids.shift() ?? "unexpected");

    const first = runtime.open(definition);
    const second = runtime.open({ ...definition, objectId: "cosmos.workspace.creation" });

    expect(runtime.get(first.sessionId).state).toBe("background");
    expect(second.state).toBe("active");
    expect(windows.get(second.environmentWindowObjectId).capabilities).toMatchObject({
      movable: false,
      resizable: false,
    });
    expect(first.environmentWindowObjectId).not.toBe(second.environmentWindowObjectId);
  });

  it("focuses and closes sessions without removing their definitions", () => {
    const windows = new WindowRuntime();
    const runtime = new WorkspaceRuntime(windows, () => "session-a");
    const session = runtime.open(definition);

    expect(runtime.focus(session.sessionId).state).toBe("active");
    expect(runtime.close(session.sessionId)).toMatchObject({
      definitionObjectId: definition.objectId,
      state: "closed",
    });
    expect(runtime.list()).toEqual([]);
  });

  it("enforces additive Project focus", () => {
    const runtime = new WorkspaceRuntime(new WindowRuntime(), () => "session-a");

    expect(() =>
      runtime.open({
        ...definition,
        context: { projectScopeIds: ["project.alpha"], focusedProjectId: "project.beta" },
      }),
    ).toThrowError(WorkspaceRuntimeError);
  });

  it("restores the focused session when another Workspace fails to open", () => {
    const windows = new WindowRuntime();
    const runtime = new WorkspaceRuntime(windows, () => "session-a");
    const active = runtime.open(definition);

    expect(() => runtime.open({ ...definition, objectId: "cosmos.workspace.creation" })).toThrow(
      "Duplicate Workspace session ID",
    );
    expect(runtime.get(active.sessionId).state).toBe("active");
    expect(windows.get(active.environmentWindowObjectId).state).toBe("active");
  });
});
