# Runtime Model

## Purpose

This document defines how Cosmos behaves while it is running.

Unlike the Domain and Architecture documents, the Runtime Model describes how information, Context and actions move through the system.

The Runtime Model defines interaction while avoiding storage or API implementation details.

---

# Runtime Philosophy

Cosmos behaves as one continuous system.

The user should not feel like they are switching between disconnected applications.

Projects, Workspaces, Tools, Knowledge and Resources participate in one coherent Runtime.

---

# Runtime Paths

Cosmos supports two primary working paths.

## Direct Tool Mode

```text
Cosmos Map
    ↓
Optional Project or Object Focus
    ↓
One User Tool beside the visible map
```

Direct Tool Mode is intended for focused work with one Tool while preserving the visible constellation.

## Workspace Mode

```text
Base or Project Shortcut
    ↓
Room
    ↓
Workspace
    ↓
Multiple Tool Instances
```

Workspace Mode is intended for complex work involving several windows or Tools.

Both modes use the same Tool definitions, Runtime Services and Context model.

---

# Context Composition

Context is composed additively through the active Runtime path.

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

A Workspace may also carry assigned Project Tags, including multiple Projects when desired.

No component needs to rediscover Context that has already been established.

---

# Runtime Context

Runtime Context may include:

- active or assigned Project scopes
- active Room
- active Workspace
- active Tool Instance
- active Object
- inherited System Tags
- inherited User Tags
- Theme and Skin resolution
- permissions
- Runtime state

Long-running work receives an immutable Context Snapshot.

---

# User Interaction

Every state-changing interaction follows one consistent path.

```text
User or Runtime Client
    ↓
Tool or API Adapter
    ↓
Command
    ↓
Runtime Service
    ↓
Validation and Permission Check
    ↓
Transaction and Persistence
    ↓
Event Publication
```

Queries read through Runtime Services without changing state.

---

# Knowledge Flow

Information develops through a traceable lifecycle.

```text
Idea or Source
    ↓
Capture or Import
    ↓
Knowledge
    ↓
Processing and Discovery
    ↓
Object Association
    ↓
Resource Implementation
    ↓
Real Product
```

Original sources remain preserved.

Processing enriches Knowledge without overwriting user intent.

---

# Runtime State

Workspaces and Tool Instances preserve restorable state such as:

- open Tools
- window positions
- selected Objects
- filters
- drafts
- camera positions
- Theme and Skin overrides

Domain data and Runtime state remain separate.

---

# Runtime Services

Runtime Services own authoritative business behavior.

They:

- validate Commands
- enforce permissions
- coordinate transactions
- access Persistence
- publish Events
- create Jobs for long-running work

UI, MCP, Companion, Journeyman and Extensions all use the same Services.

---

# Events

Events announce completed changes.

They are immutable, contextual and published only after successful transactions.

Events allow independent components to react without direct coupling.

---

# Jobs

Long-running work executes through the Job Runtime.

Examples include:

- Knowledge processing
- analysis
- repository validation
- AI execution
- resource generation
- indexing

Jobs receive Context Snapshots and never bypass Runtime Services.

---

# System Tools

System Tools support Cosmos in the background.

Examples include:

- Knowledge Processor
- Analysis Engine
- Context Builder
- Repository Analyzer
- Runtime Translation

They operate through Runtime contracts and should avoid unnecessary user interruption.

---

# Discovery

Cosmos prefers evidence over interruption.

The Runtime collects patterns over time and presents Review items only when a meaningful threshold has been reached.

The user decides whether suggestions become permanent Knowledge, Tags, Relationships or structure.

---

# Extensibility

Every Extension participates in shared Runtime systems:

- Registries
- Runtime Services
- Context
- Permissions
- Events
- Jobs
- Persistence
- Validation

Extensions add capabilities without creating parallel architectures.

---

# Runtime Goal

The Runtime should feel invisible.

The user should experience one living world in which every action naturally builds on existing Context and Knowledge.
