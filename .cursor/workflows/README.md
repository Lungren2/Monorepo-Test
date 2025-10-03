# Development Workflows

## Purpose

Common development workflows for the Robot APVSYS template. Each workflow provides step-by-step guidance for recurring tasks, ensuring consistency and reducing cognitive load for developers and AI agents.

## Available Workflows

### API Development

- **01-add-api-endpoint.md** - Creating a new FastEndpoints endpoint (15-30 min, Low complexity)
- **02-add-domain-entity.md** - Adding domain entity with full stack implementation (30-60 min, Medium complexity)

### Frontend Development

- **03-add-client-component.md** - Creating client components with proper RSC boundaries (15-30 min, Low complexity)

### Database

- **04-add-migration.md** - Creating and applying database migrations (10-20 min, Low complexity)

### Architecture

- **05-add-authentication.md** - Choosing and implementing authentication patterns (2-4 hours, High complexity)

## Workflow Structure

Each workflow follows this template:

```markdown
# Workflow: {Task Name}

## Context

- When: Trigger conditions
- Duration: Estimated time
- Complexity: Low/Medium/High

## Prerequisites

Checklist of requirements

## Steps

Numbered, actionable steps with file paths and patterns

## Verification

How to confirm success

## Related

Links to rules, examples, documentation
```

## Usage

### For Developers

1. Identify the workflow that matches your task
2. Review prerequisites
3. Follow steps sequentially
4. Verify completion with checklist

### For AI Agents

Workflows provide structured context for code generation:

- **Files to create/modify** are explicitly listed
- **Patterns to follow** reference existing code
- **Verification steps** ensure quality

## Principles

- **Minimal**: Each workflow ≤200 lines
- **Actionable**: Steps are specific, not vague
- **Referenced**: Links to code examples and rules
- **Complete**: Includes verification and related resources

## See Also

- `.cursor/rules/meta-rules.mdc` - Rule authoring guidelines
- `.cursor/rules/planning.mdc` - Task management workflow
- `.cursor/context/project-overview.md` - Project architecture
