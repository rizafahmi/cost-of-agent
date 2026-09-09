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

**Data source:** `src/data/agents.ts` (typed array of 12 agents)

**Key features:**
- Agent cards showing name, vendor, category, billing type, price band
- Sticker price vs. real cost comparison
- Detail pages with includes, caveats, source links, lastVerified dates
- All copy in Bahasa Indonesia

## Launch

### Prerequisites
```bash
# Check dependencies installed
test -d /workspace/node_modules || pnpm install
```

### Build static site
```bash
cd /workspace
pnpm build
# Output: dist/ directory with static HTML
# Exit code 0 = success
```

### Start preview server
```bash
# Find free port (suggest 4323, 4324, or 4325)
PORT=4323
netstat -tuln 2>/dev/null | grep ":$PORT " && echo "Port busy" && exit 1

# Launch preview (binds to 127.0.0.1 for isolation)
pnpm preview --host 127.0.0.1 --port $PORT
# Wait for: "Local    http://127.0.0.1:$PORT/"
```

**Isolation requirement:** Always bind to `127.0.0.1` and explicit port. Never use `0.0.0.0` or wildcard host. Record the PID of the preview process for clean shutdown.

### Tmux session management
```bash
SESSION_NAME="cost-agent-preview"
tmux has-session -t "=$SESSION_NAME" 2>/dev/null || tmux new-session -d -s "$SESSION_NAME" -c "/workspace"
tmux send-keys -t "$SESSION_NAME:0.0" "cd /workspace && pnpm preview --host 127.0.0.1 --port 4323" C-m
# Wait 3 seconds for server startup
sleep 3
tmux capture-pane -t "$SESSION_NAME:0.0" -p | grep "Local"
```

## Doctor

Run these checks after launch, before driving:

### 1. Build artifacts exist
```bash
test -f /workspace/dist/index.html || echo "FAIL: Home page not built"
test -d /workspace/dist/agen || echo "FAIL: Agent detail pages not built"
ls /workspace/dist/agen/ | wc -l  # Should be 12 directories
```

### 2. Server responds
```bash
curl -f -s http://127.0.0.1:4323/ > /dev/null && echo "OK: Home page serves" || echo "FAIL: Server not responding"
curl -f -s http://127.0.0.1:4323/agen/cursor-pro/ > /dev/null && echo "OK: Detail page serves" || echo "FAIL: Detail route broken"
```

### 3. Key content present
```bash
# Home should have title and agent cards
curl -s http://127.0.0.1:4323/ | grep -q "Cost of Agent" && echo "OK: Home title found"
curl -s http://127.0.0.1:4323/ | grep -q "agent-card" && echo "OK: Agent cards rendered"

# Detail should have pricing and sources
curl -s http://127.0.0.1:4323/agen/cursor-pro/ | grep -q "Cursor Pro" && echo "OK: Detail title found"
curl -s http://127.0.0.1:4323/agen/cursor-pro/ | grep -q "Sumber Data" && echo "OK: Sources section present"
```

### 4. Route count matches data
```bash
# Should have 12 agent routes + 1 home = 13 total HTML files
find /workspace/dist -name "index.html" | wc -l  # Should be 13
```

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

// Count agent cards (should be 12)
const cardCount = await page.$$eval('a.agent-card', cards => cards.length);
assert(cardCount === 12);

// Click first card (Continue - lowest bandLowUsd)
const firstCardHref = await page.$eval('a.agent-card', el => el.href);
assert(firstCardHref.includes('/agen/continue/'));
await page.click('a.agent-card');

// Verify detail loaded
await page.waitForSelector('h1');
const detailName = await page.$eval('h1', el => el.textContent);
assert(detailName === 'Continue');

// Screenshot for evidence
await page.screenshot({ path: '/workspace/.cursor/skills/verify-cost-of-agent/evidence/home-to-detail.png' });
```

### Verify home list order
```bash
# Extract agent IDs from href attributes in order
curl -s http://127.0.0.1:4323/ | \
  grep -oP 'href="/agen/\K[^/]+' | \
  head -12
# First should be "continue" (bandLowUsd: 0)
# Last should be "devin" (bandLowUsd: 500)
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
# Stop preview server (use recorded PID or tmux session)
tmux kill-session -t "cost-agent-preview" 2>/dev/null || true

# Verify server stopped
curl -s http://127.0.0.1:4323/ > /dev/null 2>&1 && echo "WARNING: Server still running" || echo "✓ Server stopped"

# Do NOT delete evidence directory
# Do NOT delete dist/ (build artifacts are safe to leave)
```

## Helpers

None required. All checks use standard Unix tools (curl, grep, find, ls) and optional CDP for screenshots.

## Gotchas

1. **Astro-generated IDs:** HTML includes `data-astro-cid-*` attributes that change between builds. Do NOT rely on these for selectors — use semantic class names (`agent-card`, `agent-name`, etc.) or element types.

2. **Price formatting:** Prices are formatted with `Intl.NumberFormat` using `id-ID` locale, producing `US$` prefix. Example: `US$20` not `$20` or `USD 20`.

3. **Zero-cost agents:** Three agents have `bandLowUsd: 0` (Continue, Codeium Free, Cursor Hobby). These render as `US$0` or `US$0 – US$50`. Check for both flat and range display.

4. **Missing sticker:** Not all agents have `stickerUsd`. Only render sticker price if present. Example: Continue has no sticker, only band.

5. **Bahasa copy:** All user-facing text is in Bahasa Indonesia. Headings like "Yang Termasuk", "Catatan Penting", "Sumber Data". Don't assert English headings.

6. **Route generation:** Astro builds `/agen/[id]/index.html` as directory with index file, not `/agen/[id].html`. URLs end with trailing slash: `/agen/cursor-pro/`.

7. **Sorted by band low:** Home page sorts agents by `bandLowUsd` ascending. First card should be lowest cost (Continue at $0), last should be highest (Devin at $500).

8. **Dev vs Preview:** Prefer `pnpm preview` (serves built static files from `dist/`) over `pnpm dev` (dynamic server). Preview is what users get in production.

## Feature Map

See `features/README.md` for detailed feature breakdown and driving instructions.
