# Repository Analyzer

## Purpose

The Repository Analyzer continuously understands the technical structure of project repositories.

It transforms source code, configuration and project structure into structured Runtime knowledge that can be used by Journeyman, the Knowledge Runtime and other System Tools.

The Repository Analyzer understands projects.

It does not modify them.

---

# Architectural Position

Repository Analyzer is a registered System Tool Extension.

It performs task-oriented repository analysis through Core Runtime contracts and is not a Runtime Service or independent Runtime system.

---

# Philosophy

Repositories should be understood before they are modified.

Understanding should be incremental.

Analysis should be repeatable.

The Repository Analyzer observes.

Journeyman performs work.

---

# Responsibilities

The Repository Analyzer is responsible for:

- analyzing repository structure
- identifying project components
- discovering technologies
- understanding architecture
- detecting dependencies
- identifying entry points
- identifying configuration
- generating repository metadata
- detecting structural changes

The Repository Analyzer never changes repository contents.

---

# Runtime Foundation

The Repository Analyzer operates on:

- Project Runtime
- Knowledge Runtime
- Object Service
- Job Runtime
- Provider Runtime (optional)

Repository analysis always executes as Runtime Jobs.

---

# Analysis Scope

The Repository Analyzer may analyze:

- source code
- project structure
- configuration files
- build systems
- dependency manifests
- documentation
- assets
- generated files

Analysis scope remains configurable.

---

# Analysis Pipeline

Every repository analysis follows the same flow.

```text
Repository

↓

Project Discovery

↓

Technology Detection

↓

Structure Analysis

↓

Architecture Analysis

↓

Object Discovery

↓

Relationship Detection

↓

Repository Knowledge

↓

Review Candidates
```

The repository itself remains unchanged.

---

# Project Discovery

The Analyzer first determines:

- project root
- project type
- workspace layout
- build system
- package managers
- repository boundaries

Discovery establishes the analysis context.

---

# Technology Detection

Examples include:

- Python
- Rust
- TypeScript
- Vue
- React
- FastAPI
- Docker
- Unreal Engine
- Unity

Projects may contain multiple technologies.

---

# Structure Analysis

The Analyzer identifies:

- modules
- packages
- directories
- namespaces
- components
- services
- extensions
- plugins

Structure becomes Runtime knowledge.

---

# Architecture Analysis

The Analyzer attempts to understand:

- layering
- module boundaries
- dependencies
- architectural patterns
- extension points
- runtime contracts

Architecture understanding improves over time.

---

# Object Discovery

Repository Objects may include:

- modules
- classes
- interfaces
- APIs
- commands
- services
- extensions
- configuration objects

Objects become part of the Knowledge Runtime.

---

# Relationship Discovery

Relationships may include:

- imports
- references
- inheritance
- composition
- dependencies
- runtime usage

Relationships strengthen repository understanding.

---

# Change Detection

The Analyzer continuously detects:

- added files
- removed files
- renamed files
- structural changes
- dependency updates

Only changed areas require re-analysis whenever possible.

---

# AI Independence

The Repository Analyzer functions without AI.

Rule-based parsing provides deterministic analysis.

AI Providers improve architectural understanding and semantic interpretation.

---

# Runtime Context

Analysis may inherit Context.

Examples include:

- active Project
- selected Workspace
- active Blueprint
- current Review

Context helps prioritize analysis.

---

# Output

The Analyzer produces:

- repository metadata
- discovered Objects
- discovered Relationships
- technology profile
- architecture summary
- Review candidates

The repository itself remains untouched.

---

# Integration

Repository knowledge may be used by:

- Journeyman
- Prompt Builder
- Context Builder
- Knowledge Runtime
- Review Service

The Repository Analyzer never performs implementation work.

---

# Failure Handling

If analysis fails:

- repository contents remain unchanged
- partial analysis is discarded safely
- previous repository knowledge remains available
- future analysis may retry

Repository integrity is always preserved.

---

# Extensibility

Future Extensions may introduce:

- language-specific analyzers
- framework analyzers
- build system analyzers
- architecture analyzers
- dependency visualizers
- security analyzers

Every extension integrates into the Repository Analyzer.

---

# Design Goal

The Repository Analyzer should allow Cosmos to understand software projects as structured knowledge rather than collections of files.

Users and Runtime clients should work with meaningful project understanding instead of raw source code.

---

# Principles

- Repositories are analyzed before they are modified.
- Analysis is incremental.
- Repository contents remain unchanged.
- AI enhances understanding.
- Objects and Relationships become Knowledge.
- Journeyman consumes repository understanding.
- Structural changes are continuously detected.
- Understanding grows over time.
