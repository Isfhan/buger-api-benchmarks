# BurgerAPI Battle — Framework Comparison

_Generated 2026-09-25 · profile `ci` · 3 runs · seed 42 · Bun 1.4.2_

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
routing/static | 88,669 req/s (84,313–93,600) | 94,672 req/s (93,923–95,280) | 92,226 req/s (90,875–94,141) | 87,531 req/s (87,407–87,755) | 53,045 req/s (51,569–53,973) | Elysia
routing/param | 83,269 req/s (79,477–87,408) | 93,142 req/s (92,789–93,400) | 89,215 req/s (88,196–90,756) | 86,167 req/s (86,014–86,259) | 50,432 req/s (47,454–53,238) | Elysia
routing/many-routes | 72,746 req/s (66,825–76,200) | 89,020 req/s (81,736–94,662) | 90,054 req/s (88,901–91,111) | 93,562 req/s (86,183–104,933) | 33,432 req/s (31,873–35,127) | Hono
json/echo | 89,195 req/s (84,563–98,300) | 97,401 req/s (92,819–100,740) | 100,466 req/s (87,692–113,458) | 104,621 req/s (91,572–118,263) | 52,986 req/s (49,085–55,037) | Hono
validation/body | 76,416 req/s (66,229–86,513) | 83,479 req/s (76,313–92,445) | 85,302 req/s (77,850–95,896) | 71,816 req/s (66,971–79,039) | 39,489 req/s (37,936–41,840) | Elysia 2
request/query | 97,734 req/s (84,871–104,657) | 108,234 req/s (89,553–118,883) | 104,464 req/s (95,050–112,476) | 98,851 req/s (87,730–113,503) | 52,122 req/s (49,333–55,705) | Elysia
hooks/auth | 95,076 req/s (85,991–109,212) | 99,057 req/s (92,303–112,095) | 98,455 req/s (92,723–109,330) | 87,919 req/s (78,721–99,570) | 55,985 req/s (48,881–65,282) | Elysia
errors/not-found | 78,269 req/s (76,220–80,113) | 101,969 req/s (95,508–113,769) | 97,847 req/s (92,617–107,991) | 92,071 req/s (90,176–95,633) | 54,352 req/s (52,454–58,034) | Elysia
response/text | 98,194 req/s (90,602–108,474) | 92,794 req/s (92,310–93,126) | 89,579 req/s (88,659–90,258) | 98,558 req/s (91,528–111,093) | 55,976 req/s (47,543–63,898) | Hono

## Latency p99 (ms, lower is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 3.38 ms | 3.07 ms | 3.13 ms | 3.27 ms | 9.40 ms
routing/param | 3.84 ms | 3.08 ms | 3.19 ms | 3.33 ms | 9.69 ms
routing/many-routes | 4.17 ms | 3.45 ms | 3.37 ms | 2.96 ms | 14.92 ms
json/echo | 3.52 ms | 3.04 ms | 2.71 ms | 2.87 ms | 9.43 ms
validation/body | 3.83 ms | 3.86 ms | 3.57 ms | 4.11 ms | 10.63 ms
request/query | 2.74 ms | 2.32 ms | 2.36 ms | 2.89 ms | 8.02 ms
hooks/auth | 3.03 ms | 2.92 ms | 2.89 ms | 3.28 ms | 7.49 ms
errors/not-found | 4.19 ms | 2.71 ms | 2.86 ms | 3.39 ms | 9.15 ms
response/text | 2.89 ms | 3.15 ms | 3.34 ms | 2.74 ms | 7.36 ms

## Startup (ms, spawn to ready, lower is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 173 ms | 160 ms | 172 ms | 160 ms | 181 ms
routing/param | 150 ms | 165 ms | 152 ms | 171 ms | 171 ms
routing/many-routes | 187 ms | 180 ms | 158 ms | 158 ms | 171 ms
json/echo | 170 ms | 158 ms | 178 ms | 158 ms | 159 ms
validation/body | 171 ms | 163 ms | 165 ms | 164 ms | 164 ms
request/query | 157 ms | 167 ms | 164 ms | 158 ms | 164 ms
hooks/auth | 163 ms | 165 ms | 157 ms | 151 ms | 157 ms
errors/not-found | 172 ms | 169 ms | 166 ms | 154 ms | 169 ms
response/text | 173 ms | 171 ms | 165 ms | 164 ms | 172 ms

## Memory after load (MB, RSS, lower is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 82.0 MB | 75.7 MB | 89.8 MB | 82.6 MB | 112.5 MB
routing/param | 83.1 MB | 75.7 MB | 90.5 MB | 84.2 MB | 111.9 MB
routing/many-routes | 90.5 MB | 77.3 MB | 91.0 MB | 88.0 MB | 108.5 MB
json/echo | 81.5 MB | 79.4 MB | 91.8 MB | 83.3 MB | 110.5 MB
validation/body | 88.0 MB | 89.9 MB | 98.2 MB | 88.9 MB | 117.2 MB
request/query | 86.2 MB | 85.2 MB | 95.5 MB | 85.9 MB | 112.1 MB
hooks/auth | 85.3 MB | 84.9 MB | 96.5 MB | 84.6 MB | 111.9 MB
errors/not-found | 87.9 MB | 78.6 MB | 89.5 MB | 83.6 MB | 119.8 MB
response/text | 83.2 MB | 77.7 MB | 90.7 MB | 81.3 MB | 113.7 MB

## Overall average (mean across all 9 scenarios)

BurgerAPI: 86,619 req/s (0 wins of 9)  
Elysia: 95,530 req/s (5 wins of 9)  
Elysia 2: 94,179 req/s (1 win of 9)  
Hono: 91,233 req/s (3 wins of 9)  
Express: 49,758 req/s (0 wins of 9)

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
