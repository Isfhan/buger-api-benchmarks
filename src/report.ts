import { reporters, renderScenarioFile } from './reporter';
import type { ReportMeta, ReportResult } from './types';

/**
 * Writes reports under `reports/<date>/` (summary in every reporter format plus
 * one JSON file per scenario) and raw Bombardier output under `results/<date>/`.
 * All of these directories are gitignored.
 */
export async function writeReports(
  meta: ReportMeta,
  results: ReportResult[],
): Promise<string> {
  const date = meta.date;

  for (const reporter of reporters) {
    const content = reporter.render(meta, results);
    await Bun.write(`reports/${date}/summary.${reporter.extension}`, content);
  }

  for (const r of results) {
    const safeId = r.id.replace(/\//g, '_');
    await Bun.write(
      `reports/${date}/${r.group}/${safeId}.json`,
      renderScenarioFile(r),
    );
    await Bun.write(
      `results/${date}/${safeId}_${r.target.method}.txt`,
      r.raw,
    );
  }

  return `reports/${date}`;
}
