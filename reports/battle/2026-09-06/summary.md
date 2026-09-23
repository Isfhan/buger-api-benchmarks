# BurgerAPI Battle — Framework Comparison

_Generated 2026-09-06 · profile `full` · Bun 1.4.0_

**Environment:** win32/x64 · Intel(R) Core(TM) i5-14400F (16 cores) · 31.8 GB
**Frameworks:** BurgerAPI 1.0.0-beta, Elysia (v1), Elysia 2 (elysia@experimental, for testing only), Hono, Express
**Runtime note:** all frameworks were run on Bun. Express is Node-based and ran
under Bun's Node compatibility layer (not native Node); its numbers reflect that.
**Testing note:** Elysia 2 is included for evaluation only (installed as
elysia at experimental tag); it is not yet the default Elysia baseline.

## Throughput (requests/sec, higher is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 79,660.18 req/s | 72,831.53 req/s | 103,309.43 req/s | 96,849.75 req/s | 26,380.18 req/s
routing/param | 45,272.21 req/s | 83,447.18 req/s | 89,568.37 req/s | 72,373.69 req/s | 54,389.57 req/s
json/echo | 100,669.43 req/s | 103,412.83 req/s | 72,450.4 req/s | 98,072.26 req/s | 55,174.3 req/s
validation/body | 55,653.24 req/s | 39,529.48 req/s | 64,809.63 req/s | 77,325.48 req/s | 26,599.98 req/s

## Latency p99 (ms, lower is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 11.7 ms | 12.13 ms | 8 ms | 7.31 ms | 37.35 ms
routing/param | 15.73 ms | 12.24 ms | 11.46 ms | 14.17 ms | 13 ms
json/echo | 7 ms | 8.35 ms | 12.07 ms | 7 ms | 12 ms
validation/body | 16.27 ms | 20.1 ms | 16.89 ms | 9 ms | 35.56 ms

## How to read this

Each scenario implements an identical route shape in every framework, so the
difference is framework overhead, not application logic. The same Bombardier load
settings (connections, duration, warm-up) were applied to every contestant.

> Fairness caveat: Express ran on Bun's Node compatibility, not raw Node. Treat
> its column as "Express-on-Bun", not a native Node Express baseline.
