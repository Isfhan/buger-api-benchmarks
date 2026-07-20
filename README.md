# BurgerAPI Benchmarks

A dedicated, Bun-native benchmark suite for [BurgerAPI](https://burger-api.com).

This repository is the single home for measuring BurgerAPI performance. It does
not live inside the framework repository. The core suite measures how BurgerAPI
behaves under load (many requests sent at once) for the features it actually
provides, and does not compare BurgerAPI with other frameworks.

A separate, opt-in **battle** module (see [Framework comparison (battle)](#framework-comparison-battle))
does compare BurgerAPI against other frameworks (Elysia, Hono, Express). It is
isolated under `battle/` and does not affect the core suite.

## Official Home for All BurgerAPI Benchmarks

**This repository is the official home for all BurgerAPI performance
benchmarks.** All benchmark work — new scenarios, new engines, new reporters —
must be implemented here, in `burger-api-benchmarks`.

Do **not** create benchmark folders or benchmark code inside the `burger-api`
framework repository. Keeping benchmarks here means the framework stays focused
on the framework, ships no benchmark implementation, and does not embed any
generated numbers. If you need a new measurement, add a scenario in
`scenarios/` (see [Adding a benchmark](#adding-a-benchmark)) rather than
modifying the framework repo.

## Why a separate repository?

Benchmark code is not framework code. Keeping it separate means:

- The framework repository stays focused on the framework and ships no benchmark
  implementation or generated numbers.
- The benchmark suite can evolve (new scenarios, new engines, new reporters)
  without touching framework internals.
- Anyone can run, extend, or automate the benchmarks independently.

## Why Bombardier?

[Bombardier](https://github.com/codesenberg/bombardier) is a mature, widely used
HTTP load generator. It is fast, scriptable, and prints clear latency and
throughput statistics. The runner drives Bombardier through Bun's `Bun.spawn`
API (a Bun built-in for starting another program), parses its output, and turns
it into structured reports.

## Prerequisites

- [Bun](https://bun.sh) (>= 1.3.0)
- [Bombardier](https://github.com/codesenberg/bombardier) on your `PATH`

Install Bombardier (pick one):

```bash
# Go
go install github.com/codesenberg/bombardier@latest

# macOS / Linux (Homebrew)
brew install bombardier

# Or download a binary from the Bombardier releases page and add it to PATH
```

Verify it is available:

```bash
bombardier --version
```

## Setup

From this repository root:

```bash
bun install
```

This installs the benchmark dependencies. The local `burger-api` package is
linked into this repo with [Bun's `link` command](https://bun.com/docs/pm/cli/link),
which is the recommended way to use your local working copy of the framework.

To (re)establish the link, in the framework package register it, then link it
here:

```bash
# one-time, in the burger-api framework package:
cd ../burger-api/packages/burger-api && bun link

# in this repository:
bun link burger-api
```

After that, `bun install` keeps the `burger-api` entry as `"link:burger-api"`
and resolves it to your local copy. No manual `node_modules` symlink is needed.

The benchmark suite needs the built framework, so make sure `burger-api` is
built first (`bun run build` in that repository).

## Running benchmarks

Run every scenario:

```bash
bun run bench
```

Run one category:

```bash
bun run bench routing
bun run bench middleware
bun run bench validation
bun run bench request
bun run bench errors
```

Run a single scenario:

```bash
bun run bench routing/static
bun run bench middleware/ten
```

### Benchmark profiles

Profiles control duration, warm-up (a short period of traffic before measuring,
so the server is settled), and concurrency (how many connections hit the server
at once). No code changes are needed to switch.

```bash
bun run bench --profile quick   # short, low concurrency (fast local checks)
bun run bench --profile ci      # moderate (continuous integration)
bun run bench --profile full    # long, high concurrency (production numbers)
bun run bench                   # same as --profile default
```

| Profile | Connections | Duration | Warm-up | Timeout |
| --- | --- | --- | --- | --- |
| default | 256 | 10s | 3s | 30s |
| quick | 50 | 3s | 1s | 15s |
| ci | 128 | 8s | 2s | 30s |
| full | 512 | 30s | 5s | 60s |

## Benchmark categories

| Category | Scenarios |
| --- | --- |
| routing | static, dynamic, wildcard, nested |
| middleware | none, one, five, ten |
| validation | none, query, params, body, coerce, response |
| request | query-parsing, response-mutation, json |
| errors | 404, 405, validation |

Each scenario starts its own short-lived server, warms up, is measured by
Bombardier, and then the server is stopped. This keeps scenarios isolated and
easy to debug.

## Reports

Reports are written under `reports/<date>/` and raw Bombardier output under
`results/<date>/`. Both directories are gitignored, so generated artifacts are
never committed.

Each run produces:

- `reports/<date>/summary.md` — a GitHub-readable table of all results
- `reports/<date>/summary.json` — the same data in JSON
- `reports/<date>/<category>/<scenario>.json` — per-scenario details
- `results/<date>/<scenario>_<METHOD>.txt` — raw Bombardier output

Every report includes environment metadata for reproducibility: BurgerAPI
version, Bun version, operating system, CPU, memory, date, and the Git commit.

## Adding a benchmark

1. Create a file in the relevant group folder, e.g.
   `scenarios/routing/my-scenario.ts`.
2. Export a `Scenario` with an `id`, `group`, `description`, `createApp()`
   (which builds and returns a `Burger` app), and `targets` (the endpoints to
   hit).
3. Import it in `scenarios/registry.ts` and add it to the `scenarios` list.

That is the only registration step. Nothing else needs to change.

## Project structure

```text
burger-api-benchmarks/
├── package.json
├── tsconfig.json
├── .gitignore
├── configs/            # default / quick / ci / full profiles
├── src/
│   ├── index.ts        # CLI: selector + --profile
│   ├── runner.ts       # starts/stops scenario servers, runs the engine
│   ├── report.ts       # writes reports via Bun.write
│   ├── system.ts       # environment metadata (Bun-native)
│   ├── types.ts        # shared types
│   ├── engine/         # BenchmarkEngine interface + Bombardier implementation
│   └── reporter/       # Markdown + JSON reporters
└── scenarios/
    ├── registry.ts     # explicit list of all scenarios
    ├── routing/
    ├── middleware/
    ├── validation/
    ├── request/
    └── errors/
```

## Using the published BurgerAPI package

By default this repository depends on the local sibling
`../burger-api/packages/burger-api` (a `link:` dependency) so benchmarks track
your working copy. To benchmark a released version instead, change the
`burger-api` entry in `package.json` to a published version, for example:

```json
"dependencies": {
  "burger-api": "^0.14.0"
}
```

Then run `bun install` again.

## Framework comparison (battle)

The `battle/` module is an opt-in, cross-framework comparison. It starts
BurgerAPI alongside Elysia, Hono, and Express, each implementing the **same
route shape**, and bombards them with identical load settings so the numbers
reflect framework overhead, not application logic.

```bash
bun run battle                 # all battle scenarios, default profile
bun run battle routing         # one group
bun run battle routing/static  # one scenario
bun run battle --profile quick # quick | ci | full | default
```

Reports are written to `reports/battle/<date>/summary.md` (side-by-side
throughput + p99 tables). `reports/` is gitignored.

**Runtime note:** all contestants run on Bun. Express is Node-based and runs
under Bun's Node compatibility layer (not native Node), so its column is an
"Express-on-Bun" measurement — this is stated in the report, not hidden.
