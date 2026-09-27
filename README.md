# BurgerAPI Benchmarks

A dedicated, Bun-native benchmark suite for [BurgerAPI](https://burger-api.com).

Performance is a feature, not a marketing number. Core suite = BurgerAPI only.
Optional **battle/** compares frameworks and stays isolated.

This repository is the single home for measuring BurgerAPI performance. It does
not live inside the framework repository. The core suite measures how BurgerAPI
behaves under load for real features (routing, hooks, validation, request
handling, errors) and does not compare BurgerAPI with other frameworks.

A separate, opt-in **battle** module (see [Framework comparison (battle)](#framework-comparison-battle))
does compare BurgerAPI against other frameworks (Elysia 1, Elysia 2, Hono,
Express). It is isolated under `battle/` and does not affect the core suite.

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
bun run bench validation
bun run bench request
bun run bench errors
```

Run a single scenario:

```bash
bun run bench routing/static
bun run bench validation/body
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
| validation | none, query, params, body, coerce, response |
| request | query-parsing, response-mutation, json |
| errors | 404, 405, validation |

Each scenario starts its own short-lived server, warms up, is measured by
Bombardier, and then the server is stopped. This keeps scenarios isolated and
easy to debug.

## Reports

Reports are written under `reports/<date>/` (and battle reports under
`reports/battle/<YYYY-MM-DD-HHmm>/`) and raw Bombardier output under
`results/<date>/`. Both directories are gitignored and local runs are never
committed.

The only committed report artifacts are the single latest curated battle +
overhead report, committed by the maintainer after a curated run. Those
summaries carry the measured BurgerAPI commit (short SHA + dirty flag). Because
`reports/` is ignored, curated files are added explicitly with `git add -f`;
every other report folder stays local and is pruned by the maintainer when the
curated report is committed.

Each run produces:

- `reports/<date>/summary.md` — a GitHub-readable table of all results
- `reports/<date>/summary.json` — the same data in JSON
- `reports/<date>/<category>/<scenario>.json` — per-scenario details
- `results/<date>/<scenario>_<METHOD>.txt` — raw Bombardier output

Every report includes environment metadata for reproducibility: BurgerAPI
version and the measured commit (short SHA plus a dirty flag), Bun version,
operating system, CPU, memory, date, and the benchmark-suite Git commit.

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
  "burger-api": "^1.0.0-beta"
}
```

Then run `bun install` again.

## Framework comparison (battle)

The `battle/` module is an opt-in, cross-framework comparison. It starts
BurgerAPI alongside Elysia 1, Elysia 2, Hono, and Express, each implementing the
**same route shape**, and bombards them with identical load settings so the
numbers reflect framework overhead, not application logic.

```bash
bun run battle                  # all battle scenarios, default profile
bun run battle routing          # one group
bun run battle routing/static   # one scenario
bun run battle --profile quick  # quick | ci | full | default
bun run battle --runs 3         # run the whole selection 3 times, report means
bun run battle --seed 42        # reproduce a shuffled contestant order
```

### Contestants and versions

| Column | Package | Bump by editing `package.json` |
| --- | --- | --- |
| BurgerAPI | local `link:burger-api` working copy | re-link the framework package |
| Elysia | `elysia` | `"elysia": "^1.4.30"` |
| Elysia 2 | `elysia2` (`npm:elysia@2.0.0-beta.19`, the `next` tag) | `"elysia2": "npm:elysia@<version>"` |
| Hono | `hono` | `"hono": "^4.13.9"` |
| Express | `express` | `"express": "^5.2.1"` |

The installed versions are read from each package's `package.json` at runtime
and printed in the report header, so a report always names what actually ran.
After changing a version, run `bun install`.

### Battle scenarios

| Scenario | What it measures |
| --- | --- |
| `routing/static` | Static GET route returning a small JSON body |
| `routing/param` | Dynamic GET route with one `:param` |
| `routing/many-routes` | App with 100 static + 100 parameterized routes, then one param route hit |
| `json/echo` | JSON serialization of a small object |
| `validation/body` | Real `{ name: string, age: number }` body validation, echoing the validated body |
| `request/query` | Reading two query string values through each framework query API |
| `hooks/auth` | A before-handler hook checking `Authorization: Bearer bench` |
| `errors/not-found` | Request to an unregistered path (404) |
| `response/text` | Plain-text response |

Each contestant implements the shared `BattleRouteSpec` for the scenario, so
the difference is framework overhead, not application logic. Every scenario is
listed explicitly in `battle/registry.ts` (no filesystem scanning).

### Correctness gate

After a contestant is ready and **before** warm-up, the runner sends the
scenario target once and compares status, `content-type` (prefix match), and the
exact JSON/text body to the scenario's `expect`. Validation scenarios also send
an invalid body (`{"name":1}`) and require a 4xx. A mismatch logs
`FAIL <reason>`, records a failed result with no measurement, and the report
shows `FAIL` in that cell and lists the reason under "Failed correctness
checks".

### Metrics and noise control

Each run reports throughput (req/s), p99 latency, startup time (spawn to ready),
and post-load RSS (read from the server process over a stdin side channel).
Bombardier's non-2xx count is listed when it is non-zero, except the expected
404s in `errors/not-found`. Contestant order is shuffled per scenario with a
seeded Fisher-Yates shuffle; the seed is printed and written to the report.
`--runs N` repeats the whole selection and reports the mean per cell plus the
req/s min-max spread.

Reports are written to `reports/battle/<YYYY-MM-DD-HHmm>/summary.md` (side-by-side
tables plus a per-scenario Winner column and an overall average) and
`summary.json`. `reports/` is gitignored.

**Runtime note:** all contestants run on Bun. Express is Node-based and runs
under Bun's Node compatibility layer (not native Node), so its column is an
"Express-on-Bun" measurement — this is stated in the report, not hidden. The
report also footnotes each contestant's validator: BurgerAPI uses a Zod route
schema, Elysia and Elysia 2 use TypeBox, Hono uses `@hono/zod-validator`, and
Express uses Zod `safeParse` in the handler.

## In-process overhead (fetch handler)

The HTTP battle is bounded by Bun's single-thread HTTP ceiling, so at parity it
can no longer show where framework overhead differs. `battle/overhead.ts`
removes the network and the server entirely: for each battle scenario it builds
every contestant's **public in-process handler** and calls it directly with a
`Request`, awaiting the handler and reading the response body so lazy work is
included.

```bash
bun run overhead                        # all scenarios, 5×300k iterations
bun run overhead routing                # one group
bun run overhead routing/param          # one scenario
bun run overhead --target burger,hono   # only some contestants
bun run overhead --iterations 100000    # shorter timed rounds
bun run overhead --warmup 20000 --rounds 3
```

- **Handlers measured:** BurgerAPI `fetchHandler()` (the portable WinterCG path
  — Cloudflare/Deno/Vercel/node-server), Elysia 1/2 `app.handle(request)`, Hono
  `app.fetch(request)`. Express is skipped (not fetch-based) and the report says
  so.
- **Isolation:** each contestant runs in its own `Bun.spawn` process, so JIT
  state never leaks between frameworks.
- **Requests:** bodyless requests are prebuilt once outside the timed loop; POST
  bodies are rebuilt per iteration for every contestant (a body can be read only
  once), so the same construction cost is paid by all.
- **Gate:** the same correctness gate as the HTTP battle runs before warm-up
  (`battle/gate.ts`, shared by both runners).
- **Output:** `reports/battle/overhead-<YYYY-MM-DD-HHmm>/summary.md` + `.json`
  with a table per scenario (mean of rounds, min–max spread) and an overall mean.

> Footnote: BurgerAPI's Bun `serve()` path is not measured here. On Bun,
> `serve()` registers native per-method `routes` (static + `:param` + `*`) and
> never enters this fetch handler for matched paths. The overhead benchmark
> measures the portable fetch path — `burger.fetchHandler()` /
> `toFetchHandler()` — the same code that runs on Cloudflare Workers, Deno,
> Vercel and node-server.
