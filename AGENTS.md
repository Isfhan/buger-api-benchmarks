# AGENTS.md — BurgerAPI Benchmarks

Guidance for working in this repository. Bias caution over speed on non-trivial work.

## Project Overview

This is the **dedicated, Bun-native benchmark suite for BurgerAPI**. It is a
separate repository from the framework (`burger-api`) and contains no
framework code. Its only job is to measure how BurgerAPI behaves under load for
the features BurgerAPI actually provides.

**Tech:** Bun >= 1.3.0, TypeScript (ESM), Bombardier (HTTP load generator)
**Status:** The single source of truth for BurgerAPI performance testing.

## Essential Commands

```bash
bun install              # Install deps (local burger-api + zod + typescript)
bun run typecheck        # tsc --noEmit
bun run bench            # Run every scenario (default profile)
bun run bench routing    # Run one category
bun run bench routing/static   # Run one scenario
bun run bench --profile quick  # quick | ci | full | default
```

Bombardier must be installed and on `PATH` (`bombardier --version`).

## Architecture

- `configs/` — benchmark profiles: `default.ts`, `quick.ts`, `ci.ts`, `full.ts`.
  Each exports a `BenchConfig` (connections, duration, warmup, timeout).
- `src/`
  - `index.ts` — CLI: parses an optional selector (`group` or `id`) and
    `--profile`, then runs the selected scenarios.
  - `runner.ts` — for each scenario: spawns a short-lived server process,
    waits for readiness, runs the engine (warmup + measure), then stops it.
  - `engine/` — `BenchmarkEngine` interface + the Bombardier implementation.
    The runner depends on the interface, never on Bombardier directly.
  - `reporter/` — `Reporter` interface with Markdown and JSON implementations.
  - `system.ts` — collects reproducible environment metadata (Bun-native).
  - `types.ts` — shared types (`Scenario`, `Target`, `Metrics`, `ReportMeta`).
  - `scenario-server.ts` — bootstrap the runner spawns to serve one scenario.
- `scenarios/` — one file per scenario, grouped by feature, plus an explicit
  `registry.ts` listing every scenario.

Responsibilities are deliberately separated:
`Runner → Benchmark Engine → Bombardier` and `Runner → Reporter → Markdown/JSON`.

## Rule 1 — Bun First, Always

This is a Bun project. Use Bun APIs everywhere:
`Bun.spawn()`, `Bun.write()`, `Bun.file()`, `Bun.which()`, `Bun.execPath`.

Do **not** introduce: `child_process`, `execSync`, CommonJS (`require`), or
Node-specific utilities. Reading environment metadata uses `Bun.file` /
`Bun.spawn` (e.g. `/proc` on Linux, `sysctl` on macOS) — never `node:os`.

## Rule 2 — Scenarios Define Apps, the Runner Runs Them

A `Scenario` only declares `createApp()` (returns a `Burger` app) and `targets`
(endpoints to hit). The runner owns the port, server start, shutdown, and
benchmark execution. Do not start or stop servers inside a scenario file.

## Rule 3 — Explicit Registry, No Filesystem Scanning

Every scenario is listed in `scenarios/registry.ts`. Adding a benchmark
requires creating a scenario file **and** adding it to that list. Do not
auto-discover scenarios with `Bun.glob` or similar.

## Rule 4 — Engine and Reporter Are Pluggable

Bombardier is the default engine but sits behind `BenchmarkEngine`. A different
load generator only needs to implement that interface and register in
`engine/index.ts`. Reports are produced by `Reporter` implementations; add a new
format (e.g. HTML) the same way. Do not couple the runner to one tool.

## Rule 5 — Benchmark Only Real Features

Only benchmark behavior BurgerAPI actually provides. If a feature does not
exist, do not invent a scenario for it.

## Rule 6 — Never Commit Generated Artifacts

`reports/` and `results/` are gitignored. They are produced locally on each run
and must never be committed. Node modules are gitignored too.

## Rule 7 — Terminology

Write everything as if this has always been BurgerAPI's benchmark suite. Do not
use: `Phase 1/2/0`, `milestone`, `baseline`, `previous implementation`,
`old benchmark`, `rewritten benchmark`. Use neutral category names: Routing,
Middleware, Validation, Request Processing, Error Handling.

## Rule 8 — Adding a Benchmark

1. Create `scenarios/<group>/<name>.ts` exporting a `Scenario`.
2. Import it in `scenarios/registry.ts` and add it to the `scenarios` array.

Nothing else needs to change. Profiles and reporters are shared.

## Rule 9 — Verify Before Claiming Done

After changes:
- `bun run typecheck` passes.
- `bun run bench --profile quick` runs cleanly (or the affected scenario/group).
- `git status` shows no `reports/` or `results/` files (they are ignored).
