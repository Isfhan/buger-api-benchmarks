import type { Burger } from 'burger-api';

/** A single HTTP target (endpoint) to bombard within a scenario. */
export interface Target {
  method: string;
  path: string;
  body?: string;
  headers?: Record<string, string>;
}

/**
 * A benchmark scenario. The scenario only defines the application and the
 * targets to hit. The runner owns the port, server lifecycle, and execution.
 */
export interface Scenario {
  id: string;
  group: string;
  description: string;
  createApp: () => Burger;
  targets: Target[];
}

/** Parsed timing/throughput metrics for one benchmark target. */
export interface Metrics {
  requestsPerSec: number;
  latencyAvgMs: number;
  p50Ms: number;
  p95Ms: number;
  p99Ms: number;
  throughputMBs: number;
  totalRequests: number;
  errors: number;
}

/** One measured result (scenario + target + metrics + raw output). */
export interface ReportResult {
  id: string;
  group: string;
  description: string;
  target: Target;
  metrics: Metrics;
  raw: string;
}

/** Environment metadata captured alongside every report. */
export interface ReportMeta {
  burgerApiVersion: string;
  bunVersion: string;
  os: string;
  arch: string;
  cpu: string;
  memory: string;
  date: string;
  gitCommit: string;
  profile: string;
}

/** Tunable parameters selected by a benchmark profile. */
export interface BenchConfig {
  profile: string;
  connections: number;
  durationSec: number;
  warmupSec: number;
  timeoutSec: number;
}
