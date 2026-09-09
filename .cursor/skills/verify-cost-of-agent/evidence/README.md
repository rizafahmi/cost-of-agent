# Evidence Directory

This directory contains run-specific evidence from skill executions. Each run creates a timestamped subdirectory with captured artifacts.

## Structure

```
evidence/
  run-YYYYMMDD-HHMMSS/
    build-log.txt
    route-list.txt
    agent-order.txt
    home-html-head.txt
    server-status.txt
    verification-summary.md
    *.png (screenshots, if captured)
```

## Gitignore

Evidence directories are gitignored (`evidence/*/` in `.gitignore`) to keep test artifacts local. They should not be committed to the repository.

## Cleanup

Evidence persists after server cleanup. This is intentional — you can review test results after the preview server stops.

To clean old runs manually:
```bash
rm -rf .cursor/skills/verify-cost-of-agent/evidence/run-*
```

## Viewing Evidence

Latest run:
```bash
ls -lt .cursor/skills/verify-cost-of-agent/evidence/ | head -5
```

Read a specific run summary:
```bash
cat .cursor/skills/verify-cost-of-agent/evidence/run-YYYYMMDD-HHMMSS/verification-summary.md
```
