# Workspace

## Purpose

A Workspace is a configurable working environment inside Cosmos.

Workspaces provide places where users perform work using Tools.

Unlike Projects, Workspaces do not define meaning.

Unlike Tools, Workspaces do not perform actions.

A Workspace combines Context, Layout, Tools and User Experience into one coherent environment.

---

# Philosophy

A Workspace represents a place to work.

Users should feel like they are sitting down at a workplace rather than opening another application.

Cosmos provides the framework.

Users decide how they want to work.

---

# Responsibilities

A Workspace is responsible for:

- managing Tool instances
- managing Layout
- managing Panels
- managing Window State
- managing Context
- restoring previous sessions
- providing an Overlay

A Workspace never owns Knowledge or Objects.

---

# Workspace Identity

Every Workspace possesses:

- unique ID
- display name
- description
- icon
- overlay
- layout
- context
- assigned Tools
- Theme overrides
- runtime state

Display names may be changed at any time.

Internal IDs never change.

---

# Workspace Context

Every Workspace automatically inherits Context.

Context flows through the Runtime.

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

A Workspace extends inherited Context.

It never replaces it.

Typical additions include:

- Project Tags
- User Tags
- preferred Objects
- active filters

Every Tool automatically receives the current Workspace Context.

---

# Workspace Layout

A Workspace stores its own Layout.

Examples include:

- panel positions
- floating windows
- docked windows
- split layouts
- fullscreen panels
- sidebar visibility

Layouts belong to the Workspace.

Changing a Layout never changes the underlying Project.

---

# Panels

Panels are containers inside the Workspace.

Examples include:

- floating windows
- side panels
- bottom panels
- inspector panels

Panels exist only to organize Tool instances.

Panels contain no business logic.

---

# Tool Instances

Workspaces contain Tool instances.

Multiple instances of the same Tool may exist simultaneously.

Example:

Archive

Archive

Capture

Capture

Blueprint Builder

Each Tool Instance maintains its own state.

---

# Overlay

Every Workspace uses an Overlay.

The Overlay represents the physical workplace.

Examples include:

- desk
- workbench
- laboratory
- cockpit
- drafting table
- command console

The Overlay defines visual interaction only.

It never changes functionality.

---

# Workspace Builder

Users may create their own Workspaces.

Users choose:

- name
- icon
- overlay
- default layout
- Tools
- Theme overrides

Workspaces may be duplicated, exported and shared.

---

# Workspace Presets

Cosmos provides predefined Workspace Presets.

Examples include:

- Knowledge
- Development
- Art

Presets exist only as starting points.

Users remain free to customize or completely replace them.

---

# Runtime State

Every Workspace remembers:

- open Tool instances
- panel positions
- selected Objects
- current filters
- camera state
- Theme overrides

Returning to a Workspace restores its previous state automatically.

---

# Theme Behaviour

Themes determine appearance.

A Theme may replace:

- furniture
- materials
- lighting
- decorations
- animations
- sounds

The Workspace remains functionally identical.

Every visual element may also receive its own Skin.

---

# Physical Interaction

Whenever possible, users interact with physical objects.

Examples:

Notebook

↓

Capture

Workbench

↓

Development Tools

Archive Terminal

↓

Archive

Workbench Screen

↓

Blueprint Builder

Physical interaction strengthens immersion without reducing usability.

---

# Extensibility

Every Workspace is designed for extension.

Future extensions may introduce:

- new Overlays
- additional Panels
- new interaction methods
- specialized Workspace Builders
- collaborative workspaces

Extensions should integrate into the existing Workspace model.

---

# Design Goal

A Workspace should never feel like software.

It should feel like entering a real place designed for a specific type of work.

Users should immediately understand where they are, what they can do and how their tools relate to one another.

---

# Principles

- Workspaces perform work.
- Tools perform actions.
- Projects provide meaning.
- Objects provide focus.
- Layout belongs to the Workspace.
- Context is inherited automatically.
- Multiple Tool instances are allowed.
- Overlays define appearance.
- Themes define atmosphere.
- Users own their Workspaces.
- Everything is extensible.
