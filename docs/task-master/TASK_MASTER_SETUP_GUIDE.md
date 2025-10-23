# Task Master AI - Complete Setup Guide for HVAC Canvas

## 🎉 Congratulations!

Task Master AI is now successfully integrated with Augment! You can see all 36 tools available in your Augment panel.

---

## 📊 Current Project Metrics (2025-10-19)
- Build time: **1.42 s** (1,422 ms) from `npm run metrics:build`
- Primary bundle: **663,502 bytes** (~648 KB) vs 716,800-byte budget
- Repository footprint: **313 tracked files** (148 `src/`, 127 `docs/`)
- Unit tests: **555 / 567 passing**, 12 failures confined to Sidebar + Line Properties specs
- Metrics source: `test-results/metrics/build-metrics.json` & `file-structure.json`

## 📦 What's Been Prepared

I've created a complete setup for you to use Task Master AI effectively:

### 1. ✅ Product Requirements Document (PRD)
**Location:** `.taskmaster/docs/prd.txt`

**Contents:**
- Complete feature specification for Line Properties Modal
- User stories and acceptance criteria
- Functional and non-functional requirements
- Technical architecture
- Implementation phases (103 tasks total)
- Timeline and milestones
- HVAC calculation formulas
- Success metrics

### 2. ✅ Project Context Document
**Location:** `.taskmaster/docs/project-context.md`

**Contents:**
- Complete project overview
- Technology stack
- Architecture details
- Current development focus
- Project structure
- Development guidelines
- Success criteria
- Next steps and roadmap

### 3. ✅ Existing Documentation
**Already in your project:**
- `docs/CURRENT_CODEBASE_SPECS.md` - Complete codebase specification
- `docs/LINE_PROPERTIES_MODAL.md` - Feature documentation
- `docs/PROJECT_STATUS.md` - Current status
- `docs/ARCHITECTURE.md` - System architecture

---

## 🚀 How to Initialize Task Master AI

Now that you have Task Master AI integrated with Augment, follow these steps:

### Step 1: Initialize the Project

In your Augment chat, say:

```
Initialize Task Master AI project for HVAC Canvas
```

This will:
- Create `.taskmaster/` directory structure
- Set up configuration files
- Initialize the task tracking system

### Step 2: Parse the PRD

After initialization, say:

```
Parse the PRD file at .taskmaster/docs/prd.txt to generate initial tasks
```

This will:
- Read the Product Requirements Document
- Automatically generate tasks from the requirements
- Create task hierarchy with dependencies
- Set up the 103-task breakdown for Line Properties Modal

### Step 3: Analyze Project Complexity

Then say:

```
Analyze the project complexity for all tasks
```

This will:
- Evaluate each task's complexity
- Suggest which tasks need expansion
- Identify dependencies
- Recommend task ordering

### Step 4: Get Your Next Task

Finally, say:

```
What's the next task I should work on?
```

This will:
- Analyze task dependencies
- Recommend the next logical task
- Provide context and requirements
- Help you stay focused

---

## 💡 Common Task Master AI Commands

### Project Management

**Get all tasks:**
```
Show me all tasks
```

**Get tasks by status:**
```
Show me all pending tasks
Show me all in-progress tasks
Show me all completed tasks
```

**Get specific task details:**
```
Get details for task [task-id]
```

**Find next task:**
```
What should I work on next?
```

### Task Creation & Updates

**Add a new task:**
```
Add a new task: [task description]
```

**Add a subtask:**
```
Add a subtask to task [task-id]: [subtask description]
```

**Update a task:**
```
Update task [task-id] with: [new information]
```

**Set task status:**
```
Mark task [task-id] as in-progress
Mark task [task-id] as complete
```

### Task Organization

**Add dependency:**
```
Add dependency: task [task-id-1] depends on task [task-id-2]
```

**Move task:**
```
Move task [task-id] to position [new-position]
```

**Add tag:**
```
Create tag "frontend" for organizing UI tasks
Use tag "frontend"
```

### Task Expansion & Scoping

**Expand a complex task:**
```
Expand task [task-id] into subtasks
```

**Expand all pending tasks:**
```
Expand all pending tasks
```

**Adjust complexity:**
```
Scope up task [task-id] - make it more detailed
Scope down task [task-id] - simplify it
```

### Research & Analysis

**Research a topic:**
```
Research best practices for HVAC duct sizing calculations
Research React modal accessibility patterns
```

**Get complexity report:**
```
Show me the complexity report
```

**Validate dependencies:**
```
Check for dependency issues
```

---

## 🎯 Recommended Workflow

### Phase 1: Setup (You are here!)
1. ✅ Initialize Task Master AI project
2. ✅ Parse PRD to generate tasks
3. ✅ Analyze project complexity
4. ✅ Review task breakdown

### Phase 2: Planning
1. Review all generated tasks
2. Adjust task complexity as needed
3. Add any missing tasks
4. Validate dependencies
5. Organize tasks with tags

### Phase 3: Execution
1. Get next task to work on
2. Expand task if needed
3. Mark task as in-progress
4. Complete the work
5. Mark task as complete
6. Repeat!

### Phase 4: Tracking
1. Regularly check complexity report
2. Update tasks with new information
3. Add notes and context
4. Track progress toward milestones

---

## 📋 Example: Complete Workflow

Here's a complete example of using Task Master AI for the Line Properties Modal:

### 1. Initialize
```
You: Initialize Task Master AI project for HVAC Canvas
Task Master: ✅ Project initialized! Created .taskmaster/ directory structure.
```

### 2. Parse PRD
```
You: Parse the PRD at .taskmaster/docs/prd.txt
Task Master: ✅ Parsed PRD! Generated 103 tasks across 13 phases.
```

### 3. Review Tasks
```
You: Show me all tasks for Phase 2
Task Master: 
Phase 2: Utility Layer (10 tasks)
- Task 15: Create hvac/calculations.ts
- Task 16: Implement calculateVelocity function
- Task 17: Implement calculateFriction function
...
```

### 4. Get Next Task
```
You: What's the next task I should work on?
Task Master: 
Next Task: Task 15 - Create hvac/calculations.ts
Dependencies: None (Phase 1 complete)
Complexity: Medium
Estimated Time: 30 minutes
```

### 5. Expand Task
```
You: Expand task 15 into subtasks
Task Master:
Created 4 subtasks:
- 15.1: Create file structure
- 15.2: Add TypeScript types
- 15.3: Add JSDoc comments
- 15.4: Export functions
```

### 6. Work on Task
```
You: Mark task 15 as in-progress
Task Master: ✅ Task 15 status updated to in-progress
```

### 7. Complete Task
```
You: Mark task 15 as complete
Task Master: ✅ Task 15 marked complete! 
Next recommended task: Task 16 - Implement calculateVelocity
```

### 8. Research
```
You: Research HVAC velocity calculation formulas
Task Master: 
[Provides detailed research on ASHRAE standards, Wright Equation, etc.]
```

---

## 🔧 Advanced Features

### Tags for Organization

Create tags to organize tasks by category:

```
Create tag "phase-2" for Phase 2 tasks
Create tag "calculations" for HVAC calculation tasks
Create tag "ui" for UI component tasks
Create tag "testing" for test-related tasks
```

Then use tags to filter:

```
Use tag "phase-2"
Show me all tasks
```

### Custom Rules

Add project-specific rules:

```
Add rule: All utility functions must have unit tests
Add rule: Follow layered architecture strictly
Add rule: Maximum 200 lines per file
```

### Model Configuration

Check current AI model configuration:

```
Show me the current model configuration
```

---

## 📊 Tracking Progress

### Get Overview
```
Show me the complexity report
```

### Check Dependencies
```
Validate all dependencies
```

### View Statistics
```
Show me aggregate stats for all tasks
```

---

## 🎨 Tips for Success

### 1. Start Small
- Don't try to expand all tasks at once
- Work on one phase at a time
- Focus on the next immediate task

### 2. Keep Context Updated
- Update tasks with new learnings
- Add notes about implementation decisions
- Document blockers and solutions

### 3. Use Research Feature
- Research before implementing
- Validate approaches
- Find best practices

### 4. Leverage Tags
- Organize by phase, feature, or type
- Filter tasks by context
- Track related work

### 5. Review Regularly
- Check complexity report weekly
- Validate dependencies
- Adjust scope as needed

---

## 🐛 Troubleshooting

### Task Master Not Responding
1. Check that MCP server is running
2. Restart VS Code
3. Check Augment settings

### Tasks Not Generating from PRD
1. Verify PRD file exists at `.taskmaster/docs/prd.txt`
2. Check PRD format is correct
3. Try parsing again

### Dependency Errors
1. Run `Validate all dependencies`
2. Fix any circular dependencies
3. Run `Fix dependencies automatically`

---

## 📚 Next Steps

Now that you have everything set up, here's what to do:

### Immediate (Next 5 minutes)
1. ✅ Initialize Task Master AI project
2. ✅ Parse the PRD
3. ✅ Review generated tasks
4. ✅ Get your first task

### Today
1. Complete Phase 2: Utility Layer setup
2. Start implementing HVAC calculations
3. Write unit tests for calculations

### This Week
1. Complete Phase 2 and Phase 3
2. Build shared UI components
3. Start Properties Tab implementation

### This Month
1. Complete all UI components
2. Implement multi-select mode
3. Add accessibility features
4. Integration testing

---

## 🎉 You're Ready!

Everything is set up and ready to go! Task Master AI will help you:

- ✅ Stay organized with 103 tasks
- ✅ Track progress systematically
- ✅ Research before implementing
- ✅ Maintain focus on goals
- ✅ Build high-quality code

**Start by saying:**
```
Initialize Task Master AI project for HVAC Canvas
```

Good luck building your HVAC Canvas Line Properties Modal! 🚀

---

**Questions?** Just ask Task Master AI or refer to:
- Official Docs: https://www.task-master.dev/
- GitHub: https://github.com/eyaltoledano/claude-task-master
- NPM: https://www.npmjs.com/package/task-master-ai
