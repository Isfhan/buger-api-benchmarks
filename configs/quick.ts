import type { BenchConfig } from '../src/types';

const config: BenchConfig = {
  profile: 'quick',
  connections: 50,
  durationSec: 3,
  warmupSec: 1,
  timeoutSec: 15,
};

export default config;
