# Providers

## Purpose

Providers extend the Companion Brain with advanced reasoning, language generation and specialized intelligence.

Providers are replaceable components.

They never define the Companion.

They never define the Brain.

---

# Philosophy

The Companion should remain identical regardless of which Provider performs reasoning.

Changing Providers should improve or alter intelligence.

It should never change identity, personality or Runtime behavior.

Providers are tools.

The Companion is the user-facing identity.

---

# Responsibilities

Providers are responsible for:

- language generation
- reasoning
- summarization
- planning
- brainstorming
- code generation
- explanation

Providers never:

- own Runtime State
- own Knowledge
- own Personality
- own Conversation
- execute Runtime actions

---

# Runtime Position

Providers exist outside the Companion Runtime.

```text
Conversation

↓

Brain

↓

Provider Runtime

↓

Provider

↓

Brain

↓

Conversation
```

The Brain coordinates every Provider interaction.

---

# Provider Independence

Every Provider follows the same Runtime contract.

The Brain never depends on provider-specific APIs.

Providers remain interchangeable.

---

# Provider Categories

Cosmos supports multiple Provider categories.

## Cloud Providers

Examples include:

- OpenAI
- Anthropic
- Google
- xAI

Cloud Providers require external connectivity.

---

## Local Providers

Examples include:

- Ollama
- llama.cpp
- vLLM

Local Providers execute entirely on the user's hardware.

---

## Enterprise Providers

Organizations may provide internal models through custom Provider Extensions.

Enterprise Providers follow the same Runtime contract.

---

# Provider Selection

The Brain selects Providers according to:

- user preference
- project configuration
- installed Providers
- capability requirements
- availability
- performance
- privacy requirements

Selection always remains configurable.

---

# Multiple Providers

Several Providers may coexist.

Examples:

Conversation

↓

GPT

Code Planning

↓

Qwen

Summarization

↓

Claude

Every reasoning request may use a different Provider.

---

# Provider Capabilities

Providers may expose capabilities such as:

- reasoning
- coding
- summarization
- translation
- planning
- image understanding
- multimodal reasoning

Capabilities remain descriptive.

The Brain decides when to use them.

---

# Provider Configuration

Every Provider may expose configuration options.

Examples include:

- endpoint
- authentication
- preferred model
- temperature
- context limits
- timeout
- retry policy

Configuration belongs to the Provider.

Not to the Brain.

---

# Context Delivery

Providers receive only the Context assembled by the Brain.

They never query Runtime Services directly.

This ensures:

- consistent behavior
- predictable reasoning
- Runtime security
- provider independence

---

# Privacy

The Brain determines what information is shared.

Providers never receive unrestricted Runtime access.

Users remain in control of:

- cloud usage
- local execution
- shared Context
- stored credentials

---

# Failure Handling

If a Provider becomes unavailable:

- the Brain selects another Provider when possible
- deterministic Runtime behavior continues
- non-AI capabilities remain available
- the Companion remains active

Provider failure never disables the Companion.

---

# Extensibility

Future Provider Extensions may introduce:

- new model families
- multimodal capabilities
- specialized domain models
- offline reasoning engines
- enterprise integrations

Every Provider implements the same Provider contract.

---

# Design Goal

Providers should be replaceable intelligence engines.

Users should freely choose where reasoning happens without changing how the Companion behaves.

---

# Principles

- Providers are replaceable.
- Providers extend the Brain.
- Providers never define the Companion.
- The Brain selects Providers.
- Runtime Context is assembled before reasoning.
- Providers never access Runtime directly.
- Provider failure never disables the Companion.
- Intelligence remains independent from identity.
