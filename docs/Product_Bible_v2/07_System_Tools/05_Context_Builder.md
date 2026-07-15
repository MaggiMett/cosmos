# Context Builder

## Purpose

The Context Builder assembles the minimum complete Runtime Context required to perform a specific task.

Its purpose is to provide System Tools, Capability Bundles and Providers with exactly the information they need.

Nothing more.

Nothing less.

---

# Architectural Position

Context Builder is a registered System Tool Extension.

It performs task-oriented Context assembly through Core Runtime contracts and is not a Runtime Service or independent Runtime system.

---

# Philosophy

More Context is not better.

Relevant Context is better.

The Context Builder should reduce unnecessary information while preserving everything required to solve the current task.

Context should be precise.

Not exhaustive.

---

# Responsibilities

The Context Builder is responsible for:

- assembling Runtime Context
- resolving relevant Objects
- resolving related Knowledge
- resolving Resources
- resolving Blueprints
- resolving Runtime configuration
- resolving active Runtime state
- reducing unnecessary Context

The Context Builder never performs reasoning.

---

# Runtime Foundation

The Context Builder operates on:

- Knowledge Runtime
- Object Service
- Project Runtime
- Workspace Runtime
- Review Service
- Repository Runtime
- Bundle Runtime

Context assembly always occurs before execution.

---

# Context Sources

The Context Builder may assemble Context from:

- Projects
- Objects
- Knowledge
- Resources
- Blueprints
- Reviews
- Runtime configuration
- Repository knowledge
- active Workspace
- active Room
- Runtime state

Every Context source remains authoritative.

---

# Context Assembly Pipeline

Every Context request follows the same flow.

```text
Task Request

↓

Determine Objective

↓

Resolve Context Sources

↓

Collect Runtime Information

↓

Remove Irrelevant Context

↓

Validate Completeness

↓

Context Package
```

The resulting Context Package becomes the working foundation.

---

# Task Awareness

The required Context depends entirely on the task.

Examples include:

Implement Feature

↓

Repository

↓

Blueprint

↓

Objects

↓

Knowledge

---

Explain Object

↓

Object

↓

Relationships

↓

Knowledge

---

Summarize Review

↓

Review

↓

Knowledge

↓

Project

The Context Builder never assumes that every task needs every source.

---

# Context Package

A Context Package may contain:

- Runtime metadata
- Objects
- Knowledge Items
- Relationships
- Resources
- Repository metadata
- Blueprint definitions
- active Runtime state
- Bundle information

Packages remain temporary.

---

# Context Reduction

Irrelevant information should be removed whenever possible.

Examples include:

- unrelated Projects
- unrelated Objects
- unrelated Reviews
- inactive Resources

Smaller Context improves efficiency.

---

# Context Validation

Before delivery the Context Builder verifies:

- required Objects exist
- required Knowledge exists
- Blueprint references remain valid
- Resources are accessible
- Runtime state is consistent

Incomplete Context may trigger additional collection.

---

# Context Consumers

Context Packages may be consumed by:

- Journeyman
- Prompt Builder
- Capability Bundles
- Companion Brain
- Analysis Engine
- Repository Analyzer

Consumers never assemble Context independently.

---

# Runtime Context

Current Runtime information may include:

- active Project
- active Workspace
- selected Object
- active Review
- nearby Entities
- installed Bundles
- current Theme

Runtime information changes continuously.

The Context Package represents one consistent snapshot.

---

# AI Independence

The Context Builder functions entirely without AI.

Context assembly remains deterministic.

AI Providers consume Context.

They never construct it.

---

# Performance

Context should be assembled incrementally.

Previously assembled Context may be reused when still valid.

Only changed Runtime information should require rebuilding.

---

# Security

The Context Builder respects Runtime Permissions.

Only authorized information may become part of a Context Package.

Permission filtering occurs during assembly.

---

# Failure Handling

If Context cannot be completed:

- missing elements are reported
- partial Context is clearly marked
- Runtime remains unaffected
- execution may be postponed

Context failures never corrupt Runtime State.

---

# Extensibility

Future Extensions may contribute new Context Sources.

Examples include:

- external documentation
- design systems
- cloud repositories
- enterprise knowledge
- simulation data

Every source integrates through the same Context contract.

---

# Design Goal

The Context Builder should ensure that every System Tool and Provider receives a precise, minimal and complete understanding of the current task.

High-quality Context should become one of the defining strengths of Cosmos.

---

# Principles

- Context is assembled.
- Context is minimal.
- Context is complete.
- Context is deterministic.
- Runtime remains authoritative.
- AI consumes Context.
- Consumers never assemble Context themselves.
- Every task receives its own Context Package.
