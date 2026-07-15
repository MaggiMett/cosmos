# Job Scheduler

## Purpose

The Job Scheduler coordinates the execution of all Runtime Jobs inside Cosmos.

It determines when work should begin, how work is prioritized and how available Runtime Workers are utilized.

The Job Scheduler orchestrates work.

It never performs work itself.

---

# Philosophy

Runtime work should be organized rather than immediate.

Every task becomes a Job.

Every Job follows the same lifecycle.

The Scheduler ensures predictable, efficient and scalable execution.

---

# Responsibilities

The Job Scheduler is responsible for:

- scheduling Runtime Jobs
- prioritizing work
- assigning Runtime Workers
- coordinating execution
- respecting dependencies
- managing retries
- balancing workload
- monitoring Job progress

The Job Scheduler never executes Job logic.

---

# Runtime Foundation

The Job Scheduler operates on:

- Job Runtime
- Event Dispatcher
- Runtime Workers
- Provider Runtime
- Review Runtime

The Scheduler coordinates every Runtime Worker.

---

# Job Lifecycle

Every Runtime Job follows the same lifecycle.

```text
Created

↓

Queued

↓

Waiting

↓

Assigned

↓

Running

↓

Validating

↓

Completed

or

Failed

or

Cancelled
```

The Scheduler manages every transition.

---

# Job Queue

Every Job enters a Queue before execution.

The Queue maintains:

- execution order
- priority
- dependencies
- scheduling information

Queued Jobs remain immutable until assignment.

---

# Job Priorities

Suggested priorities include:

- Critical
- High
- Normal
- Background

Higher priority Jobs may execute before lower priority Jobs.

Priority never bypasses dependency requirements.

---

# Worker Assignment

The Scheduler assigns Jobs to compatible Runtime Workers.

Examples:

Knowledge Processing

↓

Knowledge Processor

---

Repository Analysis

↓

Repository Analyzer

---

Implementation

↓

Journeyman

Workers declare supported Job types.

---

# Dependency Management

Jobs may depend on other Jobs.

Example:

```text
Repository Analysis

↓

Context Assembly

↓

Prompt Generation

↓

Implementation

↓

Validation
```

Dependent Jobs never begin before prerequisites complete successfully.

---

# Parallel Execution

Independent Jobs may execute simultaneously.

Example:

Journeyman

↓

Implementation

---

Repository Analyzer

↓

Analysis

---

Knowledge Processor

↓

Processing

Parallel execution improves Runtime efficiency.

---

# Scheduling Strategies

The Scheduler supports multiple strategies.

Examples include:

- immediate
- delayed
- periodic
- background
- user initiated
- event driven

Strategies remain configurable.

---

# Event Integration

The Scheduler reacts to Runtime Events.

Examples:

KnowledgeProcessed

↓

schedule Analysis

---

JobCompleted

↓

start Validation

---

ReviewApproved

↓

schedule Implementation

Events naturally create new work.

---

# Retry Policy

Recoverable failures may be retried.

Retry policies may define:

- retry count
- delay
- exponential backoff
- fallback Worker
- Provider retry

Retries remain transparent.

---

# Resource Awareness

Scheduling considers available resources.

Examples include:

- Runtime Workers
- Providers
- CPU
- memory
- network
- project locks

Resource awareness prevents unnecessary contention.

---

# Progress Tracking

Every Job reports structured progress.

Examples include:

- queued
- running
- waiting
- validating
- completed
- failed

Progress remains observable throughout execution.

---

# Cancellation

Jobs may be cancelled.

Cancellation should:

- preserve Runtime integrity
- stop future execution
- clean temporary state
- notify dependent Jobs

Partial work remains reviewable whenever possible.

---

# Validation Integration

Execution is not completion.

Every Job requiring validation enters Validation before completion.

Validation may include:

- tests
- repository analysis
- Bundle validation
- architecture validation
- Review generation

Only validated Jobs become completed.

---

# AI Independence

Scheduling never depends on AI.

Providers execute reasoning.

The Scheduler coordinates execution.

Scheduling remains deterministic.

---

# Failure Handling

Failed Jobs:

- preserve Runtime stability
- generate structured failure information
- may produce Reviews
- may trigger retries
- never corrupt unrelated Jobs

Failure remains isolated.

---

# Extensibility

Future Extensions may introduce:

- distributed scheduling
- cloud Workers
- priority policies
- enterprise scheduling
- project-specific schedulers
- collaborative execution

Every Scheduler Extension follows the same Runtime contract.

---

# Design Goal

The Job Scheduler should coordinate all Runtime work in a predictable, transparent and scalable manner.

Users should never need to think about scheduling while always understanding what Cosmos is currently doing.

---

# Principles

- Every task becomes a Job.
- The Scheduler coordinates work.
- Workers execute work.
- Dependencies are respected.
- Validation precedes completion.
- Scheduling is deterministic.
- AI is optional.
- Runtime remains observable.
- Failures remain isolated.
