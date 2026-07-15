# Bundle Runtime

## Purpose

The Bundle Runtime manages active Capability Bundle instances assigned to Runtime Entities.

It is responsible for loading, validating, activating, suspending and unloading Bundles while preserving Entity stability and Runtime consistency.

The Bundle Runtime extends Entity abilities without changing Entity identity.

---

# Philosophy

Entities remain stable.

Capabilities remain modular.

A Bundle may be added, removed or updated without rebuilding the Entity that uses it.

The Runtime coordinates Bundle behavior.

Bundles never control the Entity Runtime.

---

# Responsibilities

The Bundle Runtime is responsible for:

- resolving assigned Capability Bundles
- validating Role compatibility
- resolving dependencies
- validating Permission declarations and preflight availability
- initializing Bundle instances
- injecting Runtime Context
- routing Events
- preserving Bundle State
- isolating failures
- unloading Bundles safely

The Bundle Runtime never owns business logic.

---

# Bundle Definition and Bundle Instance

A Bundle Definition describes one reusable capability package.

A Bundle Instance represents one active assignment of that definition to one Entity.

Example:

```text
Conversation Bundle Definition

↓

Companion Conversation Bundle Instance

Multiple Entities may use the same Bundle Definition.

Every Entity receives its own Bundle Instance and independent Runtime State.

Bundle Lifecycle

Every Bundle Instance follows the same lifecycle.

Assigned

↓

Resolved

↓

Validated

↓

Initialized

↓

Active

↓

Suspended

↓

Disabled

↓

Unloaded

The Runtime controls every transition.

Bundles never activate themselves.

Assignment

A Bundle may be assigned through:

bundled Entity configuration
user configuration
Entity Blueprint
Extension installation
Runtime migration

Assignment does not immediately activate the Bundle.

Validation must succeed first.

Resolution

Before initialization, the Runtime resolves:

Bundle Definition
compatible Runtime API
Entity Role
required dependencies
required Providers
requested Permissions
configuration schema

Unresolved Bundles remain assigned but inactive.

Role Compatibility

Every Bundle declares compatible Entity Roles.

The Bundle Runtime compares the assigned Entity Role with the compatibility declaration.

An incompatible Bundle:

does not initialize
remains isolated
reports the incompatibility
does not affect the Entity

Role compatibility cannot be bypassed by user configuration.

Dependency Resolution

Bundles may depend on:

other Capability Bundles
Runtime Services
Providers
Entity Runtime capabilities
Integrations

Dependencies are resolved before activation.

Missing dependencies prevent activation.

Circular Bundle dependencies are rejected.

Permission Preflight

Every Bundle declares required Permissions.

Before activation, the Bundle Runtime verifies:

requested Permissions exist
Entity Role permits the capability
user configuration permits the capability
Runtime Context allows the capability

A Bundle never grants itself Permissions.

This activation check is non-authoritative preflight. Runtime Services always perform authoritative permission validation for every Command issued by the Bundle.

Initialization

During initialization the Runtime:

creates the Bundle Instance
injects Entity identity
injects Runtime Context
injects permitted Runtime Services
restores Bundle State
subscribes to declared Events
validates Bundle configuration

Only successfully initialized Bundles become Active.

Runtime Context

Every active Bundle Instance receives Runtime Context from its Entity.

Context may include:

active Project
current Room
active Workspace
selected Object
inherited Tags
running Jobs
nearby Entities
available Tools

Bundles never discover Context independently.

Context Updates

Context may change while a Bundle remains active.

The Bundle Runtime provides updated Context snapshots when relevant.

Examples include:

Project focus changed
Workspace opened
Object selected
Room changed

Bundles must react safely to Context changes.

Runtime Services

Bundles access Cosmos only through permitted Runtime Services.

Examples include:

Workspace Service
Knowledge Service
Review Service
Job Service
Object Service

Provider-dependent capabilities use Provider Runtime through its existing contract.

Bundles never access Persistence, Registries or Extension internals directly.

Events

Bundles subscribe only to declared Events.

Examples include:

ReviewCreated
JobProgress
WorkspaceOpened
ObjectSelected
UserInteractionRequested
EntityInteractionCompleted

The Bundle Runtime routes Events to active Bundle Instances.

Capabilities

Every Bundle exposes named capabilities through the Entity Runtime.

Example:

Bundle:
Workspace Assistance

Capabilities:
- request_tool_open
- highlight_object
- navigate_workspace

Other systems never call Bundle internals directly.

They request capabilities through the Entity Runtime.

Capability Invocation

Capability execution follows this flow:

Capability Requested

↓

Entity Runtime

↓

Bundle Runtime

↓

Bundle Active Check

↓

Non-Authoritative Permission Preflight

↓

Command

↓

Runtime Service

↓

Authoritative Permission and Business Validation

↓

Result

Bundles prepare or coordinate actions.

Runtime Services execute business logic.

Bundle Runtime preflight provides feedback only and never authorizes execution.

Bundle State

A Bundle Instance may maintain limited local State.

Examples include:

active conversation session
selected Review Item
monitored Job IDs
suggestion cooldown
temporary interaction state

Bundle State never replaces Entity State.

Persistence

Persistent Bundle State may include:

user configuration
enabled capabilities
preferred Provider
long-lived session references
notification preferences

Transient execution details are not persisted.

Suspension

Bundles may be suspended when:

the Entity becomes inactive
required Scope is unavailable
a dependency becomes unavailable
user disables the Bundle
Runtime enters Recovery

Suspension preserves recoverable Bundle State.

Provider Availability

Provider-dependent capabilities degrade independently.

Example:

Conversation Bundle

Without AI Provider:
- predefined dialogue
- fixed responses
- Runtime notifications

With AI Provider:
- open conversation
- explanation
- reasoning

A missing Provider should not disable unrelated capabilities.

Multiple Bundles

One Entity may use multiple Bundles simultaneously.

The Bundle Runtime coordinates capability availability without merging Bundle internals.

Bundles remain isolated.

Shared work happens through Runtime Services and Events.

Conflicting Capabilities

Two Bundles may expose similar capabilities.

The Runtime resolves conflicts through:

explicit user preference
Bundle priority
Context compatibility
capability namespace

Conflicts are never resolved silently when user intent is unclear.

Failure Isolation

One failing Bundle must never disable the Entity.

If a Bundle fails:

the Bundle Instance is isolated
its failure is recorded
remaining Bundles continue operating
Entity Runtime remains active
recovery or retry may be offered
Hot Changes

Bundles may be enabled or disabled without recreating the Entity whenever safe.

The Runtime performs:

Suspend Entity Action

↓

Update Bundle Assignment

↓

Validate

↓

Initialize or Unload Bundle

↓

Resume Entity

Active destructive operations must finish or cancel safely first.

Recovery

After unexpected shutdown the Bundle Runtime restores:

assigned Bundles
active configuration
persistent Bundle State
valid subscriptions
Provider preferences

Every Bundle resumes from a safe State.

Performance

Inactive Bundle Instances should consume no execution resources.

The Runtime may suspend Bundles that are:

out of Scope
unused
waiting for unavailable Providers
attached to suspended Entities

Event subscriptions should remain minimal and declared.

Extensibility

Future extensions may introduce:

shared Bundle configuration
collaborative Bundle capabilities
advanced capability routing
Bundle composition helpers
Bundle migration systems

Every extension follows the same Bundle Runtime contract.

Design Goal

The Bundle Runtime should allow Entities to gain and lose abilities safely while preserving their identity, personality and continuity.

Users should experience new Bundles as new skills rather than new software modules.

Principles
Bundle Definitions are reusable.
Bundle Instances belong to Entities.
Runtime controls lifecycle.
Role compatibility is mandatory.
Permission declarations are preflighted before activation; Runtime Services enforce Permissions authoritatively.
Context is injected.
Runtime Services execute work.
Bundle failures remain isolated.
Provider-dependent features degrade gracefully.
Entity identity never depends on one Bundle.
