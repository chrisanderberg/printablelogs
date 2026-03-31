# REQUIREMENTS.md

## Purpose
This file tracks the active implementation contract for printablelogs. It
captures the requirements that should guide implementation and review.

## How to interpret this file
- Hard requirements are mandatory. Agents must not violate them unless the
  human explicitly changes or approves an exception.
- Soft requirements are recommended defaults. Agents should follow them unless
  there is a clear, task-specific reason not to.
- Human approval is required before adding, removing, or changing a hard
  requirement.

## Hard requirements
- The site shall be implemented as a static Astro site.
- The hosting target shall be GitHub Pages.
- MVP shall focus on printable table-log generation only.
- MVP shall not include calendar logs, digitization, or data visualization.
- The site shall not require a backend, authentication, accounts, or cloud sync
  for core functionality.
- The primary user flow shall support:
  - title input
  - time granularity selection for daily vs continuous-time logs
  - metric column header inputs
  - a notes column that is always present and always final
  - print-ready PDF export
- The product shall support Letter and A4 paper sizes.
- The product shall support portrait and landscape orientation.
- The preview and export output shall stay closely aligned.
- Any persistence in MVP shall be local-only and optional.

## Soft requirements
- Preserve print-first clarity over dashboard-like UI clutter.
- Default to white backgrounds with black text and black grid lines for print
  fidelity.
- Use blue-ink styling sparingly for example overlays and future data views
  rather than the printable template itself.
- Optimize line weights, spacing, and hierarchy for real home-printer output.
- Keep the core generator approachable and low-friction.
- Do not introduce unnecessary metric schemas when header strings are enough.
- If heavier future features are added later, load them only where needed.

## Implementation structure
- Prefer one Astro app at the repo root unless the project grows enough that a
  multi-package structure is clearly justified.
- Keep a shared site shell for layout, header, navigation, and common styling.
- Keep print/export logic separated from basic marketing/about content.
- Prefer a repository shape roughly like:
  - `AGENTS.md`, `PROJECT.md`, `REQUIREMENTS.md`
  - `public/` for shared public assets
  - `src/components/` for shared site and app components
  - `src/layouts/` for site layouts
  - `src/lib/` for site config and print-template helpers
  - `src/pages/` for top-level routes
  - `src/styles/` for global and theme styles

## Candidate promotions to hard requirements
- None yet.

## Open questions
- Whether local template save/import should be in the first implementation pass
  or a later follow-up.
