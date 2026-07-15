# Runtime Model

## Purpose

This document defines how Cosmos behaves while it is running.

Unlike the Domain and Architecture documents, the Runtime Model describes how information, context and actions move through the system.

The Runtime Model defines interaction.

It intentionally avoids implementation details such as programming languages, databases or APIs.

---

# Runtime Philosophy

Cosmos behaves as one living system.

The user should never feel like they are switching between independent applications.

Every interaction happens inside one continuous environment.

The Runtime continuously synchronizes Projects, Workspaces, Tools and Knowledge into one coherent experience.

---

# Runtime Hierarchy

Every user interaction follows the same hierarchy.

```text
Cosmos
    ↓
    Project
        ↓
        Room
            ↓
            Workspace
                ↓
                Tool
                    ↓
                    Object
                        ↓
                        Knowledge / Resources
                        ```

                        Each level provides context for the next.

                        No layer needs to rediscover information that has already been established above it.

                        ---

                        # Context Inheritance

                        Context flows downward.

                        Every layer automatically inherits the context of its parent.

                        Example:

                        Project
                        ↓

                        Mettventures

                        ↓

                        Workspace

                        ↓

                        Building Workspace

                        ↓

                        Tool

                        ↓

                        Blueprint Builder

                        ↓

                        Object

                        ↓

                        Dwarven Pickaxe

                        The Blueprint Builder already understands that it is working inside the Mettventures Project.

                        No manual project selection is required.

                        ---

                        # Runtime Context

                        Runtime Context consists of:

                        - Active Project
                        - Active Room
                        - Active Workspace
                        - Active Tool
                        - Active Object
                        - System Tags
                        - User Tags

                        Context continuously changes as the user navigates through Cosmos.

                        Every Tool automatically reacts to context changes.

                        ---

                        # User Interaction

                        Every interaction follows the same lifecycle.

                        ```text
                        User

                        ↓

                        Workspace

                        ↓

                        Tool

                        ↓

                        Object

                        ↓

                        Knowledge

                        ↓

                        Runtime Update
                        ```

                        The user never edits the Runtime directly.

                        All changes happen through Tools.

                        ---

                        # Knowledge Flow

                        Knowledge evolves continuously.

                        Ideas are captured.

                        Captures become Knowledge.

                        Knowledge creates Objects.

                        Objects reference Resources.

                        Resources become real products.

                        ```text
                        Idea

                        ↓

                        Capture

                        ↓

                        Knowledge

                        ↓

                        Object

                        ↓

                        Resource

                        ↓

                        Product
                        ```

                        Nothing is discarded.

                        Knowledge grows through refinement.

                        ---

                        # Runtime State

                        Every Workspace remembers its own state.

                        Examples include:

                        - Open Tools
                        - Window positions
                        - Selected Objects
                        - Current filters
                        - Active Theme
                        - Overlay configuration

                        Returning to a Workspace restores its previous state automatically.

                        ---

                        # Events

                        The Runtime reacts to events.

                        Examples include:

                        - Capture created
                        - Object updated
                        - Resource imported
                        - Workspace opened
                        - Theme changed
                        - Project switched

                        Events notify the Runtime that something has changed.

                        They never define business logic.

                        ---

                        # System Services

                        Background systems continuously support the Runtime.

                        Examples include:

                        - Knowledge Processing
                        - Analysis
                        - Repository Monitoring
                        - Search Indexing
                        - Context Building
                        - AI Assistance

                        These services operate independently from the user's current activity.

                        They should never unnecessarily interrupt the user.

                        ---

                        # Discovery

                        Cosmos prefers discovery over interruption.

                        Instead of immediately asking questions, the Runtime collects evidence over time.

                        Only when meaningful patterns emerge does Cosmos present suggestions to the user.

                        Examples include:

                        - Duplicate Knowledge
                        - Missing Blueprint information
                        - Similar Objects
                        - Inconsistent Tags
                        - Potential Relationships

                        The user always decides how to proceed.

                        ---

                        # Extensibility

                        The Runtime is designed to grow.

                        New capabilities should integrate into existing Runtime flows instead of creating parallel systems.

                        Every new extension should participate in:

                        - Context
                        - Events
                        - Registries
                        - Knowledge
                        - Runtime State

                        This ensures a consistent experience throughout Cosmos.

                        ---

                        # Runtime Goal

                        The Runtime should feel invisible.

                        The user should experience one continuous world instead of many disconnected applications.

                        Every action should naturally build upon previous context, allowing the user to focus entirely on creation instead of system management.
