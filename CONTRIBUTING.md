# Contributing to HVAC Drawing Tool

Thank you for your interest in contributing to the HVAC Drawing Tool! This document provides guidelines and instructions for contributing to the project.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Git
- A code editor (VS Code recommended)
- Basic knowledge of React, TypeScript, and Canvas API

### Setup Development Environment

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Working Canvas"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npx playwright install chromium
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Run tests**
   ```bash
   npm test
   ```

---

## 📁 Project Structure

```
Working Canvas/
├── src/
│   ├── DrawingCanvas.tsx    # Main component (620 lines)
│   ├── App.tsx               # Root component
│   ├── main.tsx              # Entry point
│   └── styles.css            # Utility CSS classes
├── tests/
│   └── drawing-canvas.spec.ts # Playwright tests
├── playwright.config.ts      # Test configuration
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite config
├── README.md                 # User documentation
├── PROJECT_SUMMARY.md        # Technical docs
├── CHANGELOG.md              # Version history
└── CONTRIBUTING.md           # This file
```

---

## 🔧 Development Workflow

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes
- Write clean, readable code
- Follow existing code style
- Add comments for complex logic
- Update tests if needed

### 3. Test Your Changes
```bash
# Run all tests
npm test

# Run tests in UI mode
npm run test:ui

# Run tests in headed mode
npm run test:headed
```

### 4. Commit Your Changes
```bash
git add .
git commit -m "feat: Add your feature description"
```

### 5. Push and Create Pull Request
```bash
git push origin feature/your-feature-name
```

---

## 📝 Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format
```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples
```bash
feat(drawing): Add undo/redo functionality
fix(sidebar): Fix table not updating after delete
docs(readme): Update installation instructions
test(drawing): Add tests for snap-to-grid feature
```

---

## 🧪 Testing Guidelines

### Writing Tests
- Place tests in `tests/` directory
- Use descriptive test names
- Test user interactions, not implementation details
- Aim for high coverage of critical paths

### Test Structure
```typescript
test('should do something specific', async ({ page }) => {
  // Arrange: Set up test conditions
  await page.goto('/');
  
  // Act: Perform actions
  await page.click('button');
  
  // Assert: Verify results
  await expect(page.locator('div')).toBeVisible();
});
```

### Running Tests
```bash
# All tests
npm test

# Specific test file
npx playwright test drawing-canvas.spec.ts

# With UI
npm run test:ui

# Debug mode
npx playwright test --debug
```

---

## 🎨 Code Style Guidelines

### TypeScript
- Use TypeScript for all new code
- Define types for all props and state
- Avoid `any` type
- Use meaningful variable names

### React
- Use functional components with hooks
- Use `useCallback` for event handlers
- Use `useMemo` for expensive calculations
- Keep components focused and small

### CSS
- Use utility classes from `styles.css`
- Add new utilities if needed
- Follow existing naming conventions
- Keep specificity low

### Example
```typescript
// Good
const handleClick = useCallback((id: string) => {
  deleteLine(id);
}, [deleteLine]);

// Avoid
const handleClick = (id: any) => {
  deleteLine(id);
};
```

---

## 🐛 Bug Reports

### Before Submitting
1. Check if the bug has already been reported
2. Try to reproduce the bug
3. Gather relevant information

### Bug Report Template
```markdown
**Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Screenshots**
If applicable

**Environment**
- Browser: Chrome 120
- OS: Windows 11
- Version: 1.0.0
```

---

## 💡 Feature Requests

### Before Submitting
1. Check if the feature has been requested
2. Consider if it fits the project scope
3. Think about implementation

### Feature Request Template
```markdown
**Feature Description**
Clear description of the feature

**Use Case**
Why is this feature needed?

**Proposed Solution**
How should it work?

**Alternatives Considered**
Other approaches you've thought about

**Additional Context**
Any other relevant information
```

---

## 🔍 Code Review Process

### For Reviewers
- Be constructive and respectful
- Focus on code quality and maintainability
- Check for test coverage
- Verify documentation updates

### For Contributors
- Respond to feedback promptly
- Make requested changes
- Ask questions if unclear
- Be open to suggestions

---

## 📚 Resources

### Documentation
- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Playwright Documentation](https://playwright.dev/)

### Project Docs
- [README.md](./README.md) - User guide
- [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) - Technical overview
- [CHANGELOG.md](./CHANGELOG.md) - Version history

---

## 🎯 Priority Areas for Contribution

### High Priority
1. Scale selector UI implementation
2. Custom scale setter
3. Export/Import functionality
4. Undo/Redo system

### Medium Priority
1. Line colors
2. Measurements on lines
3. Grid system
4. Layer management

### Low Priority
1. Dark mode
2. Mobile support
3. Additional keyboard shortcuts
4. Performance optimizations

---

## ❓ Questions?

If you have questions about contributing:
1. Check existing documentation
2. Search closed issues
3. Ask in discussions
4. Contact the development team

---

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project.

---

**Thank you for contributing to the HVAC Drawing Tool!** 🎉

