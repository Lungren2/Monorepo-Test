# Scripts Directory

This directory contains automation scripts for the Robot-APVSYS project.

## Branch Protection Setup

### Overview

Branch protection rules ensure code quality and prevent direct pushes to important branches. The setup includes protection for:

- **main** (production) - Strictest protection with 2 required reviews
- **staging** - High protection for pre-production testing
- **development** - Moderate protection for ongoing development
- **hotfix** - Special rules for emergency fixes (allows force push)
- **uat** - Testing environment protection

### Quick Start

1. **Install GitHub CLI** (if not already installed):
   ```bash
   winget install GitHub.cli
   ```

2. **Authenticate with GitHub**:
   ```bash
   gh auth login
   ```

3. **Run the setup script**:
   ```bash
   # Windows (double-click or run from command prompt)
   scripts\setup-branch-protection.bat
   
   # Or run PowerShell script directly
   powershell -ExecutionPolicy Bypass -File scripts\setup-branch-protection.ps1
   ```

### Script Options

The PowerShell script supports several options:

```powershell
# Dry run (preview changes without applying)
.\setup-branch-protection.ps1 -DryRun

# Apply to different repository
.\setup-branch-protection.ps1 -Repository "owner/repo"

# Force apply (skip confirmations)
.\setup-branch-protection.ps1 -Force
```

### Protection Rules Summary

| Branch | Required Reviews | Status Checks | Force Push | Admin Override |
|--------|------------------|---------------|------------|----------------|
| main | 2 | build, test, lint | ❌ | ❌ |
| staging | 1 | build, test | ❌ | ✅ |
| development | 1 | build | ❌ | ✅ |
| hotfix | 1 | build, test | ✅ | ✅ |
| uat | 1 | build | ❌ | ✅ |

### Verification

After running the script, verify the protection rules:

```bash
# Check main branch protection
gh api repos/Lungren2/Monorepo-Test/branches/main/protection

# List all protected branches
gh api repos/Lungren2/Monorepo-Test/branches --jq '.[] | select(.protected == true) | .name'
```

### Manual Setup (Alternative)

If you prefer to set up branch protection rules manually through the GitHub web interface:

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Branches**
3. Click **Add rule** for each branch
4. Configure the protection settings as documented in `setup-branch-protection.md`

### Troubleshooting

**Common Issues:**

1. **"GitHub CLI not authenticated"**
   - Run `gh auth login` and follow the prompts

2. **"Insufficient permissions"**
   - Ensure you have admin access to the repository
   - Check that your GitHub token has `repo` permissions

3. **"Branch not found"**
   - Verify all branches exist: `git branch -a`
   - Push any missing branches: `git push -u origin <branch-name>`

4. **"Status checks not found"**
   - Set up GitHub Actions workflows for build, test, and lint
   - The protection rules reference these check names

### Next Steps

After setting up branch protection:

1. **Set up GitHub Actions workflows** for the required status checks
2. **Configure CODEOWNERS file** for code owner reviews
3. **Test the protection rules** by attempting direct pushes
4. **Train team members** on the new workflow requirements

### Files in this Directory

- `setup-branch-protection.ps1` - Main PowerShell script
- `setup-branch-protection.bat` - Windows batch wrapper
- `setup-branch-protection.md` - Detailed documentation
- `README.md` - This file

### Related Documentation

- [GitHub Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/defining-the-mergeability-of-pull-requests/about-protected-branches)
- [GitHub CLI Documentation](https://cli.github.com/manual/)
- [Project Branching Strategy](../TODO/README.md)