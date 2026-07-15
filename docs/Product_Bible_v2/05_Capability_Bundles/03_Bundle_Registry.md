# Bundle Registry

## Purpose

The Bundle Registry maintains the catalog of all Capability Bundle Definitions available to Cosmos.

It provides discovery, validation metadata, dependency information and compatibility details without loading Bundle implementations.

The Registry knows what Bundles exist.

The Bundle Runtime decides which Bundles become active.

---

# Philosophy

Capability Bundles should be discoverable without being executed.

The Registry provides metadata.

It never performs Runtime work.

A Bundle may exist inside the Registry while remaining unassigned or inactive.

---

# Responsibilities

The Bundle Registry is responsible for:

- registering Bundle Definitions
- maintaining immutable Bundle identities
- exposing Bundle metadata
- exposing compatibility information
- exposing dependency declarations
- exposing version information
- supporting Bundle discovery

The Registry never executes Bundle code.

---

# Registry Entry

Every Bundle Definition registers exactly one Registry Entry.

Each entry contains:

- immutable Bundle ID
- display name
- description
- version
- author
- extension source
- compatible Runtime API
- compatible Entity Roles
- dependency declarations
- Permission declarations
- capability declarations
- configuration schema
- lifecycle version

Registry Entries remain lightweight.

---

# Bundle Discovery

The Registry supports Bundle discovery.

Bundles may be searched by:

- name
- ID
- capability
- Entity Role
- dependency
- author
- version
- Extension package

Discovery never activates a Bundle.

---

# Bundle Identity

Every Bundle possesses:

- immutable ID
- semantic version
- display name

Display names may change.

Bundle IDs never change.

The Registry always identifies Bundles through their immutable ID.

---

# Versioning

Every Registry Entry stores Bundle version information.

Version compatibility includes:

- Bundle version
- Runtime API version
- Extension API version

The Registry exposes compatibility.

The Bundle Runtime validates compatibility.

---

# Dependency Metadata

Dependency declarations include:

- required Bundles
- optional Bundles
- Runtime Services
- Providers
- minimum versions

Dependencies remain descriptive.

Resolution belongs to the Bundle Runtime.

---

# Capability Metadata

Every Registry Entry exposes provided capabilities.

Examples include:

- conversation
- workspace_navigation
- review_assistance
- suggestion_generation
- job_monitoring

Capabilities are metadata.

Execution belongs to Bundle Instances.

---

# Permission Metadata

Registry Entries expose requested Permissions.

Examples include:

- request_tool_open
- observe_jobs
- display_review
- navigate_workspace

Permissions remain declarative.

The Runtime decides whether they are granted.

---

# Role Compatibility

Registry Entries declare compatible Entity Roles.

Example:

Conversation Bundle

Compatible Roles:

- Support Entity
- Guide Entity
- Worker Entity

Ambient Entities remain incompatible.

Compatibility is validated before assignment.

---

# Configuration Schema

Bundles may expose configurable settings.

Examples include:

- notification frequency
- preferred Provider
- proactive suggestions
- idle dialogue

The Registry stores the configuration schema.

Runtime stores configuration values.

---

# Bundle Categories

Bundles may belong to one or more categories.

Examples include:

- Conversation
- Workspace
- Knowledge
- Review
- Navigation
- Ambient
- Tutorial
- Repository
- Development

Categories simplify discovery.

They do not affect Runtime behavior.

---

# Assignment Information

The Registry exposes assignment status.

Examples:

- installed
- assignable
- deprecated
- disabled
- incompatible

Assignment itself belongs to the Bundle Runtime.

---

# Deprecation

Bundles may become deprecated.

Deprecated Bundles:

- remain identifiable
- remain discoverable
- remain loadable when compatible

The Registry provides migration recommendations where available.

---

# Security

The Registry never trusts Bundle metadata blindly.

Every Bundle is validated before registration.

Invalid metadata is rejected.

Registry integrity is maintained independently from Bundle execution.

---

# Runtime Independence

The Registry never stores:

- Bundle Runtime State
- active Bundle Instances
- Entity assignments
- conversations
- temporary context

These belong to Runtime systems.

---

# Extensibility

Future extensions may introduce:

- Bundle ratings
- certification levels
- marketplace metadata
- licensing
- compatibility badges
- community verification

The Registry remains the single source of Bundle metadata.

---

# Design Goal

The Bundle Registry should allow Cosmos to discover, validate and organize Capability Bundles without coupling discovery to execution.

Users and developers should always understand what a Bundle provides before assigning it to an Entity.

---

# Principles

- The Registry stores metadata.
- Bundle execution belongs to the Runtime.
- Bundle identity is immutable.
- Compatibility is declarative.
- Discovery never activates Bundles.
- Configuration schemas are descriptive.
- Runtime State never belongs in the Registry.
- Every Bundle has exactly one Registry Entry.
