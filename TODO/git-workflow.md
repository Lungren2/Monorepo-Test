# Git Workflow for Task Management

## Mandatory Commit Requirements

**CRITICAL**: Between each step (moving markdown files between directories), it is compulsory to commit to version control using Git.

## Task Transition Commands

### Moving from TBD to Doing

```bash
git add TODO/TBD/task-xxx-task-name.md
git mv TODO/TBD/task-xxx-task-name.md TODO/Doing/
git commit -m "Move task-xxx from TBD to Doing - starting implementation"
```

### Moving from Doing to Done

```bash
git add TODO/Doing/task-xxx-task-name.md
git mv TODO/Doing/task-xxx-task-name.md TODO/Done/
git commit -m "Move task-xxx from Doing to Done - implementation complete"
```

### Moving from Done to Reviewed

```bash
git add TODO/Done/task-xxx-task-name.md
git mv TODO/Done/task-xxx-task-name.md TODO/Reviewed/
git commit -m "Move task-xxx from Done to Reviewed - ready for review"
```

## Commit Message Format

Use the following format for all task transition commits:

```
Move task-{id} from {source} to {destination} - {reason}
```

### Examples:

- `Move task-001 from TBD to Doing - starting implementation`
- `Move task-001 from Doing to Done - implementation complete`
- `Move task-001 from Done to Reviewed - ready for review`
- `Move task-002 from TBD to Doing - beginning database setup`

## Pre-commit Checklist

Before moving any task, ensure:

### TBD → Doing

- [ ] Task has all required headers (Objective, Dependencies, Acceptance Criteria, DAG)
- [ ] No other task is currently in the Doing directory
- [ ] All DAG dependencies are completed
- [ ] Task is ready for implementation

### Doing → Done

- [ ] All acceptance criteria are met
- [ ] Implementation is complete and tested
- [ ] Code has been reviewed (if applicable)
- [ ] Documentation is updated

### Done → Reviewed

- [ ] Implementation is fully complete
- [ ] All tests pass
- [ ] Code is ready for final review
- [ ] No blocking issues remain

## Git Best Practices

1. **Always stage files before moving**: Use `git add` before `git mv`
2. **Use descriptive commit messages**: Include task ID and transition reason
3. **Commit immediately after moving**: Don't leave moved files unstaged
4. **Verify the move**: Check that files are in the correct directory after commit
5. **Update project overview**: When tasks are completed, update the project overview document

## Troubleshooting

### If you forget to commit after moving:

```bash
# Check git status
git status

# If files are staged but not committed
git commit -m "Move task-xxx from source to destination - reason"

# If files are not staged
git add TODO/destination/task-xxx-task-name.md
git commit -m "Move task-xxx from source to destination - reason"
```

### If you need to undo a move:

```bash
# Reset the last commit (if it was the move)
git reset --soft HEAD~1

# Move the file back
git mv TODO/destination/task-xxx-task-name.md TODO/source/

# Commit the correction
git commit -m "Correct task-xxx location - moved back to source"
```

## Integration with Development

This Git workflow integrates seamlessly with:

- Cursor IDE file management
- Project overview updates
- Code review processes
- Continuous integration (if applicable)
- Team collaboration workflows
