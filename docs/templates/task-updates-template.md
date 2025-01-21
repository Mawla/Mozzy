# Task Updates ({task-id})

Reference: [Task Plan](./plan.md)

# ⚠️ TEMPLATE VALIDATION CHECKLIST ⚠️

# Before committing changes, verify:

# [ ] Current Status is FIRST section in file

# [ ] Only ONE Current Status entry exists

# [ ] Previous status moved to Progress History

# [ ] All required sections present

# [ ] Emoji markers used correctly

# [ ] Timestamp is from `date` command

## Current Status

### $(date "+%Y-%m-%d %H:%M")

**Status**: {Not Started/In Progress/Review/Completed}

- What's working:

  - {current working state}
  - {list specific working features}

- What's not:

  - {current issues}
  - {list specific problems}

- Blocking issues:

  - {list any blocking issues}
  - {or "None" if no blockers}

- Next actions:
  1. {immediate next step}
  2. {following steps}
  3. {prioritized actions}

## Progress History

### $(date "+%Y-%m-%d %H:%M") - Initial Setup

✓ Completed:

- Created task documentation
- Set up initial structure

🤔 Decisions:

- {Initial approach decisions}
- {Key technical choices}

❌ Issues:

- {List any issues}
- {Or "None" if no issues}

⏭️ Next:

- Begin implementation
- {Next specific steps}

### Required Emoji Markers:

✓ Completed: Work completed
🤔 Decisions: Key decisions made
❌ Issues: Problems encountered
⏭️ Next: Upcoming work
📚 Documentation: (when docs affected)

### Update Process:

1. Get current timestamp:
   ```bash
   date "+%Y-%m-%d %H:%M"
   ```
2. Move current status to Progress History
3. Update Current Status with new timestamp
4. Verify checklist at top of file

### Template Usage Notes:

1. ONLY ONE Current Status entry should exist at any time
2. Before updating status:
   - Copy current status to Progress History
   - Update timestamp using `date` command
   - Replace current status with new status
3. Keep Progress History chronological (newest at bottom)
4. Use emoji markers consistently
5. Link to specific files/components
6. Reference task ID in all updates
7. Keep entries focused and concise
