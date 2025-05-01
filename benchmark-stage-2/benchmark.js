const { execSync } = require('child_process');
const os = require('os');

// Gather system specifications
function getSystemSpecs() {
    const cpus = os.cpus();
    return {
        cpu: `${cpus.length} cores, ${cpus[0].model} @ ${(cpus[0].speed / 1000).toFixed(1)}GHz`,
        memory: `${(os.totalmem() / 1024 ** 3).toFixed(1)} GB`,
        os: `${os.type()} ${os.release()}`,
        node: process.version,
        bun: Bun.version // Dynamically detect Bun version (if using Bun)
    };
}

// Run Bombardier benchmark and parse metrics
function runBenchmark(url) {
    try {
        const command = `bombardier -c 500 -d 10s -l ${url}`;
        const output = execSync(command, { encoding: 'utf-8' });
        // Example expected output snippet:
        //   Reqs/sec    264560.00   10733.06     268434
        //   Latency      471.00us   522.34us    51.00ms
        //   99%         48.00ms
        //   Throughput:   292.92MB/s

        // Parse Requests per Second (Reqs/sec)
        const reqSecMatch = output.match(/Reqs\/sec\s+([\d,]+)/i);
        let reqSec = reqSecMatch ? parseFloat(reqSecMatch[1].replace(/,/g, '')) : 0;

        // Parse average latency and its unit
        const latencyAvgMatch = output.match(/Latency\s+([\d.]+)(ms|us)/i);
        let latencyAvg = 0;
        if (latencyAvgMatch) {
            latencyAvg = parseFloat(latencyAvgMatch[1]);
            if (latencyAvgMatch[2].toLowerCase() === 'us') {
                latencyAvg /= 1000; // convert microseconds to milliseconds
            }
        }

        // Parse 99th percentile latency from the "99%" line
        const latency99Match = output.match(/99%\s+([\d.]+)(ms|us)/i);
        let latency99 = 0;
        if (latency99Match) {
            latency99 = parseFloat(latency99Match[1]);
            if (latency99Match[2].toLowerCase() === 'us') {
                latency99 /= 1000;
            }
        }

        // Parse Throughput in MB/s
        const throughputMatch = output.match(/Throughput:\s+([\d.]+)MB\/s/i);
        let throughput = throughputMatch ? parseFloat(throughputMatch[1]) : 0;

        return { reqSec, latencyAvg, latency99, throughput };
    } catch (error) {
        console.error(`Benchmark failed for ${url}:`, error);
        return { reqSec: 0, latencyAvg: 0, latency99: 0, throughput: 0 };
    }
}

// Main function to run benchmarks on various servers
async function runBenchmarks() {
    const servers = [
        { name: 'Bun with Express', port: 1000 },
        { name: 'Bun with Hono', port: 2000 },
        { name: 'Bun with Elysia', port: 3000 },
        { name: 'Bun with BurgerAPI', port: 4000 }
    ];

    const specs = getSystemSpecs();
    console.log('System Specifications:');
    Object.entries(specs).forEach(([key, value]) => {
        console.log(`- ${key}: ${value}`);
    });
    console.log('\nStarting benchmarks...\n');

    const results = [];
    for (const server of servers) {
        const url = `http://localhost:${server.port}/api`;
        console.log(`Benchmarking ${server.name} (${url})...`);
        const metrics = runBenchmark(url);
        results.push({
            Server: server.name,
            'Req/Sec': metrics.reqSec.toLocaleString(),
            'Avg Latency (ms)': metrics.latencyAvg.toFixed(2),
            '99th Latency (ms)': metrics.latency99.toFixed(2),
            'Throughput (MB/s)': metrics.throughput.toFixed(2)
        });
    }
    console.table(results);
}

runBenchmarks();
