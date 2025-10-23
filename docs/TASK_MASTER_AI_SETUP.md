# Task Master AI Setup Guide

## Overview
Task Master AI has been installed and configured for this HVAC Canvas project. It provides AI-powered task management to help organize and track development work.

## Current Project Metrics (2025-10-19)
- Build time: **1.42 s** (1,422 ms) via `npm run metrics:build`
- Primary bundle: **663,502 bytes** (~648 KB) within a 716,800-byte budget
- Repository footprint: **313 tracked files** (148 in `src/`, 127 in `docs/`)
- Unit tests: **555 / 567 passing** (12 failures focused on Sidebar and Line Properties interactions)
- Metrics source: `npm run metrics:collect` → `test-results/metrics/*.json`

## Installation Details

### Configuration Files Created
1. **`.cursor/mcp.json`** - MCP server configuration for Cursor IDE
2. **`.env`** - Environment variables with API keys and model configuration
3. **`.gitignore`** - Updated to exclude `.cursor/` directory for security

### Model Configuration
- **Main Model**: `gpt-4o` (OpenAI) - Used for primary task management operations
- **Research Model**: `gpt-4o-mini` (OpenAI) - Used for research and lighter tasks
- **Fallback Model**: `claude-3-5-sonnet-20241022` (Anthropic) - Backup if OpenAI models fail

## How to Use Task Master AI

### Restart Required
After installation, you need to **restart Cursor** for the MCP server to be recognized.

### Available Commands
Once Cursor restarts, Task Master AI will be available through the MCP interface. Common commands include:

1. **Create Tasks** - Break down features into manageable tasks
2. **List Tasks** - View current task list and status
3. **Update Tasks** - Mark tasks as complete or in progress
4. **Research** - Use AI to research implementation approaches
5. **Plan** - Generate implementation plans for features

### Using with AI Chat
When chatting with AI assistants in Cursor, you can:
- Ask to create a task breakdown for a feature
- Request research on implementation approaches
- Get structured plans for complex work
- Track progress across multiple tasks

### Example Workflow
```
You: "I want to add a new feature to allow users to export their canvas as PNG"

Task Master AI will:
1. Break down the feature into subtasks
2. Research best practices for canvas export
3. Create a structured implementation plan
4. Track progress as you complete each task
```

## Benefits for HVAC Canvas Project

### Current Project Context
Your HVAC Canvas app is a React/TypeScript drawing application with:
- PDF rendering capabilities
- Drawing tools (lines, shapes)
- Zoom/pan functionality
- E2E and unit tests
- Docker support

### How Task Master Helps
1. **Feature Planning** - Break down new HVAC-specific features (duct sizing, airflow calculations, etc.)
2. **Refactoring** - Organize large refactoring efforts into manageable chunks
3. **Testing** - Plan and track test coverage improvements
4. **Documentation** - Structure documentation tasks
5. **Bug Fixes** - Organize and prioritize bug fixes

## Security Notes

### API Keys
- API keys are stored in `.env` and `.cursor/mcp.json`
- Both locations are in `.gitignore` to prevent accidental commits
- **Never commit API keys to version control**

### Best Practices
1. Keep `.env` and `.cursor/` in `.gitignore`
2. Rotate API keys periodically
3. Use environment-specific keys for development vs production
4. Consider using a secrets manager for team projects

## Troubleshooting

### MCP Server Not Showing
1. Restart Cursor completely
2. Check that `.cursor/mcp.json` exists and is valid JSON
3. Verify API keys are correct in the configuration

### API Errors
1. Check API key validity
2. Verify you have credits/quota available
3. Check model names are correct
4. Review fallback model configuration

### Getting Help
- [Task Master AI Documentation](https://www.task-master.dev/)
- [GitHub Repository](https://github.com/eyaltoledano/claude-task-master)
- [NPM Package](https://www.npmjs.com/package/task-master-ai)

## Next Steps

1. **Restart Cursor** to load the MCP server
2. **Test the integration** by asking the AI to create a simple task breakdown
3. **Start using it** for your next feature or refactoring work

## Example Use Cases for Your Project

### 1. Adding HVAC-Specific Features
"Create a task breakdown for adding duct sizing calculations to the canvas"

### 2. Improving Test Coverage
"Plan tasks to increase E2E test coverage for the drawing tools"

### 3. Performance Optimization
"Research and plan tasks for optimizing canvas rendering performance"

### 4. New Drawing Tools
"Break down the implementation of a rectangle drawing tool with snap-to-grid"

---

**Installation Date**: 2025-10-16  
**Configured By**: Augment AI Assistant  
**Primary Model**: OpenAI GPT-4o
