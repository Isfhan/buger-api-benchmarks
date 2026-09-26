import { battleScenarios } from './registry';
import { collectMetadata } from '../src/system';
import { collectFrameworkVersions } from './versions';
import {
  writeOverheadReport,
  type OverheadConfig,
  type OverheadResult,
} from './overhead-report';
import {
  CONTESTANT_LABEL,
  CONTESTANT_ORDER,
  type BattleScenario,
  type ContestantName,
} from './types';

const WORKER_SCRIPT = import.meta.dir + '/overhead-worker.ts';
const WORKER_TIMEOUT_MS = 600_000;

interface CliOptions {
  selector?: string;
  targets: ContestantName[];
  config: OverheadConfig;
}

const VALID_CONTESTANTS = new Set<string>(CONTESTANT_ORDER);

function parseArgs(argv: string[]): CliOptions {
  let iterations = 300_000;
  let warmup = 50_000;
  let rounds = 5;
  let targets: ContestantName[] | undefined;
  const positionals: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--iterations') {
      iterations = Number(argv[++i]);
    } else if (arg.startsWith('--iterations=')) {
      iterations = Number(arg.slice('--iterations='.length));
    } else if (arg === '--warmup') {
      warmup = Number(argv[++i]);
    } else if (arg.startsWith('--warmup=')) {
      warmup = Number(arg.slice('--warmup='.length));
    } else if (arg === '--rounds') {
      rounds = Number(argv[++i]);
    } else if (arg.startsWith('--rounds=')) {
      rounds = Number(arg.slice('--rounds='.length));
    } else if (arg === '--target') {
      targets = parseTargets(argv[++i] ?? '');
    } else if (arg.startsWith('--target=')) {
      targets = parseTargets(arg.slice('--target='.length));
    } else {
      positionals.push(arg);
    }
  }

  for (const [name, value] of [
    ['--iterations', iterations],
    ['--warmup', warmup],
    ['--rounds', rounds],
  ] as const) {
    if (!Number.isInteger(value) || value < 1) {
      console.error(`Invalid ${name} "${value}". Expected a positive integer.`);
      process.exit(1);
    }
  }

  return {
    selector: positionals[0],
    targets: targets ?? CONTESTANT_ORDER.filter((c) => c !== 'express'),
    config: { iterations, warmup, rounds },
  };
}

function parseTargets(value: string): ContestantName[] {
  const names = value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);
  if (names.length === 0) {
    console.error('--target requires at least one contestant name.');
    process.exit(1);
  }
  for (const name of names) {
    if (!VALID_CONTESTANTS.has(name)) {
      console.error(
        `Unknown target "${name}". Valid targets: ${CONTESTANT_ORDER.join(', ')}`,
      );
      process.exit(1);
    }
  }
  return names as ContestantName[];
}

function selectScenarios(selector?: string): BattleScenario[] {
  if (!selector) return battleScenarios;
  if (battleScenarios.some((s) => s.group === selector)) {
    return battleScenarios.filter((s) => s.group === selector);
  }
  const one = battleScenarios.find((s) => s.id === selector);
  if (one) return [one];
  console.error(`Unknown battle scenario or group: "${selector}"`);
  process.exit(1);
}

/** A timeout promise that never keeps the parent process alive by itself. */
function timeoutAfter(ms: number): Promise<'timeout'> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve('timeout'), ms);
    timer.unref?.();
  });
}

/** Runs one contestant in its own process and returns its measured result. */
async function runContestant(
  scenario: BattleScenario,
  contestant: ContestantName,
  config: OverheadConfig,
): Promise<OverheadResult> {
  const child = Bun.spawn(
    [
      process.execPath,
      WORKER_SCRIPT,
      scenario.id,
      contestant,
      String(config.iterations),
      String(config.warmup),
      String(config.rounds),
    ],
    {
      stdout: 'pipe',
      stderr: 'inherit',
      env: { ...process.env, NODE_ENV: 'production' },
    },
  );

  try {
    const outcome = await Promise.race([
      new Response(child.stdout)
        .text()
        .then((text) => ({ kind: 'text' as const, text })),
      timeoutAfter(WORKER_TIMEOUT_MS).then(() => ({ kind: 'timeout' as const })),
    ]);
    if (outcome.kind === 'timeout') {
      child.kill();
      await child.exited.catch(() => {});
      return failedResult(scenario, contestant, config, 'timed out');
    }
    await child.exited;
    const text = outcome.text;

    for (const line of text.split('\n')) {
      const trimmed = line.trim();
      if (trimmed.startsWith('OVERHEAD_RESULT ')) {
        return JSON.parse(trimmed.slice('OVERHEAD_RESULT '.length)) as OverheadResult;
      }
      if (trimmed.startsWith('OVERHEAD_FAIL ')) {
        return failedResult(
          scenario,
          contestant,
          config,
          trimmed.slice('OVERHEAD_FAIL '.length),
        );
      }
    }
    return failedResult(scenario, contestant, config, 'no result reported');
  } catch (error) {
    child.kill();
    await child.exited.catch(() => {});
    return failedResult(scenario, contestant, config, `error: ${(error as Error).message}`);
  }
}

function failedResult(
  scenario: BattleScenario,
  contestant: ContestantName,
  config: OverheadConfig,
  reason: string,
): OverheadResult {
  return {
    scenarioId: scenario.id,
    group: scenario.group,
    description: scenario.description,
    contestant,
    iterations: config.iterations,
    warmup: config.warmup,
    rounds: [],
    meanOpsPerSec: 0,
    minOpsPerSec: 0,
    maxOpsPerSec: 0,
    meanNsPerOp: 0,
    failed: true,
    reason,
  };
}

const { selector, targets, config } = parseArgs(process.argv.slice(2));
if (targets.every((target) => target === 'express')) {
  console.error('No measurable targets selected — Express is not fetch-based.');
  process.exit(1);
}
const selected = selectScenarios(selector);

console.log(
  `BurgerAPI Overhead — ${selected.length} scenario(s) · ${config.warmup.toLocaleString('en-US')} warm-up + ${config.rounds}×${config.iterations.toLocaleString('en-US')} iterations · targets: ${targets.join(', ')}`,
);
if (targets.includes('express')) {
  console.log('Express is not fetch-based — skipped (it has no in-process Request → Response handler).\n');
}

const results: OverheadResult[] = [];
for (const scenario of selected) {
  console.log(`\n▶ ${scenario.id}`);
  console.log(`  ${scenario.description}`);
  for (const contestant of targets) {
    if (contestant === 'express') continue;
    const result = await runContestant(scenario, contestant, config);
    results.push(result);
    const label = CONTESTANT_LABEL[contestant].padEnd(9);
    if (result.failed) {
      console.log(`  ${label} → FAIL ${result.reason}`);
    } else {
      console.log(
        `  ${label} → ${Math.round(result.meanOpsPerSec).toLocaleString('en-US')} ops/s, ${result.meanNsPerOp.toFixed(0)} ns/op`,
      );
    }
  }
}

const meta = await collectMetadata('overhead');
const versions = await collectFrameworkVersions();
const dir = await writeOverheadReport(meta, config, results, versions);
console.log(`\nOverhead report written to ${dir}/`);
