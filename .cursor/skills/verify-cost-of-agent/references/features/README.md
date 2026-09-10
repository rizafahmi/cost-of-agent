# Feature Map: Cost of Agent

Testable feature surfaces for the Cost-of-Agent Astro static site. Each feature documented with CLI-driven verification commands.

## Features

**[home-agent-list.md](home-agent-list.md)** — Home page agent directory with cost-sorted cards (9 agents, continue→devin order)

**[agent-detail-page.md](agent-detail-page.md)** — Individual agent detail pages with pricing breakdown, includes, caveats, sources (Bahasa sections)

**[navigation-flow.md](navigation-flow.md)** — Home ↔ detail navigation via card clicks and back links

**[static-build-routes.md](static-build-routes.md)** — Static site generation produces 10 routes (1 home + 9 agents)

## Driving Features

All features use the control CLI (`control-cost-of-agent.mjs`) for reproducible verification:

```bash
# Full smoke test (all features)
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs smoke

# Individual checks
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs doctor
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs check-home
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs check-detail cursor-pro
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs order
node .cursor/skills/verify-cost-of-agent/control-cost-of-agent.mjs snapshot /
```

See [CLI-USAGE.md](../../CLI-USAGE.md) for complete command reference.

## Feature Structure

Each feature file follows this shape:

- **Sub-features** — Granular behaviors (kebab-id: description)
- **How to get to it (user POV)** — Manual steps a human would take
- **Driving it with control-cost-of-agent** — CLI commands for verification
- **Gotchas** — Known edge cases, pitfalls, selector stability

## Updating This Map

When the app changes:

1. Update affected feature files with new selectors, routes, or behaviors
2. Verify CLI commands still work
3. Update gotchas if new edge cases discovered
4. Add new feature files for new surfaces

Evidence for each run saved to `../../evidence/run-<timestamp>/` (gitignored).
