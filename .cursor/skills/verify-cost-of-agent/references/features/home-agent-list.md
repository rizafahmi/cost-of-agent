# Home Agent List

## Sub-features

- **agent-cards-display** — All 9 agents render as individual clickable cards
- **cost-based-sorting** — Cards sorted by `bandLowUsd` ascending (lowest first: muse-code→cursor-business)
- **card-content** — Each card shows name, vendor, category badge, billing badge, price band
- **sticker-vs-band** — Sticker price shown when present, struck through to emphasize real cost
- **price-formatting** — Bahasa locale with `US$` prefix (e.g., `US$20` not `$20`)
- **category-badges** — Color-coded badges: IDE, CLI, Cloud, OSS-BYOK
- **billing-badges** — Type indicators: Seat, Token, Credits, Hybrid
- **card-links** — Each card links to `/agen/[id]/` detail page
- **visual-hierarchy** — Clear layout: header, subtitle (Bahasa), grid, footer

## How to get to it (user POV)

1. Open browser to `http://127.0.0.1:4323/`
2. See heading "💰 Cost of Agent"
3. See subtitle explaining directory purpose (Bahasa: "Direktori biaya nyata...")
4. Scroll to see grid of agent cards (3-column desktop, 1-column mobile)
5. First card: Muse Code ($5 - lowest cost)
6. Last card: Cursor Teams Standard ($40 - highest cost)
7. Each card shows pricing and metadata badges
8. Hover over card to see lift effect

## Driving it with control-cost-of-agent

### Start preview server

```bash
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs preview
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs wait-ready
```

### Verify home page structure

```bash
# Check agent count, sort order (first=muse-code, last=cursor-business)
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs check-home
```

Expected output:
```
✓ Agent count: 9 (reasonable range)
✓ First agent: muse-code (lowest cost)
✓ Last agent: cursor-business (highest cost)
```

### Extract agent display order

```bash
# Get all agent IDs in display order (one per line)
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs order
```

Expected output (12 lines):
```
continue
codeium-free
cursor-hobby
aider
github-copilot-individual
claude-code-cli
windsurf-pro
github-copilot-business
cursor-pro
openai-chatgpt-plus
cursor-business
devin
```

### Get structural snapshot (JSON)

```bash
# Dump home page structure as JSON
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs snapshot /
```

Expected structure:
```json
{
  "url": "http://127.0.0.1:4323/",
  "statusCode": 200,
  "timestamp": "2026-09-09T23:10:41.428Z",
  "structure": {
    "type": "home",
    "agentCardCount": 12,
    "agentIds": ["continue", "codeium-free", ...],
    "hasTitle": true,
    "hasBahasaCopy": true
  }
}
```

### Inspect raw HTML

```bash
# Fetch home page HTML
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs get /
```

### Full diagnostic

```bash
# Comprehensive checks (includes home page validation)
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs doctor
```

Doctor checks relevant to home page:
- Build artifacts (dist/index.html exists)
- Server responds (home page 200)
- Key content (title, agent-card class)
- Route count (10 total: 1 home + 9 agents)

### Cleanup

```bash
# Stop preview server
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs stop
```

## Gotchas

1. **Astro dynamic IDs:** HTML contains `data-astro-cid-*` attributes that change between builds. Use stable class names like `agent-card`, `agent-name` for selectors, not Astro's generated IDs.

2. **Bahasa locale formatting:** Prices use Indonesian locale but USD currency, producing `US$20` not `$20` or `USD 20`. Don't assert American formatting patterns.

3. **Zero-cost agents:** Three agents have `bandLowUsd: 0` (Continue, Codeium Free, Cursor Hobby). These display as `US$0` or `US$0 – US$50` (range). Continue is first due to sort order.

4. **Sticker price optional:** Not all agents show sticker price. Only 7 of 12 have `stickerUsd` defined. Continue (first card) has no sticker — shows only band.

5. **Flat vs. range prices:** Some agents have identical low/high band (e.g., GitHub Copilot Individual: `US$10`). Others show range (e.g., Cursor Pro: `US$20 – US$60`). DOM structure differs.

6. **Card order stability:** Sort is deterministic: by `bandLowUsd` ascending, then data file insertion order as tiebreaker. Agents with same cost (e.g., three at $0) maintain file order: Continue, Codeium Free, Cursor Hobby.

7. **Grid responsiveness:** Desktop shows 3-column grid (min 320px cards). Mobile switches to single column. Test both viewports if capturing screenshots.

8. **Footer placeholder:** Footer has placeholder GitHub link `https://github.com/yourusername/cost-of-agent`. This is expected in current state.

9. **Selector stability:** Use semantic class names from SKILL.md: `a.agent-card`, `h2.agent-name`, `.agent-vendor`, `.price-band`, `.badge-category`, `.badge-billing`. Avoid element-only selectors.

10. **Agent count assertion:** The CLI `check-home` asserts "reasonable range" (10-15 agents). Exact count 9 verified in `order` command output line count.
