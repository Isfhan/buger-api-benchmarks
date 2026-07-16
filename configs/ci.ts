import type { BenchConfig } from '../src/types';

const config: BenchConfig = {
  profile: 'ci',
  connections: 128,
  durationSec: 8,
  warmupSec: 2,
  timeoutSec: 30,
};

export default config;
