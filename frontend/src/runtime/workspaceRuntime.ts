import { WindowRuntime, type WindowBounds } from "./windowRuntime";

export type WorkspaceSessionState = "created" | "initialized" | "active" | "background" | "closed";

export interface WorkspaceContext {
  projectScopeIds: readonly string[];
  focusedProjectId?: string;
  roomId?: string;
}

export interface WorkspaceDefinitionReference {
  objectId: string;
  displayName: string;
  context: WorkspaceContext;
  environmentBounds: WindowBounds;
}

export interface WorkspaceSession {
  sessionId: string;
  definitionObjectId: string;
  environmentWindowObjectId: string;
  context: WorkspaceContext;
  state: WorkspaceSessionState;
}

export class WorkspaceRuntimeError extends Error {
  constructor(
    readonly code: "duplicate_session" | "invalid_context" | "unknown_session",
    message: string,
  ) {
    super(message);
    this.name = "WorkspaceRuntimeError";
  }
}

export class WorkspaceRuntime {
  private readonly sessions = new Map<string, WorkspaceSession>();

  constructor(
    private readonly windows: WindowRuntime,
    private readonly createSessionId: () => string = () => crypto.randomUUID(),
  ) {}

  open(definition: WorkspaceDefinitionReference): Readonly<WorkspaceSession> {
    validateContext(definition.context);
    const previouslyActive = [...this.sessions.values()].find((session) => session.state === "active");
    this.backgroundFocusedSession();

    const sessionId = this.createSessionId();
    if (this.sessions.has(sessionId)) {
      if (previouslyActive) previouslyActive.state = "active";
      throw new WorkspaceRuntimeError("duplicate_session", `Duplicate Workspace session ID: ${sessionId}`);
    }
    const session: WorkspaceSession = {
      sessionId,
      definitionObjectId: definition.objectId,
      environmentWindowObjectId: `cosmos.window.workspace-session.${sessionId}`,
      context: copyContext(definition.context),
      state: "created",
    };
    this.sessions.set(sessionId, session);

    try {
      this.windows.open({
        objectId: session.environmentWindowObjectId,
        role: "workspace_environment",
        title: definition.displayName,
        bounds: { ...definition.environmentBounds },
      });
      session.state = "initialized";
      session.state = "active";
      return snapshot(session);
    } catch (error) {
      this.sessions.delete(sessionId);
      if (previouslyActive) {
        previouslyActive.state = "active";
        this.windows.focus(previouslyActive.environmentWindowObjectId);
      }
      throw error;
    }
  }

  focus(sessionId: string): Readonly<WorkspaceSession> {
    const selected = this.requireSession(sessionId);
    this.backgroundFocusedSession();
    selected.state = "active";
    this.windows.focus(selected.environmentWindowObjectId);
    return snapshot(selected);
  }

  close(sessionId: string): Readonly<WorkspaceSession> {
    const session = this.requireSession(sessionId);
    this.windows.close(session.environmentWindowObjectId);
    session.state = "closed";
    this.sessions.delete(sessionId);

    const next = [...this.sessions.values()].at(-1);
    if (next) this.focus(next.sessionId);
    return snapshot(session);
  }

  get(sessionId: string): Readonly<WorkspaceSession> {
    return snapshot(this.requireSession(sessionId));
  }

  list(): readonly Readonly<WorkspaceSession>[] {
    return [...this.sessions.values()].map(snapshot);
  }

  private requireSession(sessionId: string): WorkspaceSession {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new WorkspaceRuntimeError("unknown_session", `Unknown active Workspace session: ${sessionId}`);
    }
    return session;
  }

  private backgroundFocusedSession(): void {
    for (const session of this.sessions.values()) {
      if (session.state === "active") session.state = "background";
    }
  }
}

function validateContext(context: WorkspaceContext): void {
  if (
    context.projectScopeIds.some((projectId) => !projectId.trim()) ||
    new Set(context.projectScopeIds).size !== context.projectScopeIds.length
  ) {
    throw new WorkspaceRuntimeError(
      "invalid_context",
      "Workspace Project scopes must contain unique, non-empty Object IDs.",
    );
  }
  if (context.focusedProjectId && !context.projectScopeIds.includes(context.focusedProjectId)) {
    throw new WorkspaceRuntimeError(
      "invalid_context",
      "Focused Project must remain inside the Workspace's assigned Project scopes.",
    );
  }
}

function copyContext(context: WorkspaceContext): WorkspaceContext {
  return { ...context, projectScopeIds: [...context.projectScopeIds] };
}

function snapshot(session: WorkspaceSession): Readonly<WorkspaceSession> {
  return { ...session, context: copyContext(session.context) };
}
