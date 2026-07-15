# Entity Interaction

## Purpose

The Entity Interaction System defines how Entities interact with users, other Entities and the Cosmos Runtime.

It provides a consistent interaction model that allows every Entity to communicate, react and cooperate while remaining independent and loosely coupled.

Interaction creates the social layer of Cosmos.

---

# Architectural Position

Entity Interaction is an internal contract coordinated by Entity Runtime.

It is not a System Tool, Runtime Service or independent Runtime system.

Runtime actions requested during an interaction continue through the existing Runtime Services.

---

# Philosophy

Entities never communicate directly.

Every interaction passes through the Entity Runtime.

The Runtime validates, coordinates and synchronizes all interactions.

This keeps Entities independent while allowing complex behavior to emerge.

---

# Responsibilities

Entity Interaction is responsible for:

- coordinating interactions
- validating permissions
- validating conditions
- synchronizing participants
- coordinating animations
- coordinating dialogue
- coordinating Runtime actions
- publishing interaction Events

Interaction never performs business logic.

---

# Interaction Model

Every interaction follows the same flow.

```text
Initiator

↓

Interaction Request

↓

Entity Runtime

↓

Validation

↓

Execution

↓

Interaction Result

↓

Return to Behaviour
```

Entities never bypass the Runtime.

---

# Participants

Every interaction consists of:

- Initiator
- Target
- Interaction Type
- Runtime Context

Additional participants may join if supported.

---

# Interaction Types

Initial interaction types include:

## User Interaction

Between a User and an Entity.

Examples:

- click
- greet
- pet
- talk
- inspect
- follow

---

## Entity Interaction

Between two or more Entities.

Examples:

- greeting
- petting
- following
- pointing
- celebrating
- waiting together

---

## Runtime Interaction

Between an Entity and the Runtime.

Examples:

- open Tool
- display Review
- highlight Object
- navigate Workspace
- notify user

---

## Environment Interaction

Between an Entity and the environment.

Examples:

- sit on chair
- open door
- approach desk
- rest on bed
- inspect bookshelf

---

# Interaction Request

Every interaction begins with a request.

A request contains:

- initiator
- target
- interaction type
- requested action
- Runtime Context

The Runtime validates every request.

---

# Validation

Before execution the Runtime verifies:

- permissions
- visibility
- distance (if applicable)
- current State
- Scope compatibility
- interaction availability

Invalid requests are rejected safely.

---

# Interaction State

While interacting, participating Entities temporarily enter Interaction State.

Examples:

Idle

↓

Interaction

↓

Return to Idle

Both Entities maintain independent Runtime identities throughout the interaction.

---

# Coordinated Actions

The Runtime synchronizes shared actions.

Example:

```text
Companion

↓

Pet Interaction Request

↓

Validation

↓

Walk to Pet

↓

Pet notices Companion

↓

Petting Animation

↓

Pet Happy Animation

↓

Return to Idle
```

Each participant performs its own Behavior.

The Runtime keeps them synchronized.

---

# Conversations

Conversation is a specialized interaction.

Conversation may occur:

- User ↔ Entity
- Entity ↔ Entity

Conversation does not require an AI Provider.

Without AI, predefined dialogue may be used.

With AI, generated responses may extend the interaction.

Conversation always remains subject to Runtime Permissions.

---

# Runtime Actions

Certain interactions may request Runtime actions.

Examples:

- open Archive
- open Review
- highlight Object
- focus Workspace
- request Journeyman

The Entity never executes these actions directly.

Runtime Services remain responsible.

---

# Emotional Interaction

Entities may express emotional reactions.

Examples:

- happiness
- curiosity
- excitement
- surprise
- disappointment

Emotion changes presentation only.

It never changes Permissions or Runtime behavior.

---

# Interaction Familiarity

Entities may react differently based on authorized interaction history or familiarity data.

Examples:

Companion

↓

knows Pet

↓

special greeting

Guide

↓

first meeting

↓

introduction

This familiarity is not a Version 1 Relationship record. Version 1 Relationship endpoints are Objects, not Entities. Interaction history remains separate from Behavior Rules.

---

# Interruptions

Interactions may be interrupted.

Examples:

- user request
- higher priority Runtime Event
- Workspace change
- shutdown

Interrupted interactions should conclude gracefully whenever possible.

---

# Context Awareness

Interactions inherit Runtime Context.

Context may include:

- active Project
- current Workspace
- current Room
- active Theme
- selected Object
- nearby Entities

Context influences interaction.

It never changes Entity identity.

---

# Interaction History

Completed interactions may optionally be recorded.

Examples include:

- first meeting
- companion greeting
- tutorial completed

Interaction history is temporary by default and may support richer future interactions.

Recorded interaction history remains interaction data, not Knowledge. Only an explicit promotion through Knowledge Service creates a durable Knowledge record about the interaction; the original interaction record remains distinct and traceable.

---

# Failure Handling

If an interaction fails:

- all participants return to a safe State
- partial animations are cancelled gracefully
- Runtime consistency is preserved
- other Entities remain unaffected

One failed interaction must never destabilize Cosmos.

---

# Extensibility

Future extensions may introduce:

- multiplayer interactions
- group conversations
- cooperative behaviors
- scripted sequences
- synchronized performances

All interactions follow the same Runtime contract.

---

# Design Goal

Entity Interaction should make Cosmos feel socially alive.

Users should experience natural cooperation between Entities without losing the predictability and stability of the Runtime.

---

# Principles

- Entities never communicate directly.
- The Runtime coordinates every interaction.
- Permissions are always validated.
- Context is inherited automatically.
- Runtime Services perform Runtime work.
- Conversations are interactions.
- Interaction history remains temporary unless explicitly promoted to Knowledge through Knowledge Service.
- AI enhances interaction but never defines it.
- Every interaction leaves the Runtime in a consistent State.
