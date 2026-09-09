# Agent Detail Page

## Sub-features

- **page-routing** — Each agent has `/agen/{id}/` route generated at build time
- **header-section** — Agent name (h1), vendor, category/billing badges
- **pricing-comparison** — Sticker vs. real cost side-by-side (when sticker exists)
- **price-explainer** — Bahasa explanation of why sticker ≠ real cost (when relevant)
- **includes-list** — "Yang Termasuk" section with checkmark bullets
- **caveats-list** — "Catatan Penting" section with warning bullets
- **sources-section** — "Sumber Data" with clickable source links
- **source-metadata** — Each source shows label, URL, "Dicek: YYYY-MM-DD"
- **last-verified** — "Terakhir diverifikasi: YYYY-MM-DD" at bottom of sources
- **back-navigation** — "← Kembali ke daftar" link to home (appears top and bottom)

## How to get to it (user POV)

1. From home page, click any agent card
2. Browser navigates to `/agen/{id}/` (e.g., `/agen/cursor-pro/`)
3. See agent name as H1 heading
4. See vendor name below heading
5. See category and billing badges
6. See pricing comparison section (sticker vs. real if sticker exists)
7. Scroll down to "Yang Termasuk" (includes) with ✓ bullets
8. Scroll to "Catatan Penting" (caveats) with ⚠ bullets
9. Scroll to "Sumber Data" (sources) with clickable links
10. Click "← Kembali ke daftar" to return home

## Driving it with control-cost-of-agent

### Start preview server

```bash
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs preview
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs wait-ready
```

### Verify detail page structure

```bash
# Check specific agent detail page
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs check-detail cursor-pro
```

Expected output:
```
✓ Agent name heading (h1)
✓ Includes section (Yang Termasuk)
✓ Caveats section (Catatan Penting)
✓ Sources section (Sumber Data)
```

Test multiple agents:
```bash
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs check-detail continue
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs check-detail github-copilot-individual
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs check-detail devin
```

### Get structural snapshot (JSON)

```bash
# Dump detail page structure as JSON
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs snapshot /agen/cursor-pro/
```

Expected structure:
```json
{
  "url": "http://127.0.0.1:4323/agen/cursor-pro/",
  "statusCode": 200,
  "timestamp": "2026-09-09T23:10:41.428Z",
  "structure": {
    "type": "detail",
    "agentName": "Cursor Pro",
    "hasIncludes": true,
    "hasCaveats": true,
    "hasSources": true
  }
}
```

### Inspect raw HTML

```bash
# Fetch detail page HTML
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs get /agen/cursor-pro/
```

Pipe to grep for specific checks:
```bash
# Check for Bahasa headings
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs get /agen/cursor-pro/ | grep "Yang Termasuk"
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs get /agen/cursor-pro/ | grep "Catatan Penting"
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs get /agen/cursor-pro/ | grep "Sumber Data"

# Check for source link
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs get /agen/cursor-pro/ | grep "cursor.com/pricing"
```

### Full diagnostic

```bash
# Comprehensive checks (includes detail page spot-check)
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs doctor
```

Doctor checks cursor-pro detail as representative sample.

### Verify all detail routes exist

```bash
# Extract agent IDs from home, check each detail route
for agent_id in $(node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs order); do
  echo "Checking /agen/$agent_id/..."
  node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs check-detail "$agent_id"
done
```

### Cleanup

```bash
# Stop preview server
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs stop
```

## Gotchas

1. **Price explainer conditional:** The "Kenapa beda?" explanation only appears when `stickerUsd` exists AND `bandHighUsd > stickerUsd`. Not all details have this section.

2. **No sticker agents:** Continue, Aider, Claude Code CLI have no `stickerUsd`. Detail page doesn't show "Harga Sticker" section for these. Only "Biaya Nyata" appears.

3. **Flat price agents:** GitHub Copilot Individual, GitHub Copilot Business, Codeium Free, Cursor Hobby, ChatGPT Plus, Devin have `bandLowUsd === bandHighUsd`. These show single price, not range.

4. **Multiple sources:** Some agents have multiple source objects. Each renders as separate `.source-link`. Most have 1 source, Aider has 2.

5. **Bahasa-only copy:** All headings and labels are in Bahasa Indonesia. English assertions will fail. Use "Yang Termasuk" not "Includes", "Catatan Penting" not "Caveats", "Sumber Data" not "Sources".

6. **Checkmark/warning bullets:** CSS pseudo-elements add ✓ before includes items, ⚠ before caveats items. These are visual only — not in HTML text content.

7. **Route trailing slash:** Astro generates `/agen/[id]/index.html`. URLs must end with `/` or may 404 or redirect. Example: `/agen/cursor-pro/` works, `/agen/cursor-pro` may not.

8. **Source checkedAt format:** Dates are YYYY-MM-DD strings from data file. Display format is "Dicek: 2026-09-09" (Bahasa "checked at").

9. **lastVerified placement:** Appears at bottom of sources section as separate paragraph, not in sources array. Independent field on agent object.

10. **External link attributes:** Source links have `target="_blank" rel="noopener noreferrer"` for security. Open in new tab, don't navigate away.

11. **Selector stability:** Use semantic class names from SKILL.md: `h1` (agent name), `.vendor`, `.badge-category`, `.badge-billing`, `.price-band`, section headings by text content ("Yang Termasuk", etc.), `.source-link`, `a.back-link`.

12. **Two back links:** Detail pages have back link at top AND bottom (footer). Either works. Count should be 2 per page.
