# Task Master AI - Quick Reference Card

## 🚀 Getting Started (First Time Setup)

```
1. Initialize Task Master AI project for HVAC Canvas
2. Parse the PRD at .taskmaster/docs/prd.txt
3. Analyze project complexity
4. What's the next task I should work on?
```

---

## 📊 Current Project Snapshot (2025-10-19)
- Build time: **1.42 s** (1,422 ms) via `npm run metrics:build`
- Primary bundle: **663,502 bytes** (~648 KB) within 716,800-byte guardrail
- Repository footprint: **313 files** (148 `src/`, 127 `docs/`)
- Unit tests: **555 / 567 passing** (12 failures in Sidebar + Line Properties specs)
- Metrics: `test-results/metrics/{build-metrics,file-structure}.json`

## 📋 Essential Commands

### View Tasks
| Command | What It Does |
|---------|--------------|
| `Show me all tasks` | List all tasks |
| `Show me all pending tasks` | List tasks not started |
| `Show me all in-progress tasks` | List active tasks |
| `Show me all completed tasks` | List finished tasks |
| `Get details for task [id]` | Show full task details |
| `What's the next task?` | Get recommended next task |

### Update Tasks
| Command | What It Does |
|---------|--------------|
| `Mark task [id] as in-progress` | Start working on task |
| `Mark task [id] as complete` | Finish task |
| `Update task [id] with: [info]` | Add information to task |
| `Add a new task: [description]` | Create new task |
| `Add subtask to task [id]: [description]` | Add subtask |
| `Remove task [id]` | Delete task |

### Organize Tasks
| Command | What It Does |
|---------|--------------|
| `Expand task [id]` | Break down into subtasks |
| `Expand all pending tasks` | Break down all tasks |
| `Add dependency: task [id1] depends on [id2]` | Set dependency |
| `Validate dependencies` | Check for issues |
| `Fix dependencies` | Auto-fix dependency issues |

### Research & Analysis
| Command | What It Does |
|---------|--------------|
| `Research [topic]` | AI-powered research |
| `Show complexity report` | View task complexity |
| `Analyze project complexity` | Analyze all tasks |

---

## 🎯 Common Workflows

### Starting Your Day
```
1. Show me all in-progress tasks
2. What's the next task I should work on?
3. Mark task [id] as in-progress
```

### Completing a Task
```
1. Mark task [id] as complete
2. What's the next task?
```

### Planning a Feature
```
1. Add a new task: [feature description]
2. Expand task [id] into subtasks
3. Analyze project complexity
```

### Stuck on a Task
```
1. Research [topic related to task]
2. Update task [id] with: [blocker information]
3. Scope down task [id]
```

---

## 📊 Progress Tracking

### Daily Check-in
```
Show me the complexity report
Show me all in-progress tasks
```

### Weekly Review
```
Show me all completed tasks
Validate all dependencies
Show me all pending tasks
```

### Phase Completion
```
Show me all tasks for Phase [number]
Show me aggregate stats
```

---

## 🏷️ Tags (Optional but Useful)

### Create Tags
```
Create tag "phase-2" for Phase 2 tasks
Create tag "frontend" for UI tasks
Create tag "backend" for logic tasks
Create tag "testing" for test tasks
```

### Use Tags
```
Use tag "phase-2"
Show me all tasks
```

### List Tags
```
List all tags
```

---

## 🔧 Troubleshooting

### Common Issues
| Problem | Solution |
|---------|----------|
| Tasks not showing | `Show me all tasks` |
| Dependency errors | `Validate dependencies` then `Fix dependencies` |
| Task too complex | `Scope down task [id]` |
| Task too simple | `Scope up task [id]` |
| Need more detail | `Expand task [id]` |

---

## 💡 Pro Tips

### 1. Use Natural Language
You don't need exact commands! Task Master AI understands natural language:
- ✅ "What should I work on next?"
- ✅ "Show me tasks for the calculations tab"
- ✅ "Mark task 15 as done"
- ✅ "I need help with HVAC formulas"

### 2. Combine with Augment
Task Master AI works great with Augment's other features:
- Use codebase search to find related code
- Use chat to discuss implementation
- Use Task Master to track progress

### 3. Keep Tasks Updated
- Add notes when you learn something new
- Update tasks with implementation decisions
- Document blockers and solutions

### 4. Research Before Implementing
- Use the research feature to validate approaches
- Find best practices before coding
- Save time by learning from others

### 5. Review Regularly
- Check complexity report weekly
- Validate dependencies before starting new phases
- Adjust scope as you learn more

---

## 📝 Task Status Meanings

| Status | Meaning | When to Use |
|--------|---------|-------------|
| `pending` | Not started | Default for new tasks |
| `in-progress` | Currently working | When you start a task |
| `complete` | Finished | When task is done |
| `blocked` | Can't proceed | When waiting on something |

---

## 🎨 HVAC Canvas Specific

### Phase 2: Utility Layer (Current Focus)
```
Show me all tasks for Phase 2
What's the next task in Phase 2?
Research HVAC calculation formulas
```

### Line Properties Modal
```
Show me all tasks for Line Properties Modal
Get details for task [modal-task-id]
Research React modal best practices
```

### Testing
```
Show me all testing tasks
Add a new task: Write unit tests for [component]
```

---

## 🚀 Quick Start Checklist

- [ ] Initialize Task Master AI project
- [ ] Parse PRD from .taskmaster/docs/prd.txt
- [ ] Analyze project complexity
- [ ] Review all generated tasks
- [ ] Get your first task
- [ ] Mark task as in-progress
- [ ] Complete the task
- [ ] Mark task as complete
- [ ] Get next task
- [ ] Repeat!

---

## 📚 Resources

### Documentation
- **Setup Guide:** `TASK_MASTER_SETUP_GUIDE.md`
- **PRD:** `.taskmaster/docs/prd.txt`
- **Project Context:** `.taskmaster/docs/project-context.md`
- **Codebase Specs:** `docs/CURRENT_CODEBASE_SPECS.md`

### External Links
- **Official Docs:** https://www.task-master.dev/
- **GitHub:** https://github.com/eyaltoledano/claude-task-master
- **NPM:** https://www.npmjs.com/package/task-master-ai

---

## 🎯 Your First 5 Commands

Copy and paste these into Augment chat:

```
1. Initialize Task Master AI project for HVAC Canvas

2. Parse the PRD at .taskmaster/docs/prd.txt

3. Analyze project complexity

4. Show me all tasks for Phase 2

5. What's the next task I should work on?
```

---

**Happy Building! 🎉**

Keep this reference handy while working with Task Master AI!
