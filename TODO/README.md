# TODO Task Management System

This directory contains the task management system for the Robot APVSYS project. All development work is organized through this structured workflow.

## Directory Structure

### TBD (To Be Done)

- Contains tasks that have yet to be implemented
- Tasks are created here based on project overview requirements
- Tasks must have all required headers before moving to "Doing"

### Doing

- Contains tasks that are currently being worked on
- **IMPORTANT**: Only ONE task should be in this directory at any given time
- Tasks are moved here from "TBD" when work begins

### Done

- Contains tasks that have been fully implemented
- Tasks are moved here from "Doing" when implementation is complete
- All acceptance criteria must be met before moving

### Reviewed

- Contains tasks that need code reviewing after being "Done"
- Tasks are moved here from "Done" for final review
- After review, tasks can be archived or marked as completed

## Task File Structure

Each task file must contain the following headers:

```markdown
# Task: [Task Name]

## Objective

The objective of this task

## Dependencies

The steps that need to be taken to realize the objective

## Acceptance Criteria

The criteria to measure the effectiveness of the implemented dependencies

## Direct Acyclic Graph (DAG)

Earlier tasks (markdown files) that need to be implemented before this one can proceed

## Implementation Notes

[Optional] Additional notes, references, or implementation details
```

## Git Workflow

**MANDATORY**: Between each step (moving markdown files between directories), it is compulsory to commit to version control using Git.

### Example Commit Messages:

- `Move task-001 from TBD to Doing - starting implementation`
- `Move task-001 from Doing to Done - implementation complete`
- `Move task-001 from Done to Reviewed - ready for review`

## Task Management Rules

1. **Single Active Task**: Only one task should be in the "Doing" directory at any given time
2. **DAG Compliance**: Tasks must respect their Direct Acyclic Graph dependencies
3. **Header Completeness**: All tasks must have complete headers before moving to "Doing"
4. **Acceptance Criteria**: Tasks can only move to "Done" when all acceptance criteria are met
5. **Git Integration**: Every directory transition must be committed to Git

## File Naming Convention

Task files should be named descriptively: `task-{id}-{description}.md`

Examples:

- `task-001-user-authentication.md`
- `task-002-database-setup.md`
- `task-003-api-endpoints.md`

## Getting Started

1. Create a new task file in the `TBD` directory using the task template
2. Fill in all required headers
3. When ready to start work, move the file to `Doing` and commit
4. Complete the implementation
5. Move to `Done` and commit
6. Move to `Reviewed` for final review and commit

## Integration

This workflow integrates with the existing codebase structure and the project overview document (`.cursor/context/project-overview.md`), which serves as the high-level source of truth for project functionality.
