import type { ReportMeta } from '../src/types';
import type { BattleOutcome, BattleResult } from './runner';
import type { FrameworkVersions } from './versions';
import {
  CONTESTANT_ORDER,
  CONTESTANT_LABEL,
  CONTESTANT_VALIDATOR,
  type ContestantName,
} from './types';

/** Aggregated metrics for one scenario/contestant cell across all runs. */
interface Cell {
  failed: boolean;
  reasons: string[];
  measured: number;
  reqPerSecMean: number;
  reqPerSecMin: number;
  reqPerSecMax: number;
  p99Mean: number;
  startupMean: number;
  rssMeanBytes: number;
  errors: number;
}

interface ScenarioRow {
  id: string;
  cells: Map<ContestantName, Cell>;
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function fmtInt(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

function fmtReqPerSec(cell: Cell, runs: number): string {
  if (cell.failed) return 'FAIL';
  const base = `${fmtInt(cell.reqPerSecMean)} req/s`;
  if (runs > 1 && cell.reqPerSecMin !== cell.reqPerSecMax) {
    return `${base} (${fmtInt(cell.reqPerSecMin)}–${fmtInt(cell.reqPerSecMax)})`;
  }
  return base;
}

function buildRows(results: BattleResult[]): ScenarioRow[] {
  const order: string[] = [];
  const byScenario = new Map<string, Map<ContestantName, BattleResult[]>>();
  for (const result of results) {
    let map = byScenario.get(result.scenarioId);
    if (!map) {
      map = new Map();
      byScenario.set(result.scenarioId, map);
      order.push(result.scenarioId);
    }
    const list = map.get(result.contestant) ?? [];
    list.push(result);
    map.set(result.contestant, list);
  }

  return order.map((id) => {
    const map = byScenario.get(id)!;
    const cells = new Map<ContestantName, Cell>();
    for (const contestant of CONTESTANT_ORDER) {
      const list = map.get(contestant);
      if (!list) continue;
      const failures = list.filter((r) => r.failed);
      const measured = list.filter((r) => !r.failed && r.metrics);
      const reqPerSec = measured.map((r) => r.metrics!.requestsPerSec);
      const p99 = measured.map((r) => r.metrics!.p99Ms);
      const startup = measured
        .map((r) => r.startupMs)
        .filter((value): value is number => value !== undefined);
      const rss = measured
        .map((r) => r.rssBytes)
        .filter((value): value is number => value !== undefined);

      cells.set(contestant, {
        failed: failures.length > 0 || measured.length === 0,
        reasons: failures.map((r) => `run ${r.run + 1}: ${r.reason ?? 'failed'}`),
        measured: measured.length,
        reqPerSecMean: mean(reqPerSec),
        reqPerSecMin: reqPerSec.length ? Math.min(...reqPerSec) : 0,
        reqPerSecMax: reqPerSec.length ? Math.max(...reqPerSec) : 0,
        p99Mean: mean(p99),
        startupMean: mean(startup),
        rssMeanBytes: mean(rss),
        errors: measured.reduce((sum, r) => sum + r.metrics!.errors, 0),
      });
    }
    return { id, cells };
  });
}

function winnerOf(row: ScenarioRow): ContestantName | undefined {
  let winner: ContestantName | undefined;
  let best = -1;
  for (const contestant of CONTESTANT_ORDER) {
    const cell = row.cells.get(contestant);
    if (!cell || cell.failed) continue;
    if (cell.reqPerSecMean > best) {
      best = cell.reqPerSecMean;
      winner = contestant;
    }
  }
  return winner;
}

function renderTable(header: string[], rows: string[][]): string {
  return [header.join(' | '), header.map(() => '---').join(' | '), ...rows.map((r) => r.join(' | '))].join(
    '\n',
  );
}

function buildThroughputTable(rows: ScenarioRow[], runs: number): string {
  const header = [
    'Scenario',
    ...CONTESTANT_ORDER.map((c) => CONTESTANT_LABEL[c]),
    'Winner',
  ];
  const body = rows.map((row) => {
    const winner = winnerOf(row);
    return [
      row.id,
      ...CONTESTANT_ORDER.map((c) => {
        const cell = row.cells.get(c);
        return cell ? fmtReqPerSec(cell, runs) : '—';
      }),
      winner ? CONTESTANT_LABEL[winner] : '—',
    ];
  });
  return renderTable(header, body);
}

function buildP99Table(rows: ScenarioRow[]): string {
  const header = ['Scenario', ...CONTESTANT_ORDER.map((c) => CONTESTANT_LABEL[c])];
  const body = rows.map((row) => [
    row.id,
    ...CONTESTANT_ORDER.map((c) => {
      const cell = row.cells.get(c);
      if (!cell) return '—';
      return cell.failed ? 'FAIL' : `${cell.p99Mean.toFixed(2)} ms`;
    }),
  ]);
  return renderTable(header, body);
}

function buildStartupTable(rows: ScenarioRow[]): string {
  const header = ['Scenario', ...CONTESTANT_ORDER.map((c) => CONTESTANT_LABEL[c])];
  const body = rows.map((row) => [
    row.id,
    ...CONTESTANT_ORDER.map((c) => {
      const cell = row.cells.get(c);
      if (!cell) return '—';
      return cell.failed
        ? 'FAIL'
        : cell.startupMean > 0
          ? `${cell.startupMean.toFixed(0)} ms`
          : '—';
    }),
  ]);
  return renderTable(header, body);
}

function buildMemoryTable(rows: ScenarioRow[]): string {
  const header = ['Scenario', ...CONTESTANT_ORDER.map((c) => CONTESTANT_LABEL[c])];
  const body = rows.map((row) => [
    row.id,
    ...CONTESTANT_ORDER.map((c) => {
      const cell = row.cells.get(c);
      if (!cell) return '—';
      if (cell.failed) return 'FAIL';
      return cell.rssMeanBytes > 0 ? `${(cell.rssMeanBytes / 1024 / 1024).toFixed(1)} MB` : '—';
    }),
  ]);
  return renderTable(header, body);
}

function buildOverallAverage(rows: ScenarioRow[]): string {
  const lines: string[] = [];
  for (const contestant of CONTESTANT_ORDER) {
    const cells = rows
      .map((row) => row.cells.get(contestant))
      .filter((cell): cell is Cell => cell !== undefined && !cell.failed);
    if (cells.length === 0) continue;
    const avg = mean(cells.map((cell) => cell.reqPerSecMean));
    const wins = rows.filter((row) => winnerOf(row) === contestant).length;
    lines.push(
      `${CONTESTANT_LABEL[contestant]}: ${fmtInt(avg)} req/s (${wins} win${wins === 1 ? '' : 's'} of ${rows.length})`,
    );
  }
  return lines.join('  \n');
}

function buildErrorsSection(results: BattleResult[]): string {
  const rows = results.filter(
    (r) =>
      !r.failed &&
      r.metrics &&
      r.metrics.errors > 0 &&
      r.scenarioId !== 'errors/not-found',
  );
  if (rows.length === 0) {
    return 'None. Bombardier reported no non-2xx responses outside the expected 404 scenario.';
  }
  return renderTable(
    ['Scenario', 'Contestant', 'Run', 'Non-2xx'],
    rows.map((r) => [
      r.scenarioId,
      CONTESTANT_LABEL[r.contestant],
      String(r.run + 1),
      r.metrics!.errors.toLocaleString('en-US'),
    ]),
  );
}

function buildFailuresSection(rows: ScenarioRow[]): string {
  const lines: string[] = [];
  for (const row of rows) {
    for (const contestant of CONTESTANT_ORDER) {
      const cell = row.cells.get(contestant);
      if (!cell?.failed || cell.reasons.length === 0) continue;
      for (const reason of cell.reasons) {
        lines.push(`- ${row.id} · ${CONTESTANT_LABEL[contestant]}: ${reason}`);
      }
    }
  }
  return lines.length ? lines.join('\n') : 'None. Every contestant passed the correctness gate.';
}

/** Renders the battle report (throughput, p99, startup, memory) as Markdown. */
export function renderBattleReport(
  meta: ReportMeta,
  outcome: BattleOutcome,
  versions: FrameworkVersions,
): string {
  const rows = buildRows(outcome.results);
  const runsLabel = outcome.runs === 1 ? '1 run' : `${outcome.runs} runs`;
  const scenarioLabel = rows.length === 1 ? '1 scenario' : `${rows.length} scenarios`;

  return `# BurgerAPI Battle — Framework Comparison

_Generated ${meta.date} · profile \`${meta.profile}\` · ${runsLabel} · seed ${outcome.seed} · Bun ${meta.bunVersion}_

**Environment:** ${meta.os}/${meta.arch} · ${meta.cpu} (${meta.cores} cores) · ${meta.memory}
**Frameworks:** BurgerAPI ${meta.burgerApiVersion} · Elysia ${versions.elysia} · Elysia 2 ${versions.elysia2} · Hono ${versions.hono} · Express ${versions.express}
**Validators:** ${CONTESTANT_ORDER.map((c) => `${CONTESTANT_LABEL[c]} — ${CONTESTANT_VALIDATOR[c]}`).join('; ')}
**Correctness gate:** each contestant was probed once before warm-up; status, content-type and body had to match the expected response. A \`FAIL\` cell was not measured.
**Runtime note:** all frameworks were run on Bun. Express is Node-based and ran
under Bun's Node compatibility layer (not native Node); its numbers reflect that.
**Noise control:** contestant order was shuffled per scenario with a seeded
Fisher-Yates shuffle (seed ${outcome.seed}); each cell is the mean of ${runsLabel}
with the req/s min–max spread shown in parentheses.

## Throughput (requests/sec, higher is better)

${buildThroughputTable(rows, outcome.runs)}

## Latency p99 (ms, lower is better)

${buildP99Table(rows)}

## Startup (ms, spawn to ready, lower is better)

${buildStartupTable(rows)}

## Memory after load (MB, RSS, lower is better)

${buildMemoryTable(rows)}

## Overall average (mean across all ${scenarioLabel})

${buildOverallAverage(rows)}

## Non-2xx responses

${buildErrorsSection(outcome.results)}

## Failed correctness checks

${buildFailuresSection(rows)}

## How to read this

Each scenario implements an identical route shape in every framework, so the
difference is framework overhead, not application logic. The same Bombardier load
settings (connections, duration, warm-up) were applied to every contestant.

> Fairness caveat: Express ran on Bun's Node compatibility, not raw Node. Treat
> its column as "Express-on-Bun", not a native Node Express baseline.
> Elysia 2 is \`elysia2\` (\`npm:elysia@2.0.0-beta.19\`, the \`next\` tag) and is
> reported alongside Elysia 1 as a second upstream data point.
`;
}

function timestamp(): string {
  const date = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}`;
}

/** Writes the battle report under reports/battle/<YYYY-MM-DD-HHmm>/. */
export async function writeBattleReport(
  meta: ReportMeta,
  outcome: BattleOutcome,
  versions: FrameworkVersions,
): Promise<string> {
  const dir = `reports/battle/${timestamp()}`;
  const content = renderBattleReport(meta, outcome, versions);
  await Bun.write(`${dir}/summary.md`, content);

  const json = JSON.stringify(
    { meta, versions, seed: outcome.seed, runs: outcome.runs, results: outcome.results },
    null,
    2,
  );
  await Bun.write(`${dir}/summary.json`, json);

  return dir;
}
