# Feature: Navigation Flow

## Sub-features

1. **Home to detail** — Click agent card navigates to detail page
2. **Detail to home** — Click back link returns to home
3. **URL structure** — Clean routes `/` and `/agen/{id}/`
4. **History preservation** — Browser back button works
5. **Link target** — Cards link to correct agent detail (ID match)
6. **Deep linking** — Direct URL access works (e.g., bookmark `/agen/cursor-pro/`)
7. **404 handling** — Invalid agent ID returns 404 (e.g., `/agen/nonexistent/`)

## How to get to it (user POV)

1. **Home → Detail:**
   - Start at `http://127.0.0.1:4323/`
   - Click any agent card (e.g., "Cursor Pro")
   - URL changes to `http://127.0.0.1:4323/agen/cursor-pro/`
   - See detail page for that agent

2. **Detail → Home:**
   - From detail page, click "← Kembali ke daftar" link (top or bottom)
   - URL changes back to `http://127.0.0.1:4323/`
   - See home page with all agent cards

3. **Browser navigation:**
   - From detail, click browser back button
   - Returns to home page
   - Click browser forward button
   - Returns to detail page

4. **Direct access:**
   - Enter `http://127.0.0.1:4323/agen/cursor-pro/` directly in address bar
   - See detail page immediately (no home page visit needed)

## Driving it with browser/curl

### Curl checks (static files)

```bash
BASE_URL="http://127.0.0.1:4323"

# 1. Check home page loads
curl -f -s "$BASE_URL/" > /dev/null && echo "✓ Home page accessible" || echo "✗ Home page 404"

# 2. Check detail pages load (test 3 samples)
for agent_id in cursor-pro github-copilot-individual continue; do
  curl -f -s "$BASE_URL/agen/$agent_id/" > /dev/null && \
    echo "✓ Detail page /agen/$agent_id/ accessible" || \
    echo "✗ Detail page /agen/$agent_id/ 404"
done

# 3. Check all 12 detail routes exist
for agent_id in cursor-pro github-copilot-individual github-copilot-business windsurf-pro \
                claude-code-cli aider continue devin cursor-business codeium-free \
                cursor-hobby openai-chatgpt-plus; do
  curl -f -s "$BASE_URL/agen/$agent_id/" > /dev/null || echo "✗ Missing: /agen/$agent_id/"
done

# 4. Verify home has link to detail
HOME_HTML=$(curl -s "$BASE_URL/")
echo "$HOME_HTML" | grep -q 'href="/agen/cursor-pro/"' && \
  echo "✓ Home links to cursor-pro detail" || \
  echo "✗ Home missing link to cursor-pro"

# 5. Verify detail has back link
DETAIL_HTML=$(curl -s "$BASE_URL/agen/cursor-pro/")
echo "$DETAIL_HTML" | grep -q 'href="/"' && \
  echo "✓ Detail has back link to home" || \
  echo "✗ Detail missing back link"

# 6. Check back link text (Bahasa)
echo "$DETAIL_HTML" | grep -q "← Kembali ke daftar" && \
  echo "✓ Back link has correct text" || \
  echo "✗ Back link text incorrect"

# 7. Test invalid agent ID (should 404)
curl -f -s "$BASE_URL/agen/nonexistent/" > /dev/null 2>&1
[ $? -ne 0 ] && echo "✓ Invalid agent ID returns 404" || echo "✗ Invalid ID did not 404"
```

### Browser automation (CDP/Puppeteer)

```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  const baseUrl = 'http://127.0.0.1:4323';

  // 1. Start at home
  await page.goto(baseUrl);
  let currentUrl = page.url();
  console.assert(currentUrl === `${baseUrl}/`, `Expected home URL, got ${currentUrl}`);
  
  const title = await page.$eval('h1', el => el.textContent);
  console.assert(title.includes('Cost of Agent'), 'Not on home page');

  // 2. Click first agent card (Continue)
  const firstCardHref = await page.$eval('a.agent-card', el => el.getAttribute('href'));
  console.log('First card href:', firstCardHref);
  console.assert(firstCardHref === '/agen/continue/', `Unexpected href: ${firstCardHref}`);

  await page.click('a.agent-card');
  await page.waitForNavigation();

  // 3. Verify on detail page
  currentUrl = page.url();
  console.log('After click, URL:', currentUrl);
  console.assert(currentUrl === `${baseUrl}/agen/continue/`, `Expected detail URL, got ${currentUrl}`);

  const detailTitle = await page.$eval('h1', el => el.textContent);
  console.assert(detailTitle === 'Continue', `Expected Continue, got ${detailTitle}`);

  // 4. Click back link
  await page.click('a.back-link');
  await page.waitForNavigation();

  // 5. Verify back on home
  currentUrl = page.url();
  console.assert(currentUrl === `${baseUrl}/`, `Expected home URL after back, got ${currentUrl}`);

  const homeTitle = await page.$eval('h1', el => el.textContent);
  console.assert(homeTitle.includes('Cost of Agent'), 'Not on home page after back link');

  // 6. Test browser back/forward
  await page.click('a.agent-card:nth-of-type(2)'); // Click second card
  await page.waitForNavigation();
  
  await page.goBack();
  currentUrl = page.url();
  console.assert(currentUrl === `${baseUrl}/`, `Browser back failed, got ${currentUrl}`);

  await page.goForward();
  currentUrl = page.url();
  console.assert(currentUrl.includes('/agen/'), `Browser forward failed, got ${currentUrl}`);

  // 7. Test direct access
  await page.goto(`${baseUrl}/agen/cursor-pro/`);
  const directTitle = await page.$eval('h1', el => el.textContent);
  console.assert(directTitle === 'Cursor Pro', 'Direct access failed');

  // 8. Capture navigation flow screenshot sequence
  await page.goto(baseUrl);
  await page.screenshot({ 
    path: '/workspace/.cursor/skills/verify-cost-of-agent/evidence/nav-1-home.png',
    fullPage: true 
  });

  await page.click('a.agent-card'); // Click first card
  await page.waitForNavigation();
  await page.screenshot({ 
    path: '/workspace/.cursor/skills/verify-cost-of-agent/evidence/nav-2-detail.png',
    fullPage: true 
  });

  await page.click('a.back-link'); // Click back
  await page.waitForNavigation();
  await page.screenshot({ 
    path: '/workspace/.cursor/skills/verify-cost-of-agent/evidence/nav-3-back-home.png',
    fullPage: true 
  });

  await browser.close();
  console.log('✓ All navigation flow checks passed');
})();
```

## Gotchas

1. **Trailing slash requirement:** Astro static routes require trailing slash. `/agen/cursor-pro` redirects to `/agen/cursor-pro/`. Some browsers auto-add, others don't.

2. **Full page navigation:** This is a static site, not SPA. Each navigation is a full page load, not client-side routing. Expect `page.waitForNavigation()` after clicks.

3. **Multiple back links:** Detail pages have back link at top AND bottom (in footer). Either can be used. Count should be 2 per detail page.

4. **Card click area:** Entire card is clickable (card is an `<a>` tag), not just agent name. Click anywhere on card to navigate.

5. **Hover states:** Cards have `:hover` effect (lift and shadow). In headless browser, hover may not trigger CSS. Use direct click instead.

6. **No client-side JS:** Site has no JavaScript for routing. All navigation is traditional HTML links + browser. No need to wait for hydration or app.mount().

7. **404 pages:** Invalid routes like `/agen/nonexistent/` serve Astro's default 404. In preview mode, may return 404 status or fall back to index. Test with `curl -f` (fail on HTTP error).

8. **External links:** Source links on detail pages have `target="_blank"`. These don't navigate away from app — they open in new tab. Don't test these as part of navigation flow.

9. **Anchor links:** No intra-page anchors (no `#includes` or `#caveats`). All navigation is full page. Can't test scroll-to-section behavior.

10. **Browser state:** When testing back/forward, ensure clean history. Starting fresh browser instance recommended. Shared session may have polluted history.
