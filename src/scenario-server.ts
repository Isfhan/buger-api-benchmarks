import { scenarios } from '../scenarios/registry';

const id = process.argv[2];
const port = Number(process.argv[3] ?? 4300);

const scenario = scenarios.find((s) => s.id === id);
if (!scenario) {
  console.error(`Unknown scenario: ${id}`);
  process.exit(1);
}

const app = scenario.createApp();
await app.serve(port);
console.log('BENCH_SERVER_READY');
