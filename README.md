# Cursor Rules - AI Pair Programming Workflow

A comprehensive workflow system for effective AI pair programming using Cursor IDE. This repository contains our battle-tested process for managing AI-assisted development, including task management, documentation standards, and working memory patterns.

## Overview

This workflow is designed to maximize the effectiveness of AI pair programming by:

- Maintaining clear task context and history
- Standardizing documentation and communication
- Managing working memory effectively
- Ensuring consistent development patterns

## Key Components

1. `.cursorrules` - Core workflow rules and standards
2. Working Memory System - Active task management and context
3. Templates - Standardized formats for tasks and documentation

## Getting Started

1. Clone this repository
2. Copy the `.cursorrules` file to your project
3. Set up the working memory structure:
   ```bash
   mkdir -p docs/working-memory/{open,done}
   mkdir -p docs/templates
   ```
4. Copy the template files to your project

## Directory Structure

```
docs/
├── .cursorrules                 # Core workflow rules
├── working-memory/             # Active context
│   ├── open/                  # Active tasks
│   └── done/                  # Completed tasks
└── templates/                 # Project templates
```

## Usage

1. Task Management:

   - Create new tasks in `docs/working-memory/open/`
   - Use task templates from `docs/templates/`
   - Move completed tasks to `docs/working-memory/done/`

2. Documentation:

   - Follow standards in `.cursorrules`
   - Use templates for consistency
   - Maintain clear task history

3. Working Memory:
   - Keep active context in working memory
   - Update task status regularly
   - Track decisions and progress

## Best Practices

1. Always reference `.cursorrules` in AI conversations
2. Maintain clear task plans and history
3. Use standardized formats and templates
4. Keep documentation current and relevant
5. Follow the working memory lifecycle

## Contributing

We welcome contributions! Please:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

MIT License - See LICENSE file for details
