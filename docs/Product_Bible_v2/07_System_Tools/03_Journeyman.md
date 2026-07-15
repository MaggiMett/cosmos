# Journeyman

## Purpose

Journeyman is the primary autonomous Runtime Worker of Cosmos.

Its purpose is to execute user-approved work by understanding projects, coordinating Runtime systems and performing structured tasks.

Journeyman transforms plans into completed work.

---

# Architectural Position

Journeyman is a registered System Tool Extension.

Runtime Worker describes Journeyman's execution role; it is not a separate Runtime component category.

Journeyman performs task-oriented work through Core Runtime contracts and never replaces Runtime Services.

Its skills are capabilities declared through the existing System Tool Extension manifest and dependency contract. Journeyman is not an Entity and never receives an Entity-owned Capability Bundle Instance.

---

# Philosophy

Journeyman is not an AI.

Journeyman is not a Provider.

Journeyman is a Runtime Worker.

Artificial Intelligence extends Journeyman's ability to reason and generate work.

The Runtime defines how Journeyman operates.

---

# Responsibilities

Journeyman is responsible for:

- understanding assigned work
- planning execution
- coordinating Runtime systems
- requesting reasoning
- executing approved tasks
- validating results
- reporting progress

Journeyman never owns project knowledge.

---

# Runtime Foundation

Journeyman operates on:

- Project Runtime
- Knowledge Runtime
- Extension System and System Tool Registry
- Job Runtime
- Review Service
- Provider Runtime
- Context Builder

Journeyman introduces no special Runtime architecture.

---

# Worker Model

Journeyman behaves as a Runtime Worker.

Every task follows the same lifecycle.

```text
Assigned

↓

Planning

↓

Context Package Request

↓

Execution

↓

Validation

↓

Review

↓

Completed

Journeyman never skips validation.

Context Package Request

Before beginning work Journeyman receives a Context Snapshot and requests a task-specific Context Package from Context Builder.

Context may include:

zero, one or multiple assigned Project scopes
optional focused or primary Project
Workspace session when applicable
Objects
Knowledge
Object Blueprints, Capture Templates and Workspace Blueprints relevant to the task
Resources
previous Reviews
Runtime configuration

Journeyman never scans the repository blindly.

Context Builder assembles the Package through existing Runtime Services and Runtime contracts. Journeyman never assembles Context independently.

Planning

Journeyman always creates an execution plan before performing work.

The plan defines:

objective
required Context
required System Tool Extension capabilities
required Providers
expected outputs
validation strategy

Plans remain transparent.

System Tool Skills

Journeyman gains abilities through capabilities declared by its System Tool Extension and its declared System Tool Extension dependencies.

Examples include:

Repository Assistance
Code Generation
Documentation
Review Assistance
Refactoring
Testing
Migration
Object Blueprint Generation

The shared Extension Validation pipeline validates code-bearing skill implementations, and the System Tool Registry resolves their definitions. Journeyman requests all Runtime work through Runtime Services and never imports another Extension's internals.

Provider Usage

Journeyman may request reasoning from one or more Providers.

Providers may assist with:

planning
reasoning
code generation
summarization
architecture analysis

Journeyman coordinates Providers.

Providers never execute Runtime work.

Job Execution

Every assignment becomes a Runtime Job.

Examples include:

implement feature
analyze repository
generate documentation
refactor module
execute migration
create Object Blueprint through Object Service

Jobs remain observable throughout execution.

Validation

Journeyman validates every completed task.

Validation may include:

tests
static analysis
repository consistency
Extension validation
architecture validation
review generation

Invalid work never becomes completed automatically.

Review

After execution Journeyman prepares a structured Review.

Review may include:

summary
modified Objects
generated files
warnings
recommendations
follow-up opportunities

Users always understand what changed.

User Approval

Journeyman never performs destructive work without explicit user approval.

Examples include:

deleting files
migrations
repository restructuring
data removal

Approval remains mandatory.

Collaboration

Multiple Journeyman Workers may operate simultaneously.

Examples include:

Journeyman A

↓

Repository Analysis

Journeyman B

↓

Documentation

Journeyman C

↓

Testing

Workers coordinate through the Job Runtime.

AI Independence

Without AI Providers Journeyman may still:

execute deterministic workflows
coordinate Jobs
validate work
schedule processing
prepare Reviews

Advanced reasoning becomes unavailable.

Journeyman remains operational.

Failure Handling

If execution fails:

Runtime remains stable
partial work is isolated
Jobs report failure
Review explains the problem
retry remains possible

Failure never corrupts the Project.

Extensibility

Future System Tool Extensions may provide Journeyman with new declared skill capabilities.

Examples include:

Unreal Development
Unity Development
Blender
Electronics
PCB Design
Documentation
Localization
Security Analysis
Infrastructure
DevOps

Journeyman gains them through the existing System Tool Extension contract.

Never through Core changes.

Design Goal

Journeyman should become the user's trusted implementation partner.

Rather than acting as a coding assistant, Journeyman should understand goals, prepare structured execution, perform approved work and continuously improve projects while remaining fully transparent and controllable.

Principles
Journeyman is a Runtime Worker.
Journeyman is not an AI.
System Tool Extension capabilities define skills.
Providers extend reasoning.
Runtime Services execute work.
Planning precedes execution.
Validation precedes completion.
Review communicates results.
Users remain in control.
