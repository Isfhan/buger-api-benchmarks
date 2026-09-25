import { battleScenarios } from './registry';
import { runBattle } from './runner';
import { collectMetadata } from '../src/system';
import { collectFrameworkVersions } from './versions';
import { writeBattleReport } from './report';
import { CONTESTANT_ORDER, CONTESTANT_LABEL } from './types';

const VALID_PROFILES = ['default', 'quick', 'ci', 'full'];

interface CliOptions {
  selector?: string;
  profile: string;
  runs: number;
  seed: number;
}

function parseArgs(argv: string[]): CliOptions {
  let profile = 'default';
  let runs = 1;
  let seed: number | undefined;
  const positionals: string[] = [];

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === '--profile') {
      profile = argv[++i] ?? 'default';
    } else if (arg.startsWith('--profile=')) {
      profile = arg.slice('--profile='.length);
    } else if (arg === '--runs') {
      runs = Number(argv[++i]);
    } else if (arg.startsWith('--runs=')) {
      runs = Number(arg.slice('--runs='.length));
    } else if (arg === '--seed') {
      seed = Number(argv[++i]);
    } else if (arg.startsWith('--seed=')) {
      seed = Number(arg.slice('--seed='.length));
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
  if (!Number.isInteger(runs) || runs < 1) {
    console.error(`Invalid --runs "${runs}". Expected a positive integer.`);
    process.exit(1);
  }
  if (seed === undefined || !Number.isFinite(seed)) {
    seed = Math.floor(Math.random() * 0xffffffff);
  } else {
    seed = seed >>> 0;
  }

  return { selector: positionals[0], profile, runs, seed };
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

const { selector, profile, runs, seed } = parseArgs(process.argv.slice(2));
const selected = selectScenarios(selector);

console.log(
  `BurgerAPI Battle — running ${selected.length} scenario(s) with profile "${profile}" (runs: ${runs}, seed: ${seed})`,
);
console.log(
  `Contestants: ${CONTESTANT_ORDER.map((c) => CONTESTANT_LABEL[c]).join(' · ')} (all on Bun)\n`,
);

const meta = await collectMetadata(profile);
const versions = await collectFrameworkVersions();
const outcome = await runBattle(selected, { profile, runs, seed });
const dir = await writeBattleReport(meta, outcome, versions);
console.log(`\nBattle report written to ${dir}/`);
