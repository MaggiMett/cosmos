# Event Dispatcher

## Purpose

The Event Dispatcher is the central communication system of the Cosmos Runtime.

It delivers Runtime Events between independent Runtime components without creating direct dependencies.

The Event Dispatcher enables loose coupling throughout Cosmos.

---

# Architectural Position

Event Dispatcher is the Core Runtime component that implements the Event Model's delivery responsibilities.

It is not a System Tool, Extension or Runtime Service.

---

# Philosophy

Runtime components should never communicate directly.

Instead, they publish and subscribe to Runtime Events.

This keeps the Runtime modular, extensible and predictable.

The Event Dispatcher coordinates communication.

It never performs business logic.

---

# Responsibilities

The Event Dispatcher is responsible for:

- publishing Runtime Events
- delivering Runtime Events
- managing subscriptions
- filtering subscribers
- preserving event order
- isolating failures
- supporting asynchronous communication

The Event Dispatcher never modifies Runtime State.

---

# Runtime Foundation

The Event Dispatcher serves the entire Cosmos Runtime.

Examples include:

- Entity Runtime
- Job Runtime
- Knowledge Runtime
- Review Service
- Bundle Runtime
- Provider Runtime
- Theme Runtime

Every Runtime component may publish Events.

Every Runtime component may subscribe.

---

# Event Flow

Every Runtime Event follows the same lifecycle.

```text
Runtime Component

↓

Publish Event

↓

Event Dispatcher

↓

Subscriber Resolution

↓

Delivery

↓

Subscriber Processing
```

Publishers never know who receives an Event.

Subscribers never know who published it.

---

# Event Structure

Every Runtime Event contains:

- immutable Event ID
- Event Type
- timestamp
- publisher
- Runtime Scope
- payload
- metadata

Events remain immutable after publication.

---

# Event Categories

Examples include:

## Entity Events

- EntityLoaded
- EntityMoved
- EntityInteractionStarted
- EntityInteractionCompleted

---

## Workspace Events

- WorkspaceOpened
- WorkspaceClosed
- WorkspaceFocused

---

## Project Events

- ProjectOpened
- ProjectClosed
- ProjectFocused

---

## Knowledge Events

- CaptureCreated
- KnowledgeUpdated
- ReviewCreated
- ObjectDiscovered

---

## Job Events

- JobCreated
- JobStarted
- JobCompleted
- JobFailed

---

## Runtime Events

- ThemeChanged
- ProviderChanged
- ExtensionInstalled
- BundleLoaded

Categories remain extensible.

---

# Publishing

Runtime components publish Events.

Examples:

Knowledge Processor

↓

KnowledgeProcessed

---

Journeyman

↓

JobCompleted

---

Companion

↓

ConversationStarted

Publishing never waits for subscribers.

---

# Subscription

Runtime components subscribe to relevant Events.

Examples:

Companion

↓

JobCompleted

↓

notify user

---

Analysis Engine

↓

KnowledgeProcessed

↓

schedule analysis

Subscriptions remain explicit.

---

# Event Filtering

Subscribers receive only Events matching their subscriptions.

Filtering may consider:

- Event Type
- Runtime Scope
- Project
- Workspace
- Entity

Filtering minimizes unnecessary processing.

---

# Event Ordering

Events are delivered in publication order within the same Event stream.

Ordering remains deterministic whenever possible.

---

# Event Scope

Events may belong to different scopes.

Examples include:

- Global
- Project
- Workspace
- Entity

Scope limits unnecessary propagation.

---

# Asynchronous Delivery

Event delivery should remain asynchronous whenever appropriate.

Publishing should never block unrelated Runtime work.

Critical Events may require synchronous delivery.

---

# Reliability

The Dispatcher guarantees:

- no duplicate delivery
- deterministic ordering
- isolated subscriber failures
- safe event propagation

Subscribers remain independent.

---

# Failure Handling

If one subscriber fails:

- remaining subscribers continue
- Event delivery continues
- failure is logged
- Runtime remains stable

One subscriber never blocks the Event system.

---

# Performance

The Dispatcher should optimize:

- subscriber lookup
- event filtering
- batching
- asynchronous delivery
- memory usage

Performance should scale with Runtime complexity.

---

# Extensibility

Future Extensions may introduce:

- remote Events
- distributed Runtime
- multiplayer Events
- event persistence
- event replay
- monitoring tools

Every extension follows the same Event contract.

---

# Design Goal

The Event Dispatcher should become the nervous system of Cosmos.

Every Runtime component should communicate through Events while remaining completely independent from every other component.

---

# Principles

- Components never communicate directly.
- Events are immutable.
- Publishing is independent.
- Subscription is explicit.
- Delivery remains deterministic.
- Failures remain isolated.
- Scope limits propagation.
- The Event Dispatcher performs coordination only.
