# Entity Behaviour

## Purpose

Entity Behaviour defines how an Entity naturally behaves inside Cosmos.

Behaviour allows Entities to react, move, interact and express personality without requiring an AI Provider.

Behaviour transforms Runtime Events into believable actions.

---

# Philosophy

An Entity should feel alive even when no AI Provider is available.

Behaviour is deterministic.

Personality influences Behaviour.

AI may enhance Behaviour.

It never replaces it.

---

# Responsibilities

Entity Behaviour is responsible for:

- selecting reactions
- executing idle behaviour
- responding to Runtime Events
- controlling interaction flow
- coordinating animations
- expressing personality
- respecting cooldowns
- maintaining natural pacing

Behaviour never performs business logic.

---

# Behaviour Model

Behaviour consists of independent Behaviour Rules.

Each Rule contains:

- trigger
- conditions
- priority
- cooldown
- probability
- resulting actions

Rules remain independent.

Multiple Rules may coexist.

---

# Behaviour Categories

Initial categories include:

## Idle

Natural behaviour while nothing important happens.

Examples:

- looking around
- stretching
- sitting
- walking
- observing
- sleeping

---

## Reactive

Behaviour triggered by Runtime Events.

Examples:

- user enters Room
- Job completed
- Review created
- Project focused
- Tool opened

---

## Interactive

Behaviour involving another Entity or the User.

Examples:

- greeting
- petting
- waving
- following
- pointing

---

## Working

Behaviour while assisting.

Examples:

- reading Review
- highlighting Objects
- waiting
- presenting progress

---

## Emotional

Behaviour expressing current mood.

Examples:

- excited
- curious
- relaxed
- surprised
- focused

Emotion changes presentation.

Not Runtime permissions.

---

# Behaviour Rule

A Behaviour Rule contains:

```text
Trigger

↓

Conditions

↓

Priority

↓

Probability

↓

Cooldown

↓

Actions
```

Rules should remain simple and understandable.

---

# Triggers

Examples include:

- Runtime Event
- Timer
- User interaction
- Entity interaction
- State transition
- Workspace change
- Project change

Triggers initiate Behaviour.

---

# Conditions

Rules execute only when conditions are satisfied.

Examples:

- Entity is visible
- Entity is awake
- Companion not talking
- User present
- same Workspace
- Review exists

Conditions prevent unrealistic behaviour.

---

# Priority

Multiple Rules may become valid simultaneously.

Priority determines which Rule executes first.

Suggested priorities:

- Critical
- Important
- Normal
- Ambient

Higher priority Rules may interrupt lower priority Rules.

---

# Probability

Behaviour should not become repetitive.

Rules may define execution probability.

Example:

```text
Idle Look Around

Probability

35%
```

Randomness creates natural variation.

---

# Cooldown

Every Rule may define a cooldown.

Examples:

- greeting
- idle speech
- waving
- reminders

Cooldown prevents spam.

---

# Behaviour Queue

The Runtime maintains a Behaviour Queue.

Rules enter the queue after validation.

Only executable Rules become active.

The queue keeps behaviour orderly.

---

# Personality Influence

Personality modifies Behaviour.

Examples:

Curious

↓

looks around frequently

---

Calm

↓

longer idle periods

---

Energetic

↓

moves more often

Personality adjusts Behaviour.

It never replaces Behaviour Rules.

---

# AI Influence

AI may extend Behaviour.

Examples:

- generate natural dialogue
- explain Reviews
- suggest actions

AI may never bypass:

- Behaviour Rules
- Permissions
- Runtime Services

---

# Entity Interaction

Behaviour may involve another Entity.

Example:

```text
Companion

↓

sees Pet nearby

↓

Pet Interaction Rule

↓

walk

↓

pet

↓

Pet happy animation

↓

return to Idle
```

Both Entities execute their own Behaviour independently.

---

# User Interaction

Behaviour may react to Users.

Examples:

- user approaches
- user waves
- user clicks
- user starts Project

The Runtime validates every interaction.

---

# Interruptions

Behaviour may be interrupted.

Examples:

- higher priority Rule
- user request
- Runtime shutdown
- Workspace change

Interrupted Behaviour should return to a safe State whenever possible.

---

# Idle Behaviour

Idle Behaviour should make Cosmos feel alive.

Examples:

- reading
- stretching
- observing Workspace
- sitting on furniture
- interacting with Pets
- following the user with the eyes

Idle Behaviour should remain subtle.

It must never distract from productive work.

---

# Behaviour Packs

Themes and Extensions may provide Behaviour Packs.

Examples:

Fantasy

↓

dragon behaviour

---

Sci-Fi

↓

robot behaviour

---

Minecraft

↓

Allay behaviour

Behaviour Packs extend Behaviour Rules.

They never replace the Runtime.

---

# Persistence

Behaviour configuration is persistent.

Temporary Behaviour execution is not.

After restart the Runtime restores:

- Personality
- Behaviour configuration
- current State

Behaviour resumes naturally.

---

# Failure Handling

Invalid Behaviour Rules are ignored.

The Runtime reports validation failures.

One invalid Rule must never stop an Entity.

---

# Extensibility

Future extensions may introduce:

- advanced emotions
- schedules
- group behaviour
- weather reactions
- collaborative behaviours
- seasonal behaviour

Every extension follows the same Behaviour contract.

---

# Design Goal

Behaviour should make Entities feel believable without becoming unpredictable.

Users should quickly recognize patterns while still enjoying small moments of surprise and personality.

---

# Principles

- Behaviour is data-driven.
- Behaviour is deterministic.
- Personality modifies Behaviour.
- AI extends Behaviour.
- Rules remain independent.
- Runtime validates execution.
- Cooldowns prevent repetition.
- Behaviour should enrich—not interrupt—the user's work.
