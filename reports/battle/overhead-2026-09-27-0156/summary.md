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
BurgerAPI | 2,063,771 ops/s (2,014,058–2,122,701) | 485
Elysia | 2,631,550 ops/s (2,575,406–2,667,990) | 380
Elysia 2 | 2,174,831 ops/s (2,102,320–2,208,217) | 460
Hono | 1,255,267 ops/s (1,169,262–1,358,192) | 799

### routing/param — Dynamic GET route with one :param returning JSON

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 1,489,091 ops/s (1,471,210–1,508,413) | 672
Elysia | 1,777,281 ops/s (1,626,950–1,924,456) | 565
Elysia 2 | 1,789,969 ops/s (1,673,421–1,857,845) | 560
Hono | 1,038,541 ops/s (1,031,713–1,047,513) | 963

### routing/many-routes — App with 100 static + 100 parameterized routes, one param route hit

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 1,579,654 ops/s (1,563,228–1,598,966) | 633
Elysia | 1,903,489 ops/s (1,831,314–1,984,515) | 526
Elysia 2 | 1,796,356 ops/s (1,732,585–1,833,773) | 557
Hono | 797,993 ops/s (792,520–807,588) | 1253

### json/echo — GET returning a JSON object (serialization overhead)

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 1,925,497 ops/s (1,864,856–1,970,274) | 520
Elysia | 2,327,115 ops/s (2,277,752–2,395,204) | 430
Elysia 2 | 2,018,549 ops/s (1,921,136–2,067,005) | 496
Hono | 1,271,066 ops/s (1,242,508–1,305,935) | 787

### validation/body — POST with JSON body parsing + real schema validation, echoing the body

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 585,660 ops/s (581,023–592,546) | 1708
Elysia | 596,763 ops/s (585,876–606,613) | 1676
Elysia 2 | 614,665 ops/s (611,297–618,576) | 1627
Hono | 384,628 ops/s (382,815–386,656) | 2600

### request/query — GET reading two query string values through each framework query API

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 1,443,158 ops/s (1,402,805–1,465,843) | 693
Elysia | 1,657,457 ops/s (1,488,258–1,735,322) | 605
Elysia 2 | 1,550,456 ops/s (1,501,716–1,592,995) | 645
Hono | 919,694 ops/s (867,928–952,749) | 1088

### hooks/auth — GET guarded by a before-handler hook that checks the Authorization header

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 1,587,483 ops/s (1,562,028–1,631,187) | 630
Elysia | 1,713,015 ops/s (1,591,476–1,790,188) | 585
Elysia 2 | 1,870,578 ops/s (1,806,894–1,913,408) | 535
Hono | 785,798 ops/s (773,635–802,322) | 1273

### errors/not-found — Request to an unregistered path on a single-route app (404)

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 2,841,677 ops/s (2,732,554–2,917,811) | 352
Elysia | 3,586,826 ops/s (3,528,843–3,646,663) | 279
Elysia 2 | 2,581,082 ops/s (2,489,922–2,641,536) | 388
Hono | 1,028,766 ops/s (1,012,626–1,047,709) | 972

### response/text — GET returning a plain-text body

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 1,704,662 ops/s (1,675,833–1,731,611) | 587
Elysia | 2,024,968 ops/s (1,928,738–2,069,041) | 494
Elysia 2 | 1,673,736 ops/s (1,630,451–1,705,795) | 598
Hono | 1,297,235 ops/s (1,277,340–1,313,109) | 771

## Overall mean (mean of the per-scenario means)

Contestant | Throughput | ns/op
--- | --- | ---
BurgerAPI | 1,691,184 ops/s | 698
Elysia | 2,024,274 ops/s | 616
Elysia 2 | 1,785,580 ops/s | 652
Hono | 975,443 ops/s | 1167

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
