# Branch Protection Setup Guide

**Last Updated:** 2025-10-09  
**Status:** Ready to configure

---

## Overview

This guide explains how to set up branch protection rules for the HVAC Canvas repository to ensure code quality and prevent accidental changes to the main branch.

---

## Prerequisites

- Admin access to the GitHub repository
- CI/CD pipeline configured (`.github/workflows/ci.yml`)
- At least one successful CI run

---

## Recommended Branch Protection Rules

### For `main` Branch

Configure the following rules to protect the main branch:

---

## Setup Steps

### 1. Navigate to Branch Protection Settings

1. Go to your GitHub repository: `https://github.com/engryamato/hvac-canvas`
2. Click **Settings** (top navigation)
3. Click **Branches** (left sidebar)
4. Under "Branch protection rules", click **Add rule**

### 2. Configure Branch Name Pattern

- **Branch name pattern:** `main`
- This will apply the rules to the main branch

### 3. Enable Required Status Checks

✅ **Require status checks to pass before merging**

This ensures all CI checks pass before code can be merged.

**Select the following status checks:**
- `lint-and-typecheck` - TypeScript and ESLint checks
- `unit-tests` - Unit test suite
- `architecture-tests` - Architecture validation
- `build` - Build verification
- `e2e-tests` - End-to-end tests (optional, can be skipped if failing)

**Additional settings:**
- ✅ **Require branches to be up to date before merging**
  - Ensures the branch has the latest changes from main
  - Prevents merge conflicts

### 4. Enable Pull Request Reviews

✅ **Require a pull request before merging**

This ensures all changes go through code review.

**Settings:**
- ✅ **Require approvals:** 1
  - At least one team member must approve
  - For solo projects, you can skip this or set to 0
- ✅ **Dismiss stale pull request approvals when new commits are pushed**
  - Re-review required after new changes
- ✅ **Require review from Code Owners** (optional)
  - Only if you have a CODEOWNERS file

### 5. Enable Additional Protections

✅ **Require conversation resolution before merging**
- All PR comments must be resolved

✅ **Require signed commits** (optional, recommended)
- Ensures commits are verified
- Requires GPG key setup

✅ **Require linear history** (optional)
- Prevents merge commits
- Enforces rebase or squash merge

✅ **Include administrators**
- Apply rules to admins too
- Recommended for consistency

### 6. Prevent Force Pushes and Deletions

✅ **Do not allow bypassing the above settings**
- No one can bypass protection rules

✅ **Do not allow force pushes**
- Prevents rewriting history
- Protects against accidental data loss

✅ **Do not allow deletions**
- Prevents accidental branch deletion

### 7. Save Protection Rules

Click **Create** or **Save changes** at the bottom of the page.

---

## Recommended Configuration Summary

Here's a quick checklist of recommended settings:

### ✅ Required Status Checks
- [x] Require status checks to pass before merging
- [x] Require branches to be up to date before merging
- [x] Status checks: `lint-and-typecheck`, `unit-tests`, `architecture-tests`, `build`

### ✅ Pull Request Reviews
- [x] Require a pull request before merging
- [x] Required approvals: 1 (or 0 for solo projects)
- [x] Dismiss stale approvals when new commits are pushed

### ✅ Additional Protections
- [x] Require conversation resolution before merging
- [x] Include administrators
- [x] Do not allow bypassing settings
- [x] Do not allow force pushes
- [x] Do not allow deletions

### ⚠️ Optional Settings
- [ ] Require signed commits (requires GPG setup)
- [ ] Require linear history (enforces rebase/squash)
- [ ] Require review from Code Owners (requires CODEOWNERS file)

---

## For Solo Projects

If you're working alone, you can simplify the rules:

### Minimal Protection (Solo)
- ✅ Require status checks to pass
- ✅ Do not allow force pushes
- ✅ Do not allow deletions
- ❌ Skip pull request reviews (or set approvals to 0)

This still ensures CI passes but allows you to merge without approval.

---

## For Team Projects

If you're working with a team, use the full protection:

### Full Protection (Team)
- ✅ All recommended settings above
- ✅ Require 1-2 approvals
- ✅ Dismiss stale approvals
- ✅ Require conversation resolution
- ✅ Consider Code Owners for critical files

---

## Testing Branch Protection

### 1. Create a Test Branch

```bash
git checkout -b test/branch-protection
```

### 2. Make a Change

```bash
echo "# Test" >> test.md
git add test.md
git commit -m "test: verify branch protection"
git push origin test/branch-protection
```

### 3. Create a Pull Request

1. Go to GitHub
2. Create a PR from `test/branch-protection` to `main`
3. Verify:
   - CI checks run automatically
   - Merge button is disabled until checks pass
   - Approval required (if configured)

### 4. Verify Protection

Try to:
- ❌ Merge without approval (should fail)
- ❌ Merge with failing checks (should fail)
- ❌ Force push to main (should fail)
- ✅ Merge after approval and passing checks (should succeed)

### 5. Clean Up

```bash
git checkout main
git branch -D test/branch-protection
git push origin --delete test/branch-protection
```

---

## Troubleshooting

### Status Checks Not Appearing

**Problem:** Required status checks don't show up in the dropdown

**Solutions:**
1. Ensure CI workflow has run at least once
2. Check workflow file name matches (`.github/workflows/ci.yml`)
3. Verify job names in workflow match status check names
4. Wait a few minutes and refresh the page

### Can't Merge Even with Passing Checks

**Problem:** Merge button disabled despite passing checks

**Solutions:**
1. Check if branch is up to date with main
2. Verify all required checks are passing (not just some)
3. Check if approval is required
4. Ensure all conversations are resolved

### Accidentally Locked Out

**Problem:** Can't merge your own PRs due to strict rules

**Solutions:**
1. Temporarily disable "Include administrators"
2. Get approval from another team member
3. Adjust approval requirements
4. Use "Bypass branch protection" (not recommended)

---

## Updating Protection Rules

To modify existing rules:

1. Go to **Settings** → **Branches**
2. Find the rule for `main`
3. Click **Edit**
4. Make changes
5. Click **Save changes**

---

## Additional Branches

You may want to protect other branches too:

### `develop` Branch

If you use a develop branch for integration:

1. Create a new rule with pattern: `develop`
2. Use similar settings as `main`
3. Optionally allow force pushes (for rebasing)

### Release Branches

For release branches (`release/*`):

1. Pattern: `release/*`
2. Require status checks
3. Require approvals
4. Prevent force pushes

---

## CODEOWNERS File (Optional)

Create a `.github/CODEOWNERS` file to require reviews from specific people:

```
# Global owners
* @engryamato

# Architecture files
/docs/adrs/ @engryamato
/docs/ARCHITECTURE.md @engryamato

# CI/CD
/.github/ @engryamato

# Core services
/src/services/ @engryamato

# Tests
/tests/ @engryamato
```

Then enable "Require review from Code Owners" in branch protection.

---

## Benefits of Branch Protection

### Code Quality
- ✅ All code reviewed before merging
- ✅ CI checks catch issues early
- ✅ Architecture rules enforced
- ✅ Tests must pass

### Safety
- ✅ Prevents accidental force pushes
- ✅ Prevents branch deletion
- ✅ Prevents direct commits to main
- ✅ Requires deliberate merges

### Collaboration
- ✅ Encourages code review
- ✅ Facilitates knowledge sharing
- ✅ Documents decision-making
- ✅ Maintains code standards

---

## Resources

- **GitHub Docs:** https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches
- **Status Checks:** https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/collaborating-on-repositories-with-code-quality-features/about-status-checks
- **Code Owners:** https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners

---

## Summary

Branch protection ensures:

- ✅ All changes go through CI/CD
- ✅ Code is reviewed before merging
- ✅ Main branch stays stable
- ✅ No accidental force pushes
- ✅ Quality standards maintained

**Next Steps:**
1. Go to GitHub Settings → Branches
2. Add protection rule for `main`
3. Configure required status checks
4. Set approval requirements
5. Enable additional protections
6. Test with a PR

---

**Note:** You need admin access to the repository to configure branch protection rules.

