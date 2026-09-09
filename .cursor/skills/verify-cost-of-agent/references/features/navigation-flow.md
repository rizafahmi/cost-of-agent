# Navigation Flow

## Sub-features

- **home-to-detail** — Click agent card navigates to `/agen/{id}/` detail page
- **detail-to-home** — Click back link returns to `/` home page
- **url-structure** — Clean routes: `/` (home), `/agen/{id}/` (detail with trailing slash)
- **history-preservation** — Browser back/forward buttons work (full page navigation)
- **link-target** — Cards link to correct agent detail (ID in href matches agent data)
- **deep-linking** — Direct URL access works (e.g., bookmark `/agen/cursor-pro/`)
- **404-handling** — Invalid agent ID returns 404 (e.g., `/agen/nonexistent/`)

## How to get to it (user POV)

### Home → Detail

1. Start at `http://127.0.0.1:4323/`
2. Click any agent card (e.g., "Cursor Pro")
3. URL changes to `http://127.0.0.1:4323/agen/cursor-pro/`
4. See detail page for that agent

### Detail → Home

1. From detail page, click "← Kembali ke daftar" link (top or bottom)
2. URL changes back to `http://127.0.0.1:4323/`
3. See home page with all agent cards

### Browser Navigation

1. From detail, click browser back button → returns to home
2. Click browser forward button → returns to detail

### Direct Access

1. Enter `http://127.0.0.1:4323/agen/cursor-pro/` directly in address bar
2. See detail page immediately (no home page visit needed)

## Driving it with control-cost-of-agent

### Start preview server

```bash
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs preview
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs wait-ready
```

### Verify home page accessible

```bash
# Check home responds
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs get /
```

Should return status 200 and HTML content.

### Verify detail pages accessible

```bash
# Check cursor-pro detail responds
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs get /agen/cursor-pro/

# Check multiple detail pages
for agent_id in continue github-copilot-individual devin; do
  echo "Testing /agen/$agent_id/..."
  node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs get /agen/$agent_id/ > /dev/null && \
    echo "  ✓ Accessible" || echo "  ✗ 404"
done
```

### Check all detail routes exist

```bash
# Extract agent IDs from home, verify each has detail route
for agent_id in $(node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs order); do
  node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs get /agen/$agent_id/ > /dev/null && \
    echo "✓ /agen/$agent_id/" || echo "✗ Missing: /agen/$agent_id/"
done
```

### Verify home links to details

```bash
# Get home HTML and check for detail links
HOME_HTML=$(node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs get /)
echo "$HOME_HTML" | grep -q 'href="/agen/cursor-pro/"' && \
  echo "✓ Home links to cursor-pro" || echo "✗ Link missing"
```

Or use order command to verify all hrefs:
```bash
# Order command extracts hrefs, verifies all 12 agent links present
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs order
# Output: 12 agent IDs means 12 working links
```

### Verify detail links back to home

```bash
# Get detail HTML and check for back link
DETAIL_HTML=$(node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs get /agen/cursor-pro/)
echo "$DETAIL_HTML" | grep -q 'href="/"' && \
  echo "✓ Detail has back link" || echo "✗ Back link missing"

echo "$DETAIL_HTML" | grep -q "← Kembali ke daftar" && \
  echo "✓ Back link text correct (Bahasa)" || echo "✗ Back link text wrong"
```

### Verify invalid route returns error

```bash
# Try to fetch nonexistent agent
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs get /agen/nonexistent/ 2>&1 | grep -q "Request failed" && \
  echo "✓ Invalid agent returns error" || echo "✗ Invalid agent did not error"
```

### Full navigation validation

```bash
# Full smoke test includes navigation checks
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs smoke
```

Smoke test verifies:
- Home page loads
- Detail pages load (cursor-pro spot-checked)
- Order extraction (validates hrefs)
- Check-home (validates card links)
- Check-detail (validates back links implicitly by page load)

### Cleanup

```bash
# Stop preview server
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs stop
```

## Gotchas

1. **Trailing slash requirement:** Astro static routes require trailing slash. `/agen/cursor-pro` may redirect to `/agen/cursor-pro/`. Some browsers auto-add, others don't. Always test with trailing slash.

2. **Full page navigation:** This is a static site, not SPA. Each navigation is full page load, not client-side routing. No JavaScript routing to test.

3. **Multiple back links:** Detail pages have back link at top AND bottom (footer). Either can be used. Both link to `/` home.

4. **Card click area:** Entire card is clickable (card is an `<a>` tag), not just agent name. Clicking anywhere on card navigates.

5. **Hover states:** Cards have `:hover` effect (lift and shadow). CSS-only, no JavaScript. Testing hover requires browser automation, not CLI.

6. **No client-side JS:** Site has minimal/no JavaScript for routing. All navigation is traditional HTML links + browser history. No hydration or app mounting to wait for.

7. **404 pages:** Invalid routes like `/agen/nonexistent/` serve Astro's default 404. In preview mode, may return 404 status or redirect. Test with CLI `get` command — will show error.

8. **External links:** Source links on detail pages have `target="_blank"`. These open new tabs, don't navigate away. Not part of navigation flow testing.

9. **Anchor links:** No intra-page anchors (no `#includes` or `#caveats` fragment identifiers). All navigation is full page. Can't test scroll-to-section.

10. **URL case sensitivity:** Agent IDs are lowercase with hyphens (e.g., `github-copilot-individual`). URLs are case-sensitive. `/agen/GitHub-Copilot-Individual/` will 404.

11. **Route validation:** The `order` command validates all home→detail links exist by extracting hrefs. If order returns 12 IDs, all navigation paths are present.

12. **Deep link validation:** The `check-detail` command validates each detail route can be accessed directly (deep linking works).
