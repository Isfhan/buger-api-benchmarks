# BurgerAPI Overhead — In-Process Fetch Handler Comparison

_Generated 2026-09-27 · Bun 1.4.2 · win32/x64 · Intel(R) Core(TM) i5-14400F_
**Frameworks:** BurgerAPI 1.0.0-beta (5ed2996, clean) · Elysia 1.4.30 · Elysia 2 2.0.0-beta.19 · Hono 4.13.9
**Method:** each contestant ran in its own process; 50,000 warm-up iterations, then 5 timed rounds of 300,000 iterations. Every iteration awaits the handler and reads the response body (`await res.text()`). Cells show the mean of the rounds with the ops/s min–max spread in parentheses.
**Request reuse:** bodyless requests are prebuilt once outside the timed loop; POST requests are rebuilt per iteration for every contestant (a body can be read only once), so the same construction cost is paid by all.
**Correctness gate:** identical to the HTTP battle — each contestant's handler was probed once before warm-up; status, content-type and body had to match the expected response, and validation scenarios had to reject an invalid body with a 4xx. A `FAIL` cell was not measured.
**Skipped:** Express — not fetch-based, so it has no in-process `Request → Response` handler to measure.

## Per scenario

### routing/static — Static GET route returning a small JSON body

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 2,041,437 ops/s (2,001,269–2,069,198) | 490
Elysia | 2,524,899 ops/s (2,357,669–2,591,390) | 397
Elysia 2 | 2,128,740 ops/s (2,093,931–2,180,954) | 470
Hono | 1,288,936 ops/s (1,262,407–1,305,273) | 776

### routing/param — Dynamic GET route with one :param returning JSON

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 1,456,145 ops/s (1,442,035–1,467,776) | 687
Elysia | 1,819,688 ops/s (1,805,227–1,847,218) | 550
Elysia 2 | 1,742,675 ops/s (1,721,047–1,770,513) | 574
Hono | 999,156 ops/s (991,025–1,003,205) | 1001

### routing/many-routes — App with 100 static + 100 parameterized routes, one param route hit

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 1,405,928 ops/s (1,393,190–1,411,550) | 711
Elysia | 1,867,483 ops/s (1,829,201–1,901,046) | 536
Elysia 2 | 1,723,111 ops/s (1,709,928–1,746,850) | 580
Hono | 771,781 ops/s (752,542–785,521) | 1296

### json/echo — GET returning a JSON object (serialization overhead)

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 1,835,789 ops/s (1,744,804–1,915,690) | 545
Elysia | 2,219,390 ops/s (2,141,292–2,269,364) | 451
Elysia 2 | 2,021,400 ops/s (1,970,332–2,042,641) | 495
Hono | 1,241,362 ops/s (1,211,773–1,263,496) | 806

### validation/body — POST with JSON body parsing + real schema validation, echoing the body

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 581,251 ops/s (569,459–586,166) | 1721
Elysia | 591,724 ops/s (588,938–595,841) | 1690
Elysia 2 | 609,270 ops/s (602,284–616,166) | 1641
Hono | 365,382 ops/s (359,896–369,500) | 2737

### request/query — GET reading two query string values through each framework query API

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 1,422,810 ops/s (1,387,295–1,436,712) | 703
Elysia | 1,623,473 ops/s (1,612,026–1,636,387) | 616
Elysia 2 | 1,529,846 ops/s (1,514,728–1,544,196) | 654
Hono | 896,998 ops/s (872,355–904,392) | 1115

### hooks/auth — GET guarded by a before-handler hook that checks the Authorization header

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 1,532,592 ops/s (1,525,413–1,536,907) | 652
Elysia | 1,697,346 ops/s (1,672,039–1,724,327) | 589
Elysia 2 | 1,803,403 ops/s (1,787,906–1,812,657) | 555
Hono | 757,282 ops/s (728,116–772,822) | 1321

### errors/not-found — Request to an unregistered path on a single-route app (404)

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 2,684,752 ops/s (2,437,045–2,774,141) | 373
Elysia | 3,481,837 ops/s (3,159,138–3,641,325) | 288
Elysia 2 | 2,410,755 ops/s (2,207,270–2,503,731) | 416
Hono | 994,729 ops/s (983,925–1,004,967) | 1005

### response/text — GET returning a plain-text body

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 1,639,480 ops/s (1,615,094–1,661,676) | 610
Elysia | 1,979,018 ops/s (1,937,141–2,012,400) | 505
Elysia 2 | 1,615,270 ops/s (1,585,901–1,631,876) | 619
Hono | 1,246,651 ops/s (1,221,601–1,258,225) | 802

## Overall mean (mean of the per-scenario means)

Contestant | Throughput | ns/op
--- | --- | ---
BurgerAPI | 1,622,243 ops/s | 721
Elysia | 1,978,318 ops/s | 625
Elysia 2 | 1,731,608 ops/s | 667
Hono | 951,364 ops/s | 1207

## Failed correctness checks

None. Every contestant passed the correctness gate.

## How to read this

This benchmark removes the network and the HTTP server: it calls each
framework's public in-process handler directly, so it measures framework
overhead alone. It is the right lens now that the HTTP battle is at parity
(Bun's single-thread HTTP ceiling dominates there).

> Footnote: BurgerAPI's Bun `serve()` path is not measured here. On Bun,
> `serve()` uses native per-method `routes` (static + `:param` + `*`) and
> never enters this fetch handler for matched paths. This benchmark measures the
> portable fetch path — `burger.fetchHandler()` / `toFetchHandler()` — the
> same code that runs on Cloudflare Workers, Deno, Vercel and node-server.
> Elysia and Hono numbers are their public in-process handlers
> (`app.handle` / `app.fetch`).
