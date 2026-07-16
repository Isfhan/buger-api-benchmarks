import { scenarios } from '../scenarios/registry';
import { runBenchmarks } from './runner';

const VALID_PROFILES = ['default', 'quick', 'ci', 'full'];

function parseArgs(argv: string[]): { selector?: string; profile: string } {
  let profile = 'default';
  const positionals: string[] = [];
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--profile') {
      profile = argv[++i] ?? 'default';
    } else if (arg.startsWith('--profile=')) {
      profile = arg.slice('--profile='.length);
    } else {
      positionals.push(arg);
    }
  }
  if (!VALID_PROFILES.includes(profile)) {
    console.error(
      `Unknown profile "${profile}". Valid profiles: ${VALID_PROFILES.join(', ')}`,
    );
    process.exit(1);
  }
  return { selector: positionals[0], profile };
}

function selectScenarios(selector?: string) {
  if (!selector) return scenarios;
  if (scenarios.some((s) => s.group === selector)) {
    return scenarios.filter((s) => s.group === selector);
  }
  const one = scenarios.find((s) => s.id === selector);
  if (one) return [one];
  console.error(`Unknown scenario or group: "${selector}"`);
  process.exit(1);
}

const { selector, profile } = parseArgs(process.argv.slice(2));
const selected = selectScenarios(selector);

console.log(
  `Running ${selected.length} scenario(s) with profile "${profile}"`,
);
await runBenchmarks(selected, profile);
