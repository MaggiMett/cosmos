# Capture

## Purpose

Capture is the primary entry point for new Knowledge inside Cosmos.

It allows users to record thoughts, ideas, discoveries and external information immediately without interrupting their workflow.

Capture prioritizes speed over structure.

The purpose of Capture is not organization.

The purpose of Capture is preserving ideas before they are forgotten.

---

# Philosophy

Thinking should never be interrupted by software.

Users should always be able to capture information immediately.

Structure may come later.

Knowledge can always evolve.

Forgotten ideas cannot.

---

# Responsibilities

Capture is responsible for:

- recording new information
- preserving original user input
- accepting external files
- creating Capture drafts
- submitting Knowledge
- providing Capture Templates
- creating Blueprints
- forwarding submitted Captures to the Knowledge Runtime

Capture never performs Knowledge Processing.

---

# Runtime Dependencies

Capture uses the following Runtime systems:

- Knowledge Service
- Object Service
- Tag Service
- Job Service
- Runtime Context
- Event Model

Capture never modifies Persistence directly.

---

# Capture Modes

Capture provides multiple creation modes.

## Quick Capture

Fast entry of thoughts.

Examples include:

- one sentence
- idea
- reminder
- question

Quick Capture minimizes interaction.

---

## Rant

Free-form writing.

Users may write without structure.

The Knowledge Runtime later analyzes the content.

Rant is the preferred mode for brainstorming.

---

## Template

Templates provide structured input.

Examples include:

- Meeting Notes
- Character
- Quest
- Feature Request

Templates guide the user while remaining editable.

---

## Blueprint

Blueprints describe reusable object definitions.

Examples include:

- Minecraft Item
- API Endpoint
- UI Screen
- Character

Blueprints create structured Object descriptions rather than free-form notes.

---

## File Import

Capture accepts external sources.

Examples include:

- PDF
- Image
- Audio
- Video
- Markdown
- Text
- Repository files

Imported content becomes a new Capture source.

---

# Original Capture

Every submitted Capture becomes an immutable original.

The original Capture is never modified.

Later improvements create new Knowledge versions while preserving the original source.

---

# Drafts

Capture supports temporary drafts.

Drafts exist only until submission.

If Cosmos closes unexpectedly, Draft Recovery restores unfinished Captures.

Unsubmitted drafts never become Knowledge.

---

# Submission

Knowledge enters the Runtime only after explicit submission.

Submission performs:

- store original Capture
- attach Runtime Context
- inherit Tags
- publish CaptureCreated
- schedule Knowledge Processing Job

The user may immediately continue working.

---

# Automatic Context

Capture automatically inherits Runtime Context.

Examples include:

- active Project
- active Workspace
- active Object
- inherited System Tags
- inherited User Tags

Users should rarely assign Context manually.

---

# Automatic Tags

Capture automatically receives inherited System Tags.

Suggested User Tags may also be generated.

Users remain free to modify or remove suggested User Tags.

---

# Knowledge Processing

Capture itself never analyzes content.

After submission the Knowledge Runtime schedules background processing.

Typical processing includes:

- metadata extraction
- Object suggestions
- Relationship discovery
- duplicate analysis
- semantic indexing

Processing remains asynchronous.

---

# Review

Capture never interrupts users with immediate questions.

Potential improvements are collected over time.

Only mature discoveries enter the Review Queue.

Capture remains focused on preserving ideas.

---

# Versioning

Every refinement creates a new Knowledge version.

The original Capture always remains available as the primary source.

Knowledge evolves.

Captures remain historical evidence.

---

# User Experience

Capture should always feel immediate.

Users should never hesitate before recording an idea.

The interface should encourage rapid thinking rather than perfect structure.

---

# Failure Handling

If submission fails:

- the draft remains available
- the user receives a clear explanation
- retry is possible
- no original content is lost

Data preservation has highest priority.

---

# Extensibility

Future extensions may introduce:

- voice capture
- OCR
- browser capture
- mobile capture
- collaborative capture
- AI-assisted templates

All extensions continue using the same Runtime Services.

---

# Design Goal

Capture should become the user's trusted inbox for thoughts.

Users should instinctively record ideas knowing that Cosmos will preserve them, understand them and gradually transform them into structured Knowledge.

---

# Principles

- Speed before structure.
- Original Captures are immutable.
- Submission stores Knowledge.
- Processing is asynchronous.
- Context is inherited.
- Capture never performs analysis.
- Users are never interrupted unnecessarily.
- Every idea deserves to be preserved.
