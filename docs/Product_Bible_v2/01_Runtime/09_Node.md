# Node

## Purpose

Nodes are the visual representation of Objects inside Cosmos.

They provide a spatial interface for exploring Projects and navigating relationships.

Nodes never contain business logic.

They exist purely to visualize the underlying domain.

---

# Philosophy

Objects represent meaning.

Nodes represent Objects.

Changing the appearance of a Node never changes the underlying Object.

Multiple Node styles may represent the same Object without affecting its identity.

---

# Responsibilities

Nodes are responsible for:

- visualizing Objects
- supporting navigation
- displaying relationships
- providing interaction points
- preserving spatial orientation

Nodes never own Knowledge, Resources or Runtime data.

---

# Representation

Every Node represents exactly one Object.

An Object may appear as different Node styles depending on:

- Theme
- Zoom level
- Context
- View Mode

The underlying Object always remains identical.

---

# Interaction

Nodes provide direct interaction with Objects.

Examples include:

- selecting
- focusing
- opening
- inspecting
- creating relationships
- quick actions

Actions are executed by Tools.

Nodes simply provide access.

---

# Hierarchy

Nodes organize Projects visually.

Examples include:

Project

↓

Branch

↓

Object

↓

Sub Object

Hierarchy is visual.

Meaning belongs to the underlying Objects.

---

# Relationships

Relationships are visualized through Connectors.

Nodes never store relationships themselves.

Relationships belong to the Object model.

Nodes simply display them.

---

# Themes

Themes completely control Node appearance.

Examples include:

Galaxy Theme

- glowing stars

Fantasy Theme

- cities
- castles
- villages

Modern Theme

- minimalist circles

Cyber Theme

- holographic hubs

Themes never affect functionality.

---

# Skins

Every Node may use an individual Skin.

Examples include:

- Project Node
- Branch Node
- Object Node
- System Node

Users may override individual Node Skins independently from the active Theme.

---

# Level of Detail

Nodes adapt to zoom level.

Zooming out emphasizes:

- Projects
- Branches

Zooming in gradually reveals:

- Objects
- Relationships
- Labels
- Details

The user should never lose orientation.

---

# Runtime

Nodes possess no domain or business state.

Spatial presentation state such as position, pinned layout, collapsed detail and individual Skin override may be persisted separately as Project view state.

The Runtime generates Node representations from Objects and applies the stored view state.

Objects remain the single source of truth for meaning.

---

# Extensibility

Future Extensions may introduce:

- new Node styles
- additional interaction methods
- alternative visualizations
- custom animations
- specialized layouts

Every extension should continue visualizing existing Objects instead of replacing them.

---

# Design Goal

Nodes should help users understand complex Projects through spatial organization.

They should make relationships visible without exposing technical implementation.

Users should feel like they are exploring a living universe rather than browsing folders.

---

# Principles

- Nodes visualize Objects.
- Objects own meaning.
- Nodes never own data.
- Themes define appearance.
- Skins customize Nodes.
- Relationships belong to Objects.
- Navigation always preserves orientation.
- Every Node remains replaceable.
