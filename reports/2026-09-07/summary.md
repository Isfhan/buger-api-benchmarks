# BurgerAPI Benchmark Report

- Date: 2026-09-07
- Profile: default
- BurgerAPI: 1.0.0-beta.1
- Bun: 1.4.0
- OS: win32 x64
- CPU: Intel(R) Core(TM) i5-14400F (16 cores)
- Memory: 31.8 GB
- Git commit: 6ed45f0065eaa61482e5a64cb6c5522144994ee1

## Results

| Scenario | Target | req/s | p50 (ms) | p95 (ms) | p99 (ms) | Throughput (MB/s) | Errors |
| --- | --- | --- | --- | --- | --- | --- | --- |
| routing/static | GET /bench/routing/static | 103,294.01 | 2.59 | 3.1 | 3.65 | 21.18 | 0 |
| routing/dynamic | GET /bench/routing/user/42 | 93,802.31 | 2.61 | 3.26 | 3.95 | 19.32 | 0 |
| routing/wildcard | GET /bench/routing/files/a/b/c | 92,230.03 | 2.62 | 3.49 | 4.17 | 20.67 | 0 |
| routing/nested | GET /bench/routing/api/users/7/posts/99 | 85,126.58 | 3.09 | 3.99 | 5 | 19.97 | 0 |
| validation/none | GET /bench/validation/none?q=hello | 94,989 | 2.61 | 3.39 | 4.41 | 20.47 | 0 |
| validation/query | GET /bench/validation/query?q=hello | 91,415.83 | 2.63 | 3.58 | 4.28 | 19.79 | 0 |
| validation/params | GET /bench/validation/user/42 | 89,100.62 | 2.63 | 4 | 5 | 18.61 | 0 |
| validation/body | POST /bench/validation/body | 77,397.1 | 3.15 | 4.37 | 5.55 | 22.07 | 0 |
| validation/coerce | GET /bench/validation/coerce?n=1&b=true | 88,578.14 | 2.66 | 3.64 | 4.18 | 20.27 | 0 |
| validation/response | GET /bench/validation/response | 90,496.65 | 2.63 | 3.6 | 4.21 | 18.99 | 0 |
| request/query-parsing | GET /bench/request/query?q=hello&lang=en | 93,250.33 | 2.62 | 3.37 | 3.98 | 20.63 | 0 |
| request/response-mutation | GET /bench/request/set | 93,307.09 | 2.62 | 3.39 | 4.03 | 22.33 | 0 |
| request/json | GET /bench/request/json | 104,756.44 | 2.59 | 3.05 | 3.56 | 23.67 | 0 |
| errors/404 | GET /bench/errors/missing | 88,328.07 | 2.71 | 3.64 | 4.17 | 23.67 | 883449 |
| errors/405 | POST /bench/errors/method | 100,966.23 | 2.6 | 3.11 | 3.61 | 36.88 | 1009833 |
| errors/validation | POST /bench/errors/validate | 46,061.68 | 5.35 | 6.62 | 7.41 | 49.63 | 460839 |
| phase1/dev-static | GET /bench/phase1/static | 84,361.19 | 3.12 | 3.75 | 4.37 | 22.52 | 843752 |
| phase1/dev-dynamic | GET /bench/phase1/users/42 | 83,015.13 | 3.12 | 3.75 | 4.38 | 22.32 | 830379 |
| optimize/fallback-trie | GET /bench/opt/user/42/ | 77,760.04 | 3.14 | 4.02 | 4.77 | 20.69 | 777794 |
| optimize/fallback-regex | GET /bench/opt/user/42/ | 80,069.94 | 3.13 | 3.98 | 4.79 | 21.3 | 800865 |
| optimize/hooks-interpreter | GET /bench/opt/hooks | 100,777.98 | 2.59 | 3.12 | 3.64 | 20.18 | 0 |
| optimize/hooks-jit | GET /bench/opt/hooks | 104,832.6 | 2.58 | 2.96 | 3.47 | 20.99 | 0 |
| optimize/set-clean | GET /bench/opt/clean | 104,944.37 | 2.58 | 2.97 | 3.59 | 21.02 | 0 |
| optimize/many-trie | GET /bench/opt/target/77/ | 82,328.48 | 3.12 | 3.77 | 4.46 | 22.06 | 823521 |
| optimize/many-regex | GET /bench/opt/target/77/ | 80,356.88 | 3.13 | 3.88 | 4.57 | 21.53 | 803722 |
