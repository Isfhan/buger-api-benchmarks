# BurgerAPI Overhead — In-Process Fetch Handler Comparison

_Generated 2026-09-26 · Bun 1.4.2 · win32/x64 · Intel(R) Core(TM) i5-14400F_
**Frameworks:** BurgerAPI 1.0.0-beta · Elysia 1.4.30 · Elysia 2 2.0.0-beta.19 · Hono 4.13.9
**Method:** each contestant ran in its own process; 50,000 warm-up iterations, then 5 timed rounds of 300,000 iterations. Every iteration awaits the handler and reads the response body (`await res.text()`). Cells show the mean of the rounds with the ops/s min–max spread in parentheses.
**Request reuse:** bodyless requests are prebuilt once outside the timed loop; POST requests are rebuilt per iteration for every contestant (a body can be read only once), so the same construction cost is paid by all.
**Correctness gate:** identical to the HTTP battle — each contestant's handler was probed once before warm-up; status, content-type and body had to match the expected response, and validation scenarios had to reject an invalid body with a 4xx. A `FAIL` cell was not measured.
**Skipped:** Express — not fetch-based, so it has no in-process `Request → Response` handler to measure.

## Per scenario

### routing/static — Static GET route returning a small JSON body

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 2,099,406 ops/s (2,076,340–2,135,216) | 476
Elysia | 2,563,851 ops/s (2,500,873–2,633,120) | 390
Elysia 2 | 2,242,726 ops/s (2,175,553–2,300,299) | 446
Hono | 1,333,345 ops/s (1,313,348–1,360,295) | 750

### routing/param — Dynamic GET route with one :param returning JSON

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 1,454,201 ops/s (1,425,620–1,491,186) | 688
Elysia | 1,890,551 ops/s (1,858,934–1,930,420) | 529
Elysia 2 | 1,783,893 ops/s (1,734,804–1,816,297) | 561
Hono | 1,027,589 ops/s (1,005,437–1,046,341) | 973

### routing/many-routes — App with 100 static + 100 parameterized routes, one param route hit

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 1,548,481 ops/s (1,523,058–1,591,469) | 646
Elysia | 1,928,304 ops/s (1,839,996–1,977,724) | 519
Elysia 2 | 1,789,725 ops/s (1,747,730–1,848,990) | 559
Hono | 786,641 ops/s (779,092–793,190) | 1271

### json/echo — GET returning a JSON object (serialization overhead)

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 1,906,330 ops/s (1,883,873–1,926,941) | 525
Elysia | 2,277,895 ops/s (2,219,981–2,306,317) | 439
Elysia 2 | 2,081,305 ops/s (2,071,092–2,094,432) | 480
Hono | 1,253,011 ops/s (1,240,391–1,268,995) | 798

### validation/body — POST with JSON body parsing + real schema validation, echoing the body

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 590,395 ops/s (579,870–596,520) | 1694
Elysia | 601,824 ops/s (595,640–608,953) | 1662
Elysia 2 | 618,755 ops/s (612,765–623,043) | 1616
Hono | 380,661 ops/s (377,318–382,519) | 2627

### request/query — GET reading two query string values through each framework query API

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 1,484,632 ops/s (1,459,877–1,506,931) | 674
Elysia | 1,647,922 ops/s (1,617,510–1,670,158) | 607
Elysia 2 | 1,572,657 ops/s (1,525,999–1,626,629) | 636
Hono | 942,190 ops/s (933,699–951,182) | 1061

### hooks/auth — GET guarded by a before-handler hook that checks the Authorization header

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 1,587,156 ops/s (1,538,876–1,643,361) | 630
Elysia | 1,704,759 ops/s (1,656,938–1,780,914) | 587
Elysia 2 | 1,881,913 ops/s (1,850,850–1,905,431) | 531
Hono | 791,351 ops/s (776,383–797,721) | 1264

### errors/not-found — Request to an unregistered path on a single-route app (404)

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 2,759,949 ops/s (2,680,065–2,829,062) | 362
Elysia | 3,552,164 ops/s (3,280,987–3,634,729) | 282
Elysia 2 | 2,560,136 ops/s (2,500,240–2,603,414) | 391
Hono | 1,037,634 ops/s (1,011,916–1,055,799) | 964

### response/text — GET returning a plain-text body

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 1,718,140 ops/s (1,690,692–1,765,059) | 582
Elysia | 1,987,260 ops/s (1,885,691–2,040,757) | 504
Elysia 2 | 1,666,324 ops/s (1,630,826–1,691,359) | 600
Hono | 1,285,136 ops/s (1,276,540–1,289,426) | 778

## Overall mean (mean of the per-scenario means)

Contestant | Throughput | ns/op
--- | --- | ---
BurgerAPI | 1,683,188 ops/s | 697
Elysia | 2,017,170 ops/s | 613
Elysia 2 | 1,799,715 ops/s | 647
Hono | 981,951 ops/s | 1165

## Failed correctness checks

None. Every contestant passed the correctness gate.

## How to read this

This benchmark removes the network and the HTTP server: it calls each
framework's public in-process handler directly, so it measures framework
overhead alone. It is the right lens now that the HTTP battle is at parity
(Bun's single-thread HTTP ceiling dominates there).

> Footnote: BurgerAPI's Bun `serve()` path is not measured here. On Bun,
> `serve()` uses native per-method `routes` (static + `:param`) and never
> enters this fetch handler for matched paths. This benchmark measures the
> portable fetch path — `burger.fetchHandler()` / `toFetchHandler()` — the
> same code that runs on Cloudflare Workers, Deno, Vercel and node-server.
> Elysia and Hono numbers are their public in-process handlers
> (`app.handle` / `app.fetch`).
