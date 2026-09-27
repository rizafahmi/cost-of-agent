# Control CLI Usage Guide

Agent-friendly control CLI for Cost-of-Agent Astro static site verification.

## Quick Start

```bash
# Full smoke test (build → preview → checks → evidence → stop)
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs smoke

# Or get help
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs --help
```

## Commands

### Build & Preview

**`build`** — Build the static site
```bash
node control-cost-of-agent.mjs build
# Runs: pnpm build
# Output: dist/ directory
# Exit: 0 = success, non-zero = build failed
```

**`preview`** — Start preview server
```bash
node control-cost-of-agent.mjs preview
# Binds: 127.0.0.1:4323 (default)
# State: Saves PID to evidence/.control/preview.json
# Idempotent: Reuses healthy server, restarts stale
# Exit: 0 always (use wait-ready to confirm serving)
```

**`stop`** — Stop preview server
```bash
node control-cost-of-agent.mjs stop
# Sends: SIGTERM, then SIGKILL if needed after 2s
# Clears: State file
# Idempotent: Safe to rerun
# Exit: 0 = stopped or wasn't running
```

**`wait-ready`** — Wait for server to respond
```bash
node control-cost-of-agent.mjs wait-ready
# Polls: http://127.0.0.1:4323/ until 200 or timeout (30s)
# Exit: 0 = ready, non-zero = timeout
```

### Diagnostics

**`doctor`** — Run comprehensive diagnostics
```bash
node control-cost-of-agent.mjs doctor
# Checks:
#   1. Build artifacts (dist/index.html, dist/agen/, 9 agent dirs)
#   2. Server response (home 200, detail 200)
#   3. Key content (title, agent-card, Bahasa sections)
#   4. Route count (10 total: 1 home + 9 agents)
# Output: ✓/✗ lines for each check
# Exit: 0 = all passed, non-zero = failures
```

**`check-home`** — Assert home page structure
```bash
node control-cost-of-agent.mjs check-home
# Checks:
#   - Agent count ~9
#   - First agent: "byteplus-modelark-code" (lowest bandLowUsd: 5)
#   - Last agent: "cursor-business" (highest bandLowUsd: 40)
# Exit: 0 = passed, non-zero = failed
```

**`check-detail <agent-id>`** — Assert detail page sections
```bash
node control-cost-of-agent.mjs check-detail cursor-pro
# Checks:
#   - Agent name heading (h1)
#   - "Yang Termasuk" (includes)
#   - "Catatan Penting" (caveats)
#   - "Sumber Data" (sources)
# Exit: 0 = passed, non-zero = failed
```

### Data Extraction

**`order`** — Extract agent IDs in display order
```bash
node control-cost-of-agent.mjs order
# Output: One agent ID per line (stdout)
# First: "byteplus-modelark-code" (lowest cost)
# Last: "cursor-business" (highest cost)
# Exit: 0 = success, non-zero = fetch failed
```

**`get <path>`** — Fetch page for inspection
```bash
node control-cost-of-agent.mjs get /
node control-cost-of-agent.mjs get /agen/cursor-pro/
# Output: Status, content-length, body
# Exit: 0 = 200 response, non-zero = error or non-200
```

**`snapshot <path>`** — Structural summary as JSON
```bash
node control-cost-of-agent.mjs snapshot /
# Output: JSON to stdout with:
#   - url, statusCode, timestamp
#   - structure: { type, agentCardCount, agentIds, hasTitle, hasBahasaCopy }
# Exit: 0 = success, non-zero = fetch failed
```

### Evidence

**`evidence-init`** — Create timestamped evidence directory
```bash
node control-cost-of-agent.mjs evidence-init
# Creates: evidence/run-YYYYMMDD-HHMMSS/
# Writes: README.md
# Output: Directory path to stdout
# Exit: 0 always
```

**`smoke`** — Full end-to-end test
```bash
node control-cost-of-agent.mjs smoke
# Sequence:
#   1. Build (if needed)
#   2. Start preview
#   3. Wait for ready
#   4. Doctor
#   5. Check home
#   6. Check detail (cursor-pro)
#   7. Create evidence
#   8. Stop server
# Output: Progress for each stage, ✓/✗ summary
# Exit: 0 = all passed, non-zero = any failures
```

## Environment Variables

Override defaults:

```bash
COA_BASE_URL=http://127.0.0.1:5000 node control-cost-of-agent.mjs doctor
COA_PORT=5000 node control-cost-of-agent.mjs preview
COA_HOST=127.0.0.1 node control-cost-of-agent.mjs preview
```

Defaults:
- `COA_BASE_URL`: `http://127.0.0.1:4323`
- `COA_PORT`: `4323`
- `COA_HOST`: `127.0.0.1`

## State Management

Preview server state persisted to:
```
.cursor/skills/verify-cost-of-agent/evidence/.control/preview.json
```

Schema:
```json
{
  "pid": 12345,
  "port": 4323,
  "host": "127.0.0.1",
  "startedAt": "2026-09-09T23:10:11.000Z"
}
```

This file is gitignored and safe to delete manually if needed.

## Exit Codes

All commands follow convention:
- **0** = success
- **non-zero** = failure

Commands that never fail (exit 0 always):
- `evidence-init`

Commands that can fail:
- `build` (exit with build status)
- `doctor`, `check-home`, `check-detail` (exit 1 on assertion failures)
- `order`, `get`, `snapshot` (exit 1 on HTTP errors)
- `smoke` (exit 1 if any stage fails)

## Output Format

Agent-parseable output:
- **✓** = passed check
- **✗** = failed check
- Clear labels for each check
- Exit codes for scripting

JSON output (where applicable):
- `snapshot` command
- Structured data for programmatic use

## Examples

### Manual testing workflow
```bash
# 1. Build
node control-cost-of-agent.mjs build

# 2. Start server
node control-cost-of-agent.mjs preview

# 3. Wait for ready
node control-cost-of-agent.mjs wait-ready

# 4. Run checks
node control-cost-of-agent.mjs doctor
node control-cost-of-agent.mjs check-home
node control-cost-of-agent.mjs order

# 5. Inspect specific agent
node control-cost-of-agent.mjs check-detail cursor-pro
node control-cost-of-agent.mjs snapshot /agen/cursor-pro/

# 6. Create evidence
RUN_DIR=$(node control-cost-of-agent.mjs evidence-init)
node control-cost-of-agent.mjs order > "$RUN_DIR/agent-order.txt"
node control-cost-of-agent.mjs snapshot / > "$RUN_DIR/home-snapshot.json"

# 7. Cleanup
node control-cost-of-agent.mjs stop
```

### Quick verification
```bash
# One command, complete test
node control-cost-of-agent.mjs smoke

# Exit code tells you if it passed
if node control-cost-of-agent.mjs smoke; then
  echo "All checks passed!"
else
  echo "Some checks failed"
fi
```

### CI/CD integration
```bash
#!/bin/bash
set -e

# Install dependencies
pnpm install

# Run smoke test
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs smoke

# Smoke test creates evidence and cleans up automatically
echo "Verification passed!"
```

## Technical Notes

- **Zero dependencies**: Uses only Node built-ins (`node:child_process`, `node:fs`, `node:http`, `node:path`, `node:url`)
- **ESM module**: `#!/usr/bin/env node` shebang, `.mjs` extension
- **Async/await**: All HTTP operations properly awaited
- **Process management**: Tracked PIDs, graceful shutdown
- **Idempotent**: Safe to rerun preview/stop
- **Isolation**: Always binds to 127.0.0.1, never wildcard host

## Troubleshooting

**Server won't start**
```bash
# Check if port is in use
lsof -i :4323

# Try different port
COA_PORT=4324 node control-cost-of-agent.mjs preview
```

**Stale state file**
```bash
# Manually clear state
rm .cursor/skills/verify-cost-of-agent/evidence/.control/preview.json

# Or just run stop (clears state)
node control-cost-of-agent.mjs stop
```

**Doctor fails but site looks good**
```bash
# Run individual checks to isolate
node control-cost-of-agent.mjs check-home
node control-cost-of-agent.mjs check-detail cursor-pro
node control-cost-of-agent.mjs order

# Inspect raw HTML
node control-cost-of-agent.mjs get / | head -100
```

**Preview not responding**
```bash
# Check if process is alive
cat .cursor/skills/verify-cost-of-agent/evidence/.control/preview.json

# Check logs (preview runs detached, no logs)
# Rebuild and try again
node control-cost-of-agent.mjs stop
node control-cost-of-agent.mjs build
node control-cost-of-agent.mjs smoke
```
