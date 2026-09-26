import { battleScenarios } from './registry';
import { checkExpectation, checkInvalidProbe } from './gate';
import type {
  BattleRouteSpec,
  BattleTarget,
  ContestantName,
  InProcessHandler,
} from './types';

const [id, contestant, iterationsArg, warmupArg, roundsArg] = process.argv.slice(2);
const iterations = Number(iterationsArg ?? 300000);
const warmup = Number(warmupArg ?? 50000);
const rounds = Number(roundsArg ?? 5);

const scenario = battleScenarios.find((s) => s.id === id);
if (!scenario) {
  console.error(`Unknown battle scenario: ${id}`);
  process.exit(1);
}

/**
 * Each contestant is loaded in its own process (one framework per run), so a
 * dynamic import keeps the other frameworks' modules out of this process.
 */
async function loadFactory(
  name: ContestantName,
): Promise<((spec: BattleRouteSpec) => Promise<InProcessHandler>) | undefined> {
  switch (name) {
    case 'burger':
      return (await import('./challengers/burger')).createHandler;
    case 'elysia':
      return (await import('./challengers/elysia')).createHandler;
    case 'elysia2':
      return (await import('./challengers/elysia2')).createHandler;
    case 'hono':
      return (await import('./challengers/hono')).createHandler;
    default:
      return undefined;
  }
}

const factory = await loadFactory(contestant as ContestantName);
if (!factory) {
  console.error(
    `Unknown or unsupported overhead contestant: ${contestant} (Express is not fetch-based)`,
  );
  process.exit(1);
}

const url = `http://localhost${scenario.target.path}`;
const init: RequestInit = {
  method: scenario.target.method,
  headers: scenario.target.headers,
};
const freshBody = scenario.target.body !== undefined;
const freshInit: RequestInit | undefined = freshBody
  ? { ...init, body: scenario.target.body }
  : undefined;

/** Reuses one prebuilt Request object for every iteration (no body). */
async function runReuse(
  handler: InProcessHandler,
  request: Request,
  count: number,
): Promise<void> {
  for (let i = 0; i < count; i++) {
    const res = await handler(request);
    await res.text();
  }
}

/** Builds a fresh Request per iteration (a body can be read only once). */
async function runFresh(
  handler: InProcessHandler,
  requestUrl: string,
  requestInit: RequestInit,
  count: number,
): Promise<void> {
  for (let i = 0; i < count; i++) {
    const res = await handler(new Request(requestUrl, requestInit));
    await res.text();
  }
}

function fail(reason: string): never {
  console.log(`OVERHEAD_FAIL ${reason}`);
  process.exit(1);
}

try {
  const handler = await factory(scenario.spec);

  const gate = async (target: BattleTarget): Promise<Response> =>
    handler(
      new Request(`http://localhost${target.path}`, {
        method: target.method,
        headers: target.headers,
        body: target.body,
      }),
    );
  const failure =
    (await checkExpectation(scenario, gate)) ??
    (await checkInvalidProbe(scenario, gate));
  if (failure) fail(failure);

  // Warm up so JIT state is settled before the timed rounds.
  if (freshInit) {
    await runFresh(handler, url, freshInit, warmup);
  } else {
    await runReuse(handler, new Request(url, init), warmup);
  }

  const reusedRequest = freshInit ? undefined : new Request(url, init);
  const roundOpsPerSec: number[] = [];
  const roundNsPerOp: number[] = [];

  for (let round = 0; round < rounds; round++) {
    Bun.gc(true);
    const start = performance.now();
    if (freshInit) {
      await runFresh(handler, url, freshInit, iterations);
    } else {
      await runReuse(handler, reusedRequest!, iterations);
    }
    const elapsedMs = performance.now() - start;
    roundOpsPerSec.push((iterations / elapsedMs) * 1000);
    roundNsPerOp.push((elapsedMs * 1e6) / iterations);
  }

  const mean = (values: number[]) =>
    values.reduce((sum, value) => sum + value, 0) / values.length;

  console.log(
    `OVERHEAD_RESULT ${JSON.stringify({
      scenarioId: scenario.id,
      group: scenario.group,
      description: scenario.description,
      contestant,
      iterations,
      warmup,
      rounds: roundOpsPerSec,
      meanOpsPerSec: mean(roundOpsPerSec),
      minOpsPerSec: Math.min(...roundOpsPerSec),
      maxOpsPerSec: Math.max(...roundOpsPerSec),
      meanNsPerOp: mean(roundNsPerOp),
      failed: false,
    })}`,
  );
} catch (error) {
  fail(`error: ${(error as Error).message}`);
}
