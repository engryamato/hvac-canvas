# Codecov Setup Guide

**Last Updated:** 2025-10-09  
**Status:** Ready to configure

---

## Overview

This guide explains how to set up Codecov for automated code coverage reporting in the HVAC Canvas project.

---

## Prerequisites

- GitHub repository: `engryamato/hvac-canvas`
- Admin access to the repository
- Codecov account (free for open source)

---

## Setup Steps

### 1. Create Codecov Account

1. Go to [codecov.io](https://codecov.io)
2. Click "Sign up with GitHub"
3. Authorize Codecov to access your GitHub account
4. Select the `engryamato/hvac-canvas` repository

### 2. Get Codecov Token

1. Navigate to your repository on Codecov
2. Go to **Settings** → **General**
3. Copy the **Repository Upload Token**
4. Save this token securely (you'll need it in the next step)

### 3. Add Token to GitHub Secrets

1. Go to your GitHub repository: `https://github.com/engryamato/hvac-canvas`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `CODECOV_TOKEN`
5. Value: Paste the token from step 2
6. Click **Add secret**

### 4. Verify CI Workflow

The CI workflow (`.github/workflows/ci.yml`) is already configured to upload coverage reports to Codecov. The relevant section:

```yaml
- name: Upload coverage reports
  uses: codecov/codecov-action@v4
  if: always()
  with:
    files: ./coverage/coverage-final.json
    flags: unittests
    name: codecov-umbrella
  continue-on-error: true
```

**Note:** The `codecov-action@v4` requires the `CODECOV_TOKEN` secret to be set.

### 5. Trigger a Build

1. Push a commit or create a PR
2. Wait for the CI pipeline to complete
3. Check the "Upload coverage reports" step in the GitHub Actions logs
4. Verify the coverage report appears on Codecov

---

## Codecov Configuration

The `codecov.yml` file in the repository root configures Codecov behavior:

### Coverage Targets

- **Project coverage:** 80% target (allow 2% drop)
- **Patch coverage:** 70% target for new code (allow 5% drop)

### Comment Behavior

- Posts coverage report on every PR
- Shows coverage diff, tree view, and flags
- Includes annotations on changed files

### Ignored Files

- Test files (`**/__tests__/**`, `*.test.ts`, `*.spec.ts`)
- Configuration files (`vite.config.ts`, `vitest.config.ts`, etc.)
- Build output (`dist/**`)
- Dependencies (`node_modules/**`)

---

## Using Codecov

### Viewing Coverage Reports

1. **On Codecov Dashboard:**
   - Go to [codecov.io/gh/engryamato/hvac-canvas](https://codecov.io/gh/engryamato/hvac-canvas)
   - View overall coverage, trends, and file-level coverage

2. **On Pull Requests:**
   - Codecov bot comments on PRs with coverage diff
   - Shows which files increased/decreased coverage
   - Highlights uncovered lines

3. **On GitHub:**
   - Coverage annotations appear on changed files
   - Check marks/X marks indicate coverage status

### Coverage Badge

Add the Codecov badge to README.md:

```markdown
[![codecov](https://codecov.io/gh/engryamato/hvac-canvas/branch/main/graph/badge.svg)](https://codecov.io/gh/engryamato/hvac-canvas)
```

This will display the current coverage percentage.

---

## Interpreting Coverage Reports

### Coverage Metrics

- **Line Coverage:** Percentage of lines executed
- **Branch Coverage:** Percentage of conditional branches tested
- **Function Coverage:** Percentage of functions called

### Coverage Diff

On PRs, Codecov shows:
- **+X%** - Coverage increased
- **-X%** - Coverage decreased
- **±0%** - No change

### File Tree

Shows coverage for each file:
- 🟢 Green: Good coverage (≥80%)
- 🟡 Yellow: Moderate coverage (60-79%)
- 🔴 Red: Low coverage (<60%)

---

## Troubleshooting

### Coverage Not Uploading

**Problem:** Coverage report not appearing on Codecov

**Solutions:**
1. Verify `CODECOV_TOKEN` is set in GitHub Secrets
2. Check CI logs for upload errors
3. Ensure coverage files are generated (`coverage/coverage-final.json`)
4. Verify `codecov-action@v4` is used in workflow

### Coverage Percentage Incorrect

**Problem:** Coverage percentage doesn't match local tests

**Solutions:**
1. Check `codecov.yml` ignore patterns
2. Verify coverage is generated with `--coverage` flag
3. Run locally: `npm run test:unit -- --coverage`
4. Compare local `coverage/index.html` with Codecov report

### Codecov Bot Not Commenting

**Problem:** No coverage comment on PRs

**Solutions:**
1. Check Codecov settings → Comment behavior
2. Verify `comment.behavior: default` in `codecov.yml`
3. Ensure Codecov app is installed on repository
4. Check PR permissions (Codecov needs write access)

---

## Best Practices

### Maintaining Coverage

1. **Write tests for new code** - Aim for ≥70% coverage on new features
2. **Review coverage diffs** - Check Codecov comments on PRs
3. **Fix uncovered lines** - Add tests for critical paths
4. **Monitor trends** - Watch for coverage drops over time

### Coverage Goals

- **Utils:** ≥80% (pure functions are easy to test)
- **Services:** ≥80% (domain logic should be well-tested)
- **Hooks:** ≥70% (some React hooks are hard to test)
- **Components:** ≥70% (UI components have visual aspects)

### When to Ignore Coverage

- **Type definitions** - No executable code
- **Configuration files** - Not application logic
- **Test files** - Already ignored
- **Generated code** - Not manually written

---

## Advanced Features

### Coverage Flags

Use flags to track coverage by category:

```yaml
flags:
  unittests:
    paths:
      - src/
  e2e:
    paths:
      - tests/
```

### Carryforward

If a CI job fails, Codecov can carry forward previous coverage:

```yaml
flags:
  unittests:
    carryforward: true
```

### Notifications

Configure Slack/email notifications for coverage changes:

1. Go to Codecov → Settings → Notifications
2. Add Slack webhook or email
3. Set thresholds for notifications

---

## Resources

- **Codecov Docs:** https://docs.codecov.com
- **GitHub Action:** https://github.com/codecov/codecov-action
- **Configuration:** https://docs.codecov.com/docs/codecov-yaml
- **Support:** https://community.codecov.com

---

## Summary

Once configured, Codecov provides:

- ✅ Automated coverage reporting on every PR
- ✅ Coverage trends over time
- ✅ File-level coverage visualization
- ✅ Coverage diff on PRs
- ✅ Annotations on changed files
- ✅ Coverage badges for README

**Next Steps:**
1. Create Codecov account
2. Add `CODECOV_TOKEN` to GitHub Secrets
3. Push a commit to trigger CI
4. Verify coverage appears on Codecov
5. Add coverage badge to README

---

**Note:** The CI workflow is already configured. You only need to add the `CODECOV_TOKEN` secret to enable coverage uploads.

