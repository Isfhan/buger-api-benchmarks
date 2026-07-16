import type { BenchmarkEngine, EngineRunOptions, EngineRunResult } from './types';
import type { Metrics } from '../types';

function toMs(value: number, unit: string): number {
  switch (unit.toLowerCase()) {
    case 'us':
      return value / 1000;
    case 'ms':
      return value;
    case 's':
      return value * 1000;
    default:
      return value;
  }
}

function parseMetrics(raw: string): Metrics {
  const reqSecMatch = raw.match(/Reqs\/sec\s+([\d.]+)/i);
  const requestsPerSec = reqSecMatch ? parseFloat(reqSecMatch[1]) : 0;

  let latencyAvgMs = 0;
  const latAvg = raw.match(/Latency\s+([\d.]+)\s*(us|ms|s)/i);
  if (latAvg) latencyAvgMs = toMs(parseFloat(latAvg[1]), latAvg[2]);

  const pct: Record<string, number> = {};
  const pctRe = /^\s*(\d+)%\s+([\d.]+)\s*(us|ms|s)/gim;
  let m: RegExpExecArray | null;
  while ((m = pctRe.exec(raw))) {
    pct[m[1]] = toMs(parseFloat(m[2]), m[3]);
  }

  const tp = raw.match(/Throughput:\s+([\d.]+)\s*MB\/s/i);
  const throughputMBs = tp ? parseFloat(tp[1]) : 0;

  let totalRequests = 0;
  let errors = 0;
  const codes = raw.match(/HTTP codes:\s*([\s\S]*?)(?:\n\s*\n|$)/i);
  if (codes) {
    const block = codes[1];
    const sum = (label: string): number => {
      const mm = block.match(new RegExp(`${label}\\s*-\\s*([\\d,]+)`, 'i'));
      return mm ? parseInt(mm[1].replace(/,/g, ''), 10) : 0;
    };
    totalRequests = sum('1xx') + sum('2xx') + sum('3xx') + sum('4xx') + sum('5xx');
    errors = sum('4xx') + sum('5xx');
  }

  return {
    requestsPerSec,
    latencyAvgMs: +latencyAvgMs.toFixed(3),
    p50Ms: +(pct['50'] ?? 0).toFixed(3),
    p95Ms: +(pct['95'] ?? 0).toFixed(3),
    p99Ms: +(pct['99'] ?? 0).toFixed(3),
    throughputMBs: +throughputMBs.toFixed(2),
    totalRequests,
    errors,
  };
}

export const bombardierEngine: BenchmarkEngine = {
  name: 'bombardier',
  async run(opts: EngineRunOptions): Promise<EngineRunResult> {
    const bin = Bun.which('bombardier');
    if (!bin) {
      throw new Error(
        'Bombardier not found on PATH. Install it (e.g. `go install github.com/codesenberg/bombardier@latest`) and re-run.',
      );
    }

    const args = [
      '-c',
      String(opts.connections),
      '-d',
      `${opts.durationSec}s`,
      '-l',
      opts.url,
      '-m',
      opts.method.toUpperCase(),
    ];
    if (opts.body) args.push('-b', opts.body);
    for (const [key, value] of Object.entries(opts.headers ?? {})) {
      args.push('-H', `${key}: ${value}`);
    }

    const proc = Bun.spawn([bin, ...args], { stdout: 'pipe', stderr: 'pipe' });
    const raw = await new Response(proc.stdout).text();
    const errOut = await new Response(proc.stderr).text();
    const code = await proc.exited;
    if (code !== 0) {
      throw new Error(`Bombardier exited with code ${code}:\n${errOut}\n${raw}`);
    }

    return { metrics: parseMetrics(raw), raw };
  },
};
