import type { ReportMeta } from '../src/types';
import type { FrameworkVersions } from './versions';
import {
  CONTESTANT_LABEL,
  CONTESTANT_ORDER,
  type ContestantName,
} from './types';

/** One contestant's measurement for one scenario, produced by the worker. */
export interface OverheadResult {
  scenarioId: string;
  group: string;
  description: string;
  contestant: ContestantName;
  iterations: number;
  warmup: number;
  /** ops/s per round, in round order. */
  rounds: number[];
  meanOpsPerSec: number;
  minOpsPerSec: number;
  maxOpsPerSec: number;
  meanNsPerOp: number;
  failed: boolean;
  reason?: string;
}

export interface OverheadConfig {
  iterations: number;
  warmup: number;
  rounds: number;
}

function fmtInt(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}

function fmtOps(cell: OverheadResult, rounds: number): string {
  if (cell.failed) return 'FAIL';
  const base = `${fmtInt(cell.meanOpsPerSec)} ops/s`;
  if (rounds > 1 && cell.minOpsPerSec !== cell.maxOpsPerSec) {
    return `${base} (${fmtInt(cell.minOpsPerSec)}–${fmtInt(cell.maxOpsPerSec)})`;
  }
  return base;
}

function renderTable(header: string[], rows: string[][]): string {
  return [
    header.join(' | '),
    header.map(() => '---').join(' | '),
    ...rows.map((row) => row.join(' | ')),
  ].join('\n');
}

/** Renders the overhead report (per-scenario tables + overall mean) as Markdown. */
export function renderOverheadReport(
  meta: ReportMeta,
  config: OverheadConfig,
  results: OverheadResult[],
  versions: FrameworkVersions,
): string {
  const scenarioOrder: string[] = [];
  const byScenario = new Map<string, Map<ContestantName, OverheadResult>>();
  for (const result of results) {
    let cells = byScenario.get(result.scenarioId);
    if (!cells) {
      cells = new Map();
      byScenario.set(result.scenarioId, cells);
      scenarioOrder.push(result.scenarioId);
    }
    cells.set(result.contestant, result);
  }

  const scenarioTables = scenarioOrder
    .map((scenarioId) => {
      const cells = byScenario.get(scenarioId)!;
      const any = cells.values().next().value as OverheadResult | undefined;
      const rows = CONTESTANT_ORDER.filter((c) => cells.has(c)).map((c) => {
        const cell = cells.get(c)!;
        return [
          CONTESTANT_LABEL[c],
          fmtOps(cell, config.rounds),
          cell.failed ? '—' : cell.meanNsPerOp.toFixed(0),
        ];
      });
      return `### ${scenarioId} — ${any?.description ?? ''}\n\n${renderTable(
        ['Contestant', 'Throughput', 'ns/op (mean)'],
        rows,
      )}`;
    })
    .join('\n\n');

  const overall: string[][] = [];
  for (const contestant of CONTESTANT_ORDER) {
    const cells = scenarioOrder
      .map((id) => byScenario.get(id)!.get(contestant))
      .filter((cell): cell is OverheadResult => cell !== undefined && !cell.failed);
    if (cells.length === 0) continue;
    const meanOps =
      cells.reduce((sum, cell) => sum + cell.meanOpsPerSec, 0) / cells.length;
    const meanNs =
      cells.reduce((sum, cell) => sum + cell.meanNsPerOp, 0) / cells.length;
    overall.push([
      CONTESTANT_LABEL[contestant],
      `${fmtInt(meanOps)} ops/s`,
      meanNs.toFixed(0),
    ]);
  }

  const failures = results.filter((r) => r.failed);
  const failureSection =
    failures.length === 0
      ? 'None. Every contestant passed the correctness gate.'
      : failures
          .map(
            (r) =>
              `- ${r.scenarioId} · ${CONTESTANT_LABEL[r.contestant]}: ${r.reason ?? 'failed'}`,
          )
          .join('\n');

  return `# BurgerAPI Overhead — In-Process Fetch Handler Comparison

_Generated ${meta.date} · Bun ${meta.bunVersion} · ${meta.os}/${meta.arch} · ${meta.cpu}_
**Frameworks:** BurgerAPI ${meta.burgerApiVersion} (${meta.burgerApiCommit}, ${meta.burgerApiDirty ? 'dirty' : 'clean'}) · Elysia ${versions.elysia} · Elysia 2 ${versions.elysia2} · Hono ${versions.hono}
**Method:** each contestant ran in its own process; ${config.warmup.toLocaleString('en-US')} warm-up iterations, then ${config.rounds} timed rounds of ${config.iterations.toLocaleString('en-US')} iterations. Every iteration awaits the handler and reads the response body (\`await res.text()\`). Cells show the mean of the rounds with the ops/s min–max spread in parentheses.
**Request reuse:** bodyless requests are prebuilt once outside the timed loop; POST requests are rebuilt per iteration for every contestant (a body can be read only once), so the same construction cost is paid by all.
**Correctness gate:** identical to the HTTP battle — each contestant's handler was probed once before warm-up; status, content-type and body had to match the expected response, and validation scenarios had to reject an invalid body with a 4xx. A \`FAIL\` cell was not measured.
**Skipped:** Express — not fetch-based, so it has no in-process \`Request → Response\` handler to measure.

## Per scenario

${scenarioTables}

## Overall mean (mean of the per-scenario means)

${renderTable(['Contestant', 'Throughput', 'ns/op'], overall)}

## Failed correctness checks

${failureSection}

## How to read this

This benchmark removes the network and the HTTP server: it calls each
framework's public in-process handler directly, so it measures framework
overhead alone. It is the right lens now that the HTTP battle is at parity
(Bun's single-thread HTTP ceiling dominates there).

> Footnote: BurgerAPI's Bun \`serve()\` path is not measured here. On Bun,
> \`serve()\` uses native per-method \`routes\` (static + \`:param\` + \`*\`) and
> never enters this fetch handler for matched paths. This benchmark measures the
> portable fetch path — \`burger.fetchHandler()\` / \`toFetchHandler()\` — the
> same code that runs on Cloudflare Workers, Deno, Vercel and node-server.
> Elysia and Hono numbers are their public in-process handlers
> (\`app.handle\` / \`app.fetch\`).
`;
}

function timestamp(): string {
  const date = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}`;
}

/** Writes the overhead report under reports/battle/overhead-<YYYY-MM-DD-HHmm>/. */
export async function writeOverheadReport(
  meta: ReportMeta,
  config: OverheadConfig,
  results: OverheadResult[],
  versions: FrameworkVersions,
): Promise<string> {
  const dir = `reports/battle/overhead-${timestamp()}`;
  await Bun.write(
    `${dir}/summary.md`,
    renderOverheadReport(meta, config, results, versions),
  );
  await Bun.write(
    `${dir}/summary.json`,
    JSON.stringify({ meta, versions, config, results }, null, 2),
  );
  return dir;
}
