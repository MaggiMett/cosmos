# Project Structure

## Purpose

This document defines how Projects are structured inside Cosmos.

It explains how user-defined project organization relates to technical implementation while keeping both worlds independent.

The goal is to allow users to organize projects in the way that best supports understanding without sacrificing compatibility with the target technology.

---

# Philosophy

Cosmos never organizes files.

Cosmos organizes meaning.

The user works with concepts.

Journeyman works with implementation.

Both structures coexist without replacing each other.

---

# Two Structures

Every Project consists of two connected structures.

```text
User Structure

↓

Runtime Translation

↓

Runtime Structure
```

The user only works directly with the User Structure.

Journeyman continuously translates between both worlds.

---

# User Structure

The User Structure represents how humans naturally understand a Project.

It is optimized for:

- understanding
- planning
- brainstorming
- navigation
- architecture
- creativity

The User Structure contains:

- Branches
- Objects
- Relationships
- Context
- Knowledge

The user owns this structure completely.

---

# Runtime Structure

The Runtime Structure represents how the target technology expects the Project to exist.

Examples include:

Minecraft

- assets/
- data/
- resource packs

Application

- frontend/
- backend/
- tests/
- database/

Python

- packages
- modules
- configuration

The Runtime Structure always remains compatible with the target platform.

---

# Runtime Translation

Journeyman connects both structures.

The user decides:

- what exists
- what it means
- how it is organized

Journeyman decides:

- file locations
- naming conventions
- implementation details
- validation
- compatibility
- generated resources

Meaning belongs to the user.

Implementation belongs to Journeyman.

---

# Objects

Objects are the bridge between both structures.

Every Object exists inside the User Structure.

Objects may reference one or many Runtime Resources.

One Object may correspond to:

- one file
- many files
- generated assets
- external resources

Users continue working with one Object regardless of implementation complexity.

---

# Runtime Resources

Runtime Resources always remain inside the original repository.

Cosmos never requires moving project files.

Resources may include:

- source code
- textures
- models
- recipes
- localization
- configuration
- documentation

Objects simply reference these Resources.

---

# Importing Existing Projects

Existing repositories can be imported into Cosmos.

Journeyman analyzes:

- directory structure
- naming conventions
- object patterns
- dependencies
- technologies

Based on this analysis, Journeyman proposes an initial User Structure.

The user decides which suggestions should become part of the Project.

Importing is always incremental.

---

# Creating New Projects

New Projects usually begin without Runtime Resources.

Initially they consist only of:

- Vision
- Knowledge
- Objects
- Relationships

Implementation starts only when the user decides to build something.

Journeyman then creates the required Runtime Resources.

---

# Branches

Projects are organized through Branches.

Branches provide semantic organization.

Examples:

- Lore
- Characters
- Systems
- UI
- Backend
- World Building

Branches are organizational Objects.

They never represent technical folders.

---

# Relationships

Objects may freely reference each other across Branches.

Relationships describe meaning rather than hierarchy.

Cosmos encourages interconnected knowledge instead of isolated folder trees.

---

# Compatibility

The Runtime Structure always remains compatible with external tooling.

Projects continue working with:

- Git
- IDEs
- Build Systems
- External Editors
- Existing Pipelines

A Project can always be used without Cosmos.

Cosmos adds understanding.

It never introduces dependency.

---

# Future Growth

Projects naturally evolve.

```text
Vision

↓

Knowledge

↓

Objects

↓

Resources

↓

Product
```

The logical structure grows together with the user's understanding.

The Runtime grows together with implementation.

Both remain synchronized without becoming identical.

---

# Design Goal

Project Structure should allow users to think like creators rather than programmers.

Users organize meaning.

Journeyman manages implementation.

Both perspectives remain permanently connected.

---

# Principles

- The user owns the User Structure.
- Journeyman owns Runtime Translation.
- Runtime compatibility is always preserved.
- Objects connect both worlds.
- Meaning is independent from implementation.
- Existing repositories remain usable.
- Projects grow continuously.
