import type { ReportMeta } from '../src/types';
import type { BattleResult } from './runner';
import {
  CONTESTANT_ORDER,
  CONTESTANT_LABEL,
  type ContestantName,
} from './types';

const REPORTER_EXT = 'md';

function buildSideBySide(results: BattleResult[]): string {
  // Group results by scenario id, preserving first-seen order.
  const order: string[] = [];
  const byScenario = new Map<string, Map<ContestantName, BattleResult>>();
  for (const r of results) {
    if (!byScenario.has(r.scenarioId)) {
      byScenario.set(r.scenarioId, new Map());
      order.push(r.scenarioId);
    }
    byScenario.get(r.scenarioId)!.set(r.contestant, r);
  }

  const header = ['Scenario', ...CONTESTANT_ORDER.map((c) => CONTESTANT_LABEL[c])].join(' | ');
  const sep = ['---', ...CONTESTANT_ORDER.map(() => '---')].join(' | ');

  const rows = order.map((id) => {
    const map = byScenario.get(id)!;
    const cells = CONTESTANT_ORDER.map((c) => {
      const r = map.get(c);
      return r ? `${r.metrics.requestsPerSec.toLocaleString()} req/s` : '—';
    });
    return [id, ...cells].join(' | ');
  });

  return [header, sep, ...rows].join('\n');
}

function buildP99Table(results: BattleResult[]): string {
  const order: string[] = [];
  const byScenario = new Map<string, Map<ContestantName, BattleResult>>();
  for (const r of results) {
    if (!byScenario.has(r.scenarioId)) {
      byScenario.set(r.scenarioId, new Map());
      order.push(r.scenarioId);
    }
    byScenario.get(r.scenarioId)!.set(r.contestant, r);
  }

  const header = ['Scenario', ...CONTESTANT_ORDER.map((c) => CONTESTANT_LABEL[c])].join(' | ');
  const sep = ['---', ...CONTESTANT_ORDER.map(() => '---')].join(' | ');
  const rows = order.map((id) => {
    const map = byScenario.get(id)!;
    const cells = CONTESTANT_ORDER.map((c) => {
      const r = map.get(c);
      return r ? `${r.metrics.p99Ms} ms` : '—';
    });
    return [id, ...cells].join(' | ');
  });

  return [header, sep, ...rows].join('\n');
}

/** Renders the battle report (side-by-side req/s + p99) as Markdown. */
export function renderBattleReport(meta: ReportMeta, results: BattleResult[]): string {
  return `# BurgerAPI Battle — Framework Comparison

_Generated ${meta.date} · profile \`${meta.profile}\` · Bun ${meta.bunVersion}_

**Environment:** ${meta.os}/${meta.arch} · ${meta.cpu} · ${meta.memory}
**Frameworks:** BurgerAPI ${meta.burgerApiVersion}, Elysia, Hono, Express
**Runtime note:** all frameworks were run on Bun. Express is Node-based and ran
under Bun's Node compatibility layer (not native Node); its numbers reflect that.

## Throughput (requests/sec, higher is better)

${buildSideBySide(results)}

## Latency p99 (ms, lower is better)

${buildP99Table(results)}

## How to read this

Each scenario implements an identical route shape in every framework, so the
difference is framework overhead, not application logic. The same Bombardier load
settings (connections, duration, warm-up) were applied to every contestant.

> Fairness caveat: Express ran on Bun's Node compatibility, not raw Node. Treat
> its column as "Express-on-Bun", not a native Node Express baseline.
`;
}

/** Writes the battle report under reports/battle/<date>/. */
export async function writeBattleReport(
  meta: ReportMeta,
  results: BattleResult[],
): Promise<string> {
  const dir = `reports/battle/${meta.date}`;
  const content = renderBattleReport(meta, results);
  await Bun.write(`${dir}/summary.${REPORTER_EXT}`, content);

  // Also drop raw per-scenario JSON for tooling.
  const json = JSON.stringify({ meta, results }, null, 2);
  await Bun.write(`${dir}/summary.json`, json);

  return dir;
}
