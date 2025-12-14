# Cline Tools for FlowLens

This package contains [Cline](https://github.com/cline/cline) task templates for automating FlowLens development workflows.

## Overview

Cline acts as the "Dev Agent" for FlowLens, handling:
- Adding new metrics and data sources
- Syncing Kestra flows with TypeScript types
- Adding new action types to the decision system
- Automated PR creation for routine changes

## Available Tasks

### `add-metric`

Add a new monitoring metric to the pipeline.

```bash
cline task add-metric \
  --metric_name "request_count" \
  --metric_unit "req/s" \
  --threshold_warning 1000 \
  --threshold_critical 5000 \
  --source prometheus
```

### `sync-flows`

Synchronize Kestra flow definitions with TypeScript types.

```bash
cline task sync-flows
```

This will:
1. Validate YAML syntax
2. Generate TypeScript interfaces
3. Create a PR automatically

### `add-action-type`

Add a new action type to the decision system.

```bash
cline task add-action-type \
  --action_type "create_ticket" \
  --description "Create Jira ticket for incident" \
  --default_risk "low" \
  --auto_approvable true \
  --icon "Ticket"
```

## Integration with CodeRabbit

All PRs created by Cline tasks are automatically reviewed by CodeRabbit:

1. Cline creates the PR with appropriate labels
2. CodeRabbit analyzes the changes
3. CodeRabbit posts review comments
4. Human reviews and merges

Example CodeRabbit integration:

```yaml
# .github/workflows/cline-pr.yaml
on:
  pull_request:
    types: [opened]
    
jobs:
  coderabbit-review:
    if: contains(github.event.pull_request.labels.*.name, 'automation')
    runs-on: ubuntu-latest
    steps:
      - uses: coderabbitai/coderabbit-action@v1
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Creating Custom Tasks

1. Create a new JSON file in `tasks/`:

```json
{
  "name": "my-task",
  "description": "What this task does",
  "version": "1.0.0",
  "instructions": [
    "Step-by-step instructions for Cline"
  ],
  "files_to_modify": [
    "list of files to change"
  ],
  "template": {
    "param1": "default",
    "param2": 0
  }
}
```

2. Run the task:

```bash
cline task my-task --param1 value --param2 42
```
