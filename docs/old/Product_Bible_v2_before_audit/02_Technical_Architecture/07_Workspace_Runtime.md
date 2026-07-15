# Workspace Runtime

## Purpose

The Workspace Runtime manages every active Workspace inside Cosmos.

It is responsible for creating, restoring, updating and destroying Workspace sessions while maintaining a consistent user experience.

The Workspace Runtime coordinates Tool Instances, Layouts and Runtime Context.

---

# Philosophy

A Workspace is temporary.

The user's work is not.

The Workspace Runtime allows users to freely move between Workspaces while preserving their working environment.

Changing Workspaces should feel like walking to another desk rather than closing one application and opening another.

---

# Responsibilities

The Workspace Runtime is responsible for:

- opening Workspaces
- closing Workspaces
- restoring Workspace State
- managing Tool Instances
- managing Panels
- managing Layouts
- synchronizing Runtime Context
- tracking active Workspaces

The Workspace Runtime never performs business logic.

---

# Workspace Lifecycle

Every Workspace follows the same lifecycle.

```text
Created

↓

Initialized

↓

Active

↓

Background

↓

Closed
```

Closed Workspaces may later be restored.

---

# Active Workspace

Only one Workspace is normally focused.

Multiple Workspaces may remain active simultaneously.

Background Workspaces continue preserving:

- Tool state
- Layout
- Window positions
- Panel configuration

---

# Tool Instances

Every Workspace owns its Tool Instances.

Examples:

Workspace

↓

Capture

Archive

Blueprint Builder

↓

Individual Tool Instances

Tool Instances never belong to Projects.

They belong to the active Workspace session.

---

# Layout

The Workspace Runtime manages:

- floating windows
- docked panels
- split layouts
- fullscreen Tools
- sidebar visibility
- panel arrangement

Layout changes affect only the current Workspace.

---

# Panels

Panels are Runtime containers.

Examples include:

- left panel
- right panel
- inspector
- bottom panel
- floating window

Panels host Tool Instances.

They never contain business logic.

---

# Overlay

Every Workspace loads exactly one Overlay.

The Overlay defines:

- interaction points
- furniture
- physical appearance
- visual placement

Changing an Overlay never changes functionality.

---

# Context

The Workspace Runtime extends inherited Context.

Workspace Context includes:

- active Project
- active Room
- active Workspace
- active Tools
- current Object
- current filters

Whenever Workspace Context changes, Tool Instances are notified automatically.

---

# State

Every Workspace maintains Runtime State.

Examples include:

- open Tool Instances
- selected Objects
- camera position
- active panels
- scroll positions
- temporary drafts

Workspace State is restored whenever the Workspace is reopened.

---

# Synchronization

Workspace changes are synchronized automatically.

Examples include:

- Tool opened
- Tool closed
- Layout changed
- Panel moved
- Object selected

Synchronization should feel immediate.

---

# Events

The Workspace Runtime publishes Events including:

- WorkspaceOpened
- WorkspaceClosed
- WorkspaceFocused
- WorkspaceStateChanged
- LayoutChanged
- ToolOpened
- ToolClosed

Other Runtime systems subscribe through the Event Model.

---

# Failure Handling

Workspace failures remain isolated.

If one Workspace becomes invalid:

- its Tool Instances are safely closed
- its Runtime State is preserved whenever possible
- other Workspaces continue operating normally

One broken Workspace must never stop the Runtime.

---

# Persistence

The Workspace Runtime stores:

- Layout
- open Tool Instances
- Overlay
- Runtime State
- user preferences

Business data remains outside the Workspace Runtime.

---

# Extensibility

Future extensions may introduce:

- collaborative Workspaces
- multi-monitor Workspaces
- VR Workspaces
- custom panel systems
- advanced layout managers

All extensions integrate through the same Workspace Runtime contract.

---

# Design Goal

The Workspace Runtime should make every Workspace feel persistent and alive.

Users should always return to the same workplace exactly as they left it, allowing them to focus entirely on their work instead of managing software.

---

# Principles

- Workspaces are temporary.
- User work is persistent.
- Tool Instances belong to Workspaces.
- Layout belongs to the Workspace.
- Context updates automatically.
- Workspace failures remain isolated.
- State is restorable.
- Business logic remains outside the Workspace Runtime.
