# BurgerAPI Benchmark Report

- Date: 2026-09-06
- Profile: default
- BurgerAPI: 1.0.0-beta.1
- Bun: 1.4.0
- OS: win32 x64
- CPU: x64
- Memory: unknown
- Git commit: 0621fdc1ff230e5f8248525f39ee7a6c367f9992

## Results

| Scenario | Target | req/s | p50 (ms) | p95 (ms) | p99 (ms) | Throughput (MB/s) | Errors |
| --- | --- | --- | --- | --- | --- | --- | --- |
| routing/static | GET /bench/routing/static | 104,408.69 | 2.07 | 3 | 4 | 21.41 | 0 |
| routing/dynamic | GET /bench/routing/user/42 | 100,950.52 | 2.59 | 3.05 | 4 | 20.79 | 0 |
| routing/wildcard | GET /bench/routing/files/a/b/c | 94,465.15 | 3 | 3.44 | 4 | 21.17 | 0 |
| routing/nested | GET /bench/routing/api/users/7/posts/99 | 96,078.43 | 3 | 3.12 | 4 | 22.54 | 0 |
| validation/none | GET /bench/validation/none?q=hello | 96,670.72 | 2.99 | 3.19 | 4 | 20.83 | 0 |
| validation/query | GET /bench/validation/query?q=hello | 91,739.76 | 3 | 4 | 4.01 | 19.86 | 0 |
| validation/params | GET /bench/validation/user/42 | 93,828.17 | 3 | 4 | 4 | 19.59 | 0 |
| validation/body | POST /bench/validation/body | 89,451.42 | 3 | 4 | 4.2 | 25.5 | 0 |
| validation/coerce | GET /bench/validation/coerce?n=1&b=true | 91,471.65 | 3 | 4 | 4.08 | 20.93 | 0 |
| validation/response | GET /bench/validation/response | 100,297.94 | 2.65 | 3.01 | 4 | 21.04 | 0 |
| request/query-parsing | GET /bench/request/query?q=hello&lang=en | 104,103.15 | 2.01 | 3 | 4 | 23.03 | 0 |
| request/response-mutation | GET /bench/request/set | 102,875.44 | 2.11 | 3 | 4 | 24.62 | 0 |
| request/json | GET /bench/request/json | 106,060.16 | 2.02 | 3 | 3.97 | 23.97 | 0 |
| errors/404 | GET /bench/errors/missing | 94,543.48 | 3 | 3.24 | 4 | 25.33 | 945587 |
| errors/405 | POST /bench/errors/method | 110,053.79 | 2 | 3 | 3.4 | 40.19 | 1100712 |
| errors/validation | POST /bench/errors/validate | 42,585.09 | 6 | 7 | 7.88 | 45.89 | 426126 |
| phase1/dev-static | GET /bench/phase1/static | 92,504.09 | 3 | 4 | 4 | 24.7 | 925276 |
| phase1/dev-dynamic | GET /bench/phase1/users/42 | 94,701.63 | 3 | 3.2 | 4 | 25.46 | 947194 |
| optimize/fallback-trie | GET /bench/opt/user/42/ | 88,635.13 | 3 | 4 | 4 | 23.58 | 886577 |
| optimize/fallback-regex | GET /bench/opt/user/42/ | 81,361.84 | 3 | 4 | 5.25 | 21.64 | 813752 |
| optimize/hooks-interpreter | GET /bench/opt/hooks | 100,010.51 | 2.62 | 3.01 | 4 | 20.03 | 0 |
| optimize/hooks-jit | GET /bench/opt/hooks | 102,975 | 2.48 | 3 | 4 | 20.62 | 0 |
| optimize/set-clean | GET /bench/opt/clean | 107,100.58 | 2.06 | 3 | 3.61 | 21.45 | 0 |
| optimize/many-trie | GET /bench/opt/target/77/ | 89,540.34 | 3 | 4 | 4 | 23.99 | 895584 |
| optimize/many-regex | GET /bench/opt/target/77/ | 86,507.48 | 3 | 4 | 4.51 | 23.18 | 865158 |
