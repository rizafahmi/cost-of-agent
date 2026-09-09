# Feature: Home Agent List

## Sub-features

1. **Agent cards display** — All 12 agents render as individual cards
2. **Sorting by cost** — Cards sorted by `bandLowUsd` ascending (lowest first)
3. **Card content** — Each card shows name, vendor, category, billing type, price band
4. **Sticker vs. band** — Sticker price shown when present, struck through
5. **Price formatting** — Bahasa locale with `US$` prefix (e.g., `US$20`)
6. **Category badges** — Color-coded badges for IDE/CLI/Cloud/OSS-BYOK
7. **Billing badges** — Type indicators (Seat/Token/Credits/Hybrid)
8. **Card links** — Each card links to `/agen/[id]/` detail page
9. **Visual hierarchy** — Clear layout with header, grid, footer

## How to get to it (user POV)

1. Open browser to `http://127.0.0.1:4323/`
2. See heading "💰 Cost of Agent"
3. See subtitle explaining directory purpose (Bahasa)
4. Scroll to see grid of agent cards
5. First card should be lowest cost (Continue at $0)
6. Last card should be highest cost (Devin at $500)
7. Each card shows pricing and metadata badges
8. Hover over card to see lift effect

## Driving it with browser/curl

### Curl checks (static HTML)

```bash
BASE_URL="http://127.0.0.1:4323"
HOME_HTML=$(curl -s "$BASE_URL/")

# 1. Check page title
echo "$HOME_HTML" | grep -q "Cost of Agent" && echo "✓ Title present" || echo "✗ Title missing"

# 2. Check subtitle (Bahasa)
echo "$HOME_HTML" | grep -q "Direktori biaya nyata" && echo "✓ Subtitle present" || echo "✗ Subtitle missing"

# 3. Count agent cards (should be 12)
CARD_COUNT=$(echo "$HOME_HTML" | grep -o 'class="agent-card"' | wc -l)
[ "$CARD_COUNT" -eq 12 ] && echo "✓ 12 cards rendered" || echo "✗ Found $CARD_COUNT cards"

# 4. Extract agent IDs in order
AGENT_IDS=$(echo "$HOME_HTML" | grep -oP 'href="/agen/\K[^/]+' | head -12)
echo "Agent order:"
echo "$AGENT_IDS"

# 5. Verify first is lowest cost (continue)
FIRST_ID=$(echo "$AGENT_IDS" | head -1)
[ "$FIRST_ID" = "continue" ] && echo "✓ First agent is Continue (lowest cost)" || echo "✗ First is $FIRST_ID"

# 6. Verify last is highest cost (devin)
LAST_ID=$(echo "$AGENT_IDS" | tail -1)
[ "$LAST_ID" = "devin" ] && echo "✓ Last agent is Devin (highest cost)" || echo "✗ Last is $LAST_ID"

# 7. Check for category badges
echo "$HOME_HTML" | grep -q "badge-category" && echo "✓ Category badges present" || echo "✗ No category badges"

# 8. Check for billing badges
echo "$HOME_HTML" | grep -q "badge-billing" && echo "✓ Billing badges present" || echo "✗ No billing badges"

# 9. Check for price bands
echo "$HOME_HTML" | grep -q "price-band" && echo "✓ Price bands present" || echo "✗ No price bands"

# 10. Check for sticker prices (some agents have these)
echo "$HOME_HTML" | grep -q "price-sticker" && echo "✓ Sticker prices present" || echo "✗ No sticker prices"
```

### Browser automation (CDP/Puppeteer)

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:4323/');

  // 1. Check title
  const title = await page.$eval('h1', el => el.textContent);
  console.assert(title.includes('Cost of Agent'), `Title mismatch: ${title}`);

  // 2. Count cards
  const cards = await page.$$('a.agent-card');
  console.assert(cards.length === 12, `Expected 12 cards, got ${cards.length}`);

  // 3. Get first card details
  const firstCard = await page.$eval('a.agent-card', el => ({
    name: el.querySelector('.agent-name').textContent,
    vendor: el.querySelector('.agent-vendor').textContent,
    href: el.getAttribute('href')
  }));
  console.log('First card:', firstCard);
  console.assert(firstCard.name === 'Continue', `First card should be Continue, got ${firstCard.name}`);

  // 4. Get last card details
  const lastCard = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('a.agent-card'));
    const last = cards[cards.length - 1];
    return {
      name: last.querySelector('.agent-name').textContent,
      vendor: last.querySelector('.agent-vendor').textContent,
      href: last.getAttribute('href')
    };
  });
  console.log('Last card:', lastCard);
  console.assert(lastCard.name === 'Devin', `Last card should be Devin, got ${lastCard.name}`);

  // 5. Verify all cards have required elements
  const cardsData = await page.$$eval('a.agent-card', cards => {
    return cards.map(card => ({
      hasName: !!card.querySelector('.agent-name'),
      hasVendor: !!card.querySelector('.agent-vendor'),
      hasCategory: !!card.querySelector('.badge-category'),
      hasBilling: !!card.querySelector('.badge-billing'),
      hasPriceBand: !!card.querySelector('.price-band')
    }));
  });
  
  const allValid = cardsData.every(card => 
    card.hasName && card.hasVendor && card.hasCategory && card.hasBilling && card.hasPriceBand
  );
  console.assert(allValid, 'Some cards missing required elements');

  // 6. Screenshot for evidence
  await page.screenshot({ 
    path: '/workspace/.cursor/skills/verify-cost-of-agent/evidence/home-agent-list.png',
    fullPage: true 
  });

  await browser.close();
  console.log('✓ All home agent list checks passed');
})();
```

## Gotchas

1. **Astro dynamic IDs:** HTML contains `data-astro-cid-*` attributes that change between builds. Use class names like `agent-card`, `agent-name` instead.

2. **Bahasa locale formatting:** Prices use Indonesian locale but USD currency, producing `US$20` not `$20`. Don't assert American formatting.

3. **Zero-cost agents:** Three agents have `bandLowUsd: 0` (Continue, Codeium Free, Cursor Hobby). These display as `US$0` or `US$0 – US$50` (range). First agent (Continue) is in this group.

4. **Sticker price optional:** Not all agents show sticker price. Only 7 of 12 have `stickerUsd` defined. Continue (first card) has no sticker — it only shows band.

5. **Flat vs. range prices:** Some agents have identical low/high (e.g., GitHub Copilot Individual: `US$10`). Others show range (e.g., Cursor Pro: `US$20 – US$60`). DOM structure differs slightly for each.

6. **Card order stability:** Sort is deterministic (by `bandLowUsd` then insertion order). Agents with same bandLowUsd (e.g., three at $0) maintain data file order: Continue, Codeium Free, Cursor Hobby.

7. **Grid responsiveness:** Desktop shows 3-column grid (min 320px cards). Mobile switches to single column. Test both if capturing screenshots.

8. **Footer GitHub link:** Footer has placeholder link `https://github.com/yourusername/cost-of-agent`. This is expected in current state.
