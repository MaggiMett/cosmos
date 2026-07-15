# Blueprint Builder

## Purpose

Blueprint Builder allows users to define reusable object structures.

Instead of repeatedly describing similar Objects, users create a Blueprint once and instantiate it whenever needed.

Blueprints define structure.

Objects define content.

---

# Philosophy

Projects naturally contain recurring concepts.

Minecraft contains Items.

Stories contain Characters.

Applications contain Pages.

Blueprints describe these recurring structures without restricting creativity.

---

# Responsibilities

Blueprint Builder is responsible for:

- creating Blueprints
- editing Blueprints
- versioning Blueprints
- instantiating Objects
- defining default fields
- defining Blueprint Tags
- defining Blueprint Relationships

Blueprint Builder never stores Object content.

---

# Runtime Dependencies

Blueprint Builder uses:

- Object Service
- Knowledge Service
- Tag Service
- Relationship Service
- Runtime Context
- Event Model

Blueprint Builder never modifies Persistence directly.

---

# Blueprint

A Blueprint defines the structure of an Object Type.

Examples include:

- Minecraft Item
- Character
- Quest
- Building
- API Endpoint
- UI Screen
- Database Table

Blueprints define expectations.

They never contain project-specific information.

---

# Blueprint Components

A Blueprint may define:

- title
- description
- default Tags
- fields
- sections
- Relationships
- Resources
- child Objects
- validation rules

Projects may extend these definitions.

---

# Blueprint Fields

Fields describe information expected for an Object.

Examples include:

- Name
- Description
- Texture
- Model
- Stats
- Recipe
- Dependencies

Fields may be:

- text
- number
- boolean
- list
- object reference
- resource reference

Future field types may be introduced through Extensions.

---

# Blueprint Tags

Blueprints automatically assign default System Tags.

They may also suggest User Tags.

Users remain free to modify User Tags after Object creation.

---

# Blueprint Relationships

Blueprints may define expected Relationships.

Example:

Minecraft Item

↓

belongs to

↓

Item Category

Character

↓

belongs to

↓

Faction

Relationships become suggestions rather than requirements.

---

# Blueprint Instantiation

Creating an Object from a Blueprint performs:

- create Object
- assign Blueprint
- create default fields
- assign default Tags
- establish default Relationships

The Object immediately becomes part of the Project.

---

# Versioning

Blueprints evolve through versions.

Existing Objects retain their historical structure.

Users may later migrate Objects to newer Blueprint versions when appropriate.

Migration is always explicit.

---

# Project Scope

Blueprints may exist in two scopes.

## Global Blueprints

Reusable across Projects.

Examples:

- Character
- Meeting
- API Endpoint

---

## Project Blueprints

Specific to one Project.

Examples:

- Minecraft Item
- Dwarven Building
- Skill Tree Node

Project Blueprints inherit Runtime Context automatically.

---

# Object Creation

Objects created from Blueprints remain fully editable.

Blueprints provide a starting structure.

They never lock Object behavior.

---

# Companion

Companion may assist while creating Blueprints.

Examples include:

- suggesting fields
- identifying repeated patterns
- proposing Relationships
- explaining existing Blueprints

The user always defines the final structure.

---

# Runtime Context

Blueprint Builder automatically inherits:

- Project
- Workspace
- current Object
- current Tags
- active Theme

Context reduces manual configuration.

---

# Failure Handling

If Blueprint creation fails:

- the Blueprint draft remains available
- validation errors are explained
- retry remains possible
- no existing Objects are modified

---

# Extensibility

Future Extensions may introduce:

- custom field types
- validation rules
- Blueprint inheritance
- domain-specific Blueprints
- automatic Object migration

Every extension follows the same Blueprint Runtime contract.

---

# Design Goal

Blueprint Builder should allow users to gradually formalize recurring ideas without reducing flexibility.

As Projects mature, Blueprints transform repeated manual work into reusable knowledge structures.

---

# Principles

- Blueprints define structure.
- Objects contain content.
- Blueprints are reusable.
- Objects remain editable.
- Blueprint versions are preserved.
- Migration is explicit.
- Runtime Context is inherited.
- Companion assists but never decides.
