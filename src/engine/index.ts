import type { BenchmarkEngine } from './types';
import { bombardierEngine } from './bombardier';

/**
 * Returns the benchmarking engine for a given name. Bombardier is the default
 * and currently the only engine; new engines implement `BenchmarkEngine` and
 * are registered here.
 */
export function getEngine(name: string = 'bombardier'): BenchmarkEngine {
  switch (name) {
    case 'bombardier':
      return bombardierEngine;
    default:
      throw new Error(`Unknown benchmark engine "${name}"`);
  }
}
