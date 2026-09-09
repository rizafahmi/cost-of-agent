# Feature: Static Build Routes

## Sub-features

1. **Build succeeds** — `pnpm build` exits 0 without errors
2. **Dist directory** — Creates `dist/` with static HTML
3. **Home route** — Generates `dist/index.html`
4. **Agent routes** — Generates `dist/agen/{id}/index.html` for all 12 agents
5. **Route count** — Exactly 13 HTML files (1 home + 12 agents)
6. **Asset copying** — Favicon files copied to `dist/`
7. **Build logs** — Output shows "13 page(s) built" message
8. **Clean build** — No TypeScript errors or Astro warnings

## How to get to it (user POV)

1. **Developer runs build:**
   - Open terminal in project root
   - Run `pnpm build`
   - See build output with progress messages
   - See "✓ Completed" messages for each phase
   - See final "13 page(s) built" confirmation
   - `dist/` directory appears in file tree

2. **Verify build artifacts:**
   - Open `dist/` directory
   - See `index.html` (home page)
   - See `agen/` subdirectory
   - Open `agen/` directory
   - See 12 subdirectories (cursor-pro, github-copilot-individual, etc.)
   - Each subdirectory contains `index.html`
   - See `favicon.ico` and `favicon.svg` in `dist/`

## Driving it with browser/curl

### Shell checks (build artifacts)

```bash
cd /workspace

# 1. Clean previous build (optional)
rm -rf dist/

# 2. Run build
BUILD_OUTPUT=$(pnpm build 2>&1)
BUILD_EXIT=$?

# 3. Check build exit code
[ $BUILD_EXIT -eq 0 ] && echo "✓ Build succeeded" || echo "✗ Build failed with exit $BUILD_EXIT"

# 4. Check build output message
echo "$BUILD_OUTPUT" | grep -q "13 page(s) built" && \
  echo "✓ Build message confirms 13 pages" || \
  echo "✗ Build message unexpected"

# 5. Check dist directory exists
[ -d dist ] && echo "✓ dist/ directory created" || echo "✗ dist/ directory missing"

# 6. Check home route
[ -f dist/index.html ] && echo "✓ Home route generated" || echo "✗ Home route missing"

# 7. Check agen directory
[ -d dist/agen ] && echo "✓ agen/ directory created" || echo "✗ agen/ directory missing"

# 8. Count agent subdirectories
AGENT_COUNT=$(ls -1d dist/agen/*/ 2>/dev/null | wc -l)
[ $AGENT_COUNT -eq 12 ] && \
  echo "✓ 12 agent directories generated" || \
  echo "✗ Expected 12 agent dirs, found $AGENT_COUNT"

# 9. Check each expected agent route
EXPECTED_AGENTS=(
  "cursor-pro"
  "github-copilot-individual"
  "github-copilot-business"
  "windsurf-pro"
  "claude-code-cli"
  "aider"
  "continue"
  "devin"
  "cursor-business"
  "codeium-free"
  "cursor-hobby"
  "openai-chatgpt-plus"
)

for agent in "${EXPECTED_AGENTS[@]}"; do
  if [ -f "dist/agen/$agent/index.html" ]; then
    echo "✓ /agen/$agent/index.html exists"
  else
    echo "✗ /agen/$agent/index.html MISSING"
  fi
done

# 10. Count all index.html files
HTML_COUNT=$(find dist -name "index.html" | wc -l)
[ $HTML_COUNT -eq 13 ] && \
  echo "✓ 13 total HTML files" || \
  echo "✗ Expected 13 HTML files, found $HTML_COUNT"

# 11. Check favicons
[ -f dist/favicon.ico ] && echo "✓ favicon.ico copied" || echo "✗ favicon.ico missing"
[ -f dist/favicon.svg ] && echo "✓ favicon.svg copied" || echo "✗ favicon.svg missing"

# 12. Check for TypeScript errors in build output
echo "$BUILD_OUTPUT" | grep -qi "error" && \
  echo "⚠ Build output contains errors" || \
  echo "✓ No errors in build output"

# 13. Verify HTML is valid (contains DOCTYPE and html tags)
grep -q "<!DOCTYPE html>" dist/index.html && \
  echo "✓ Home HTML has DOCTYPE" || \
  echo "✗ Home HTML missing DOCTYPE"

grep -q "<html" dist/index.html && \
  echo "✓ Home HTML has html tag" || \
  echo "✗ Home HTML missing html tag"

# 14. Check agent HTML structure
SAMPLE_AGENT="dist/agen/cursor-pro/index.html"
grep -q "<!DOCTYPE html>" "$SAMPLE_AGENT" && \
  echo "✓ Agent HTML has DOCTYPE" || \
  echo "✗ Agent HTML missing DOCTYPE"

grep -q "Cursor Pro" "$SAMPLE_AGENT" && \
  echo "✓ Agent HTML contains agent name" || \
  echo "✗ Agent HTML missing agent name"

# 15. Save build output to evidence
EVIDENCE_DIR="/workspace/.cursor/skills/verify-cost-of-agent/evidence"
RUN_ID="run-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$EVIDENCE_DIR/$RUN_ID"
echo "$BUILD_OUTPUT" > "$EVIDENCE_DIR/$RUN_ID/build-output.txt"
echo "✓ Build output saved to evidence/$RUN_ID/build-output.txt"

# 16. Save route list to evidence
find dist -name "index.html" | sort > "$EVIDENCE_DIR/$RUN_ID/route-list.txt"
echo "✓ Route list saved to evidence/$RUN_ID/route-list.txt"
```

### Build output parsing

```bash
# Extract key metrics from build output
BUILD_OUTPUT=$(pnpm build 2>&1)

# Get Astro version
ASTRO_VERSION=$(echo "$BUILD_OUTPUT" | grep -oP 'astro\s+v\K[0-9.]+')
echo "Astro version: $ASTRO_VERSION"

# Get output mode
OUTPUT_MODE=$(echo "$BUILD_OUTPUT" | grep -oP 'output:\s+"\K[^"]+')
echo "Output mode: $OUTPUT_MODE"  # Should be "static"

# Get build directory
BUILD_DIR=$(echo "$BUILD_OUTPUT" | grep -oP 'directory:\s+\K[^\s]+')
echo "Build directory: $BUILD_DIR"  # Should be /workspace/dist/

# Get total build time
BUILD_TIME=$(echo "$BUILD_OUTPUT" | grep -oP 'Completed in \K[0-9]+ms' | tail -1)
echo "Build time: ${BUILD_TIME}ms"

# Get page count
PAGE_COUNT=$(echo "$BUILD_OUTPUT" | grep -oP '\K[0-9]+(?=\s+page\(s\) built)')
echo "Pages built: $PAGE_COUNT"  # Should be 13

# List generated routes
ROUTES=$(echo "$BUILD_OUTPUT" | grep -oP '├─ \K[^\s]+')
echo "Generated routes:"
echo "$ROUTES"
```

## Gotchas

1. **Build directory path:** Astro uses absolute path `/workspace/dist/` in build logs, not relative `./dist/`. Both refer to same location.

2. **Route output format:** Build logs show routes with tree characters: `├─ /agen/cursor-pro/index.html (+12ms)`. Timing varies run-to-run.

3. **Telemetry notice:** First build shows Astro telemetry notice. Subsequent builds may not. Don't assert presence of this message.

4. **TypeScript generation:** Build runs type generation first ("Generated 153ms"). This is normal, not an error.

5. **Static mode enforcement:** `astro.config.mjs` has `output: 'static'`. Dynamic or server modes not used. All routes pre-rendered at build time.

6. **No 404 page:** Site doesn't define custom 404. Preview server may serve Astro default or redirect to index for missing routes.

7. **Asset fingerprinting:** Astro may add hashes to CSS/JS filenames. Exact filenames vary. Don't assert specific asset names, only that HTML exists.

8. **Minified HTML:** Production build minifies HTML (no pretty-printing). Grep patterns must work on single-line HTML.

9. **Data-astro attributes:** Every build regenerates random `data-astro-cid-*` IDs for CSS scoping. These change between builds — not stable for testing.

10. **Build cache:** Astro caches build artifacts in `.astro/` directory. Clean builds (`rm -rf .astro/`) may have different timing but same output.

11. **Node version:** `package.json` specifies `node: >=22.12.0`. Build may fail on older Node. Check version with `node --version`.

12. **pnpm vs npm:** Project uses pnpm (lockfile is `pnpm-lock.yaml`). Using npm instead may cause dependency resolution differences.

13. **Parallel build:** Astro builds pages in parallel. Log order of "generating static routes" messages is non-deterministic. Don't assert specific order.

14. **Exit code reliability:** Exit code 0 is most reliable success indicator. Parsing text output can be fragile across Astro versions.
