# BurgerAPI Battle — Framework Comparison

_Generated 2026-09-06 · profile `ci` · Bun 1.4.0_

**Environment:** win32/x64 · x64 · unknown
**Frameworks:** BurgerAPI 1.0.0-beta.1, Elysia (v1), Elysia 2 (elysia@experimental, for testing only), Hono, Express
**Runtime note:** all frameworks were run on Bun. Express is Node-based and ran
under Bun's Node compatibility layer (not native Node); its numbers reflect that.
**Testing note:** Elysia 2 is included for evaluation only (installed as
elysia at experimental tag); it is not yet the default Elysia baseline.

## Throughput (requests/sec, higher is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 108,050.09 req/s | 113,944.17 req/s | 110,375.79 req/s | 113,206.39 req/s | 65,897.07 req/s
routing/param | 105,875.94 req/s | 112,650.56 req/s | 109,181.16 req/s | 112,582.76 req/s | 63,508.69 req/s
json/echo | 115,188.5 req/s | 113,137.99 req/s | 110,743.51 req/s | 114,198.86 req/s | 64,042.26 req/s
validation/body | 101,964.36 req/s | 100,911.28 req/s | 100,623.53 req/s | 93,304.2 req/s | 45,550.85 req/s

## Latency p99 (ms, lower is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 2.01 ms | 2 ms | 2 ms | 2 ms | 3.12 ms
routing/param | 2.01 ms | 2 ms | 2 ms | 2 ms | 3.38 ms
json/echo | 2 ms | 2 ms | 2 ms | 2 ms | 3.41 ms
validation/body | 2.07 ms | 2.01 ms | 2.01 ms | 2.25 ms | 4.27 ms

## How to read this

Each scenario implements an identical route shape in every framework, so the
difference is framework overhead, not application logic. The same Bombardier load
settings (connections, duration, warm-up) were applied to every contestant.

> Fairness caveat: Express ran on Bun's Node compatibility, not raw Node. Treat
> its column as "Express-on-Bun", not a native Node Express baseline.
