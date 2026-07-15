# Architecture

## Purpose

This document describes the conceptual architecture of Cosmos.

It explains how the major building blocks of the system relate to each other.

The Architecture defines structure.

It does not describe implementation details, programming languages or runtime behavior.

---

# Overview

Cosmos is designed as a layered system.

Every layer has a single responsibility.

Higher layers organize lower layers.

Lower layers never define higher layers.

This creates a stable architecture that remains extensible over time.

---

# Architecture Hierarchy

```text
Cosmos
│
├── Projects
│
├── Base
│   └── Rooms
│       └── Workspaces
│           └── Tools
│
├── Objects
│   ├── Knowledge
│   ├── Resources
│   ├── Tags
│   └── Relationships
│
└── System Services
```

---

# Cosmos

Cosmos is the root environment.

It connects every Project, every Workspace and every system component into one coherent operating system.

Cosmos owns the global navigation, user experience and shared runtime.

---

# Projects

Projects represent visions.

Every Project provides a structured environment for transforming an idea into reality.

Projects organize Objects.

They never duplicate Knowledge.

---

# Base

The Base is the user's home.

It provides permanent access to Workspaces and the Companion.

The Base exists independently from Projects.

Projects are entered from Cosmos.

Workspaces are entered from the Base.

---

# Rooms

Rooms organize the Base.

A Room provides one or more Workspace Slots.

Rooms exist for organization and immersion.

They do not contain business logic.

---

# Workspaces

Workspaces are configurable working environments.

A Workspace combines:

- Layout
- Overlay
- Context
- Tool collection
- Window state

A Workspace defines how the user works.

It never defines what the user works on.

---

# Tools

Tools perform work.

Every capability inside Cosmos is implemented as a Tool.

Examples include:

- Capture
- Archive
- Review
- Blueprint Builder
- Texture Editor
- Journeyman

Tools remain independent from Projects and Themes.

---

# Objects

Objects represent meaningful entities.

Everything that has meaning inside a Project eventually becomes an Object.

Objects connect:

- Knowledge
- Resources
- Tags
- Relationships
- Versions

Objects are the central domain entity of Cosmos.

---

# Knowledge

Knowledge stores understanding.

It preserves ideas, documentation, discoveries and decisions.

Knowledge grows continuously through refinement.

Knowledge is never duplicated between Projects.

---

# Resources

Resources contain implementation.

Resources include files, source code, textures, models, documents and other physical assets.

Resources belong to Objects.

Knowledge explains Resources.

---

# Tags

Tags organize meaning.

System Tags describe structure.

User Tags describe personal organization.

Together they build the contextual understanding of Cosmos.

---

# Relationships

Relationships connect Objects.

They allow Cosmos to discover patterns, dependencies and semantic connections.

Relationships continuously evolve as Knowledge grows.

---

# Context Flow

Context flows through the architecture.

It is inherited automatically.

```text
Project
    ↓
    Room
        ↓
        Workspace
            ↓
            Tool
                ↓
                Object
                ```

                Each layer contributes additional context.

                Lower layers never replace higher context.

                They extend it.

                ---

                # Extensibility

                Every major component of Cosmos is designed for extension.

                Examples include:

                - Themes
                - Tools
                - Workspaces
                - Blueprints
                - Providers
                - Integrations

                The Core defines contracts.

                Extensions provide capabilities.

                ---

                # Separation of Responsibilities

                Cosmos separates responsibility across its architecture.

                Projects organize visions.

                Objects organize meaning.

                Knowledge organizes understanding.

                Resources organize implementation.

                Tools provide capabilities.

                Workspaces provide environments.

                Rooms organize the Base.

                The Base provides a home.

                Cosmos connects everything together.

                ---

                # Architectural Goal

                The architecture of Cosmos should remain stable for many years.

                New functionality should emerge by extending existing concepts instead of introducing special cases.

                The simpler the Core remains, the more powerful Cosmos becomes.
