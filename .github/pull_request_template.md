# Pull Request

## Description

<!-- Provide a brief description of the changes in this PR -->

## Type of Change

<!-- Mark the relevant option with an 'x' -->

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Refactoring (no functional changes, code improvements)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Test coverage improvement

## Changes Made

<!-- List the specific changes made in this PR -->

- 
- 
- 

## Testing Done

<!-- Describe the testing you've performed -->

### Unit Tests
- [ ] All existing unit tests pass
- [ ] New unit tests added (if applicable)
- [ ] Test coverage maintained or improved

### E2E Tests
- [ ] All E2E tests pass (or 29/30 if known issue)
- [ ] New E2E tests added (if applicable)

### Architecture Tests
- [ ] Architecture tests pass
- [ ] No dependency flow violations

### Manual Testing
<!-- Describe manual testing performed -->

- [ ] Tested in development environment
- [ ] Tested all affected features
- [ ] Tested edge cases

## Checklist

### Code Quality
- [ ] Code follows the project's style guidelines
- [ ] Self-review of code completed
- [ ] Code is well-commented, particularly in hard-to-understand areas
- [ ] No console.log or debugging code left in
- [ ] No ESLint warnings
- [ ] No TypeScript errors

### Testing
- [ ] Unit tests pass (`npm run test:unit`)
- [ ] Architecture tests pass
- [ ] Build succeeds (`npm run build`)
- [ ] Bundle size within budget (≤176 KB)

### Documentation
- [ ] Documentation updated (if needed)
- [ ] JSDoc comments added/updated (if needed)
- [ ] README updated (if needed)
- [ ] ADR created (if architectural decision made)

### Architecture Compliance
- [ ] Follows 7-layer architecture
- [ ] No circular dependencies
- [ ] Dependency flow rules followed:
  - Components → Hooks → Services → Utils → Constants/Types
- [ ] Files in appropriate directories
- [ ] Barrel exports updated (if needed)

## Related Issues

<!-- Link to related issues -->

Closes #
Related to #

## Screenshots (if applicable)

<!-- Add screenshots to help explain your changes -->

## Additional Notes

<!-- Any additional information that reviewers should know -->

## Reviewer Checklist

<!-- For reviewers to complete -->

- [ ] Code changes reviewed
- [ ] Tests reviewed and adequate
- [ ] Documentation reviewed
- [ ] Architecture compliance verified
- [ ] No security concerns
- [ ] Performance impact considered
- [ ] Approved for merge

