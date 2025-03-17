### Benchmark Analysis: Comparing Server Configurations

The provided benchmark results compare the performance of four server configurations—**Node.js with Express**, **Bun with Express**, **Bun with Elysia**, and **Bun with BurgerAPI**—under a consistent test setup of **100 connections over 10 seconds**. The system specifications for the test environment are:

- **CPU**: 6 cores, Intel(R) Core(TM) i5-9400 @ 2.90 GHz
- **Memory**: 15.95 GB
- **OS**: Windows 10.0.19045
- **Node.js**: v22.14.0
- **Bun.js**: v1.2.5

Below, I’ll analyze key performance metrics—total requests, requests per second (Req/Sec), average latency, 99th percentile latency, and throughput—to determine how these configurations compare and identify the fastest performer.

---

#### 1. Total Requests Handled

This metric indicates the total number of requests processed during the test duration.

- **Node.js with Express**: 80,892 requests (11.04s)
- **Bun with Express**: 258,140 requests (11.01s)
- **Bun with Elysia**: 379,148 requests (10.03s)
- **Bun with BurgerAPI**: 401,618 requests (11.02s)

**Observation**: Bun with BurgerAPI handled the highest number of requests (401,618), followed by Bun with Elysia (379,148). Bun with Express processed significantly fewer requests (258,140), while Node.js with Express trailed far behind (80,892).

---

#### 2. Requests per Second (Req/Sec)

This measures the average number of requests handled per second, reflecting throughput efficiency.

- **Node.js with Express**: 7,354.73 Req/Sec
- **Bun with Express**: 23,471.28 Req/Sec
- **Bun with Elysia**: 37,913.60 Req/Sec
- **Bun with BurgerAPI**: 36,507.64 Req/Sec

**Observation**: Bun with Elysia leads with the highest Req/Sec (37,913.60), closely followed by Bun with BurgerAPI (36,507.64). Bun with Express (23,471.28) outperforms Node.js with Express (7,354.73) by a wide margin.

---

#### 3. Average Latency

Average latency represents the mean time taken to process a request and return a response.

- **Node.js with Express**: 13.09 ms
- **Bun with Express**: 3.90 ms
- **Bun with Elysia**: 2.05 ms
- **Bun with BurgerAPI**: 2.11 ms

**Observation**: Bun with Elysia has the lowest average latency (2.05 ms), with Bun with BurgerAPI nearly matching it at 2.11 ms. Bun with Express (3.90 ms) is notably faster than Node.js with Express (13.09 ms).

---

#### 4. 99th Percentile Latency

This metric shows the latency experienced by 99% of requests, indicating performance under high load.

- **Node.js with Express**: 79.00 ms
- **Bun with Express**: 6.00 ms
- **Bun with Elysia**: 3.00 ms
- **Bun with BurgerAPI**: 4.00 ms

**Observation**: Bun with Elysia again excels with the lowest 99th percentile latency (3.00 ms), followed by Bun with BurgerAPI (4.00 ms). Bun with Express (6.00 ms) performs well, while Node.js with Express has a significantly higher latency (79.00 ms).

---

#### 5. Throughput (MB/s)

Throughput measures the data transfer rate in megabytes per second.

- **Node.js with Express**: 1.82 MB/s
- **Bun with Express**: 4.77 MB/s
- **Bun with Elysia**: 5.31 MB/s
- **Bun with BurgerAPI**: 4.63 MB/s

**Observation**: Bun with Elysia achieves the highest throughput (5.31 MB/s), followed by Bun with Express (4.77 MB/s) and Bun with BurgerAPI (4.63 MB/s). Node.js with Express lags at 1.82 MB/s.

---

#### Summary of Performance Rankings

Based on the metrics above, here’s how the configurations rank:

1. **Bun with Elysia**

   - **Total Requests**: 379,148 (2nd)
   - **Req/Sec**: 37,913.60 (1st)
   - **Avg Latency**: 2.05 ms (1st)
   - **99th Latency**: 3.00 ms (1st)
   - **Throughput**: 5.31 MB/s (1st)
   - **Strengths**: Leads in Req/Sec, latency, and throughput, making it the most balanced and efficient performer.

2. **Bun with BurgerAPI**

   - **Total Requests**: 401,618 (1st)
   - **Req/Sec**: 36,507.64 (2nd)
   - **Avg Latency**: 2.11 ms (2nd)
   - **99th Latency**: 4.00 ms (2nd)
   - **Throughput**: 4.63 MB/s (3rd)
   - **Strengths**: Excels in total requests, with latency and Req/Sec very close to Elysia, though throughput is slightly lower.

3. **Bun with Express**

   - **Total Requests**: 258,140 (3rd)
   - **Req/Sec**: 23,471.28 (3rd)
   - **Avg Latency**: 3.90 ms (3rd)
   - **99th Latency**: 6.00 ms (3rd)
   - **Throughput**: 4.77 MB/s (2nd)
   - **Strengths**: Solid performance, significantly better than Node.js, but trails the other Bun configurations.

4. **Node.js with Express**
   - **Total Requests**: 80,892 (4th)
   - **Req/Sec**: 7,354.73 (4th)
   - **Avg Latency**: 13.09 ms (4th)
   - **99th Latency**: 79.00 ms (4th)
   - **Throughput**: 1.82 MB/s (4th)
   - **Weaknesses**: Lags in all metrics, making it the slowest configuration.

---

#### Additional Notes

- **Errors and Non-2xx Responses**: All configurations reported zero errors and non-2xx responses, indicating reliable operation during the test.
- **Test Consistency**: The slightly varying durations (10.03s to 11.04s) are typical in benchmarking due to system overhead, but they don’t significantly skew the results.

---

#### Conclusion: Which is the Fastest?

**Bun with Elysia** emerges as the fastest overall performer in this benchmark. It excels in requests per second (37,913.60), average latency (2.05 ms), 99th percentile latency (3.00 ms), and throughput (5.31 MB/s), offering the best combination of speed and efficiency. While **Bun with BurgerAPI** handles the most total requests (401,618), its slightly higher latencies and lower throughput place it just behind Elysia in overall performance.

For most use cases—where low latency and high throughput are critical—**Bun with Elysia** is the top choice. However, if maximizing total request capacity is the priority (e.g., in scenarios with sustained high traffic), **Bun with BurgerAPI** could be a strong alternative. Both Bun-based configurations significantly outperform **Bun with Express** and **Node.js with Express**, with the latter being the slowest by a wide margin.
