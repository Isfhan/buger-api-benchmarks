import type { BenchConfig } from '../src/types';

const config: BenchConfig = {
  profile: 'full',
  connections: 512,
  durationSec: 30,
  warmupSec: 5,
  timeoutSec: 60,
};

export default config;
