# Tool Runtime

## Purpose

The Tool Runtime manages every active Tool Instance inside Cosmos.

It is responsible for creating, executing, suspending and destroying Tool Instances while providing them with Context, Runtime Services and communication through the Event Model.

The Tool Runtime transforms Tool definitions into executable Runtime instances.

---

# Philosophy

A Tool Definition describes what a Tool can do.

A Tool Instance performs the work.

Tool Instances are lightweight, isolated and replaceable.

Users may freely create, close and reopen Tool Instances without affecting the underlying Project or Object.

---

# Responsibilities

The Tool Runtime is responsible for:

- creating Tool Instances
- initializing Tool Instances
- providing Runtime Context
- providing Runtime Services
- managing Tool lifecycle
- routing Events
- preserving Tool State
- safely shutting down Tool Instances

The Tool Runtime never performs business logic itself.

---

# Tool Lifecycle

Every Tool Instance follows the same lifecycle.

```text
Created

↓

Initialized

↓

Ready

↓

Active

↓

Background

↓

Suspended

↓

Closed

↓

Destroyed
```

Destroyed Tool Instances leave no Runtime state except persistent Tool State.

---

# Initialization

During initialization the Runtime:

- resolves the Tool definition
- validates permissions
- injects Runtime Services
- injects Runtime Context
- restores Tool State
- subscribes to Events

Only after successful initialization does the Tool become active.

---

# Runtime Context

Every Tool Instance receives immutable Context for the current execution.

Typical Context includes:

- active Project
- active Workspace
- active Object
- inherited Tags
- current Theme
- current Runtime State

Tool Instances never discover Context themselves.

---

# Runtime Services

Tool Instances never access the Core directly.

Instead they use Runtime Services.

Examples include:

Knowledge Service

Object Service

Workspace Service

Resource Service

Relationship Service

Job Service

All Runtime modifications occur through Services.

---

# Commands

Tool Instances initiate work by sending Commands.

Examples include:

Create Knowledge

Rename Object

Import Resource

Create Relationship

Commands never modify the Runtime directly.

They are handled by Runtime Services.

---

# Queries

Tool Instances retrieve information through Queries.

Examples include:

Find Objects

Search Knowledge

Resolve Tags

Load Resources

Queries never modify Runtime state.

---

# Events

Tool Instances subscribe to Runtime Events.

Examples include:

KnowledgeUpdated

ObjectRenamed

WorkspaceChanged

ThemeChanged

ProjectFocused

Events allow Tool Instances to react without creating direct dependencies.

---

# Tool State

Every Tool Instance maintains local Runtime State.

Examples include:

- current selection
- active tab
- editor cursor
- scroll position
- temporary input
- draft content

Local State belongs only to the Tool Instance.

---

# Persistence

Whenever appropriate, Tool State is persisted.

Examples include:

- editor drafts
- open documents
- layout preferences
- selected filters

Temporary calculations are not persisted.

---

# Isolation

Tool Instances remain isolated.

A failing Tool Instance:

- cannot crash another Tool
- cannot corrupt Runtime state
- cannot bypass Runtime Services

Failures remain local.

---

# Communication

Tool Instances never communicate directly.

Communication always occurs through:

- Runtime Services
- Events
- Runtime Context

This prevents hidden dependencies.

---

# Permissions

Every Tool Instance executes with explicitly granted permissions.

Examples include:

- read Knowledge
- modify Resources
- create Objects
- access Providers

Permission checks occur inside Runtime Services.

---

# Background Execution

Tool Instances may continue background work.

Examples include:

- indexing
- imports
- previews
- synchronization

Long-running work should be delegated to the Job Runtime whenever possible.

---

# Shutdown

Before closing, a Tool Instance:

- saves persistent state
- releases Runtime resources
- unsubscribes from Events
- disposes temporary resources

Shutdown should leave no orphaned Runtime objects.

---

# Failure Handling

If a Tool Instance fails:

- the failure is isolated
- unsaved work is recovered whenever possible
- the Runtime remains operational
- Workspace State remains valid

Tool failures must never destabilize Cosmos.

---

# Extensibility

Every future Tool follows the same Runtime contract.

Additional capabilities may be introduced without changing the Tool Runtime architecture.

---

# Design Goal

Tool Instances should feel lightweight, reliable and completely interchangeable.

Users should think about their work—not about the software executing it.

---

# Principles

- Tool Definitions describe capabilities.
- Tool Instances perform work.
- Runtime Services own business logic.
- Tool Instances receive Context.
- Communication happens through Events.
- State belongs to Tool Instances.
- Failures remain isolated.
- Every Tool follows one Runtime contract.
