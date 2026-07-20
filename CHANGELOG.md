# Changelog: BurgerAPI Benchmarks

All notable changes to the BurgerAPI benchmark suite are documented here.

## 1.2.0

- 🧹 **Removed the Middleware category**: the `middleware/none`, `middleware/one`,
  `middleware/five`, and `middleware/ten` scenarios, plus the `middleware/ten`
  battle case, were removed. BurgerAPI no longer models infrastructure as a
  separate middleware layer; lifecycle behavior is expressed through hooks, so
  middleware-style scenarios no longer represent a real feature. Validation,
  Routing, Request Processing, and Error Handling categories are unchanged.
- ⚔️ **Battle suite trimmed**: the cross-framework `middleware/ten` battle case
  was removed for the same reason; the remaining battle cases
  (routing/static, routing/param, json/echo, validation/body) stay.
- 🧪 **Elysia 2 added for testing**: `elysia@experimental` (v2.0.0-exp) is
  installed as the `elysia-experimental` alias and added as an `Elysia 2`
  contestant to the battle (routing/static, routing/param, json/echo,
  validation/body). It is for evaluation only and is not the default Elysia
  baseline. The default `elysia` dependency remains v1. The battle report notes
  that Elysia 2 is included for testing.

## 1.1.0

- ⚔️ **Battle module** — added an isolated, opt-in cross-framework comparison
  under `battle/`. It benchmarks BurgerAPI against Elysia, Hono, and Express,
  each implementing the same `BattleRouteSpec`, under identical Bombardier load
  settings. Run with `bun run battle` (selector + `--profile` supported).
  Reports are written to `reports/battle/<date>/` with side-by-side throughput
  and p99 tables. The core BurgerAPI-only suite is unchanged.
- ⚠️ **Express fairness note** — Express is Node-based and runs on Bun's Node
  compatibility layer; the battle report foot-notes this so its column is read
  as "Express-on-Bun", not native Node.

## 1.0.0

- 🧪 **Validation scenarios** — added `validation/coerce` (GET route with
  coercion enabled for a query schema) and `validation/response` (GET route
  declaring a response schema, response validation in dev mode) to measure the
  Validation 2.0 features of BurgerAPI.
- 📌 **Repository policy** — this repository is the official and only home for
  all BurgerAPI performance benchmarks. Benchmark code must not be added to the
  `burger-api` framework repository.
- 🧹 **Terminology** — scenario descriptions use neutral category names
  (Validation, Routing, Middleware, Request Processing, Error Handling) and no
  phase/milestone language.

The suite tracks BurgerAPI `0.14.0` (compiler-driven core, request context, Validation 2.0) via a local `link:`
dependency on the framework working copy.
