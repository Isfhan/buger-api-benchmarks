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

// Side channel: the runner writes `RSS` on stdin and expects `RSS <bytes>` back,
// so the measured process reports its own resident set size after the load.
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk: string) => {
  for (const line of chunk.split('\n')) {
    if (line.trim() === 'RSS') {
      console.log(`RSS ${process.memoryUsage().rss}`);
    }
  }
});
process.stdin.resume();
