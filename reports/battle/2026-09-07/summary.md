# BurgerAPI Battle — Framework Comparison

_Generated 2026-09-07 · profile `ci` · Bun 1.4.0_

**Environment:** win32/x64 · Intel(R) Core(TM) i5-14400F (16 cores) · 31.8 GB
**Frameworks:** BurgerAPI 1.0.0-beta.1, Elysia (v1), Elysia 2 (elysia@experimental, for testing only), Hono, Express
**Runtime note:** all frameworks were run on Bun. Express is Node-based and ran
under Bun's Node compatibility layer (not native Node); its numbers reflect that.
**Testing note:** Elysia 2 is included for evaluation only (installed as
elysia at experimental tag); it is not yet the default Elysia baseline.

## Throughput (requests/sec, higher is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 103,668.89 req/s | 113,312.14 req/s | 104,383.29 req/s | 97,085.88 req/s | 57,972.34 req/s
routing/param | 94,406.16 req/s | 110,486.8 req/s | 108,046.52 req/s | 100,796.8 req/s | 55,303.2 req/s
json/echo | 104,927 req/s | 109,425.75 req/s | 102,307.24 req/s | 100,430.82 req/s | 57,576.49 req/s
validation/body | 89,725.23 req/s | 89,620.29 req/s | 91,310.75 req/s | 85,654.24 req/s | 40,971.39 req/s

## Latency p99 (ms, lower is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 2 ms | 2 ms | 2.87 ms | 2.43 ms | 4 ms
routing/param | 2.08 ms | 2 ms | 2 ms | 2.01 ms | 4 ms
json/echo | 2 ms | 2 ms | 2.25 ms | 2.1 ms | 4 ms
validation/body | 2.09 ms | 2.14 ms | 2.11 ms | 2.51 ms | 5 ms

## How to read this

Each scenario implements an identical route shape in every framework, so the
difference is framework overhead, not application logic. The same Bombardier load
settings (connections, duration, warm-up) were applied to every contestant.

> Fairness caveat: Express ran on Bun's Node compatibility, not raw Node. Treat
> its column as "Express-on-Bun", not a native Node Express baseline.
