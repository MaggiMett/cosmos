# Workspace Builder

## Purpose

Workspace Builder allows users to create, customize and organize personal Workspaces.

A Workspace defines how the user prefers to work.

It combines Tools, Layouts, Overlays and Context into one reusable working environment.

Workspace Builder creates workplaces.

It does not create Knowledge.

---

# Philosophy

Every person works differently.

Some users prefer one large Tool.

Others prefer many windows.

Cosmos should adapt to the user rather than forcing one workflow.

Every Workspace should become a personalized desk.

---

# Responsibilities

Workspace Builder is responsible for:

- creating Workspaces
- editing Workspaces
- organizing Tools
- configuring Panels
- configuring Layouts
- assigning Overlays
- defining Workspace Context
- saving Workspace Blueprints

Workspace Builder never performs work belonging to the contained Tools.

---

# Runtime Dependencies

Workspace Builder uses:

- Workspace Service
- Tool Service
- Theme Service
- Runtime Context
- Event Model

Workspace Builder never modifies Persistence directly.

---

# Workspace

A Workspace represents one complete working environment.

A Workspace may be:

- global
- project specific

Every Workspace is independent.

---

# Workspace Components

A Workspace may contain:

- Overlay
- Panels
- Tool Instances
- Layout
- Theme overrides
- Context filters
- Project associations

These components define how the Workspace behaves.

---

# Tool Management

Users may freely add or remove User Tools.

Examples include:

- Capture
- Archive
- Review
- Blueprint Builder

Removing a Tool removes it only from the Workspace.

The Tool remains installed.

---

# Panels

Panels provide containers for Tool Instances.

Users may:

- dock Tools
- float Tools
- resize Panels
- hide Panels
- restore Panels

Panels define presentation only.

---

# Overlay

Every Workspace uses exactly one Overlay.

The Overlay defines:

- desk
- furniture
- interaction areas
- decorative elements

Changing an Overlay never changes functionality.

---

# Project Workspaces

Users may create Workspaces specifically for one Project.

Example:

Workspace

↓

Mettventures

↓

Automatically inherits:

- Project Context
- Project Tags
- Project Objects

Project Workspaces reduce manual configuration.

---

# Global Workspaces

Global Workspaces remain available across every Project.

Examples include:

- Knowledge
- Planning
- Writing

Global Workspaces receive Context dynamically.

---

# Workspace Blueprints

Every Workspace may be saved as a Blueprint.

Blueprints preserve:

- Tool arrangement
- Overlay
- Panels
- Layout
- Context configuration

New Workspaces may be created from existing Blueprints.

---

# Context

Workspace Builder configures Context behavior.

Examples include:

- default Project
- preferred Tags
- active Object types
- default filters

Context remains inherited from the Runtime.

Workspace Builder only extends it.

---

# Themes

Users may override Theme components per Workspace.

Examples include:

- Overlay
- Background
- Node Skin
- Companion Skin

Workspace customization never affects the global Theme unless explicitly requested.

---

# Runtime State

Workspace Builder never stores Runtime State.

It defines Workspace configuration.

Runtime State belongs to Workspace Runtime.

---

# Companion

Companion may assist while building Workspaces.

Examples include:

- recommending Tool combinations
- suggesting Layout improvements
- explaining Tool interactions

The user remains responsible for Workspace design.

---

# Failure Handling

If Workspace creation fails:

- the current Blueprint remains available
- existing Workspaces remain unchanged
- validation errors are explained
- retry remains possible

---

# Extensibility

Future Extensions may introduce:

- custom Panels
- custom Overlays
- custom Layout systems
- collaborative Workspaces
- VR Workspaces
- animated furniture

Workspace Builder should remain independent from specific Workspace content.

---

# Design Goal

Workspace Builder should allow every user to build a personal operating environment.

Instead of adapting to software, users continuously shape Cosmos into the workspace that best matches the way they think and create.

---

# Principles

- Workspaces define environments.
- Tools perform work.
- Layout belongs to the Workspace.
- Runtime State belongs to Workspace Runtime.
- Users build their own workplaces.
- Project Workspaces inherit Context.
- Blueprints preserve Workspace configuration.
- Every Workspace remains fully customizable.
