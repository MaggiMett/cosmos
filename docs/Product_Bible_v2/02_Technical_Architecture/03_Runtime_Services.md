# Runtime Services

## Purpose

Runtime Services provide the business capabilities of Cosmos.

They are the only supported way for Runtime components to create, modify, query or remove domain data.

The Runtime owns all business logic.

Extensions never manipulate the Core directly.

---

# Philosophy

Every Runtime action should happen through a Service.

Tools request work.

Services perform work.

This guarantees that all Runtime behavior follows one consistent implementation.

---

# Responsibilities

Runtime Services are responsible for:

- executing business logic
- validating requests
- enforcing permissions
- maintaining consistency
- updating Runtime state
- publishing Events
- coordinating Registries
- accessing Persistence

Runtime Services never contain user interface code.

---

# Service Architecture

Every Runtime capability is exposed through a Service.

Examples include:

- Project Service
- Workspace Service
- Tool Service
- Object Service
- Knowledge Service
- Resource Service
- Relationship Service
- Tag Service
- Theme Service
- Job Service
- Review Service

Services define Runtime behavior.

Extensions consume Services.

Runtime Services own business behavior for durable Entity identity and configuration.

Review Service owns business behavior for Review Items and decisions.

Entity Runtime owns active Entity lifecycle and State, while Review remains a User Tool presentation.

Neither Runtime component replaces the Runtime Service boundary.

---

# Single Source of Truth

Business logic exists only once.

Examples:

Creating Knowledge

↓

Knowledge Service

Opening Workspace

↓

Workspace Service

Importing Resources

↓

Resource Service

No Extension should implement duplicate business logic.

---

# Commands

Services receive Commands.

Commands request that something should happen.

Examples include:

- Create Knowledge
- Open Workspace
- Rename Object
- Import Resource
- Create Relationship

Commands modify the Runtime.

Every state-changing action follows one pipeline:

```text
Client or Tool
    ↓
Command
    ↓
Runtime Service
    ↓
Authoritative Permission Validation
    ↓
Business Validation
    ↓
Transaction and Persistence
    ↓
Event Publication
    ↓
Optional Subscriber Reaction
    ↓
Optional Command or Request to a Runtime Service
    ↓
Optional Long-Running Job Creation by that Service
```

---

# Queries

Services expose Queries.

Queries request information without modifying the Runtime.

Examples include:

- Find Objects
- Search Knowledge
- List Workspaces
- Resolve Theme
- Get Object History

Queries never change Runtime state.

---

# Events

After successful execution Services publish Events.

Examples include:

Knowledge Created

↓

KnowledgeCreated Event

Workspace Opened

↓

WorkspaceOpened Event

Services produce Events.

They do not consume them directly.

Events describe completed facts and never request work or create Jobs. Subscribers may react by sending a new Command or request to the appropriate Runtime Service.

---

# Validation

Every request is validated before execution. The Runtime Service first performs the authoritative permission decision and then performs business validation.

Validation may include:

- permissions
- object existence
- dependency checks
- schema validation
- context validation
- business rules

Invalid requests never modify the Runtime.

UI, Entity Runtime and Bundle Runtime may perform non-authoritative preflight checks for early feedback. A successful preflight never authorizes execution and never replaces Service validation.

---

# Context

Every Service receives a Runtime Context.

Context is never discovered inside the Service.

The Runtime resolves Context before execution.

This ordinary Runtime Context injection remains the default for synchronous Tool and Service actions.

Long-running operations receive an immutable Context Snapshot. When a consumer requires a task-specific Context Package, it requests one from Context Builder rather than assembling Context inside the Service or consumer.

This keeps Services deterministic.

---

# Transactions

A Service operation should succeed completely or fail completely.

Partial updates should never leave Cosmos in an inconsistent state.

Whenever multiple Runtime components change together, they belong to one transaction.

---

# Permissions

Services enforce permissions.

Runtime Services are the only authoritative permission enforcement boundary.

Extensions never bypass the permission system.

Examples include:

- read Knowledge
- modify Resources
- create Objects
- execute AI Providers

Permission checks occur inside the Service layer.

---

# Jobs

Runtime Services create Jobs only for delegated long-running work. Ordinary state changes complete synchronously inside the Service transaction.

Neither Events nor subscribers create Jobs directly. A subscriber may request a Runtime Service, and that Service performs authoritative validation before optionally creating a Job.

After Event publication, the originating Service may also create a required long-running Job directly from the validated Command, as Knowledge Service does for Capture processing. The Event is never the cause or request.

---

# Runtime Independence

Services are independent from:

- UI
- Themes
- Workspaces
- Companion
- MCP
- Extensions

Every client uses exactly the same Services.

---

# Service Consumers

Runtime Services may be used by:

- User Tools
- System Tools
- Entities
- Capability Bundles
- Companion
- Journeyman
- MCP
- REST API
- Future Extensions

All consumers receive identical Runtime behavior.

---

# Error Handling

Services return structured Runtime errors.

Examples include:

- Object Not Found
- Permission Denied
- Invalid Context
- Dependency Missing
- Validation Failed

Errors should always explain what happened and how the user can resolve the problem.

---

# Extensibility

New Runtime capabilities should be introduced by adding new Services rather than modifying existing ones whenever possible.

Services should remain small, focused and reusable.

---

# Design Goal

Every important action inside Cosmos should pass through exactly one Runtime Service.

This creates one consistent implementation for every capability regardless of whether it is triggered by the UI, Companion, Journeyman or an external Extension.

---

# Principles

- Services own business logic.
- Commands modify.
- Queries read.
- Events notify.
- Services validate.
- Services enforce permissions.
- Services use Context.
- Business logic exists only once.
- Every Runtime client uses the same Services.
- Extensions never bypass the Runtime.
