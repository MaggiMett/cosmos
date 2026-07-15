# Context

## Purpose

Context represents the current working situation inside Cosmos.

It provides every Runtime component with the information required to understand where the user is working, what they are working on and how that work relates to the rest of the system.

Context eliminates unnecessary configuration by allowing information to flow naturally through the Runtime.

---

# Philosophy

Users should never repeatedly explain where they are working.

Cosmos continuously understands the current situation through inherited Context.

Every interaction begins with Context.

Every Tool adapts automatically.

---

# Responsibilities

Context is responsible for:

- providing working scope
- inheriting semantic information
- filtering relevant content
- reducing manual configuration
- supporting intelligent systems
- preserving consistency across the Runtime

Context never performs work.

It only describes the current situation.

---

# Context Hierarchy

Context is inherited through the Runtime hierarchy.

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
                        Knowledge
                        ```

                        Each level contributes additional Context.

                        Lower levels extend higher levels.

                        Nothing is replaced.

                        ---

                        # Context Components

                        A Runtime Context may contain:

                        - active Project
                        - active Room
                        - active Workspace
                        - active Tool
                        - active Object
                        - inherited System Tags
                        - inherited User Tags
                        - Theme information
                        - Runtime state

                        Different Tools may use different parts of the available Context.

                        ---

                        # Context Inheritance

                        Every level automatically inherits the Context of its parent.

                        Example:

                        ```text
                        Project
                        Mettventures

                        ↓

                        Workspace
                        Development

                        ↓

                        Tool
                        Blueprint Builder

                        ↓

                        Object
                        Dwarven Pickaxe
                        ```

                        The Blueprint Builder already understands:

                        - active Project
                        - available Tags
                        - active Workspace
                        - current Object

                        No additional configuration is required.

                        ---

                        # Context Tags

                        Context is primarily expressed through Tags.

                        Examples include:

                        System Tags

                        - Project
                        - Workspace
                        - Object
                        - Blueprint

                        User Tags

                        - Lore
                        - Dwarfs
                        - Mining
                        - Magic

                        Inherited Tags continuously build the current semantic understanding.

                        ---

                        # Workspace Context

                        Every Workspace defines its own Context additions.

                        Examples include:

                        - preferred Objects
                        - default filters
                        - active Branches
                        - frequently used Tools

                        Changing Workspaces changes Context automatically.

                        ---

                        # Tool Context

                        Tools never discover Context themselves.

                        The Runtime provides Context before any Tool performs work.

                        This allows every Tool to remain reusable and independent.

                        ---

                        # Context Snapshots

                        Long-running operations use Context Snapshots.

                        A Snapshot preserves the complete working Context at the moment an operation begins.

                        Examples include:

                        - Journeyman tasks
                        - Analysis jobs
                        - Knowledge Processing
                        - Blueprint generation

                        Later Context changes do not affect running operations.

                        ---

                        # Discovery

                        Context enables intelligent discovery.

                        Because Cosmos understands the current situation, it can identify:

                        - related Objects
                        - duplicate Knowledge
                        - missing information
                        - inconsistent Tags
                        - potential Relationships

                        Suggestions remain contextual instead of global.

                        ---

                        # Runtime

                        Context exists only while the Runtime is active.

                        It is continuously rebuilt as users navigate through Cosmos.

                        Persistent data remains stored inside Projects, Objects and Knowledge.

                        Context simply describes the current perspective.

                        ---

                        # Extensibility

                        Future extensions may contribute additional Context.

                        Examples include:

                        - collaboration
                        - permissions
                        - AI providers
                        - custom workflows
                        - specialized Runtime states

                        Every extension participates in the same Context model.

                        ---

                        # Design Goal

                        Context should become invisible.

                        Users should naturally experience Cosmos as understanding where they are and what they are trying to accomplish.

                        The less users need to manually configure, the more natural the entire system becomes.

                        ---

                        # Principles

                        - Context is inherited.
                        - Context never replaces meaning.
                        - Context reduces configuration.
                        - Every Tool receives Context.
                        - Context remains lightweight.
                        - Context continuously evolves.
                        - Snapshots preserve long-running work.
                        - Context belongs to the Runtime.
