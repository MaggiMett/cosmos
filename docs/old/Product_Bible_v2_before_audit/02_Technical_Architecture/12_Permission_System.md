# Permission System

## Purpose

The Permission System controls what Runtime components are allowed to do.

Every action that modifies or accesses the Runtime passes through the Permission System.

Permissions protect the Core while allowing Extensions to remain powerful.

The Runtime always remains in control.

---

# Philosophy

No Runtime component should automatically receive unrestricted access.

Every capability must be explicitly declared.

Every permission must be explicitly granted.

Trust should never be assumed.

---

# Responsibilities

The Permission System is responsible for:

- validating Runtime permissions
- enforcing access control
- protecting Runtime Services
- limiting Extension capabilities
- protecting external resources
- exposing permission information
- supporting future security policies

The Permission System never performs business logic.

---

# Permission Model

Permissions are capability based.

A permission describes what a component may do.

Examples include:

- read Knowledge
- create Knowledge
- modify Objects
- delete Objects
- import Resources
- generate Resources
- execute AI Providers
- access network
- manage Workspaces

Permissions describe actions.

They do not describe implementations.

---

# Permission Categories

Initial categories include:

## Knowledge

Examples:

- read
- create
- update
- review

---

## Objects

Examples:

- create
- update
- archive
- delete

---

## Resources

Examples:

- import
- export
- modify
- generate

---

## Projects

Examples:

- create
- open
- close
- archive

---

## Workspaces

Examples:

- create
- modify
- remove

---

## Runtime

Examples:

- create Jobs
- subscribe Events
- publish Events
- register Extensions

---

## Providers

Examples:

- execute AI
- image generation
- speech synthesis
- embeddings

---

## External

Examples:

- repository access
- filesystem access
- network access
- external processes

---

# Ownership

Permissions belong to Runtime components.

Examples include:

- User Tools
- System Tools
- Providers
- Integrations
- Runtime Services

Users grant trust.

The Runtime enforces it.

---

# Declaration

Every Extension declares the permissions it requires.

Example:

```text
Capture

requires

- create Knowledge
- update Knowledge
```

The Runtime validates permission declarations before activation.

---

# Runtime Enforcement

Permissions are enforced only by Runtime Services.

Extensions never perform permission checks themselves.

Every Runtime request passes through the same validation layer.

This guarantees consistent behavior.

---

# Least Privilege

Components should request only the permissions they actually require.

Unused permissions should never be granted.

Smaller permission sets reduce risk and improve maintainability.

---

# Permission Resolution

Before executing a Command the Runtime determines:

- requesting component
- granted permissions
- required permission
- current Runtime Context

Only then is the Command executed.

---

# Runtime Context

Permissions may depend on Context.

Examples include:

- active Project
- active Workspace
- repository ownership
- Runtime state

Context may further restrict an otherwise valid permission.

---

# Denied Requests

Denied operations never partially execute.

The Runtime returns a structured error describing:

- missing permission
- requesting component
- attempted action
- possible resolution

Failures should always be understandable.

---

# External Access

Sensitive capabilities require explicit permissions.

Examples include:

- internet access
- repository modification
- filesystem access
- process execution

These permissions should be highly visible to users.

---

# Events

Permission-related Events include:

- PermissionDenied
- PermissionGranted
- ExtensionActivated
- ExtensionDisabled

The Event Model communicates permission changes to interested Runtime components.

---

# Extensibility

Future Extensions may introduce additional permission categories.

Every new permission should integrate into the shared Permission model instead of creating independent security systems.

---

# Design Goal

Permissions should protect the Runtime without becoming intrusive.

Users should understand what every Extension is allowed to do while developers work against one consistent security model.

---

# Principles

- Every capability requires permission.
- Runtime Services enforce permissions.
- Extensions declare permissions.
- Permissions are capability based.
- Least privilege is preferred.
- Denied requests never modify the Runtime.
- Context may further restrict permissions.
- One shared Permission model protects the entire Runtime.
