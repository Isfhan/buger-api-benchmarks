# BurgerAPI Battle — Framework Comparison

_Generated 2026-09-27 · profile `ci` · 3 runs · seed 42 · Bun 1.4.2_

**Environment:** win32/x64 · Intel(R) Core(TM) i5-14400F (16 cores) · 31.8 GB
**Frameworks:** BurgerAPI 1.0.0-beta (5ed2996, clean) · Elysia 1.4.30 · Elysia 2 2.0.0-beta.19 · Hono 4.13.9 · Express 5.2.1
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
routing/static | 92,380 req/s (87,313–94,985) | 94,319 req/s (91,997–95,629) | 89,153 req/s (83,754–92,266) | 87,204 req/s (85,299–88,485) | 54,444 req/s (53,419–55,387) | Elysia
routing/param | 92,721 req/s (91,338–93,539) | 93,099 req/s (91,183–94,231) | 89,684 req/s (88,313–90,428) | 86,012 req/s (84,385–86,836) | 51,694 req/s (51,291–52,259) | Elysia
routing/many-routes | 88,441 req/s (85,878–91,018) | 90,164 req/s (85,281–94,616) | 89,742 req/s (88,789–90,410) | 87,917 req/s (83,197–90,544) | 34,515 req/s (34,323–34,683) | Elysia
json/echo | 94,536 req/s (93,041–96,128) | 94,500 req/s (94,310–94,873) | 91,105 req/s (90,887–91,356) | 87,787 req/s (87,738–87,872) | 54,267 req/s (53,958–54,441) | BurgerAPI
validation/body | 80,416 req/s (78,850–81,612) | 80,116 req/s (78,272–81,123) | 80,404 req/s (78,847–82,045) | 68,067 req/s (67,899–68,239) | 37,505 req/s (36,831–37,921) | BurgerAPI
request/query | 89,222 req/s (89,084–89,371) | 89,096 req/s (88,834–89,321) | 89,417 req/s (88,889–90,054) | 86,816 req/s (84,535–90,994) | 50,186 req/s (49,622–50,652) | Elysia 2
hooks/auth | 88,953 req/s (86,808–91,139) | 86,232 req/s (85,566–87,408) | 88,937 req/s (85,504–92,030) | 82,897 req/s (80,845–85,190) | 53,977 req/s (53,609–54,243) | BurgerAPI
errors/not-found | 87,398 req/s (86,884–87,986) | 96,370 req/s (95,966–96,877) | 92,200 req/s (91,387–92,808) | 87,994 req/s (86,199–90,060) | 56,204 req/s (54,772–57,041) | Elysia
response/text | 92,753 req/s (92,482–93,031) | 93,534 req/s (93,143–94,185) | 90,792 req/s (90,388–91,535) | 88,259 req/s (87,955–88,559) | 55,896 req/s (54,247–56,798) | Elysia

## Latency p99 (ms, lower is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 3.00 ms | 3.03 ms | 3.06 ms | 3.25 ms | 9.33 ms
routing/param | 3.00 ms | 3.00 ms | 3.18 ms | 3.29 ms | 9.90 ms
routing/many-routes | 3.24 ms | 3.21 ms | 3.18 ms | 3.31 ms | 14.62 ms
json/echo | 3.04 ms | 3.00 ms | 3.15 ms | 3.24 ms | 9.49 ms
validation/body | 4.00 ms | 3.94 ms | 4.00 ms | 4.44 ms | 13.16 ms
request/query | 3.19 ms | 3.20 ms | 3.23 ms | 3.31 ms | 9.97 ms
hooks/auth | 3.24 ms | 3.23 ms | 3.23 ms | 3.99 ms | 9.47 ms
errors/not-found | 3.28 ms | 3.00 ms | 3.11 ms | 3.32 ms | 9.00 ms
response/text | 3.01 ms | 3.00 ms | 3.17 ms | 3.22 ms | 9.12 ms

## Startup (ms, spawn to ready, lower is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 164 ms | 164 ms | 180 ms | 158 ms | 166 ms
routing/param | 172 ms | 171 ms | 174 ms | 173 ms | 167 ms
routing/many-routes | 171 ms | 179 ms | 165 ms | 151 ms | 164 ms
json/echo | 156 ms | 164 ms | 169 ms | 158 ms | 152 ms
validation/body | 166 ms | 159 ms | 171 ms | 166 ms | 165 ms
request/query | 171 ms | 164 ms | 165 ms | 160 ms | 171 ms
hooks/auth | 166 ms | 159 ms | 163 ms | 158 ms | 171 ms
errors/not-found | 173 ms | 165 ms | 165 ms | 151 ms | 172 ms
response/text | 172 ms | 164 ms | 166 ms | 163 ms | 157 ms

## Memory after load (MB, RSS, lower is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 77.3 MB | 76.7 MB | 90.0 MB | 82.9 MB | 110.7 MB
routing/param | 78.4 MB | 76.7 MB | 92.5 MB | 84.3 MB | 110.1 MB
routing/many-routes | 82.0 MB | 77.8 MB | 90.7 MB | 88.0 MB | 111.7 MB
json/echo | 77.3 MB | 77.3 MB | 89.4 MB | 81.4 MB | 111.3 MB
validation/body | 86.1 MB | 85.6 MB | 94.6 MB | 89.0 MB | 117.0 MB
request/query | 80.3 MB | 79.7 MB | 89.5 MB | 85.6 MB | 112.4 MB
hooks/auth | 82.8 MB | 82.0 MB | 92.9 MB | 86.1 MB | 111.7 MB
errors/not-found | 80.0 MB | 75.6 MB | 88.0 MB | 85.9 MB | 123.6 MB
response/text | 77.7 MB | 77.0 MB | 92.3 MB | 85.6 MB | 112.2 MB

## Overall average (mean across all 9 scenarios)

BurgerAPI: 89,647 req/s (3 wins of 9)  
Elysia: 90,825 req/s (5 wins of 9)  
Elysia 2: 89,048 req/s (1 win of 9)  
Hono: 84,773 req/s (0 wins of 9)  
Express: 49,854 req/s (0 wins of 9)

## Non-2xx responses

None. Bombardier reported no non-2xx responses outside the expected 404 scenario.

## Failed correctness checks

None. Every contestant passed the correctness gate.

## How to read this

Each scenario implements an identical route shape in every framework, so the
difference is framework overhead, not application logic. The same Bombardier load
settings (connections, duration, warm-up) were applied to every contestant.

> Fairness caveat: Express ran on Bun's Node compatibility, not raw Node. Treat
> its column as "Express-on-Bun", never as native Node.
> Elysia 2 is `elysia2` (`npm:elysia@2.0.0-beta.19`, the `next` tag) and is
> reported alongside Elysia 1 as a second upstream data point.
