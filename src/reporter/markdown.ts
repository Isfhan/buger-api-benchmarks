import type { Reporter } from './types';
import type { ReportMeta, ReportResult } from '../types';

export const markdownReporter: Reporter = {
  extension: 'md',
  render(meta: ReportMeta, results: ReportResult[]): string {
    const lines: string[] = [];
    lines.push('# BurgerAPI Benchmark Report');
    lines.push('');
    lines.push(`- Date: ${meta.date}`);
    lines.push(`- Profile: ${meta.profile}`);
    lines.push(`- BurgerAPI: ${meta.burgerApiVersion}`);
    lines.push(`- Bun: ${meta.bunVersion}`);
    lines.push(`- OS: ${meta.os} ${meta.arch}`);
    lines.push(`- CPU: ${meta.cpu}`);
    lines.push(`- Memory: ${meta.memory}`);
    lines.push(`- Git commit: ${meta.gitCommit}`);
    lines.push('');
    lines.push('## Results');
    lines.push('');
    lines.push(
      '| Scenario | Target | req/s | p50 (ms) | p95 (ms) | p99 (ms) | Throughput (MB/s) | Errors |',
    );
    lines.push('| --- | --- | --- | --- | --- | --- | --- | --- |');
    for (const r of results) {
      const m = r.metrics;
      lines.push(
        `| ${r.id} | ${r.target.method} ${r.target.path} | ${m.requestsPerSec.toLocaleString()} | ${m.p50Ms} | ${m.p95Ms} | ${m.p99Ms} | ${m.throughputMBs} | ${m.errors} |`,
      );
    }
    lines.push('');
    return lines.join('\n');
  },
};
