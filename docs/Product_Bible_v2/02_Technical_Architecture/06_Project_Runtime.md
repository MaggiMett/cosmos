# Project Runtime

## Purpose

The Project Runtime manages the lifecycle of Projects while Cosmos is running.

It is responsible for loading, activating, synchronizing and unloading Projects while preserving Context and Runtime consistency.

The Project Runtime is the bridge between persistent Project data and the active Runtime.

---

# Philosophy

Projects are permanent.

Runtime is temporary.

The Project Runtime brings Projects into the active Runtime whenever they are needed and safely releases them when they are no longer active.

Projects never disappear.

Only their Runtime representation changes.

---

# Responsibilities

The Project Runtime is responsible for:

- loading Projects
- activating Projects
- unloading Projects
- synchronizing Runtime state
- contributing assigned Project scopes and optional Project focus to Runtime Context
- coordinating Runtime Services
- managing Project lifetime
- exposing active Projects

The Project Runtime never performs business logic.

---

# Project Lifecycle

Every Project follows the same Runtime lifecycle.

```text
Discovered

↓

Loaded

↓

Initialized

↓

Active

↓

Suspended

↓

Unloaded
```

Only Active Projects participate in the Runtime.

---

# Loading

Loading a Project includes:

- reading Project metadata
- restoring Runtime state
- loading Objects
- restoring Relationships
- restoring Workspace references
- restoring Context

Loading never modifies Project content.

---

# Initialization

During initialization the Runtime:

- validates the Project
- resolves Extensions
- restores Context
- prepares Runtime Services
- registers active Objects

The Project becomes available only after successful initialization.

---

# Active Projects

Active Projects participate in the Runtime.

Active Projects may:

- receive Context
- participate in opening Workspace sessions through Runtime Services
- execute Tools
- create Jobs
- receive Events

Multiple Projects may remain loaded simultaneously.

One Project may optionally be focused or primary while multiple Projects remain active or assigned.

---

# Focus

Project Focus identifies the optional primary Project for defaults and emphasis.

Changing focus does not unload other Projects.

Focus influences defaults for newly opened Tools and Workspace sessions without removing other assigned Project scopes.

---

# Runtime Context

The Project Runtime contributes the optional Project layer of Runtime Context.

Examples include:

- zero, one or multiple assigned Project IDs and Tags
- optional focused or primary Project ID
- active Theme
- available Objects
- Runtime configuration

Direct Tool Instances and active Workspace sessions inherit the applicable assigned scopes and optional focus from Runtime Context.

---

# Synchronization

The Project Runtime continuously synchronizes:

- Runtime State
- Object changes
- Knowledge updates
- Resource references
- Relationships

Synchronization should remain transparent to the user.

---

# Repository Integration

Projects may reference one or more external repositories.

The Project Runtime never owns repository contents.

Instead it maintains:

- mappings
- references
- synchronization state
- repository metadata

Journeyman performs translation between semantic Objects and technical Resources.

---

# Runtime State

Each Project maintains its own Runtime State.

Examples include:

- opened Workspace sessions
- focused Objects
- camera position
- selected Nodes
- temporary selections

Runtime State may be restored after restart.

---

# Events

The Project Runtime publishes Events including:

- ProjectLoaded
- ProjectActivated
- ProjectFocused
- ProjectSuspended
- ProjectUnloaded

Other Runtime systems react through the Event Model.

---

# Failure Handling

If a Project fails to load:

- the failure is isolated
- other Projects remain available
- partial initialization is rolled back
- the user receives a clear explanation

One invalid Project must never destabilize Cosmos.

---

# Extensibility

Future extensions may contribute additional Project Runtime behavior.

Examples include:

- collaborative sessions
- cloud synchronization
- remote repositories
- distributed Projects

All extensions integrate through Runtime Services.

---

# Design Goal

The Project Runtime should make Projects feel alive while keeping their underlying data stable and independent.

Users should experience Projects as continuously available worlds rather than files that are repeatedly opened and closed.

---

# Principles

- Projects are permanent.
- Runtime is temporary.
- Loading never changes Projects.
- Focus changes Context.
- Runtime State is separate from Project data.
- Repositories remain external.
- Synchronization is transparent.
- One failed Project never affects others.
