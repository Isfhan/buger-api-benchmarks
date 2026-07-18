import { battleScenarios } from './registry';
import type { ContestantName } from './types';

const [id, contestant, portArg] = process.argv.slice(2);
const port = Number(portArg ?? 4300);

const scenario = battleScenarios.find((s) => s.id === id);
if (!scenario) {
  console.error(`Unknown battle scenario: ${id}`);
  process.exit(1);
}

const factory = scenario.contestants[contestant as ContestantName];
if (!factory) {
  console.error(`Unknown contestant: ${contestant}`);
  process.exit(1);
}

const app = factory();
await app.start(port);
console.log('BENCH_SERVER_READY');
