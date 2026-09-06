# BurgerAPI Benchmark Report

- Date: 2026-09-06
- Profile: default
- BurgerAPI: 1.0.0-beta.1
- Bun: 1.4.0
- OS: win32 x64
- CPU: x64
- Memory: unknown
- Git commit: 257067dbb90a9c601ae3d0eefc405170e64ccc28

## Results

| Scenario | Target | req/s | p50 (ms) | p95 (ms) | p99 (ms) | Throughput (MB/s) | Errors |
| --- | --- | --- | --- | --- | --- | --- | --- |
| routing/static | GET /bench/routing/static | 109,094.17 | 2.12 | 2.82 | 3.37 | 22.37 | 0 |
| routing/dynamic | GET /bench/routing/user/42 | 106,736.74 | 2.23 | 3.08 | 3.58 | 21.98 | 0 |
| routing/wildcard | GET /bench/routing/files/a/b/c | 106,881.99 | 2.27 | 3.03 | 3.48 | 23.95 | 0 |
| routing/nested | GET /bench/routing/api/users/7/posts/99 | 101,222.61 | 2.6 | 3.14 | 3.68 | 23.75 | 0 |
| validation/none | GET /bench/validation/none?q=hello | 110,145.57 | 2.11 | 2.92 | 3.51 | 23.74 | 0 |
| validation/query | GET /bench/validation/query?q=hello | 107,061.46 | 2.17 | 3.1 | 3.6 | 23.17 | 0 |
| validation/params | GET /bench/validation/user/42 | 102,115.21 | 2.6 | 3.2 | 3.74 | 21.33 | 0 |
| validation/body | POST /bench/validation/body | 95,925.65 | 2.61 | 3.31 | 3.83 | 27.35 | 0 |
| validation/coerce | GET /bench/validation/coerce?n=1&b=true | 102,458.45 | 2.6 | 3.16 | 3.63 | 23.45 | 0 |
| validation/response | GET /bench/validation/response | 104,456.25 | 2.59 | 3.12 | 3.63 | 21.91 | 0 |
| request/query-parsing | GET /bench/request/query?q=hello&lang=en | 106,250.24 | 2.58 | 3.01 | 3.52 | 23.51 | 0 |
| request/response-mutation | GET /bench/request/set | 106,432.55 | 2.5 | 3.05 | 3.49 | 25.47 | 0 |
| request/json | GET /bench/request/json | 106,345.87 | 2.44 | 3 | 3.56 | 24.03 | 0 |
| errors/404 | GET /bench/errors/missing | 96,759 | 2.61 | 3.27 | 3.78 | 25.93 | 967832 |
| errors/405 | POST /bench/errors/method | 113,338.51 | 2.1 | 2.7 | 3.26 | 41.39 | 1133599 |
| errors/validation | POST /bench/errors/validate | 43,046.08 | 5.83 | 6.83 | 7.25 | 46.38 | 430679 |
| phase1/dev-static | GET /bench/phase1/static | 98,207.21 | 2.61 | 3.25 | 3.76 | 26.22 | 982305 |
| phase1/dev-dynamic | GET /bench/phase1/users/42 | 95,524.62 | 2.62 | 3.35 | 3.84 | 25.69 | 955451 |
| optimize/fallback-trie | GET /bench/opt/user/42/ | 89,152.45 | 2.64 | 3.61 | 4.13 | 23.72 | 891586 |
| optimize/fallback-regex | GET /bench/opt/user/42/ | 89,098.43 | 2.65 | 3.61 | 4.18 | 23.7 | 891210 |
| optimize/hooks-interpreter | GET /bench/opt/hooks | 112,614.74 | 2.1 | 2.88 | 3.37 | 22.55 | 0 |
| optimize/hooks-jit | GET /bench/opt/hooks | 115,308.67 | 2.09 | 2.73 | 3.3 | 23.09 | 0 |
| optimize/set-clean | GET /bench/opt/clean | 107,064.88 | 2.57 | 2.84 | 3.44 | 21.44 | 0 |
| optimize/many-trie | GET /bench/opt/target/77/ | 90,974.97 | 2.63 | 3.47 | 4.13 | 24.38 | 909887 |
| optimize/many-regex | GET /bench/opt/target/77/ | 88,289.18 | 2.66 | 3.65 | 4.39 | 23.66 | 883082 |
