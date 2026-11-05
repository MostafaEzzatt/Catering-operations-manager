@AGENTS.md

# Project notes

Keep project knowledge and preferences in this file (or other files inside this repo), not in the global `~/.claude` memory.

## "pgh" means push everything to GitHub

When the user says "pgh", push all current work to GitHub without asking for further confirmation:

1. Run `git status` and look at what will be included.
2. Stage everything (`git add -A`), commit with a short descriptive message, then `git push` the current branch to its remote (set upstream if needed).
3. Never force-push. Never bypass hooks.
4. If the status shows secrets (`.env`, keys, tokens) that are not gitignored, leave them out and report it instead of committing them.
5. Report the commit hash and branch pushed. If nothing changed, say so.

## Use graphify

Always use the graphify skill in this project for questions about the codebase, its architecture, or file relationships.

- The graph is in `graphify-out/` (`graph.json`, `GRAPH_REPORT.md`, `graph.html`).
- If `graphify-out/graph.json` exists, query it first with `graphify query "<question>"` before reading files one by one.
- After code changes, refresh it with `/graphify . --update`.
- The graph is mostly built from code parsing, so confirm details in the source before acting on them.

## TanStack form + React 19 freeze

In this repo (React 19, the `radix-ui` umbrella package, `@tanstack/react-form` 1.28), mounting a TanStack `useForm` per table row next to Radix dialogs caused a synchronous render loop. It froze the tab ("Page Unresponsive") after every flight-count update (June 2026). Upstream issue: TanStack/form#2020, closed without a fix and blamed on Radix. Upgrading the library does not help.

Cause: TanStack form re-runs `formApi.update(opts)` in a dependency-less layout effect on every render. Radix `composeRefs` creates new callback refs each render, and React 19 detaches and reattaches them, which fires state setters during commit. Together they loop.

How to apply:

- For new dialogs and forms, use plain `useState` plus zod `safeParse`. `components/update-flight-count.tsx` is the pattern, including reset-on-open and closing the dialog before the action to avoid Radix's stuck `pointer-events: none`.
- Do not add per-row `useForm` instances.
- `add-ms-flight-count` and `add-company` still use TanStack form with a Radix Select. Single instances have been fine so far, but they are the prime suspects if a freeze reappears.
