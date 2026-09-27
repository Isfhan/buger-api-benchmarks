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
routing/static | 111,273 req/s (107,009–114,251) | 113,757 req/s (107,358–117,325) | 116,168 req/s (108,964–123,322) | 113,153 req/s (110,832–116,571) | 65,437 req/s (62,800–66,881) | Elysia 2
routing/param | 118,799 req/s (116,082–121,207) | 114,608 req/s (111,439–120,238) | 115,470 req/s (113,346–116,770) | 113,612 req/s (111,630–115,715) | 64,179 req/s (62,443–65,603) | BurgerAPI
routing/many-routes | 110,593 req/s (109,036–111,687) | 113,539 req/s (111,845–114,458) | 119,062 req/s (117,666–120,193) | 109,073 req/s (106,000–111,719) | 41,741 req/s (41,146–42,249) | Elysia 2
json/echo | 118,372 req/s (114,187–121,633) | 115,285 req/s (111,874–122,064) | 115,188 req/s (110,770–119,575) | 117,592 req/s (116,941–118,079) | 65,412 req/s (65,002–65,824) | BurgerAPI
validation/body | 97,931 req/s (97,885–97,957) | 98,466 req/s (98,054–98,681) | 99,821 req/s (97,693–101,016) | 83,245 req/s (82,960–83,780) | 45,505 req/s (44,739–46,018) | Elysia 2
request/query | 111,221 req/s (109,974–112,190) | 117,395 req/s (114,367–119,110) | 112,626 req/s (106,890–119,152) | 113,166 req/s (111,102–114,916) | 59,416 req/s (56,005–61,960) | Elysia
hooks/auth | 114,166 req/s (113,147–115,155) | 114,080 req/s (113,796–114,535) | 109,964 req/s (101,561–114,180) | 102,867 req/s (100,135–104,543) | 65,902 req/s (65,697–66,044) | BurgerAPI
errors/not-found | 108,782 req/s (107,967–109,691) | 114,361 req/s (113,574–114,909) | 115,523 req/s (111,362–119,764) | 113,191 req/s (112,661–114,173) | 68,015 req/s (67,948–68,053) | Elysia 2
response/text | 114,911 req/s (111,144–118,490) | 111,953 req/s (110,567–113,644) | 114,176 req/s (108,538–119,043) | 115,374 req/s (112,382–119,627) | 68,037 req/s (67,543–68,527) | Hono

## Latency p99 (ms, lower is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 2.00 ms | 2.00 ms | 2.00 ms | 1.92 ms | 3.04 ms
routing/param | 2.00 ms | 2.00 ms | 2.00 ms | 2.00 ms | 3.11 ms
routing/many-routes | 2.00 ms | 2.00 ms | 2.00 ms | 2.01 ms | 4.43 ms
json/echo | 1.99 ms | 1.93 ms | 1.89 ms | 1.77 ms | 3.11 ms
validation/body | 2.06 ms | 2.02 ms | 2.07 ms | 2.43 ms | 4.12 ms
request/query | 1.99 ms | 1.88 ms | 1.95 ms | 1.96 ms | 3.56 ms
hooks/auth | 1.81 ms | 1.79 ms | 2.08 ms | 2.11 ms | 3.21 ms
errors/not-found | 1.90 ms | 2.00 ms | 1.88 ms | 1.91 ms | 3.21 ms
response/text | 2.00 ms | 2.00 ms | 2.00 ms | 1.93 ms | 3.00 ms

## Startup (ms, spawn to ready, lower is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 157 ms | 150 ms | 156 ms | 156 ms | 166 ms
routing/param | 159 ms | 157 ms | 166 ms | 157 ms | 165 ms
routing/many-routes | 172 ms | 164 ms | 156 ms | 155 ms | 165 ms
json/echo | 156 ms | 149 ms | 147 ms | 164 ms | 158 ms
validation/body | 157 ms | 164 ms | 151 ms | 151 ms | 150 ms
request/query | 156 ms | 171 ms | 164 ms | 149 ms | 157 ms
hooks/auth | 157 ms | 157 ms | 150 ms | 149 ms | 157 ms
errors/not-found | 157 ms | 155 ms | 780 ms | 150 ms | 157 ms
response/text | 177 ms | 164 ms | 158 ms | 150 ms | 164 ms

## Memory after load (MB, RSS, lower is better)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 81.5 MB | 81.9 MB | 95.0 MB | 85.9 MB | 111.2 MB
routing/param | 83.2 MB | 80.5 MB | 97.7 MB | 88.2 MB | 110.6 MB
routing/many-routes | 87.5 MB | 82.8 MB | 101.3 MB | 87.3 MB | 114.2 MB
json/echo | 83.3 MB | 81.2 MB | 91.0 MB | 87.5 MB | 110.6 MB
validation/body | 89.7 MB | 93.2 MB | 104.4 MB | 89.3 MB | 118.0 MB
request/query | 87.6 MB | 88.1 MB | 97.0 MB | 88.9 MB | 114.3 MB
hooks/auth | 87.0 MB | 89.3 MB | 98.2 MB | 88.7 MB | 111.7 MB
errors/not-found | 88.8 MB | 80.9 MB | 90.1 MB | 87.1 MB | 125.7 MB
response/text | 84.0 MB | 82.7 MB | 96.7 MB | 87.9 MB | 112.4 MB

## Overall average (mean across all 9 scenarios)

BurgerAPI: 111,783 req/s (3 wins of 9)  
Elysia: 112,605 req/s (1 win of 9)  
Elysia 2: 113,111 req/s (4 wins of 9)  
Hono: 109,030 req/s (1 win of 9)  
Express: 60,405 req/s (0 wins of 9)

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
