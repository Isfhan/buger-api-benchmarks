# BurgerAPI Battle — Averaged (3 runs)

_Mean of 3 consecutive `bun run battle --profile ci` runs on the same machine (128 connections, 8s duration, 2s warm-up each), to smooth single-run scheduler noise on a shared desktop._

**Environment:** win32/x64 · Intel(R) Core(TM) i5-14400F (16 threads) · 31.8 GB RAM · Bun 1.4.0

## Throughput (requests/sec, mean of 3 runs)

Scenario | BurgerAPI | Elysia | Elysia 2 | Hono | Express
--- | --- | --- | --- | --- | ---
routing/static | 104,234 req/s | 111,869 req/s | 107,121 req/s | 103,928 req/s | 62,240 req/s
routing/param | 98,269 req/s | 110,834 req/s | 108,139 req/s | 104,398 req/s | 59,827 req/s
json/echo | 107,109 req/s | 105,569 req/s | 100,960 req/s | 100,513 req/s | 57,200 req/s
validation/body | 88,676 req/s | 88,142 req/s | 89,467 req/s | 83,378 req/s | 43,994 req/s

## Overall average (mean across all 4 scenarios)

BurgerAPI: 99,572 req/s  
Elysia: 104,103 req/s  
Elysia 2: 101,422 req/s  
Hono: 98,054 req/s  
Express: 55,815 req/s
