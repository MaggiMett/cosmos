# Prompt Builder

## Purpose

The Prompt Builder transforms a Runtime Task and its Context Package into a structured Provider Request.

It compiles all relevant information into an optimized prompt tailored to the selected Provider.

The Prompt Builder translates Runtime understanding into Provider understanding.

---

# Philosophy

Providers should never receive raw Runtime data.

They should receive a carefully structured request.

The Prompt Builder composes prompts.

It never performs reasoning.

---

# Responsibilities

The Prompt Builder is responsible for:

- transforming Runtime Tasks into Provider Requests
- structuring Context Packages
- applying Provider formatting
- reducing redundant information
- assembling execution instructions
- preserving Runtime intent
- generating reproducible prompts

The Prompt Builder never gathers Context.

---

# Runtime Foundation

The Prompt Builder operates on:

- Context Builder
- Provider Runtime
- Project Runtime
- Bundle Runtime
- Runtime Configuration

The Prompt Builder always receives a completed Context Package.

---

# Input

The Prompt Builder receives:

- Task
- Context Package
- Runtime configuration
- selected Provider
- execution preferences

The Prompt Builder never requests additional Runtime information.

---

# Prompt Assembly Pipeline

Every Provider Request follows the same flow.

```text
Task

↓

Context Package

↓

Provider Profile

↓

Prompt Composition

↓

Prompt Optimization

↓

Provider Request
```

Prompt generation remains deterministic whenever possible.

---

# Task Translation

The Builder translates Runtime Tasks into Provider instructions.

Examples include:

Implement Feature

↓

implementation prompt

---

Review Repository

↓

analysis prompt

---

Summarize Knowledge

↓

summary prompt

---

Generate Documentation

↓

documentation prompt

The Runtime objective always remains explicit.

---

# Context Integration

The Context Package becomes structured prompt sections.

Typical sections include:

- objective
- project information
- relevant Objects
- Blueprint definitions
- Resources
- Runtime configuration
- execution constraints

Irrelevant Context is never added.

---

# Provider Profiles

Different Providers may require different prompt styles.

Provider Profiles define:

- formatting
- instruction style
- preferred structure
- output requirements
- token optimization

The Prompt Builder applies the appropriate Provider Profile automatically.

---

# Prompt Structure

A typical Provider Request contains:

```text
Objective

↓

Runtime Context

↓

Relevant Knowledge

↓

Constraints

↓

Expected Result

↓

Validation Requirements
```

Structure should remain predictable.

---

# Prompt Optimization

The Builder removes:

- duplicate information
- redundant explanations
- repeated Resources
- unnecessary metadata

Prompt optimization never removes required information.

---

# Constraints

The Prompt Builder includes Runtime constraints.

Examples include:

- architecture rules
- Blueprint contracts
- Runtime Principles
- coding standards
- project conventions

Constraints remain explicit.

---

# Validation Instructions

Every Provider Request may include validation requirements.

Examples:

- preserve architecture
- avoid modifying unrelated files
- generate structured output
- satisfy Blueprint contracts
- pass validation

Validation expectations become part of the request.

---

# AI Independence

The Prompt Builder itself does not require AI.

Prompt composition is deterministic.

Providers consume prompts.

They do not generate them.

---

# Prompt Reproducibility

Given the same:

- Task
- Context Package
- Provider Profile
- Runtime configuration

The Prompt Builder should generate an equivalent Provider Request.

Prompt generation should remain predictable.

---

# Prompt History

Prompt generation may optionally be recorded.

History may include:

- generated prompt
- Provider
- timestamp
- originating Task
- execution result

History supports debugging and reproducibility.

---

# Failure Handling

If prompt generation fails:

- Context remains unchanged
- Task remains unchanged
- Provider execution never starts
- the user receives a structured explanation

Prompt failures never affect Runtime integrity.

---

# Extensibility

Future Extensions may introduce:

- Provider-specific optimizers
- prompt templates
- multimodal prompts
- chain-of-thought wrappers
- domain-specific prompt strategies

Every extension integrates through the Prompt Builder.

---

# Design Goal

The Prompt Builder should make Provider communication deterministic, reproducible and independent from individual Runtime Workers.

Every Provider should receive the highest possible quality input without knowing anything about Cosmos.

---

# Principles

- Prompts are compiled.
- Context is never gathered here.
- Prompt composition is deterministic.
- Provider Profiles define formatting.
- Runtime intent is preserved.
- Constraints remain explicit.
- Validation is included.
- Providers consume Provider Requests.
