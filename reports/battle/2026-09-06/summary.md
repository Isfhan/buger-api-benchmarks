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
routing/static | 109,822.77 req/s | 107,370 req/s | 111,461.19 req/s | 105,958.28 req/s | 64,003.38 req/s
routing/param | 103,586.51 req/s | 108,327.4 req/s | 115,670.79 req/s | 112,215.04 req/s | 62,526.46 req/s
json/echo | 113,863.83 req/s | 111,175.42 req/s | 109,253.7 req/s | 110,666.82 req/s | 63,431.36 req/s
validation/body | 97,778.52 req/s | 99,105.11 req/s | 102,497.96 req/s | 94,726.3 req/s | 45,201.17 req/s

## Latency p99 (ms, lower is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 2 ms | 2 ms | 1.85 ms | 2.01 ms | 3.35 ms
routing/param | 2.09 ms | 1.99 ms | 1.75 ms | 2 ms | 3.39 ms
json/echo | 2 ms | 2 ms | 2 ms | 2 ms | 3.13 ms
validation/body | 2.01 ms | 2.01 ms | 2.01 ms | 2.01 ms | 4.36 ms

## How to read this

Each scenario implements an identical route shape in every framework, so the
difference is framework overhead, not application logic. The same Bombardier load
settings (connections, duration, warm-up) were applied to every contestant.

> Fairness caveat: Express ran on Bun's Node compatibility, not raw Node. Treat
> its column as "Express-on-Bun", not a native Node Express baseline.
