import type { BenchConfig, Metrics, ReportMeta } from '../src/types';
import type { BenchmarkEngine } from '../src/engine/types';
import { getEngine } from '../src/engine';
import {
  CONTESTANT_ORDER,
  CONTESTANT_LABEL,
  type BattleScenario,
  type ContestantName,
} from './types';

const BASE_PORT = 5300;
const SERVER_SCRIPT = import.meta.dir + '/server.ts';

async function waitForReady(
  proc: ReturnType<typeof Bun.spawn>,
  timeoutMs: number,
): Promise<void> {
  const stdout = proc.stdout;
  if (!stdout || typeof stdout === 'number') {
    proc.kill();
    throw new Error('Could not capture battle server output');
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
      throw new Error('Timed out waiting for the battle server to start');
    }
  }
  throw new Error('Battle server exited before becoming ready');
}

/** One measured result for a single contestant of a battle scenario. */
export interface BattleResult {
  scenarioId: string;
  group: string;
  description: string;
  contestant: ContestantName;
  metrics: Metrics;
}

/**
 * Runs the selected battle scenarios. For each scenario, every contestant is
 * started on its own port, warmed up, measured with the shared Bombardier
 * engine, then stopped — so all frameworks are measured under identical load.
 */
export async function runBattle(
  scenarios: BattleScenario[],
  profile: string,
): Promise<BattleResult[]> {
  const config: BenchConfig = (await import(`../configs/${profile}.ts`)).default;
  const engine: BenchmarkEngine = getEngine();
  const results: BattleResult[] = [];

  for (const scenario of scenarios) {
    console.log(`\n▶ ${scenario.id}`);
    console.log(`  ${scenario.description}`);

    for (const name of CONTESTANT_ORDER) {
      const port = BASE_PORT + results.length;
      const child = Bun.spawn(
        [process.execPath, SERVER_SCRIPT, scenario.id, name, String(port)],
        { stdout: 'pipe', stderr: 'pipe' },
      );
      await waitForReady(child, config.timeoutSec * 1000);

      try {
        const url = `http://localhost:${port}${scenario.target.path}`;
        await engine.run({
          url,
          method: scenario.target.method,
          body: scenario.target.body,
          headers: scenario.target.headers,
          connections: config.connections,
          durationSec: config.warmupSec,
          timeoutSec: config.timeoutSec,
        });

        const { metrics } = await engine.run({
          url,
          method: scenario.target.method,
          body: scenario.target.body,
          headers: scenario.target.headers,
          connections: config.connections,
          durationSec: config.durationSec,
          timeoutSec: config.timeoutSec,
        });

        results.push({
          scenarioId: scenario.id,
          group: scenario.group,
          description: scenario.description,
          contestant: name,
          metrics,
        });

        console.log(
          `  ${CONTESTANT_LABEL[name].padEnd(9)} → ${metrics.requestsPerSec.toLocaleString()} req/s, p99 ${metrics.p99Ms} ms`,
        );
      } finally {
        child.kill();
        await child.exited.catch(() => {});
      }
    }
  }

  return results;
}

export type { ReportMeta };
