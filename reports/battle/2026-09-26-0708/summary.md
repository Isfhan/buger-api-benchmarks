# BurgerAPI Battle — Framework Comparison

_Generated 2026-09-26 · profile `ci` · 3 runs · seed 42 · Bun 1.4.2_

**Environment:** win32/x64 · Intel(R) Core(TM) i5-14400F (16 cores) · 31.8 GB
**Frameworks:** BurgerAPI 1.0.0-beta · Elysia 1.4.30 · Elysia 2 2.0.0-beta.19 · Hono 4.13.9 · Express 5.2.1
**Validators:** BurgerAPI — Zod `schema: { post: { body: z.object(...) } }`; Elysia — TypeBox `t.Object({ name: t.String(), age: t.Number() })`; Elysia 2 — TypeBox `t.Object({ name: t.String(), age: t.Number() })`; Hono — `@hono/zod-validator` with Zod; Express — Zod `safeParse` in the handler
**Correctness gate:** each contestant was probed once before warm-up; status, content-type and body had to match the expected response. A `FAIL` cell was not measured.
**Runtime note:** all frameworks were run on Bun. Express is Node-based and ran
under Bun's Node compatibility layer (not native Node); its numbers reflect that.
**Noise control:** contestant order was shuffled per scenario with a seeded
Fisher-Yates shuffle (seed 42); each cell is the mean of 3 runs
with the req/s min–max spread shown in parentheses.

## Throughput (requests/sec, higher is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express | Winner
--- | --- | --- | --- | --- | --- | ---
routing/static | 113,020 req/s (112,231–114,263) | 115,507 req/s (114,715–116,774) | 117,854 req/s (114,921–121,768) | 115,796 req/s (114,162–117,076) | 65,859 req/s (63,819–66,932) | Elysia 2
routing/param | 111,374 req/s (109,019–112,679) | 114,345 req/s (112,192–117,944) | 116,697 req/s (112,809–120,295) | 114,372 req/s (111,400–116,214) | 64,038 req/s (63,181–65,578) | Elysia 2
routing/many-routes | 108,883 req/s (104,902–110,927) | 110,452 req/s (104,133–113,890) | 113,111 req/s (107,671–119,063) | 107,175 req/s (101,458–110,477) | 41,754 req/s (40,328–43,134) | Elysia 2
json/echo | 115,221 req/s (112,522–118,506) | 114,650 req/s (112,785–115,609) | 110,733 req/s (109,201–113,459) | 111,491 req/s (105,198–117,522) | 65,443 req/s (64,869–65,882) | BurgerAPI
validation/body | 99,711 req/s (99,555–100,020) | 98,742 req/s (98,597–98,935) | 100,401 req/s (99,956–101,288) | 83,324 req/s (82,607–84,120) | 46,163 req/s (45,709–46,547) | Elysia 2
request/query | 116,738 req/s (111,457–119,546) | 115,964 req/s (112,634–118,687) | 118,921 req/s (118,268–119,767) | 113,440 req/s (113,260–113,667) | 60,363 req/s (58,614–62,359) | Elysia 2
hooks/auth | 116,128 req/s (114,945–116,926) | 114,072 req/s (114,017–114,170) | 112,913 req/s (108,760–115,080) | 101,785 req/s (96,764–104,383) | 65,004 req/s (64,097–65,915) | BurgerAPI
errors/not-found | 111,213 req/s (110,928–111,530) | 115,142 req/s (114,038–116,896) | 113,203 req/s (111,784–113,923) | 113,672 req/s (113,323–113,864) | 68,527 req/s (67,696–69,721) | Elysia
response/text | 117,150 req/s (112,059–121,019) | 115,349 req/s (111,613–118,260) | 116,341 req/s (115,733–116,719) | 116,018 req/s (111,715–120,115) | 67,875 req/s (67,707–68,085) | BurgerAPI

## Latency p99 (ms, lower is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 2.00 ms | 2.00 ms | 2.00 ms | 2.00 ms | 3.06 ms
routing/param | 2.00 ms | 1.93 ms | 2.00 ms | 2.00 ms | 3.20 ms
routing/many-routes | 1.84 ms | 1.89 ms | 1.89 ms | 2.05 ms | 4.38 ms
json/echo | 2.00 ms | 2.00 ms | 1.97 ms | 2.00 ms | 3.11 ms
validation/body | 2.01 ms | 2.01 ms | 2.01 ms | 2.36 ms | 4.00 ms
request/query | 1.87 ms | 2.01 ms | 1.77 ms | 1.92 ms | 3.46 ms
hooks/auth | 1.78 ms | 1.79 ms | 1.94 ms | 2.11 ms | 3.24 ms
errors/not-found | 1.80 ms | 2.00 ms | 1.98 ms | 1.79 ms | 3.18 ms
response/text | 1.97 ms | 1.80 ms | 1.82 ms | 1.85 ms | 3.09 ms

## Startup (ms, spawn to ready, lower is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 171 ms | 151 ms | 149 ms | 158 ms | 157 ms
routing/param | 158 ms | 158 ms | 153 ms | 159 ms | 171 ms
routing/many-routes | 172 ms | 156 ms | 151 ms | 150 ms | 164 ms
json/echo | 150 ms | 160 ms | 157 ms | 157 ms | 171 ms
validation/body | 158 ms | 171 ms | 156 ms | 149 ms | 150 ms
request/query | 169 ms | 155 ms | 158 ms | 149 ms | 156 ms
hooks/auth | 162 ms | 157 ms | 163 ms | 149 ms | 156 ms
errors/not-found | 163 ms | 157 ms | 156 ms | 156 ms | 156 ms
response/text | 160 ms | 157 ms | 172 ms | 149 ms | 158 ms

## Memory after load (MB, RSS, lower is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 82.2 MB | 82.9 MB | 94.5 MB | 87.0 MB | 111.1 MB
routing/param | 83.0 MB | 80.5 MB | 94.8 MB | 88.4 MB | 111.1 MB
routing/many-routes | 93.5 MB | 82.6 MB | 97.2 MB | 87.7 MB | 111.9 MB
json/echo | 81.9 MB | 84.0 MB | 90.7 MB | 88.0 MB | 110.9 MB
validation/body | 90.2 MB | 94.2 MB | 102.5 MB | 91.0 MB | 119.3 MB
request/query | 85.5 MB | 86.7 MB | 98.1 MB | 89.0 MB | 113.5 MB
hooks/auth | 87.4 MB | 90.0 MB | 96.9 MB | 88.4 MB | 111.5 MB
errors/not-found | 88.9 MB | 81.1 MB | 89.5 MB | 86.4 MB | 123.9 MB
response/text | 84.5 MB | 83.4 MB | 96.3 MB | 87.6 MB | 113.6 MB

## Overall average (mean across all 9 scenarios)

BurgerAPI: 112,160 req/s (3 wins of 9)  
Elysia: 112,691 req/s (1 win of 9)  
Elysia 2: 113,353 req/s (5 wins of 9)  
Hono: 108,564 req/s (0 wins of 9)  
Express: 60,558 req/s (0 wins of 9)

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
