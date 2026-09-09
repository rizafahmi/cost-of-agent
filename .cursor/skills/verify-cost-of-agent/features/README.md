# Feature Map: Cost of Agent

This directory contains detailed feature breakdowns for the Cost-of-Agent static site. Each file documents a testable surface area with specific driving instructions.

## Feature Files

1. **home-agent-list.md** — Home page agent directory with sorting and cards
2. **agent-detail-page.md** — Individual agent detail pages with pricing breakdown
3. **navigation-flow.md** — Home → detail navigation via card clicks
4. **static-build-routes.md** — Static site generation produces expected routes

## Using This Map

Each feature file follows a standard structure:
- **Sub-features** — Granular behaviors to verify
- **How to get to it (user POV)** — Steps a human would take
- **Driving it with browser/curl** — Automated verification approach
- **Gotchas** — Known edge cases and pitfalls

When verifying a feature, read its file first, then execute the driving steps, capturing evidence as you go.

## Updating This Map

When the app changes:
1. Update affected feature files with new selectors, routes, or behaviors
2. Mark deprecated features clearly
3. Add new feature files for new surfaces
4. Run `/maintain-verification-skill` to keep map honest

## Evidence References

Evidence for each feature should be saved to `.cursor/skills/verify-cost-of-agent/evidence/<run-id>/` with descriptive filenames:
- `home-list-screenshot.png`
- `detail-cursor-pro-screenshot.png`
- `navigation-flow-recording.mp4`
- `route-list-build-output.txt`
