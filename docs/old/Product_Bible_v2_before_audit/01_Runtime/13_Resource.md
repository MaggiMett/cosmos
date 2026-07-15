# Resource

## Purpose

Resources represent the physical implementation assets of a Project.

Unlike Knowledge, Resources contain the actual files, media and technical artifacts required to build a real product.

Resources implement.

They do not explain.

---

# Philosophy

Resources belong to the implementation layer.

Users think in Objects.

Objects reference Resources.

Resources remain compatible with the technologies they belong to.

Cosmos never replaces existing project structures.

---

# Responsibilities

Resources are responsible for:

- storing implementation assets
- preserving compatibility
- supporting external tools
- providing technical content
- linking implementation to Objects

Resources never define meaning.

Meaning belongs to Objects and Knowledge.

---

# Resource Types

Resources may include:

- source code
- configuration
- images
- textures
- 3D models
- audio
- video
- documents
- localization
- scripts
- generated assets
- external files

Future Extensions may introduce additional Resource types.

---

# Ownership

Resources belong to Objects.

One Object may reference:

- one Resource
- many Resources

One Resource may also be referenced by multiple Objects when appropriate.

---

# Runtime Location

Resources remain inside the Runtime Structure.

Examples include:

Minecraft

- assets/
- data/
- resource packs

Applications

- frontend/
- backend/
- database/

Cosmos references Resources.

It does not replace existing repository layouts.

---

# Knowledge

Knowledge explains Resources.

Examples include:

- implementation notes
- design decisions
- documentation
- research
- discussions

Resources contain implementation.

Knowledge provides understanding.

---

# Relationships

Resources may participate in Relationships through their owning Objects.

Relationships are never attached directly to files.

Meaning always belongs to the Object layer.

---

# Versioning

Resources evolve naturally.

Version history should remain available whenever possible.

Cosmos should preserve the relationship between historical Resources and historical Knowledge.

---

# External Editing

Resources are expected to be edited by external software.

Examples include:

- Visual Studio Code
- Blender
- Blockbench
- Photoshop
- IntelliJ
- Unreal Engine

Cosmos should detect changes without requiring users to work exclusively inside Cosmos.

---

# Import

Existing Resources may be imported into Projects.

Journeyman analyzes:

- directory structure
- technologies
- naming conventions
- dependencies

Resources are then connected to existing or newly created Objects.

---

# Generation

System Tools may generate new Resources.

Examples include:

- source code
- configuration
- localization
- templates
- documentation

Generated Resources become normal Runtime Resources.

---

# Runtime

Resources remain independent from:

- Themes
- Workspaces
- Tools
- Views

Different Tools may edit the same Resource.

The Resource itself remains unchanged except through explicit user actions.

---

# Extensibility

Future extensions may introduce:

- new Resource types
- custom editors
- validation systems
- preview providers
- importers
- exporters

Every extension should continue treating Resources as implementation assets.

---

# Design Goal

Resources should integrate naturally with existing development workflows.

Users should never feel locked into Cosmos.

Instead, Cosmos should provide understanding while allowing every Resource to remain fully compatible with external software.

---

# Principles

- Resources implement Objects.
- Knowledge explains Resources.
- Objects reference Resources.
- Resources remain technology compatible.
- Cosmos never replaces repository structures.
- External tools remain first-class citizens.
- Resources evolve continuously.
- Everything remains extensible.
