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
routing/static | 115,596 req/s (112,816–117,041) | 113,813 req/s (111,871–115,865) | 114,327 req/s (110,714–118,798) | 113,017 req/s (105,043–118,385) | 66,889 req/s (65,447–67,927) | BurgerAPI
routing/param | 112,447 req/s (110,961–114,770) | 117,444 req/s (112,028–121,655) | 115,900 req/s (108,455–120,068) | 111,384 req/s (103,957–116,100) | 64,538 req/s (63,411–65,541) | Elysia
routing/many-routes | 107,335 req/s (102,498–109,983) | 110,001 req/s (102,579–114,066) | 114,719 req/s (108,388–120,732) | 107,124 req/s (100,718–110,782) | 41,798 req/s (41,087–42,924) | Elysia 2
json/echo | 116,000 req/s (111,757–120,662) | 119,645 req/s (112,484–123,423) | 116,510 req/s (112,791–122,392) | 113,493 req/s (105,839–117,537) | 64,492 req/s (63,138–65,276) | Elysia
validation/body | 100,032 req/s (99,634–100,459) | 98,833 req/s (98,404–99,355) | 101,025 req/s (100,415–101,606) | 83,674 req/s (83,173–84,005) | 45,490 req/s (44,645–46,058) | Elysia 2
request/query | 117,711 req/s (114,605–119,527) | 117,725 req/s (116,418–119,100) | 113,908 req/s (106,950–119,478) | 113,649 req/s (113,462–113,778) | 60,860 req/s (60,162–61,855) | Elysia
hooks/auth | 116,556 req/s (116,222–116,851) | 113,861 req/s (113,117–114,279) | 114,379 req/s (113,517–115,370) | 103,439 req/s (102,458–104,402) | 66,044 req/s (65,397–66,912) | BurgerAPI
errors/not-found | 114,664 req/s (109,605–117,422) | 116,423 req/s (113,803–120,866) | 115,200 req/s (113,919–116,881) | 112,753 req/s (111,761–113,453) | 64,865 req/s (58,533–68,404) | Elysia
response/text | 117,436 req/s (111,802–120,460) | 113,820 req/s (105,721–121,099) | 119,932 req/s (118,092–121,013) | 117,971 req/s (117,301–118,447) | 67,924 req/s (67,247–68,595) | Elysia 2

## Latency p99 (ms, lower is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 1.91 ms | 2.00 ms | 1.82 ms | 1.74 ms | 3.11 ms
routing/param | 2.00 ms | 2.00 ms | 2.00 ms | 1.94 ms | 3.17 ms
routing/many-routes | 1.91 ms | 1.97 ms | 2.00 ms | 2.03 ms | 4.42 ms
json/echo | 2.00 ms | 1.91 ms | 1.86 ms | 2.00 ms | 3.10 ms
validation/body | 2.01 ms | 2.00 ms | 2.02 ms | 2.24 ms | 4.15 ms
request/query | 1.87 ms | 2.00 ms | 2.00 ms | 1.93 ms | 3.41 ms
hooks/auth | 1.77 ms | 1.89 ms | 2.00 ms | 2.05 ms | 3.17 ms
errors/not-found | 1.88 ms | 1.92 ms | 2.00 ms | 1.97 ms | 3.80 ms
response/text | 1.94 ms | 2.01 ms | 1.65 ms | 1.77 ms | 3.08 ms

## Startup (ms, spawn to ready, lower is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 170 ms | 156 ms | 156 ms | 157 ms | 164 ms
routing/param | 157 ms | 151 ms | 164 ms | 155 ms | 164 ms
routing/many-routes | 172 ms | 165 ms | 150 ms | 164 ms | 158 ms
json/echo | 164 ms | 165 ms | 152 ms | 157 ms | 165 ms
validation/body | 159 ms | 157 ms | 156 ms | 149 ms | 149 ms
request/query | 152 ms | 158 ms | 156 ms | 156 ms | 163 ms
hooks/auth | 151 ms | 163 ms | 156 ms | 150 ms | 157 ms
errors/not-found | 165 ms | 159 ms | 151 ms | 158 ms | 149 ms
response/text | 163 ms | 156 ms | 151 ms | 149 ms | 165 ms

## Memory after load (MB, RSS, lower is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 83.1 MB | 82.5 MB | 95.3 MB | 88.0 MB | 110.9 MB
routing/param | 84.0 MB | 81.1 MB | 99.1 MB | 88.2 MB | 111.3 MB
routing/many-routes | 87.5 MB | 83.7 MB | 94.5 MB | 87.5 MB | 111.9 MB
json/echo | 83.5 MB | 83.3 MB | 95.4 MB | 87.1 MB | 111.8 MB
validation/body | 89.8 MB | 94.2 MB | 102.2 MB | 90.1 MB | 117.8 MB
request/query | 85.7 MB | 86.2 MB | 98.9 MB | 88.9 MB | 113.8 MB
hooks/auth | 87.3 MB | 90.1 MB | 98.2 MB | 88.0 MB | 110.7 MB
errors/not-found | 87.8 MB | 82.3 MB | 90.5 MB | 87.3 MB | 122.6 MB
response/text | 84.1 MB | 83.9 MB | 96.7 MB | 89.7 MB | 112.8 MB

## Overall average (mean across all 9 scenarios)

BurgerAPI: 113,086 req/s (2 wins of 9)  
Elysia: 113,507 req/s (4 wins of 9)  
Elysia 2: 113,989 req/s (3 wins of 9)  
Hono: 108,500 req/s (0 wins of 9)  
Express: 60,322 req/s (0 wins of 9)

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
