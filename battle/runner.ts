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
const PORT_RANGE = 100;
const SERVER_SCRIPT = import.meta.dir + '/server.ts';

export interface BattleRunOptions {
  profile: string;
  runs: number;
  seed: number;
}

/** One measured result for a single contestant of a battle scenario. */
export interface BattleResult {
  scenarioId: string;
  group: string;
  description: string;
  contestant: ContestantName;
  run: number;
  metrics?: Metrics;
  startupMs?: number;
  rssBytes?: number;
  failed: boolean;
  reason?: string;
}

/** Everything a battle run produced: results, plus the noise-control settings. */
export interface BattleOutcome {
  results: BattleResult[];
  seed: number;
  runs: number;
}

/** Deterministic PRNG (mulberry32) so `--seed N` reproduces the run order. */
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates shuffle using the seeded PRNG. */
function shuffled<T>(items: T[], rand: () => number): T[] {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** A line-oriented view of a child's stdout, safe to wait on repeatedly. */
interface ServerStream {
  waitForLine(match: (line: string) => boolean, timeoutMs: number): Promise<string | null>;
}

function captureLines(proc: ReturnType<typeof Bun.spawn>): ServerStream {
  const stdout = proc.stdout;
  if (!stdout || typeof stdout === 'number') {
    proc.kill();
    throw new Error('Could not capture battle server output');
  }
  const reader = stdout.getReader();
  const decoder = new TextDecoder();
  const lines: string[] = [];
  let buf = '';
  let ended = false;

  void (async () => {
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buf.indexOf('\n')) !== -1) {
          lines.push(buf.slice(0, idx).trim());
          buf = buf.slice(idx + 1);
        }
      }
    } catch {
      /* stream closed */
    } finally {
      ended = true;
    }
  })();

  return {
    async waitForLine(match, timeoutMs) {
      const deadline = Date.now() + timeoutMs;
      while (true) {
        const idx = lines.findIndex(match);
        if (idx !== -1) return lines.splice(idx, 1)[0];
        if (ended || Date.now() > deadline) return null;
        await Bun.sleep(20);
      }
    },
  };
}

/**
 * Correctness gate: sends the scenario target once and compares status,
 * content-type prefix and body to the scenario's `expect`. Returns a failure
 * reason or `null` when the response matches.
 */
async function checkExpectation(scenario: BattleScenario, url: string): Promise<string | null> {
  const expect = scenario.expect;
  let res: Response;
  try {
    res = await fetch(url, {
      method: scenario.target.method,
      headers: scenario.target.headers,
      body: scenario.target.body,
    });
  } catch (error) {
    return `request failed: ${(error as Error).message}`;
  }

  if (res.status !== expect.status) {
    return `status ${res.status}, expected ${expect.status}`;
  }
  if (expect.contentType) {
    const contentType = res.headers.get('content-type') ?? '';
    if (!contentType.startsWith(expect.contentType)) {
      return `content-type "${contentType}", expected prefix "${expect.contentType}"`;
    }
  }
  if ('json' in expect) {
    let actual: unknown;
    try {
      actual = await res.json();
    } catch (error) {
      return `response body is not JSON: ${(error as Error).message}`;
    }
    if (!Bun.deepEquals(actual, expect.json)) {
      return `body ${JSON.stringify(actual)}, expected ${JSON.stringify(expect.json)}`;
    }
  } else if (expect.text !== undefined) {
    const actual = await res.text();
    if (actual !== expect.text) {
      return `body "${actual}", expected "${expect.text}"`;
    }
  }
  return null;
}

/** Sends the scenario's invalid probe (if any) and requires a 4xx response. */
async function checkInvalidProbe(scenario: BattleScenario, url: string): Promise<string | null> {
  const probe = scenario.invalidProbe;
  if (!probe) return null;
  let res: Response;
  try {
    res = await fetch(url, {
      method: scenario.target.method,
      headers: scenario.target.headers,
      body: probe.body,
    });
  } catch (error) {
    return `invalid request failed: ${(error as Error).message}`;
  }
  await res.text().catch(() => '');
  const [min, max] = probe.expectStatusRange;
  if (res.status < min || res.status > max) {
    return `invalid body returned ${res.status}, expected ${min}-${max}`;
  }
  return null;
}

/** Asks the server process for its RSS over the stdin side channel. */
async function readRss(
  proc: ReturnType<typeof Bun.spawn>,
  stream: ServerStream,
): Promise<number | undefined> {
  const stdin = proc.stdin;
  if (!stdin || typeof stdin === 'number') return undefined;
  try {
    stdin.write('RSS\n');
    await stdin.flush();
  } catch {
    return undefined;
  }
  const line = await stream.waitForLine((l) => l.startsWith('RSS '), 2000);
  if (!line) return undefined;
  const bytes = Number(line.slice(4));
  return Number.isFinite(bytes) ? bytes : undefined;
}

/**
 * Runs the selected battle scenarios. For each scenario every contestant is
 * started on its own port, checked against the scenario expectation, warmed up,
 * measured with the shared Bombardier engine, asked for its RSS, then stopped.
 * Contestant order is shuffled per scenario with a seeded Fisher-Yates shuffle.
 */
export async function runBattle(
  scenarios: BattleScenario[],
  options: BattleRunOptions,
): Promise<BattleOutcome> {
  const config: BenchConfig = (await import(`../configs/${options.profile}.ts`)).default;
  const engine: BenchmarkEngine = getEngine();
  const rand = mulberry32(options.seed);
  const results: BattleResult[] = [];
  let portOffset = 0;

  console.log(`Seed: ${options.seed} · runs: ${options.runs}`);

  for (let run = 0; run < options.runs; run++) {
    for (const scenario of scenarios) {
      console.log(`\n▶ ${scenario.id}${options.runs > 1 ? ` (run ${run + 1}/${options.runs})` : ''}`);
      console.log(`  ${scenario.description}`);

      const order = shuffled(CONTESTANT_ORDER, rand);
      for (const name of order) {
        if (!scenario.contestants[name]) continue;
        const label = CONTESTANT_LABEL[name];
        const port = BASE_PORT + (portOffset++ % PORT_RANGE);
        const startedAt = performance.now();
        const child = Bun.spawn(
          [process.execPath, SERVER_SCRIPT, scenario.id, name, String(port)],
          { stdin: 'pipe', stdout: 'pipe', stderr: 'inherit', env: { ...process.env, NODE_ENV: 'production' } },
        );
        const stream = captureLines(child);

        const recordFailure = (reason: string, startupMs?: number) => {
          results.push({
            scenarioId: scenario.id,
            group: scenario.group,
            description: scenario.description,
            contestant: name,
            run,
            startupMs,
            failed: true,
            reason,
          });
          console.log(`  ${label.padEnd(9)} → FAIL ${reason}`);
        };

        try {
          const ready = await stream.waitForLine(
            (line) => line.includes('BENCH_SERVER_READY'),
            config.timeoutSec * 1000,
          );
          if (!ready) {
            recordFailure('server did not become ready');
            continue;
          }
          const startupMs = performance.now() - startedAt;
          const url = `http://localhost:${port}${scenario.target.path}`;

          const failure =
            (await checkExpectation(scenario, url)) ?? (await checkInvalidProbe(scenario, url));
          if (failure) {
            recordFailure(failure, startupMs);
            continue;
          }

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

          const rssBytes = await readRss(child, stream);
          results.push({
            scenarioId: scenario.id,
            group: scenario.group,
            description: scenario.description,
            contestant: name,
            run,
            metrics,
            startupMs,
            rssBytes,
            failed: false,
          });
          console.log(
            `  ${label.padEnd(9)} → ${metrics.requestsPerSec.toLocaleString()} req/s, p99 ${metrics.p99Ms} ms, start ${startupMs.toFixed(0)} ms` +
              (rssBytes ? `, RSS ${(rssBytes / 1024 / 1024).toFixed(1)} MB` : ''),
          );
        } catch (error) {
          recordFailure(`error: ${(error as Error).message}`);
        } finally {
          child.kill();
          await child.exited.catch(() => {});
        }
      }
    }
  }

  return { results, seed: options.seed, runs: options.runs };
}

export type { ReportMeta };
