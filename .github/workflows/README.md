# GitHub Actions Workflows

This directory contains all GitHub Actions workflow definitions for the Robot-APVSYS project.

## Purpose

Automated workflows for CI/CD, security scanning, and quality assurance across the monorepo.

## Key Files / Entry Points

- `codeql-analysis.yml` - Static security analysis and vulnerability scanning

## How to Use

### CodeQL Analysis Workflow

**Triggers:**
- Push to any branch (`*`)
- Pull requests to any branch (`*`)
- Weekly schedule (Mondays at 14:20 UTC)
- Manual dispatch

**Features:**
- Multi-language support (JavaScript/TypeScript, C#)
- Security and quality queries
- Dependency vulnerability scanning
- Results uploaded to GitHub Security tab

**Matrix Strategy:**
- Runs parallel analysis for each language
- Fails fast disabled for comprehensive coverage

## Security Best Practices

- Uses pinned action versions with commit SHAs
- Implements least-privilege permissions
- Includes dependency review for PRs
- Fetches full git history for accurate analysis

## Links

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [CodeQL Documentation](https://codeql.github.com/docs/)
