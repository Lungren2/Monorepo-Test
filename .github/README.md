# GitHub Actions Workflows

This directory contains GitHub Actions workflows for automated CI/CD, security scanning, and quality assurance.

## Purpose

Automated workflows that ensure code quality, security, and maintainability across all branches of the Robot-APVSYS monorepo.

## Key Files / Entry Points

- `workflows/codeql-analysis.yml` - Static security analysis using CodeQL
- `workflows/` - Directory containing all workflow definitions

## How to Use

### CodeQL Analysis

The CodeQL workflow automatically:
- Scans all branches on push events
- Analyzes pull requests for security vulnerabilities
- Runs weekly scheduled scans (Mondays at 14:20 UTC)
- Supports manual triggering via workflow_dispatch

**Supported Languages:**
- JavaScript/TypeScript (Next.js frontend)
- C# (.NET Minimal API backend)

**Security Features:**
- Static Application Security Testing (SAST)
- Dependency vulnerability scanning
- Code quality analysis
- Results uploaded to GitHub Security tab

### Manual Triggering

To manually run the CodeQL analysis:
1. Go to Actions tab in GitHub
2. Select "CodeQL Analysis" workflow
3. Click "Run workflow"
4. Choose branch and click "Run workflow"

## Links

- [GitHub Security Tab](https://github.com/Lungren2/Monorepo-Test/security)
- [Actions Tab](https://github.com/Lungren2/Monorepo-Test/actions)
- [CodeQL Documentation](https://codeql.github.com/docs/)
