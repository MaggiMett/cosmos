# Domain

## Purpose

This document defines the conceptual domain of Cosmos.

It describes the fundamental concepts that exist inside the system and the relationships between them.

The Domain defines meaning.

It intentionally contains no implementation details, user interface descriptions or technical architecture.

---

# Cosmos

Cosmos is the complete environment in which users create, organize and evolve their personal universe.

It connects projects, knowledge, tools, Entities and intelligent systems into one coherent ecosystem.

Cosmos is the highest-level domain object.

---

# Project

A Project represents a vision that is transformed into reality.

A Project logically organizes everything that contributes to achieving that vision. Logical inclusion does not transfer ownership of native Resource files.

This includes:

- Knowledge
- Objects
- Resource mappings
- Relationships
- Workspaces
- Decisions
- Runtime references

A Project is a logical domain.

It is not limited to a single repository, application or technology.

---

# Base

The Base represents the user's home inside Cosmos.

It provides access to Rooms, Workspaces and the Companion.

The Base is independent from the currently active Project.

Its visual appearance is defined by the active Theme.

---

# Room

Rooms organize different areas inside the Base.

Each Room provides one or more Workspace Slots.

Rooms primarily organize the user's working environment.

They do not contain project logic.

---

# Workspace

A Workspace represents a configurable place for working.

Workspaces define:

- Layout
- Overlay
- Context
- Tool collection
- Window arrangement

Workspaces are independent from their visual appearance.

Users may freely create, modify and organize Workspaces.

---

# Tool

A Tool is a reusable capability that performs one specific task.

Cosmos distinguishes between two Tool categories.

## User Tools

User Tools provide direct interaction.

Examples:

- Capture
- Archive
- Review
- Texture Editor
- Blueprint Builder

User Tools may open windows or panels.

---

## System Tools

System Tools operate in the background.

Examples:

- Knowledge Processor
- Analysis Engine
- Repository Analyzer
- Runtime Translation

System Tools support the system itself and usually have no direct user interface.

System Tools remain task-oriented capabilities.

Core Runtime infrastructure is not a Tool.

---

# Object

Objects represent meaningful entities inside a Project.

An Object is the primary working unit of Cosmos.

Objects may reference:

- Knowledge
- Resources
- Relationships
- Tags
- Versions

Objects remain independent from their visual representation.

---

# Node

Nodes are the visual representation of Objects inside Cosmos.

Nodes organize Projects spatially.

Nodes never define meaning.

Meaning belongs to the underlying Object.

---

# Knowledge

Knowledge represents structured information stored inside Cosmos.

Every meaningful informational record preserved by Cosmos becomes Knowledge. Resources remain separate implementation assets.

Projects, Objects, Relationships, Blueprints and Resources remain distinct domain concepts. They do not become Knowledge; durable descriptions, summaries, analyses, decisions or transcripts about them may become Knowledge.

Knowledge may originate from:

- Captures
- submitted informational records from files and documents
- explicitly promoted conversation records
- durable descriptions of Blueprints
- Decisions
- External sources

Knowledge grows through refinement instead of replacement.

---

# Resource

Resources represent concrete implementation assets.

Examples include:

- Source files
- Images
- Models
- Audio
- Videos
- Configuration
- Documentation

Resources are referenced by Objects and remain owned by their native repository or source.

Knowledge describes Resources.

Resources never replace Knowledge.

---

# Tag

Tags classify Knowledge and Objects.

Cosmos distinguishes between two categories.

## System Tags

System Tags describe structural information.

Examples:

- Project
- Workspace
- Tool
- Object
- Blueprint
- Capture
- State

System Tags are generated and managed by Cosmos.

---

## User Tags

User Tags describe meaning from the user's perspective.

Examples:

- Lore
- Dwarfs
- Magic
- Weapons
- Mining

Users are fully responsible for maintaining their own tagging strategy.

Cosmos may suggest improvements but never changes User Tags automatically.

---

# Relationship

Relationships are persistent Project-owned domain records that connect exactly two Objects.

Relationships represent meaningful connections.

Version 1 defines one universal relationship:

- Related

Objects reference Relationships, but neither endpoint exclusively owns the record. Nodes and Connectors only visualize it.

Additional relationship types may be introduced later without changing the underlying architecture.

---

# Context

Context describes the current working situation.

Context is inherited automatically through the following hierarchy:

Project

↓

Room

↓

Workspace

↓

Tool

↓

Object

Context reduces manual configuration and helps every Tool understand where it is currently operating.

---

# Entity

An Entity is a persistent identity with an active presence inside the Cosmos Runtime.

Entities may interact with users, other Entities and the environment.

Entity identity and configuration remain independent from visual appearance and optional AI Providers.

Entities never own business logic.

They request actions through Runtime Services.

---

# Theme

A Theme defines the visual representation of Cosmos.

Themes may customize:

- Backgrounds
- Base
- Rooms
- Workspaces
- Nodes
- Companion
- Objects
- Visual effects

Themes never change the underlying domain model.

---

# Companion

The Companion is the user's constant Entity and assistant inside Cosmos.

The Companion exists independently from Projects and accompanies the user throughout the entire system.

It assists, explains, discovers and supports.

The Companion never replaces user decisions.

---

# Principles

- The Domain defines meaning.
- User interfaces are not part of the Domain.
- Technical implementation is not part of the Domain.
- Every Project follows the same Domain Model.
- Meaning belongs to Objects.
- Nodes visualize Objects.
- Knowledge grows continuously.
- Resources implement Objects.
- Context is inherited.
- Entities provide Runtime presence without owning business logic.
- Everything is designed to be extensible.
