# Repository Runtime

## Purpose

The Repository Runtime manages the relationship between Cosmos Projects and external repositories.

It allows users to organize Projects semantically while preserving complete compatibility with existing development environments.

The Repository Runtime never owns repositories.

It understands them.

---

# Philosophy

Users think in Objects.

Repositories store implementation.

The Repository Runtime connects both worlds without forcing either side to change.

Cosmos organizes meaning.

Repositories organize implementation.

Journeyman translates between them.

---

# Responsibilities

The Repository Runtime is responsible for:

- connecting Projects to repositories
- maintaining Object ↔ Resource mappings
- tracking repository state
- coordinating Journeyman translation
- detecting external changes
- exposing repository information through Runtime Services

The Repository Runtime never edits repositories directly.

---

# Repository Independence

Repositories remain first-class citizens.

Projects continue working normally without Cosmos.

Examples include:

- Git repositories
- Minecraft Mods
- Resource Packs
- Python Projects
- Web Applications

Cosmos never introduces proprietary repository structures.

---

# Runtime Structure

Every repository maintains its native structure.

Examples include:

Minecraft

- assets/
- data/
- recipes/

Python

- packages/
- modules/
- tests/

Frontend

- src/
- public/
- components/

The Runtime never replaces these structures.

---

# User Structure

Users work with semantic Objects.

Examples include:

Lore

↓

Dwarfs

↓

Dwarven Pickaxe

The semantic structure reflects understanding rather than file organization.

---

# Translation Layer

Journeyman continuously translates between:

```text
User Structure

↓

Runtime Translation

↓

Repository Structure
```

The user defines meaning.

Journeyman resolves implementation.

---

# Object Mapping

Objects become the bridge between both worlds.

An Object may reference:

- one Resource
- multiple Resources
- generated Resources
- external Resources

Users continue working with one Object regardless of implementation complexity.

---

# Repository Discovery

Existing repositories may be imported.

Journeyman analyzes:

- directory structure
- technologies
- naming conventions
- dependencies
- project patterns

Based on this analysis, Journeyman proposes an initial semantic Project Structure.

The user decides what becomes part of the Project.

---

# Repository Monitoring

The Repository Runtime continuously monitors external changes.

Examples include:

- file modifications
- file creation
- file deletion
- repository updates
- branch changes

Changes are translated into Runtime Events.

---

# Synchronization

Synchronization is bidirectional.

User changes

↓

Journeyman

↓

Repository

Repository changes

↓

Repository Runtime

↓

Journeyman

↓

Objects

Synchronization should preserve user intent while maintaining repository compatibility.

---

# Runtime Services

The Repository Runtime collaborates with:

- Project Service
- Object Service
- Resource Service
- Job Service

Business logic remains inside Runtime Services.

---

# Events

Typical Events include:

- RepositoryConnected
- RepositoryScanned
- RepositoryUpdated
- RepositoryDisconnected
- ResourceMapped
- ResourceUnmapped

Other Runtime systems subscribe through the Event Model.

---

# Compatibility

The Repository Runtime must remain compatible with external tooling.

Examples include:

- Git
- IDEs
- Build Systems
- Compilers
- Minecraft Mod Loaders
- External Editors

Cosmos should integrate into existing workflows rather than replacing them.

---

# Failure Handling

Repository failures remain isolated.

If a repository becomes unavailable:

- semantic Project data remains available
- Object mappings remain preserved
- Runtime Services continue operating where possible
- synchronization resumes when the repository becomes available

---

# Extensibility

Future extensions may introduce support for additional repository types, development platforms and build systems.

The Repository Runtime should require only new translators rather than architectural changes.

---

# Design Goal

The Repository Runtime should make technical implementation feel invisible.

Users organize Projects according to meaning while Journeyman continuously maintains compatibility with the underlying repository.

Both perspectives remain synchronized without ever becoming identical.

---

# Principles

- Repositories remain independent.
- Cosmos organizes meaning.
- Journeyman performs translation.
- Objects connect both worlds.
- Repository compatibility is always preserved.
- Synchronization is bidirectional.
- External tools remain first-class citizens.
- One repository failure never affects the Runtime.
