import { battleScenarios } from './registry';
import { runBattle } from './runner';
import { collectMetadata } from '../src/system';
import { writeBattleReport } from './report';

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
  if (!selector) return battleScenarios;
  if (battleScenarios.some((s) => s.group === selector)) {
    return battleScenarios.filter((s) => s.group === selector);
  }
  const one = battleScenarios.find((s) => s.id === selector);
  if (one) return [one];
  console.error(`Unknown battle scenario or group: "${selector}"`);
  process.exit(1);
}

const { selector, profile } = parseArgs(process.argv.slice(2));
const selected = selectScenarios(selector);

console.log(
  `BurgerAPI Battle — running ${selected.length} scenario(s) with profile "${profile}"`,
);
console.log('Contestants: BurgerAPI · Elysia · Hono · Express (all on Bun)\n');

const meta = await collectMetadata(profile);
const results = await runBattle(selected, profile);
const dir = await writeBattleReport(meta, results);
console.log(`\nBattle report written to ${dir}/`);
