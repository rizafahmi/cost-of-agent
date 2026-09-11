---
name: verify-cost-of-agent
description: Drive the Cost-of-Agent Astro static site (Bahasa directory) — launch preview, doctor, browser-drive home + agent detail, capture proof. Use when verifying Cost-of-Agent UI behavior.
---

# Verification Skill: Cost of Agent

Systematic verification for the Cost-of-Agent static site — a Bahasa Indonesia AI coding agent pricing directory built with Astro SSG.

## Surface

**What it is:** Public Bahasa web directory displaying AI coding agent pricing:
- Home: `/` — agent list sorted by `bandLowUsd` (lowest to highest)
- Detail: `/agen/[id]/` — individual agent pages with pricing, includes, caveats, sources

**Tech stack:** Astro 7.x + TypeScript, static site generator (`output: 'static'`)

**Data source:** `src/data/agents.ts` (typed array of 11 agents)

**Key features:**
- Agent cards showing name, vendor, category, billing type, price band
- Sticker price vs. real cost comparison
- Detail pages with includes, caveats, source links, lastVerified dates
- All copy in Bahasa Indonesia

## Launch

**Control CLI:** `.cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs`

All launch, verification, and cleanup operations use the control CLI. It manages state, ensures idempotency, and provides agent-friendly output.

### Prerequisites
```bash
# Check dependencies installed
test -d /workspace/node_modules || pnpm install
```

### Build static site
```bash
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs build
# Output: dist/ directory with static HTML
# Exit code 0 = success
```

### Start preview server
```bash
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs preview
# Starts server on 127.0.0.1:4323 (override with COA_PORT, COA_HOST)
# Persists PID and port to .cursor/skills/verify-cost-of-agent/evidence/.control/preview.json
# Idempotent: safe to rerun (reuses if healthy, restarts if stale)
```

**Isolation requirement:** Always binds to `127.0.0.1` and explicit port. Never uses `0.0.0.0` or wildcard host. State is tracked for clean shutdown.

### Wait for server ready
```bash
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs wait-ready
# Polls until http://127.0.0.1:4323/ returns 200 or timeout
# Exit code 0 = ready, non-zero = timeout
```

## Doctor

Run diagnostics after launch to verify build artifacts, server response, content, and route count.

### Comprehensive diagnostics
```bash
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs doctor
# Checks:
# 1. Build artifacts exist (dist/index.html, dist/agen/, 11 agent dirs)
# 2. Server responds (home 200, detail 200)
# 3. Key content present (title, agent-card, Bahasa sections)
# 4. Route count (12 total: 1 home + 11 agents)
# Exit code 0 = all passed, non-zero = failures
```

Doctor output is agent-parseable with clear ✓/✗ lines for each check.

## Drive

**Harness:** Browser automation via CDP (Chrome DevTools Protocol) or curl + screenshot tool.

**Stable selectors:**
- Home agent cards: `a.agent-card` with `href="/agen/{id}/"`
- Agent name on card: `h2.agent-name`
- Agent vendor: `.agent-vendor`
- Price band: `.price-band`
- Category badge: `.badge-category`
- Billing badge: `.badge-billing`
- Detail page heading: `h1` (agent name)
- Detail vendor: `.vendor`
- Includes list: `section ul li` (first section)
- Caveats list: `section.caveats ul li`
- Source links: `.source-link`
- Back link: `a.back-link` with text "← Kembali ke daftar"

### Navigate home → detail
```javascript
// CDP example (pseudo-code)
const browser = await cdp.launch();
const page = await browser.newPage();
await page.goto('http://127.0.0.1:4323/');

// Verify home loaded
const title = await page.$eval('h1', el => el.textContent);
assert(title.includes('Cost of Agent'));

// Count agent cards (should be 11)
const cardCount = await page.$$eval('a.agent-card', cards => cards.length);
assert(cardCount === 11);

// Click first card (byteplus-modelark-code - lowest bandLowUsd, alphabetically first)
const firstCardHref = await page.$eval('a.agent-card', el => el.href);
assert(firstCardHref.includes('/agen/byteplus-modelark-code/'));
await page.click('a.agent-card');

// Verify detail loaded
await page.waitForSelector('h1');
const detailName = await page.$eval('h1', el => el.textContent);
assert(detailName === 'BytePlus ModelArk (Dola-Seed Code API)');

// Screenshot for evidence
await page.screenshot({ path: '/workspace/.cursor/skills/verify-cost-of-agent/evidence/home-to-detail.png' });
```

### Verify home list order
```bash
# Extract agent IDs from href attributes in order
curl -s http://127.0.0.1:4323/ | \
  grep -oP 'href="/agen/\K[^/]+' | \
  head -11
# First should be "byteplus-modelark-code" (bandLowUsd: 5, alphabetically first)
# Last should be "cursor-business" (bandLowUsd: 40)
```

### Check detail page elements
```bash
# For cursor-pro detail
URL="http://127.0.0.1:4323/agen/cursor-pro/"
curl -s "$URL" | grep -q "Cursor Pro" && echo "✓ Name"
curl -s "$URL" | grep -q "Cursor" && echo "✓ Vendor"
curl -s "$URL" | grep -q "US\$20" && echo "✓ Price band low"
curl -s "$URL" | grep -q "US\$60" && echo "✓ Price band high"
curl -s "$URL" | grep -q "Yang Termasuk" && echo "✓ Includes heading"
curl -s "$URL" | grep -q "Catatan Penting" && echo "✓ Caveats heading"
curl -s "$URL" | grep -q "Sumber Data" && echo "✓ Sources heading"
curl -s "$URL" | grep -q "cursor.com/pricing" && echo "✓ Source link"
curl -s "$URL" | grep -q "2026-09-09" && echo "✓ lastVerified date"
```

## Evidence

**Evidence directory:** `.cursor/skills/verify-cost-of-agent/evidence/<run-id>/`

Create run-specific subdirectory with timestamp:
```bash
RUN_ID="run-$(date +%Y%m%d-%H%M%S)"
EVIDENCE_DIR="/workspace/.cursor/skills/verify-cost-of-agent/evidence/$RUN_ID"
mkdir -p "$EVIDENCE_DIR"
```

**Artifacts to capture:**
1. **build-log.txt** — Output of `pnpm build`
2. **server-startup.txt** — Preview server console output
3. **home-page.png** — Screenshot of home page
4. **detail-page-cursor-pro.png** — Screenshot of Cursor Pro detail
5. **home-html-head.txt** — First 100 lines of home HTML
6. **route-list.txt** — List of all generated routes in `dist/`
7. **agent-order.txt** — Extracted agent IDs in display order

**Screenshot tool:** Use CDP, Playwright, Puppeteer, or `wkhtmltoimage` if available.

**Evidence must survive cleanup:** Do NOT delete evidence directory when stopping server.

## Cleanup

```bash
# Stop preview server (reads PID from state, graceful shutdown)
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs stop
# Sends SIGTERM, waits, then SIGKILL if needed
# Clears state file
# Idempotent: safe to rerun

# Evidence and dist/ are preserved
# Do NOT delete evidence directory
# Do NOT delete dist/ (build artifacts are safe to leave)
```

## Helpers

All helpers use the control CLI for reproducibility and agent-friendly output.

### Extract agent order from home
```bash
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs order
# Prints agent IDs (one per line) in display order
# First should be "byteplus-modelark-code" (lowest cost), last "cursor-business" (highest)
```

### Check home page structure
```bash
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs check-home
# Asserts:
# - Agent count ~11
# - First agent is "byteplus-modelark-code" (bandLowUsd: 5)
# - Last agent is "cursor-business" (bandLowUsd: 40)
# Exit code 0 = passed, non-zero = failed
```

### Check detail page sections
```bash
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs check-detail cursor-pro
# Asserts presence of:
# - Agent name heading (h1)
# - "Yang Termasuk" (includes)
# - "Catatan Penting" (caveats)
# - "Sumber Data" (sources)
# Exit code 0 = passed, non-zero = failed
```

### Fetch page for inspection
```bash
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs get /
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs get /agen/cursor-pro/
# Prints HTTP status and response body
```

### Create structural snapshot
```bash
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs snapshot /
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs snapshot /agen/cursor-pro/
# Outputs JSON with structural summary (agent IDs, sections, counts)
# Agent-friendly for evidence capture
```

### Initialize evidence directory
```bash
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs evidence-init
# Creates evidence/run-YYYYMMDD-HHMMSS/ with README
# Prints directory path to stdout for scripting
```

### Full smoke test
```bash
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs smoke
# Runs full verification sequence:
# 1. Build (if needed)
# 2. Start preview
# 3. Wait for ready
# 4. Doctor
# 5. Check home
# 6. Check detail (cursor-pro)
# 7. Create evidence
# 8. Stop server
# Exit code 0 = all passed, non-zero = failures
```

## Gotchas

1. **Astro-generated IDs:** HTML includes `data-astro-cid-*` attributes that change between builds. Do NOT rely on these for selectors — use semantic class names (`agent-card`, `agent-name`, etc.) or element types.

2. **Price formatting:** Prices are formatted with `Intl.NumberFormat` using `id-ID` locale, producing `US$` prefix. Example: `US$20` not `$20` or `USD 20`.

3. **Low-cost agents:** Multiple agents have low `bandLowUsd` values. Sort order is `bandLowUsd` ascending, then by ID alphabetically for ties.

4. **Missing sticker:** Not all agents have `stickerUsd`. Only render sticker price if present. Example: Continue has no sticker, only band.

5. **Bahasa copy:** All user-facing text is in Bahasa Indonesia. Headings like "Yang Termasuk", "Catatan Penting", "Sumber Data". Don't assert English headings.

6. **Route generation:** Astro builds `/agen/[id]/index.html` as directory with index file, not `/agen/[id].html`. URLs end with trailing slash: `/agen/cursor-pro/`.

7. **Sorted by band low:** Home page sorts agents by `bandLowUsd` ascending, then by ID alphabetically for ties. First card should be lowest cost (byteplus-modelark-code at $5), last should be highest (cursor-business at $40).

8. **Dev vs Preview:** Prefer `pnpm preview` (serves built static files from `dist/`) over `pnpm dev` (dynamic server). Preview is what users get in production.

## Feature Map

See [`references/features/`](references/features/) for detailed feature breakdown and CLI-driven verification instructions.

Key features:
- [Home Agent List](references/features/home-agent-list.md) — 11 cost-sorted cards
- [Agent Detail Page](references/features/agent-detail-page.md) — Pricing, includes, caveats (Bahasa)
- [Navigation Flow](references/features/navigation-flow.md) — Home ↔ detail via cards/back links
- [Static Build Routes](references/features/static-build-routes.md) — 12 pre-rendered routes
