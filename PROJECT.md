# PROJECT.md

## Overview
printablelogs is a static, print-first web app for analog-first tracking logs.
Its long-term product shape is a three-step workflow:
generate printable logs, digitize filled logs into structured data, and
visualize that data. MVP is only the first step: printable table-log generation.

Primary domain: `https://printablelogs.app`

## Purpose
printablelogs exists to:
- make it faster to create clean printable logs than drawing them by hand
- preserve an analog-friendly workflow without giving up later analysis
- provide a strong foundation for future digitization and visualization features

## Audience
The site serves users who track repeated measurements or routines on paper,
including:
- aquarium and maintenance tracking
- home and lab experiments
- habits and routines
- any time-series workflow where notes matter as context

## Priorities
When making tradeoffs, prioritize:
1. Print clarity and usability
2. Simplicity and low friction
3. Faithfulness to the analog workflow
4. Extensibility for later digitization and visualization
5. Performance sufficient to avoid feeling sloppy

## Non-goals
For MVP, printablelogs does not include:
- calendar log generation
- image digitization
- in-app data visualizations
- accounts, auth, cloud sync, or sharing features
- complex metric metadata beyond header strings

## Information architecture

### Routes
The initial site should include:
- `/` for the homepage and primary generator entry point
- `/about/` for the site About page

Additional routes can be added later if the product grows, but MVP should stay
focused on the main printable workflow.

## Product character
The site should feel:
- print-first
- clear
- practical
- quietly refined

The default identity is black-on-white with clean grid structure and restrained
blue-ink accents used mainly for examples, preview overlays, and future data
visualization.

## Current document model
- `AGENTS.md` defines how agents should work in this repo.
- `PROJECT.md` defines the product, goals, audience, and information
  architecture.
- `REQUIREMENTS.md` defines the active implementation contract, including
  design and implementation-structure requirements.

## How to use this file
- Read this file first to understand what the product is, who it serves, and
  what shape it should have.
- Read `REQUIREMENTS.md` next for the active implementation contract.
