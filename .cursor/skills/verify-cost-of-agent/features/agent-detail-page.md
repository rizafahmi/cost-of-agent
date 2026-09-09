# Feature: Agent Detail Page

## Sub-features

1. **Page routing** — Each agent has `/agen/[id]/` route generated at build
2. **Header section** — Name, vendor, category/billing badges
3. **Pricing comparison** — Sticker vs. real cost side-by-side (when sticker exists)
4. **Price explainer** — Bahasa explanation of why sticker ≠ real cost
5. **Includes list** — "Yang Termasuk" section with checkmark bullets
6. **Caveats list** — "Catatan Penting" section with warning bullets
7. **Sources section** — "Sumber Data" with clickable source links
8. **Source metadata** — Each source shows label, URL, checkedAt date
9. **Last verified** — `lastVerified` date displayed at bottom of sources
10. **Back navigation** — "← Kembali ke daftar" link to home (top and bottom)

## How to get to it (user POV)

1. From home page, click any agent card
2. Browser navigates to `/agen/{id}/` (e.g., `/agen/cursor-pro/`)
3. See agent name as H1 heading
4. See vendor name below heading
5. See category and billing badges
6. See pricing comparison section (sticker vs. real if sticker exists)
7. Scroll down to see "Yang Termasuk" (includes)
8. Scroll to see "Catatan Penting" (caveats)
9. Scroll to see "Sumber Data" (sources) with clickable links
10. Click "← Kembali ke daftar" to return home

## Driving it with browser/curl

### Curl checks (static HTML)

```bash
BASE_URL="http://127.0.0.1:4323"
AGENT_ID="cursor-pro"
DETAIL_URL="$BASE_URL/agen/$AGENT_ID/"
DETAIL_HTML=$(curl -s "$DETAIL_URL")

# 1. Check page loads
[ -n "$DETAIL_HTML" ] && echo "✓ Detail page loads" || echo "✗ Page failed to load"

# 2. Check H1 contains agent name
echo "$DETAIL_HTML" | grep -q "<h1[^>]*>Cursor Pro</h1>" && echo "✓ H1 present" || echo "✗ H1 missing"

# 3. Check vendor
echo "$DETAIL_HTML" | grep -q "Cursor</div>" && echo "✓ Vendor present" || echo "✗ Vendor missing"

# 4. Check category badge
echo "$DETAIL_HTML" | grep -q "badge-category" && echo "✓ Category badge present" || echo "✗ Category badge missing"

# 5. Check billing badge
echo "$DETAIL_HTML" | grep -q "badge-billing" && echo "✓ Billing badge present" || echo "✗ Billing badge missing"

# 6. Check pricing section exists
echo "$DETAIL_HTML" | grep -q "pricing-section" && echo "✓ Pricing section present" || echo "✗ Pricing section missing"

# 7. Check for sticker price (cursor-pro has one)
echo "$DETAIL_HTML" | grep -q "Harga Sticker" && echo "✓ Sticker price shown" || echo "✗ Sticker price missing"

# 8. Check for real cost band
echo "$DETAIL_HTML" | grep -q "Biaya Nyata" && echo "✓ Real cost shown" || echo "✗ Real cost missing"

# 9. Check for price explainer (only if sticker > band)
echo "$DETAIL_HTML" | grep -q "Kenapa beda?" && echo "✓ Price explainer present" || echo "✗ Price explainer missing"

# 10. Check "Yang Termasuk" heading
echo "$DETAIL_HTML" | grep -q "Yang Termasuk" && echo "✓ Includes heading present" || echo "✗ Includes heading missing"

# 11. Check includes list items (should have 4 for cursor-pro)
INCLUDES_COUNT=$(echo "$DETAIL_HTML" | grep -A 20 "Yang Termasuk" | grep -c "<li")
echo "Includes count: $INCLUDES_COUNT (expected ~4)"

# 12. Check "Catatan Penting" heading
echo "$DETAIL_HTML" | grep -q "Catatan Penting" && echo "✓ Caveats heading present" || echo "✗ Caveats heading missing"

# 13. Check caveats list items (should have 3 for cursor-pro)
CAVEATS_COUNT=$(echo "$DETAIL_HTML" | grep -A 20 "Catatan Penting" | grep -c "<li")
echo "Caveats count: $CAVEATS_COUNT (expected ~3)"

# 14. Check "Sumber Data" heading
echo "$DETAIL_HTML" | grep -q "Sumber Data" && echo "✓ Sources heading present" || echo "✗ Sources heading missing"

# 15. Check for source link (cursor-pro has cursor.com/pricing)
echo "$DETAIL_HTML" | grep -q "cursor.com/pricing" && echo "✓ Source link present" || echo "✗ Source link missing"

# 16. Check for checkedAt date
echo "$DETAIL_HTML" | grep -q "Dicek: 2026-09-09" && echo "✓ CheckedAt date present" || echo "✗ CheckedAt date missing"

# 17. Check for lastVerified date
echo "$DETAIL_HTML" | grep -q "Terakhir diverifikasi: 2026-09-09" && echo "✓ LastVerified present" || echo "✗ LastVerified missing"

# 18. Check back link (top)
echo "$DETAIL_HTML" | grep -q "← Kembali ke daftar" && echo "✓ Back link present" || echo "✗ Back link missing"

# 19. Check specific prices for cursor-pro
echo "$DETAIL_HTML" | grep -q "US\$20" && echo "✓ Sticker price US$20 found"
echo "$DETAIL_HTML" | grep -q "US\$60" && echo "✓ Band high US$60 found"
```

### Browser automation (CDP/Puppeteer)

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const agentId = 'cursor-pro';
  await page.goto(`http://127.0.0.1:4323/agen/${agentId}/`);

  // 1. Check H1
  const h1 = await page.$eval('h1', el => el.textContent);
  console.assert(h1 === 'Cursor Pro', `H1 mismatch: ${h1}`);

  // 2. Check vendor
  const vendor = await page.$eval('.vendor', el => el.textContent);
  console.assert(vendor === 'Cursor', `Vendor mismatch: ${vendor}`);

  // 3. Check badges
  const badges = await page.$$eval('.badge', els => els.map(el => el.textContent));
  console.log('Badges:', badges);
  console.assert(badges.includes('IDE'), 'Missing category badge');
  console.assert(badges.includes('Hybrid'), 'Missing billing badge');

  // 4. Check pricing section
  const hasPricingSection = await page.$('.pricing-section') !== null;
  console.assert(hasPricingSection, 'Missing pricing section');

  // 5. Check sticker price
  const stickerPrice = await page.$eval('.price-sticker', el => el.textContent);
  console.log('Sticker price:', stickerPrice);
  console.assert(stickerPrice.includes('US$20'), `Sticker price mismatch: ${stickerPrice}`);

  // 6. Check band price
  const bandPrice = await page.$eval('.price-band', el => el.textContent.trim());
  console.log('Band price:', bandPrice);
  console.assert(bandPrice.includes('US$20'), 'Band low missing');
  console.assert(bandPrice.includes('US$60'), 'Band high missing');

  // 7. Check price explainer (should exist because sticker < bandHigh)
  const hasExplainer = await page.$('.price-explainer') !== null;
  console.assert(hasExplainer, 'Missing price explainer');

  // 8. Check includes section
  const includesHeading = await page.$$eval('h2', els => 
    els.find(el => el.textContent === 'Yang Termasuk')
  );
  console.assert(includesHeading, 'Missing includes heading');

  const includesItems = await page.$$eval('section:first-of-type ul li', els => 
    els.map(el => el.textContent)
  );
  console.log('Includes:', includesItems);
  console.assert(includesItems.length === 4, `Expected 4 includes, got ${includesItems.length}`);

  // 9. Check caveats section
  const caveatsHeading = await page.$$eval('h2', els => 
    els.find(el => el.textContent === 'Catatan Penting')
  );
  console.assert(caveatsHeading, 'Missing caveats heading');

  const caveatsItems = await page.$$eval('section.caveats ul li', els => 
    els.map(el => el.textContent)
  );
  console.log('Caveats:', caveatsItems);
  console.assert(caveatsItems.length === 3, `Expected 3 caveats, got ${caveatsItems.length}`);

  // 10. Check sources section
  const sourcesHeading = await page.$$eval('h2', els => 
    els.find(el => el.textContent === 'Sumber Data')
  );
  console.assert(sourcesHeading, 'Missing sources heading');

  const sourceLinks = await page.$$eval('.source-link', els => 
    els.map(el => ({
      href: el.href,
      text: el.textContent.trim()
    }))
  );
  console.log('Sources:', sourceLinks);
  console.assert(sourceLinks.length === 1, `Expected 1 source, got ${sourceLinks.length}`);
  console.assert(sourceLinks[0].href.includes('cursor.com/pricing'), 'Source link incorrect');

  // 11. Check lastVerified
  const lastVerified = await page.$eval('.sources p', el => el.textContent);
  console.log('Last verified:', lastVerified);
  console.assert(lastVerified.includes('2026-09-09'), 'Last verified date incorrect');

  // 12. Check back link
  const backLinks = await page.$$eval('a.back-link', els => els.length);
  console.assert(backLinks >= 1, 'Missing back link');

  // 13. Screenshot for evidence
  await page.screenshot({ 
    path: '/workspace/.cursor/skills/verify-cost-of-agent/evidence/agent-detail-cursor-pro.png',
    fullPage: true 
  });

  await browser.close();
  console.log('✓ All agent detail checks passed');
})();
```

## Gotchas

1. **Price explainer conditional:** The "Kenapa beda?" explanation only appears when `stickerUsd` exists AND `bandHighUsd > stickerUsd`. Not all details have this.

2. **No sticker agents:** Continue, Aider, Claude Code CLI have no `stickerUsd`. Detail page doesn't show "Harga Sticker" section for these. Only "Biaya Nyata" appears.

3. **Flat price agents:** GitHub Copilot Individual, GitHub Copilot Business, Codeium Free, Cursor Hobby, ChatGPT Plus, Devin have `bandLowUsd === bandHighUsd`. These show single price, not range.

4. **Multiple sources:** Some agents have multiple source objects. Each renders as separate `.source-link`. Most have 1, Aider has 2.

5. **Bahasa-only copy:** All headings and labels are in Bahasa. English assertions will fail. Use "Yang Termasuk" not "Includes", "Catatan Penting" not "Caveats".

6. **Checkmark/warning bullets:** CSS pseudo-elements add ✓ before includes items, ⚠ before caveats items. These are not in HTML text content.

7. **Route trailing slash:** Astro generates `/agen/[id]/index.html`. URLs must end with `/` or will 404. Example: `/agen/cursor-pro/` works, `/agen/cursor-pro` does not.

8. **Source checkedAt format:** Dates are YYYY-MM-DD strings. Display format is "Dicek: 2026-09-09" (Bahasa "checked at").

9. **lastVerified placement:** Appears at bottom of sources section, not in sources array. Separate field on agent object.

10. **External link attributes:** Source links have `target="_blank" rel="noopener noreferrer"` for security. Should open in new tab.
