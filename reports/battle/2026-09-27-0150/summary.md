# BurgerAPI Battle — Framework Comparison

_Generated 2026-09-26 · profile `quick` · 1 run · seed 55749136 · Bun 1.4.2_

**Environment:** win32/x64 · Intel(R) Core(TM) i5-14400F (16 cores) · 31.8 GB
**Frameworks:** BurgerAPI 1.0.0-beta · Elysia 1.4.30 · Elysia 2 2.0.0-beta.19 · Hono 4.13.9 · Express 5.2.1
**Validators:** BurgerAPI — Zod `schema: { post: { body: z.object(...) } }`; Elysia — TypeBox `t.Object({ name: t.String(), age: t.Number() })`; Elysia 2 — TypeBox `t.Object({ name: t.String(), age: t.Number() })`; Hono — `@hono/zod-validator` with Zod; Express — Zod `safeParse` in the handler
**Correctness gate:** each contestant was probed once before warm-up; status, content-type and body had to match the expected response. A `FAIL` cell was not measured.
**Runtime note:** all frameworks were run on Bun. Express is Node-based and ran
under Bun's Node compatibility layer (not native Node); its numbers reflect that.
**Noise control:** contestant order was shuffled per scenario with a seeded
Fisher-Yates shuffle (seed 55749136); each cell is the mean of 1 run
with the req/s min–max spread shown in parentheses.

## Throughput (requests/sec, higher is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express | Winner
--- | --- | --- | --- | --- | --- | ---
routing/static | 108,167 req/s | 113,583 req/s | 109,628 req/s | 108,907 req/s | 64,449 req/s | Elysia
routing/param | 107,776 req/s | 110,224 req/s | 107,876 req/s | 114,828 req/s | 62,822 req/s | Hono
routing/many-routes | 110,843 req/s | 113,201 req/s | 114,124 req/s | 110,038 req/s | 41,918 req/s | Elysia 2
json/echo | 118,922 req/s | 116,458 req/s | 109,604 req/s | 113,202 req/s | 65,521 req/s | BurgerAPI
validation/body | 100,816 req/s | 98,393 req/s | 100,733 req/s | 83,061 req/s | 46,205 req/s | BurgerAPI
request/query | 115,448 req/s | 112,668 req/s | 109,923 req/s | 108,640 req/s | 62,482 req/s | BurgerAPI
hooks/auth | 112,797 req/s | 101,036 req/s | 110,605 req/s | 104,333 req/s | 64,475 req/s | BurgerAPI
errors/not-found | 109,126 req/s | 113,141 req/s | 123,611 req/s | 113,111 req/s | 68,424 req/s | Elysia 2
response/text | 110,155 req/s | 111,230 req/s | 107,706 req/s | 110,520 req/s | 68,498 req/s | Elysia

## Latency p99 (ms, lower is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 1.00 ms | 1.00 ms | 1.00 ms | 1.01 ms | 1.96 ms
routing/param | 1.00 ms | 1.00 ms | 1.01 ms | 1.00 ms | 2.00 ms
routing/many-routes | 1.01 ms | 1.00 ms | 1.00 ms | 1.02 ms | 2.30 ms
json/echo | 1.00 ms | 1.00 ms | 1.00 ms | 1.01 ms | 1.88 ms
validation/body | 1.03 ms | 1.03 ms | 1.03 ms | 1.07 ms | 2.25 ms
request/query | 1.00 ms | 1.00 ms | 1.00 ms | 1.01 ms | 2.00 ms
hooks/auth | 1.00 ms | 1.03 ms | 1.00 ms | 1.02 ms | 2.00 ms
errors/not-found | 1.00 ms | 1.01 ms | 1.00 ms | 1.01 ms | 2.00 ms
response/text | 1.00 ms | 1.00 ms | 1.03 ms | 1.02 ms | 2.00 ms

## Startup (ms, spawn to ready, lower is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 152 ms | 167 ms | 150 ms | 172 ms | 170 ms
routing/param | 154 ms | 150 ms | 173 ms | 154 ms | 171 ms
routing/many-routes | 173 ms | 173 ms | 153 ms | 153 ms | 151 ms
json/echo | 148 ms | 169 ms | 152 ms | 153 ms | 169 ms
validation/body | 150 ms | 150 ms | 150 ms | 150 ms | 150 ms
request/query | 149 ms | 150 ms | 171 ms | 149 ms | 155 ms
hooks/auth | 151 ms | 153 ms | 144 ms | 155 ms | 168 ms
errors/not-found | 154 ms | 170 ms | 153 ms | 150 ms | 168 ms
response/text | 177 ms | 170 ms | 147 ms | 171 ms | 169 ms

## Memory after load (MB, RSS, lower is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 82.4 MB | 80.5 MB | 90.3 MB | 86.2 MB | 106.3 MB
routing/param | 83.3 MB | 83.7 MB | 89.8 MB | 88.0 MB | 108.4 MB
routing/many-routes | 88.7 MB | 83.2 MB | 94.6 MB | 87.4 MB | 104.9 MB
json/echo | 81.6 MB | 82.6 MB | 91.1 MB | 88.5 MB | 110.5 MB
validation/body | 88.0 MB | 93.4 MB | 105.9 MB | 89.2 MB | 114.1 MB
request/query | 84.1 MB | 84.3 MB | 97.1 MB | 88.7 MB | 107.6 MB
hooks/auth | 87.5 MB | 88.9 MB | 98.1 MB | 88.9 MB | 109.6 MB
errors/not-found | 86.1 MB | 80.8 MB | 91.2 MB | 87.2 MB | 108.2 MB
response/text | 81.7 MB | 82.8 MB | 97.5 MB | 88.0 MB | 112.3 MB

## Overall average (mean across all 9 scenarios)

BurgerAPI: 110,450 req/s (4 wins of 9)  
Elysia: 109,993 req/s (2 wins of 9)  
Elysia 2: 110,423 req/s (2 wins of 9)  
Hono: 107,405 req/s (1 win of 9)  
Express: 60,533 req/s (0 wins of 9)

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
