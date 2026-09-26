import type { BattleScenario, BattleTarget } from './types';

/**
 * Performs one request for the correctness gate and returns its response.
 * The HTTP battle passes a `fetch()`-based implementation; the overhead
 * benchmark passes the contestant's in-process handler. The checks below are
 * shared so both gates stay identical.
 */
export type GateRequest = (target: BattleTarget) => Promise<Response>;

/**
 * Correctness gate: sends the scenario target once and compares status,
 * content-type prefix and body to the scenario's `expect`. Returns a failure
 * reason or `null` when the response matches.
 */
export async function checkExpectation(
  scenario: BattleScenario,
  request: GateRequest,
): Promise<string | null> {
  const expect = scenario.expect;
  let res: Response;
  try {
    res = await request(scenario.target);
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
export async function checkInvalidProbe(
  scenario: BattleScenario,
  request: GateRequest,
): Promise<string | null> {
  const probe = scenario.invalidProbe;
  if (!probe) return null;
  let res: Response;
  try {
    res = await request({
      method: scenario.target.method,
      path: scenario.target.path,
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
