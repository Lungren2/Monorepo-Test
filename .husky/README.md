# Husky Git Hooks

This directory contains Git hooks managed by Husky for the Robot-APVSYS project.

## Hooks

### Pre-commit Hook (`.husky/pre-commit`)
- Runs `lint-staged` to format and lint staged files
- Formats TypeScript/React files with Prettier
- Formats JSON, MD, YAML files with Prettier
- Prevents commits with unformatted code

### Pre-push Hook (`.husky/pre-push`)
- Runs tests (`pnpm test`)
- Builds the project (`pnpm build`)
- Ensures code quality before pushing to remote

## Configuration

The hooks are configured in the root `package.json`:

```json
{
  "lint-staged": {
    "apps/web/**/*.{ts,tsx,js,jsx}": [
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ]
  }
}
```

## Usage

Hooks run automatically when you:
- `git commit` - Pre-commit hook runs
- `git push` - Pre-push hook runs

## Bypassing Hooks

To bypass hooks (not recommended):
```bash
git commit --no-verify -m "message"
git push --no-verify
```

## Installation

Hooks are automatically installed when you run:
```bash
pnpm install
```

This runs the `prepare` script which initializes Husky.
