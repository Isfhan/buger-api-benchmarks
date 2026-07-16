import type { BenchConfig } from '../src/types';

const config: BenchConfig = {
  profile: 'default',
  connections: 256,
  durationSec: 10,
  warmupSec: 3,
  timeoutSec: 30,
};

export default config;
