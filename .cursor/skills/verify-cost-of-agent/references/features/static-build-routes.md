# Static Build Routes

## Sub-features

- **build-succeeds** — `pnpm build` exits 0 without errors
- **dist-directory** — Creates `dist/` with static HTML files
- **home-route** — Generates `dist/index.html` for `/` route
- **agent-routes** — Generates `dist/agen/{id}/index.html` for all 11 agents
- **route-count** — Exactly 12 HTML files (1 home + 11 agents)
- **asset-copying** — Favicon files copied to `dist/`
- **build-logs** — Output shows "12 page(s) built" confirmation
- **clean-build** — No TypeScript errors or Astro warnings
- **static-mode** — Astro config enforces `output: 'static'` (no SSR)

## How to get to it (user POV)

### Developer runs build

1. Open terminal in project root
2. Run `pnpm build`
3. See build output with progress messages:
   - Type generation
   - "output: static"
   - "Building static entrypoints..."
   - Route generation for each page
4. See final "12 page(s) built" confirmation
5. `dist/` directory appears in file tree

### Verify build artifacts

1. Open `dist/` directory
2. See `index.html` (home page)
3. See `agen/` subdirectory
4. Open `agen/` directory
5. See 11 subdirectories (cursor-pro, github-copilot-pro, muse-code, deepseek-flash, muse-spark, etc.)
6. Each subdirectory contains `index.html`
7. See `favicon.ico` and `favicon.svg` in `dist/`

## Driving it with control-cost-of-agent

### Run build

```bash
# Build static site
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs build
```

Expected output:
```
Building site...
(pnpm build output)
✓ Build completed successfully
```

Exit code 0 = success, non-zero = build failed.

### Verify build artifacts exist

```bash
# Check dist/ was created
ls -la dist/

# Check home route
ls -la dist/index.html

# Check agen directory
ls -la dist/agen/

# Count agent directories
ls -1 dist/agen/ | wc -l  # Should be 11

# List all agent routes
ls -1 dist/agen/*/index.html
```

### Full smoke test (includes build check)

```bash
# Smoke test builds if needed
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs smoke
```

Smoke test stage 1: "Build check"
- If `dist/` exists, skips build
- If missing, runs build
- Fails if build exits non-zero

### Verify route count

```bash
# Count all index.html files
find dist -name "index.html" | wc -l  # Should be 12

# Or use doctor
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs doctor
```

Doctor includes route count check:
```
[4/4] Checking route count...
  ✓ Route count: 12 (1 home + 11 agents)
```

### Verify specific routes

```bash
# Check expected agent routes exist
for agent_id in cursor-pro github-copilot-pro github-copilot-business \
                devin-pro claude-code-cli muse-code glm-coding-plan \
                byteplus-modelark-code cursor-business; do
  [ -f "dist/agen/$agent_id/index.html" ] && \
    echo "✓ /agen/$agent_id/" || echo "✗ Missing: /agen/$agent_id/"
done
```

### Inspect build output

```bash
# Run build and capture output
pnpm build 2>&1 | tee /tmp/build-output.txt

# Check for "12 page(s) built"
grep -q "12 page(s) built" /tmp/build-output.txt && \
  echo "✓ Build message confirms 12 pages" || echo "✗ Unexpected page count"

# Check for "static" mode
grep -q 'output: "static"' /tmp/build-output.txt && \
  echo "✓ Static mode confirmed" || echo "✗ Wrong output mode"
```

### Check for errors

```bash
# Build should have no errors
pnpm build 2>&1 | grep -i error
# (No output = no errors)

# Build exit code should be 0
pnpm build && echo "✓ Build succeeded" || echo "✗ Build failed"
```

### Verify HTML structure

```bash
# Check home HTML is valid
grep -q "<!DOCTYPE html>" dist/index.html && echo "✓ Home has DOCTYPE"
grep -q "<html" dist/index.html && echo "✓ Home has html tag"
grep -q "Cost of Agent" dist/index.html && echo "✓ Home has title"

# Check agent HTML is valid
grep -q "<!DOCTYPE html>" dist/agen/cursor-pro/index.html && echo "✓ Agent has DOCTYPE"
grep -q "Cursor Pro" dist/agen/cursor-pro/index.html && echo "✓ Agent has content"
```

### Create evidence

```bash
# Initialize evidence directory
RUN_DIR=$(node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs evidence-init)

# Save build output
pnpm build 2>&1 > "$RUN_DIR/build-output.txt"

# Save route list
find dist -name "index.html" | sort > "$RUN_DIR/route-list.txt"

# Save agent order
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs order > "$RUN_DIR/agent-order.txt"
```

### Clean build

```bash
# Remove dist and rebuild
rm -rf dist/
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs build
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs doctor
```

## Gotchas

1. **Build directory path:** Astro uses absolute path `/workspace/dist/` in build logs, not relative `./dist/`. Both refer to same location.

2. **Route output format:** Build logs show routes with tree characters: `├─ /agen/cursor-pro/index.html (+12ms)`. Timing varies run-to-run. Non-deterministic order due to parallel build.

3. **Telemetry notice:** First build shows Astro telemetry notice. Subsequent builds may not. Don't assert presence of this message.

4. **TypeScript generation:** Build runs type generation first ("Generated 180ms"). This is normal, not an error.

5. **Static mode enforcement:** `astro.config.mjs` has `output: 'static'`. All routes pre-rendered at build time. No server/hybrid/dynamic routes.

6. **No custom 404:** Site doesn't define custom 404 page. Invalid routes serve Astro's default 404 or redirect in preview.

7. **Asset fingerprinting:** Astro may add hashes to CSS/JS filenames in production. Exact filenames vary. Test that HTML exists, not specific asset names.

8. **Minified HTML:** Production build may minify HTML (no pretty-printing). Grep patterns must work on single-line HTML.

9. **Data-astro attributes:** Every build regenerates random `data-astro-cid-*` IDs for CSS scoping. These change between builds — not stable for testing. Use semantic class names.

10. **Build cache:** Astro caches build artifacts in `.astro/` directory. Clean builds (`rm -rf .astro/`) may have different timing but same output.

11. **Node version:** `package.json` specifies `node: >=22.12.0`. Build may fail on older Node. Current version: `node --version` should be ≥22.12.

12. **pnpm vs npm:** Project uses pnpm (lockfile is `pnpm-lock.yaml`). Using npm instead may cause dependency resolution differences. Always use pnpm.

13. **Parallel build:** Astro builds pages in parallel. Log order of "generating static routes" messages is non-deterministic. Don't assert specific route order in logs.

14. **Exit code reliability:** Exit code 0 is most reliable success indicator. Parsing text output can be fragile across Astro versions.

15. **Control CLI build command:** The CLI's `build` command wraps `pnpm build` and reports exit code. Use this for automated testing instead of raw pnpm.

16. **Smoke test auto-build:** The `smoke` command builds only if `dist/` is missing. For clean build testing, delete `dist/` first or use explicit `build` command.
