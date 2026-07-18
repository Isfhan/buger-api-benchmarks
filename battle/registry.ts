import type { BattleScenario } from './types';
import { battleRoutingStatic, battleRoutingParam } from './scenarios/routing';
import { battleMiddlewareTen } from './scenarios/middleware';
import { battleJson } from './scenarios/json';
import { battleValidation } from './scenarios/validation';

/**
 * Explicit registry of every battle (cross-framework) scenario. To add a
 * comparison, create a scenario file under `battle/scenarios/` and add it here.
 * Nothing is discovered from the filesystem.
 */
export const battleScenarios: BattleScenario[] = [
  battleRoutingStatic,
  battleRoutingParam,
  battleMiddlewareTen,
  battleJson,
  battleValidation,
];
