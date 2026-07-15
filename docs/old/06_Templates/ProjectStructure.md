# Project Structure

## Purpose

This document defines how projects are represented inside Cosmos.

It establishes the relationship between the user's logical project structure and the underlying technical implementation.

The goal is to provide an intuitive project organization without changing how the target technology works internally.

---

# Core Principle

Cosmos never organizes files.

Cosmos organizes meaning.

The user works with concepts, objects and relationships.

The technical implementation remains compatible with the target platform.

---

# Source of Truth

Every project has exactly one technical source of truth.

The source of truth is always the real project repository.

Examples:

- Minecraft Modpack
- Application source code
- Website
- Python project
- Documentation repository

Cosmos never replaces the repository.

It builds an intelligent layer on top of it.

---

# Two Project Structures

Every project consists of two connected structures.

## User Structure

The User Structure represents how humans understand a project.

It is optimized for:

- navigation
- understanding
- planning
- brainstorming
- organization

The User Structure is visualized inside Cosmos.

Example:

Mettventures

- Lore
- Items
    - Weapons
        - Tools
        - NPCs
        - Structures
        - Magic

        The user is free to organize this structure.

        ---

        ## Runtime Structure

        The Runtime Structure represents how the target technology expects the project to exist.

        Examples:

        Minecraft

        - assets/
        - data/
        - src/

        Application

        - frontend/
        - backend/
        - database/
        - tests/

        The Runtime Structure always follows the technical requirements of the platform.

        ---

        # Relationship

        The User Structure and Runtime Structure are independent.

        Cosmos connects both structures.

        Changing one does not require changing the other.

        Journeyman is responsible for translating between both worlds.

        ---

        # Projects

        A Project represents a complete working domain.

        Projects may be:

        - User Projects
        - System Projects

        Examples

        User Projects

        - Mettventures
        - Homeserver
        - Website

        System Projects

        - Knowledge Workspace
        - Workbench

        Both project types use exactly the same architecture.

        ---

        # Nodes

        Nodes are the visual representation of the User Structure.

        Nodes never represent raw files.

        Nodes represent meaningful concepts.

        Examples:

        - Lore
        - Items
        - NPCs
        - Character
        - API
        - Dashboard

        Nodes are connected through Constellation Lines.

        These relationships visualize how the project is organized.

        ---

        # Node Types

        Cosmos currently defines two node types.

        ## Container Nodes

        Container Nodes organize other Nodes.

        Examples:

        - Lore
        - Items
        - Characters

        Container Nodes primarily provide structure.

        ---

        ## Object Nodes

        Object Nodes represent individual working objects.

        Examples:

        - Dwarven Pickaxe
        - King Borin
        - Login Screen
        - Health API

        Object Nodes can be opened, edited and implemented.

        ---

        # Objects

        Every Node owns a corresponding Object.

        Objects are the smallest independent units inside Cosmos.

        Objects contain the complete context of a logical entity.

        Objects may reference:

        - resources
        - captures
        - knowledge
        - files
        - images
        - blueprints
        - relationships
        - metadata

        An Object is independent from its visual representation.

        Nodes visualize Objects.

        ---

        # Object Resources

        Objects reference technical resources.

        Resources may include:

        - source files
        - textures
        - models
        - documentation
        - configuration
        - localization
        - captures
        - knowledge
        - media

        Resources remain inside the original repository.

        Cosmos never duplicates project resources.

        ---

        # Object Views

        Objects are opened through Object Views.

        Object Views provide a simplified working environment.

        Typical sections may include:

        - Overview
        - Description
        - Capture
        - Knowledge
        - Resources
        - Blueprint
        - History
        - Relationships

        Workbench tools operate on Object Resources.

        ---

        # Runtime Translation

        Journeyman translates User Structure into Runtime Structure.

        The user decides:

        - what exists
        - where it belongs
        - how it should be organized

        Journeyman decides:

        - where files belong
        - naming conventions
        - technical implementation
        - validation
        - compatibility

        The user defines meaning.

        Journeyman defines implementation.

        ---

        # Runtime Resources

        Technical implementation may span many files.

        Example:

        Object

        Dwarven Pickaxe

        Resources

        - texture
        - recipe
        - model
        - localization
        - code
        - configuration

        The user experiences one Object.

        Journeyman manages many implementation files.

        ---

        # Repository Compatibility

        Cosmos never requires a custom repository layout.

        Projects remain compatible with:

        - Git
        - IDEs
        - build systems
        - external editors
        - existing tooling

        A project can always be opened without Cosmos.

        ---

        # Importing Existing Projects

        Existing repositories can be imported.

        Journeyman analyzes:

        - folder structure
        - object patterns
        - naming conventions
        - dependencies
        - project architecture

        Journeyman suggests a User Structure.

        The user decides what should become part of the Cosmos representation.

        Importing is always incremental.

        ---

        # Creating New Objects

        New Objects begin as Concepts.

        Concept Objects may contain:

        - captures
        - descriptions
        - references
        - ideas
        - relationships

        Implementation begins only when requested.

        Journeyman then creates the required Runtime Resources.

        ---

        # Object States

        Objects may exist in different states.

        Examples:

        - Concept
        - Ready
        - Implementing
        - Implemented
        - Needs Review
        - Broken

        States communicate implementation progress without exposing technical complexity.

        ---

        # Blueprints

        Blueprints define reusable Object types.

        A Blueprint may define:

        - required resources
        - object layout
        - validation rules
        - runtime patterns
        - workbench tools
        - object views

        Blueprints are independent from Capture Templates.

        ---

        # User Customization

        Users may create their own User Structure.

        Journeyman may suggest structures based on existing repositories.

        Users may:

        - create Nodes
        - rename Nodes
        - reorganize Nodes
        - merge Nodes
        - import suggested Nodes

        The User Structure always belongs to the user.

        ---

        # Themes

        The visual appearance of a Project is independent from its structure.

        Themes may completely change visual representation.

        Examples:

        Galaxy

        - stars
        - constellations
        - nebulae

        Fantasy

        - cities
        - roads
        - kingdoms

        Modern

        - minimal diagrams
        - clean geometry

        Only the visualization changes.

        The underlying Objects, Nodes and relationships remain identical.

        ---

        # Principles

        - The repository is the technical source of truth.
        - Cosmos organizes meaning, not files.
        - Every Node owns an Object.
        - Nodes visualize Objects.
        - Objects reference technical resources.
        - Journeyman manages technical implementation.
        - Users manage logical project organization.
        - Runtime compatibility is always preserved.
        - Existing repositories can always be imported.
        - Themes never change project structure.
        - The same architecture applies to User Projects and System Projects.
