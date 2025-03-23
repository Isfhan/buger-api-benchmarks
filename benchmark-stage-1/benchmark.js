const autocannon = require('autocannon');
const os = require('os');


// Gather system specifications
const cpus = os.cpus();
const cpuModel = cpus[0].model;
const numCores = cpus.length;
const cpuSpeed = cpus[0].speed > 0 ? ` @ ${(cpus[0].speed / 1000).toFixed(2)} GHz` : '';
const cpuInfo = `${numCores} cores, ${cpuModel}${cpuSpeed}`;
const totalMemoryGB = (os.totalmem() / (1024 ** 3)).toFixed(2);
const osName = {
  'Linux': 'Linux',
  'Darwin': 'macOS',
  'Windows_NT': 'Windows'
}[os.type()] || os.type();
const osVersion = os.release();
const nodeVersion = process.version;
const bunVersion = '1.2.5';

// Function to print system specifications
function printSystemSpecs() {
  console.log("System Specifications:");
  console.log(`- CPU: ${cpuInfo}`);
  console.log(`- Memory: ${totalMemoryGB} GB`);
  console.log(`- OS: ${osName} ${osVersion}`);
  console.log(`- Node.js: ${nodeVersion}`);
  console.log(`- Bun.js: ${bunVersion}`);
  console.log();
}

// Function to run a benchmark on a given URL
async function runBenchmark(url, serverName) {
  console.log(`Benchmarking ${serverName} (${url}):`);
  return new Promise((resolve, reject) => {
    const instance = autocannon({
      url,
      connections: 500, // Number of concurrent connections
      duration: 10,     // Duration in seconds
    }, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
    autocannon.track(instance, { renderProgressBar: true });
  });
}

// Main async function to execute the benchmarks
(async () => {
  // Print system specs before starting benchmarks
  printSystemSpecs();
  console.log("Starting benchmarks...\n");

  // Benchmark Node.js with Express on port 1000
  const nodeExpressResults = await runBenchmark('http://localhost:1000/api', 'Node.js with Express');

  // Benchmark Bun with Express on port 2000
  const bunExpressResults = await runBenchmark('http://localhost:2000/api', 'Bun with Express');

  // Benchmark Bun with Elysia on port 3000
  const bunElysiaResults = await runBenchmark('http://localhost:3000/api', 'Bun with Elysia');

  // Benchmark Bun with Hono on port 4000
  const bunHonoResults = await runBenchmark('http://localhost:4000/api', 'Bun with Hono');

  // Benchmark Bun with BurgerAPI on port 5000
  const bunBurgerResults = await runBenchmark('http://localhost:5000/api', 'Bun with BurgerAPI');



  // Extract key metrics for comparison
  const metrics = [
    {
      Server: 'Node.js with Express',
      'Duration (s)': nodeExpressResults.duration.toFixed(2),
      'Total Requests': nodeExpressResults.requests.total,
      'Req/Sec': nodeExpressResults.requests.average.toFixed(2),
      'Avg Latency (ms)': nodeExpressResults.latency.average.toFixed(2),
      '99th Latency (ms)': nodeExpressResults.latency.p99.toFixed(2),
      'Errors': nodeExpressResults.errors,
      'Non-2xx': nodeExpressResults.non2xx,
      'Throughput (MB/s)': (nodeExpressResults.throughput.average / 1024 / 1024).toFixed(2),
    },
    {
      Server: 'Bun with Express',
      'Duration (s)': bunExpressResults.duration.toFixed(2),
      'Total Requests': bunExpressResults.requests.total,
      'Req/Sec': bunExpressResults.requests.average.toFixed(2),
      'Avg Latency (ms)': bunExpressResults.latency.average.toFixed(2),
      '99th Latency (ms)': bunExpressResults.latency.p99.toFixed(2),
      'Errors': bunExpressResults.errors,
      'Non-2xx': bunExpressResults.non2xx,
      'Throughput (MB/s)': (bunExpressResults.throughput.average / 1024 / 1024).toFixed(2),
    },
    {
      Server: 'Bun with Elysia',
      'Duration (s)': bunElysiaResults.duration.toFixed(2),
      'Total Requests': bunElysiaResults.requests.total,
      'Req/Sec': bunElysiaResults.requests.average.toFixed(2),
      'Avg Latency (ms)': bunElysiaResults.latency.average.toFixed(2),
      '99th Latency (ms)': bunElysiaResults.latency.p99.toFixed(2),
      'Errors': bunElysiaResults.errors,
      'Non-2xx': bunElysiaResults.non2xx,
      'Throughput (MB/s)': (bunElysiaResults.throughput.average / 1024 / 1024).toFixed(2),
    },
    {
      Server: 'Bun with Hono',
      'Duration (s)': bunHonoResults.duration.toFixed(2),
      'Total Requests': bunHonoResults.requests.total,
      'Req/Sec': bunHonoResults.requests.average.toFixed(2),
      'Avg Latency (ms)': bunHonoResults.latency.average.toFixed(2),
      '99th Latency (ms)': bunHonoResults.latency.p99.toFixed(2),
      'Errors': bunHonoResults.errors,
      'Non-2xx': bunHonoResults.non2xx,
      'Throughput (MB/s)': (bunHonoResults.throughput.average / 1024 / 1024).toFixed(2),
    },
    {
      Server: 'Bun with BurgerAPI',
      'Duration (s)': bunBurgerResults.duration.toFixed(2),
      'Total Requests': bunBurgerResults.requests.total,
      'Req/Sec': bunBurgerResults.requests.average.toFixed(2),
      'Avg Latency (ms)': bunBurgerResults.latency.average.toFixed(2),
      '99th Latency (ms)': bunBurgerResults.latency.p99.toFixed(2),
      'Errors': bunBurgerResults.errors,
      'Non-2xx': bunBurgerResults.non2xx,
      'Throughput (MB/s)': (bunBurgerResults.throughput.average / 1024 / 1024).toFixed(2),
    },
  ];

  // Display benchmark configuration and results
  console.log("\nBenchmark Configuration: 500 connections, 10 seconds");
  console.log("Benchmark Comparison:");
  console.table(metrics);
})();