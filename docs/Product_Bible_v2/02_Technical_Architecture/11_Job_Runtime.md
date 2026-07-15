# Job Runtime

## Purpose

The Job Runtime manages every long-running operation inside Cosmos.

It executes background work independently from the user interface while ensuring that the Runtime remains responsive, observable and recoverable.

Jobs execute delegated long-running work.

Runtime Services own validation, authorization and transactional business rules.

Job handlers implement the asynchronous workflow by calling those Services and approved System Tools.

---

# Philosophy

The user should never wait for expensive operations.

Whenever possible, Runtime Services should delegate long-running work to the Job Runtime.

The user continues working while Cosmos works in the background.

---

# Responsibilities

The Job Runtime is responsible for:

- scheduling Jobs
- executing Jobs
- monitoring progress
- handling retries
- reporting status
- publishing Job Events
- recovering interrupted Jobs
- cancelling Jobs

Validation, authorization and state-changing business rules remain inside Runtime Services.

---

# Job Lifecycle

Every Job follows the same lifecycle.

```text
Created

↓

Queued

↓

Scheduled

↓

Running

↓

Completed

or

Failed

or

Cancelled
```

Only Running Jobs consume execution resources.

---

# Job Creation

Jobs are created exclusively by Runtime Services.

Examples include:

Knowledge Service

↓

Knowledge Processing Job

Repository Service

↓

Repository Scan Job

Object Service

↓

Resource Generation Job

Extensions never create Jobs directly.

---

# Job Categories

Initial Job categories include:

- Knowledge Processing
- Repository Analysis
- Repository Synchronization
- AI Analysis
- Embedding Generation
- Search Indexing
- Resource Generation
- Import
- Export
- Validation

Future categories may be added without changing the Job Runtime architecture.

---

# Background Execution

Jobs execute independently from:

- UI
- Workspaces
- Tool Instances

Users may close Workspaces without interrupting running Jobs.

Jobs belong to the Runtime.

Not to the UI.

---

# Context Snapshot

Every Job receives a Context Snapshot.

The Snapshot is an immutable capture of Runtime Context at Job creation. It is not an independently assembled Context model.

The Snapshot contains:

- zero, one or multiple assigned Project scopes
- optional focused or primary Project
- Workspace session (if applicable)
- Object
- Tags
- initiating user
- Runtime configuration

The Snapshot never changes while the Job is running.

If a Job handler requires a task-specific Context Package, it requests that Package from Context Builder using the Snapshot. The Job Runtime and Job handler never assemble an independent Context Package.

---

# Progress

Every Job reports progress.

Typical progress includes:

- queued
- running
- current stage
- percentage (when available)
- estimated remaining work

Progress reporting should remain lightweight.

---

# Events

The Job Runtime publishes:

- JobCreated
- JobQueued
- JobStarted
- JobProgress
- JobCompleted
- JobFailed
- JobCancelled

Other Runtime systems subscribe through the Event Model.

---

# Dependencies

Jobs may depend on other Jobs.

Example:

```text
Repository Scan

↓

Object Discovery

↓

Knowledge Linking

↓

Relationship Discovery
```

Dependent Jobs begin only after successful completion of required Jobs.

Circular dependencies are not permitted.

---

# Failure Handling

Failures remain isolated.

If a Job fails:

- Runtime remains operational
- partial work is discarded when necessary
- failure is recorded
- retry becomes possible

One failed Job never stops other Jobs.

---

# Retry

Retry behavior is controlled by the Job Runtime.

Retry policies may include:

- immediate retry
- delayed retry
- manual retry
- permanent failure

Retry decisions depend on the failure category.

---

# Cancellation

Users may cancel Jobs whenever appropriate.

Cancellation should:

- stop execution safely
- release Runtime resources
- preserve completed work when possible

Cancelled Jobs publish JobCancelled.

---

# Persistence

Long-running Jobs may be persisted.

After unexpected shutdown:

- unfinished Jobs are restored
- eligible Jobs resume automatically
- completed Jobs are not repeated

The Runtime determines resumability.

---

# Scheduling

The Job Runtime schedules execution according to Runtime priorities.

Typical priorities include:

- User initiated
- Interactive
- Background
- Maintenance

User work always receives higher priority than maintenance work.

---

# AI Jobs

AI Providers execute through the Job Runtime.

Examples include:

- Knowledge refinement
- semantic analysis
- repository explanation
- Blueprint generation
- Companion reasoning

AI execution should never block the Runtime.

---

# Resource Management

The Job Runtime manages execution resources.

It controls:

- concurrent Jobs
- execution queues
- provider utilization
- repository access
- CPU-intensive work

The Runtime remains responsive even under heavy load.

---

# Extensibility

Future Extensions may introduce additional Job types.

Every Job follows the same Runtime contract regardless of its implementation.

---

# Design Goal

The Job Runtime should make expensive operations feel effortless.

Users continue creating while Cosmos continuously improves Projects in the background.

Long-running work should become almost invisible.

---

# Principles

- Jobs execute long-running work.
- Runtime Services create Jobs.
- Jobs receive Context Snapshots.
- Jobs are asynchronous.
- Jobs report progress.
- Failures remain isolated.
- Retry is managed centrally.
- User work always has priority.
- Jobs never bypass Runtime Services or own authoritative state-changing rules.
