import type { Metrics } from '../types';

export interface EngineRunOptions {
  url: string;
  method: string;
  body?: string;
  headers?: Record<string, string>;
  connections: number;
  durationSec: number;
  timeoutSec: number;
}

export interface EngineRunResult {
  metrics: Metrics;
  raw: string;
}

/**
 * A benchmarking engine. Bombardier is the default implementation; a different
 * tool can be added later by implementing this interface and registering it in
 * `engine/index.ts` without touching the runner.
 */
export interface BenchmarkEngine {
  name: string;
  run(opts: EngineRunOptions): Promise<EngineRunResult>;
}
