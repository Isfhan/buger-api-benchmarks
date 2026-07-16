import type { BenchConfig, ReportMeta, ReportResult, Scenario } from './types';
import type { BenchmarkEngine } from './engine/types';
import { getEngine } from './engine';
import { collectMetadata } from './system';
import { writeReports } from './report';

const BASE_PORT = 4300;
const SERVER_SCRIPT = import.meta.dir + '/scenario-server.ts';

async function waitForReady(
  proc: ReturnType<typeof Bun.spawn>,
  timeoutMs: number,
): Promise<void> {
  const stdout = proc.stdout;
  if (!stdout || typeof stdout === 'number') {
    proc.kill();
    throw new Error('Could not capture benchmark server output');
  }
  const reader = stdout.getReader();
  const decoder = new TextDecoder();
  let buf = '';
  const deadline = Date.now() + timeoutMs;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    if (buf.includes('BENCH_SERVER_READY')) return;
    if (Date.now() > deadline) {
      proc.kill();
      throw new Error('Timed out waiting for the benchmark server to start');
    }
  }
  throw new Error('Benchmark server exited before becoming ready');
}

/**
 * Runs the selected scenarios. For each scenario the runner spawns a short-lived
 * server process, warms up, measures with the engine, then stops the server.
 */
export async function runBenchmarks(
  scenarios: Scenario[],
  profile: string,
): Promise<void> {
  const config: BenchConfig = (await import(`../configs/${profile}.ts`)).default;
  const engine: BenchmarkEngine = getEngine();
  const meta: ReportMeta = await collectMetadata(profile);
  const results: ReportResult[] = [];

  for (let i = 0; i < scenarios.length; i++) {
    const scenario = scenarios[i];
    const port = BASE_PORT + i;
    console.log(`\n▶ ${scenario.id}`);
    console.log(`  ${scenario.description}`);

    const child = Bun.spawn(
      [process.execPath, SERVER_SCRIPT, scenario.id, String(port)],
      { stdout: 'pipe', stderr: 'pipe' },
    );
    await waitForReady(child, config.timeoutSec * 1000);

    try {
      for (const target of scenario.targets) {
        const url = `http://localhost:${port}${target.path}`;

        await engine.run({
          url,
          method: target.method,
          body: target.body,
          headers: target.headers,
          connections: config.connections,
          durationSec: config.warmupSec,
          timeoutSec: config.timeoutSec,
        });

        const { metrics, raw } = await engine.run({
          url,
          method: target.method,
          body: target.body,
          headers: target.headers,
          connections: config.connections,
          durationSec: config.durationSec,
          timeoutSec: config.timeoutSec,
        });

        results.push({
          id: scenario.id,
          group: scenario.group,
          description: scenario.description,
          target,
          metrics,
          raw,
        });

        console.log(
          `  ${target.method} ${target.path} → ${metrics.requestsPerSec.toLocaleString()} req/s, p99 ${metrics.p99Ms} ms`,
        );
      }
    } finally {
      child.kill();
      await child.exited.catch(() => {});
    }
  }

  const dir = await writeReports(meta, results);
  console.log(`\nReports written to ${dir}/`);
}
