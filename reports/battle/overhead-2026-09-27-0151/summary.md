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
BurgerAPI | 1,249,618 ops/s (1,221,953–1,263,076) | 800

### routing/param — Dynamic GET route with one :param returning JSON

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 829,263 ops/s (822,505–837,499) | 1206

### routing/many-routes — App with 100 static + 100 parameterized routes, one param route hit

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 856,499 ops/s (840,223–876,390) | 1168

### json/echo — GET returning a JSON object (serialization overhead)

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 1,169,599 ops/s (1,145,671–1,189,187) | 855

### validation/body — POST with JSON body parsing + real schema validation, echoing the body

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 460,340 ops/s (452,757–467,803) | 2173

### request/query — GET reading two query string values through each framework query API

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 971,821 ops/s (959,353–998,069) | 1029

### hooks/auth — GET guarded by a before-handler hook that checks the Authorization header

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 947,534 ops/s (932,988–964,586) | 1056

### errors/not-found — Request to an unregistered path on a single-route app (404)

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 1,089,412 ops/s (1,070,278–1,107,315) | 918

### response/text — GET returning a plain-text body

Contestant | Throughput | ns/op (mean)
--- | --- | ---
BurgerAPI | 1,013,326 ops/s (953,317–1,050,259) | 988

## Overall mean (mean of the per-scenario means)

Contestant | Throughput | ns/op
--- | --- | ---
BurgerAPI | 954,157 ops/s | 1133

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
