# Context

## Purpose

Context represents the current working situation inside Cosmos.

It provides every Runtime component with the information required to understand where the user is working, what they are working on and how that work relates to the rest of the system.

Context reduces repeated configuration without changing persistent meaning.

---

# Philosophy

Users should not repeatedly explain their current Project, Workspace, Tool or Object.

Cosmos composes Context from the active Runtime path and assigned Context Tags.

Every Tool receives Context from the Runtime instead of discovering it independently.

---

# Responsibilities

Context is responsible for:

- providing working scope
- combining inherited semantic information
- filtering relevant content
- reducing manual configuration
- supporting intelligent systems
- preserving consistency across Runtime actions

Context never performs work.

It only describes the current situation.

---

# Context Path

Context is composed through the active Runtime path.

```text
Cosmos
    ↓
Optional Project Scope
    ↓
Room
    ↓
Workspace
    ↓
Tool
    ↓
Object
    ↓
Knowledge
```

Each level contributes additional Context.

Lower levels extend inherited Context and never silently replace it.

---

# Optional Project Scope

Project Context is optional.

A user may work globally without a focused Project.

A Workspace may carry:

- no Project Tag
- one Project Tag
- multiple Project Tags

This allows project-specific Workspaces and cross-project Workspaces without introducing separate Workspace types.

---

# Context Components

A Runtime Context may contain:

- active or assigned Project IDs
- active Room
- active Workspace
- active Tool Instance
- active Object
- inherited System Tags
- inherited User Tags
- Theme and Skin information
- permissions
- Runtime state

Different Tools may use different parts of the available Context.

---

# Context Tags

Context is primarily expressed through additive Tags.

Examples include:

System Tags:

- Project
- Room
- Workspace
- Tool
- Object
- Blueprint

User Tags:

- Lore
- Dwarfs
- Mining
- Magic

A Tool receives the merged Context Tags of the current path plus its local additions.

---

# Workspace Context

Every Workspace defines its own Context additions.

Examples include:

- assigned Project Tags
- preferred Objects
- default Archive filters
- active Branches
- User Tags

When the user changes Project focus, the Layout and Panels may remain while content and filters update to the new Context.

---

# Tool Context

Tools never discover Context themselves.

The Runtime provides Context before any Tool action.

This keeps Tool definitions reusable and prevents duplicated Context logic.

---

# Object and Knowledge Context

Selecting an Object adds Object-specific Context.

Knowledge created or opened through that Object may inherit the Object and Workspace Tags.

Inherited Tags remain removable where the product explicitly allows user control, but the original source Context remains traceable.

---

# Context Snapshots

Long-running operations receive immutable Context Snapshots.

A Snapshot may contain:

- Project scopes
- Room and Workspace IDs
- Tool and Object IDs
- inherited Tags
- permissions
- initiating user
- timestamp

Later navigation does not alter a running operation.

---

# Discovery

Context allows Analysis and Companion features to remain relevant.

It supports discovery of:

- related Objects
- duplicate Knowledge
- missing information
- inconsistent Tags
- potential Relationships

Discovery remains scoped to relevant Context unless a global analysis is explicitly requested.

---

# Persistence

Context itself is Runtime data.

Persistent Workspace definitions, assigned Tags and restorable state are stored separately.

Context is rebuilt from those durable sources whenever the Runtime starts or navigation changes.

---

# Extensibility

Extensions may contribute additional Context fields and Tags through defined contracts.

They may not create independent Context systems.

---

# Design Goal

Context should become invisible.

Users should experience Cosmos as understanding where they are and what they are trying to accomplish without repeated configuration.

---

# Principles

- Context is composed additively.
- Project scope is optional.
- Workspaces may carry Project Tags.
- Tools receive Context from the Runtime.
- Context never owns persistent meaning.
- Snapshots preserve long-running work.
- Extensions share one Context model.
