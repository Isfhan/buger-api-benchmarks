# BurgerAPI Battle — Framework Comparison

_Generated 2026-09-26 · profile `full` · 1 run · seed 3340952144 · Bun 1.4.2_

**Environment:** win32/x64 · Intel(R) Core(TM) i5-14400F (16 cores) · 31.8 GB
**Frameworks:** BurgerAPI 1.0.0-beta · Elysia 1.4.30 · Elysia 2 2.0.0-beta.19 · Hono 4.13.9 · Express 5.2.1
**Validators:** BurgerAPI — Zod `schema: { post: { body: z.object(...) } }`; Elysia — TypeBox `t.Object({ name: t.String(), age: t.Number() })`; Elysia 2 — TypeBox `t.Object({ name: t.String(), age: t.Number() })`; Hono — `@hono/zod-validator` with Zod; Express — Zod `safeParse` in the handler
**Correctness gate:** each contestant was probed once before warm-up; status, content-type and body had to match the expected response. A `FAIL` cell was not measured.
**Runtime note:** all frameworks were run on Bun. Express is Node-based and ran
under Bun's Node compatibility layer (not native Node); its numbers reflect that.
**Noise control:** contestant order was shuffled per scenario with a seeded
Fisher-Yates shuffle (seed 3340952144); each cell is the mean of 1 run
with the req/s min–max spread shown in parentheses.

## Throughput (requests/sec, higher is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express | Winner
--- | --- | --- | --- | --- | --- | ---
routing/static | 116,389 req/s | 111,086 req/s | 114,824 req/s | 110,145 req/s | 58,735 req/s | BurgerAPI
routing/param | 118,236 req/s | 120,642 req/s | 112,706 req/s | 110,537 req/s | 58,696 req/s | Elysia
routing/many-routes | 106,847 req/s | 110,344 req/s | 116,332 req/s | 104,522 req/s | 40,165 req/s | Elysia 2
json/echo | 115,522 req/s | 117,467 req/s | 117,781 req/s | 112,443 req/s | 58,719 req/s | Elysia 2
validation/body | 94,049 req/s | 91,363 req/s | 94,443 req/s | 77,885 req/s | 42,132 req/s | Elysia 2
request/query | 114,680 req/s | 113,877 req/s | 115,062 req/s | 108,353 req/s | 55,676 req/s | Elysia 2
hooks/auth | 110,890 req/s | 108,397 req/s | 109,886 req/s | 98,666 req/s | 60,163 req/s | BurgerAPI
errors/not-found | 112,024 req/s | 112,056 req/s | 115,991 req/s | 108,731 req/s | 63,490 req/s | Elysia 2
response/text | 116,066 req/s | 118,303 req/s | 115,548 req/s | 112,421 req/s | 62,323 req/s | Elysia

## Latency p99 (ms, lower is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 5.99 ms | 6.24 ms | 6.00 ms | 6.33 ms | 10.80 ms
routing/param | 6.15 ms | 5.78 ms | 6.35 ms | 6.01 ms | 10.78 ms
routing/many-routes | 6.21 ms | 6.00 ms | 5.81 ms | 6.68 ms | 14.68 ms
json/echo | 5.97 ms | 5.90 ms | 5.71 ms | 6.12 ms | 10.78 ms
validation/body | 7.26 ms | 7.54 ms | 7.54 ms | 8.57 ms | 15.11 ms
request/query | 6.12 ms | 6.13 ms | 5.75 ms | 6.54 ms | 11.29 ms
hooks/auth | 6.41 ms | 6.32 ms | 6.07 ms | 6.99 ms | 10.44 ms
errors/not-found | 6.00 ms | 6.15 ms | 6.05 ms | 6.39 ms | 10.00 ms
response/text | 6.17 ms | 5.91 ms | 6.00 ms | 6.35 ms | 10.14 ms

## Startup (ms, spawn to ready, lower is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 192 ms | 171 ms | 171 ms | 150 ms | 150 ms
routing/param | 171 ms | 169 ms | 149 ms | 151 ms | 175 ms
routing/many-routes | 168 ms | 170 ms | 151 ms | 170 ms | 152 ms
json/echo | 167 ms | 169 ms | 153 ms | 150 ms | 170 ms
validation/body | 172 ms | 151 ms | 166 ms | 152 ms | 173 ms
request/query | 174 ms | 171 ms | 151 ms | 150 ms | 151 ms
hooks/auth | 152 ms | 166 ms | 170 ms | 151 ms | 169 ms
errors/not-found | 172 ms | 170 ms | 169 ms | 150 ms | 169 ms
response/text | 170 ms | 170 ms | 171 ms | 151 ms | 153 ms

## Memory after load (MB, RSS, lower is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 83.2 MB | 76.3 MB | 88.8 MB | 83.3 MB | 118.2 MB
routing/param | 82.7 MB | 77.6 MB | 89.0 MB | 84.2 MB | 118.3 MB
routing/many-routes | 82.8 MB | 79.7 MB | 89.2 MB | 84.6 MB | 123.6 MB
json/echo | 78.6 MB | 83.8 MB | 89.0 MB | 86.4 MB | 117.2 MB
validation/body | 87.3 MB | 90.4 MB | 97.4 MB | 87.8 MB | 127.9 MB
request/query | 85.3 MB | 85.3 MB | 93.2 MB | 84.8 MB | 119.6 MB
hooks/auth | 85.1 MB | 86.2 MB | 92.9 MB | 85.5 MB | 119.0 MB
errors/not-found | 85.1 MB | 76.9 MB | 88.7 MB | 82.6 MB | 193.4 MB
response/text | 84.6 MB | 75.9 MB | 88.8 MB | 85.6 MB | 121.7 MB

## Overall average (mean across all 9 scenarios)

BurgerAPI: 111,634 req/s (2 wins of 9)  
Elysia: 111,504 req/s (2 wins of 9)  
Elysia 2: 112,508 req/s (5 wins of 9)  
Hono: 104,856 req/s (0 wins of 9)  
Express: 55,567 req/s (0 wins of 9)

## Non-2xx responses

None. Bombardier reported no non-2xx responses outside the expected 404 scenario.

## Failed correctness checks

None. Every contestant passed the correctness gate.

## How to read this

Each scenario implements an identical route shape in every framework, so the
difference is framework overhead, not application logic. The same Bombardier load
settings (connections, duration, warm-up) were applied to every contestant.

> Fairness caveat: Express ran on Bun's Node compatibility, not raw Node. Treat
> its column as "Express-on-Bun", not a native Node Express baseline.
> Elysia 2 is `elysia2` (`npm:elysia@2.0.0-beta.19`, the `next` tag) and is
> reported alongside Elysia 1 as a second upstream data point.
