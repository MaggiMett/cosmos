# Recovery

## Purpose

The Recovery System ensures that Cosmos can recover safely from failures without losing meaningful user work.

It coordinates restoration after unexpected interruptions while preserving Runtime consistency and user trust.

Recovery protects progress.

It does not hide failures.

---

# Philosophy

Failures are inevitable.

Data loss is not.

Cosmos should always recover to the last known consistent state while making every recovery action transparent to the user.

Recovery should feel automatic, predictable and reliable.

---

# Responsibilities

The Recovery System is responsible for:

- restoring Runtime State
- recovering interrupted work
- restarting recoverable Jobs
- validating persistent data
- detecting incomplete operations
- protecting user work
- reporting recovery actions

Recovery never performs business logic.

---

# Recovery Scope

Recovery applies to:

- Runtime State
- Workspace State
- Tool State
- Jobs
- temporary drafts
- pending transactions

Persistent Project data is restored through the Persistence Layer.

---

# Runtime Recovery

After startup the Runtime restores:

- active Projects
- active Workspaces
- Tool Instances
- window layouts
- panel positions
- camera positions
- user selections

The Runtime should appear exactly as the user left it whenever possible.

---

# Draft Recovery

Temporary user work should be recoverable.

Examples include:

- unfinished Captures
- editor content
- unsaved Blueprint changes
- temporary notes

Recovery should prefer preserving work over discarding it.

---

# Transaction Recovery

Incomplete Runtime transactions are detected during startup.

Every transaction must end in one of two states:

- committed
- rolled back

Partial transactions are never accepted.

---

# Job Recovery

Long-running Jobs may be resumed.

Examples include:

- Knowledge Processing
- Repository Analysis
- AI Jobs
- Resource Generation

Only resumable Jobs restart automatically.

Non-resumable Jobs remain available for manual retry.

---

# Extension Recovery

Extensions are recovered independently.

If one Extension fails during startup:

- the Extension remains disabled
- the failure is recorded
- dependent components become unavailable
- the Runtime continues loading

One Extension must never prevent Cosmos from starting.

---

# Repository Recovery

Repositories are revalidated during startup.

If a repository is temporarily unavailable:

- semantic Project data remains available
- Object mappings remain intact
- synchronization resumes automatically when possible

Repository failures never remove Project information.

---

# Context Recovery

Recovered Runtime State restores the previous Context whenever possible.

Examples include:

- active Project
- active Workspace
- selected Object
- current Tool
- inherited Context

Users should continue where they left off.

---

# Failure Reporting

Recovery actions are transparent.

Users should be informed about:

- recovered drafts
- restarted Jobs
- failed Extensions
- unavailable repositories
- unrecoverable operations

Failures should always be understandable.

---

# Recovery Events

The Recovery System publishes Events including:

- RuntimeRecovered
- WorkspaceRecovered
- DraftRecovered
- JobResumed
- RecoveryFailed

Other Runtime systems respond through the Event Model.

---

# Validation

Recovered data is validated before activation.

Validation includes:

- schema compatibility
- dependency availability
- Runtime consistency
- Extension compatibility

Invalid data is isolated rather than discarded.

---

# Backup Integration

Recovery complements Backup.

Recovery restores recent Runtime work.

Backups restore historical persistent data.

Both systems work together but remain independent.

---

# Extensibility

Future extensions may participate in Recovery by implementing the shared Recovery contract.

Extensions should declare:

- recoverable state
- restart behavior
- validation rules

Recovery remains centrally coordinated.

---

# Design Goal

Recovery should be nearly invisible.

After unexpected interruptions, users should continue working with minimal disruption while trusting that Cosmos has preserved everything reasonably possible.

---

# Principles

- Data loss is unacceptable.
- Recovery never hides failures.
- Runtime State is recoverable.
- Transactions are atomic.
- Jobs resume when possible.
- Extensions recover independently.
- Recovery is transparent.
- Validation precedes restoration.
- User trust has highest priority.
