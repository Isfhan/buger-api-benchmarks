import type { BattleScenario } from './types';
import { battleRoutingStatic, battleRoutingParam } from './scenarios/routing';
import { battleJson } from './scenarios/json';
import { battleValidation } from './scenarios/validation';

/**
 * Explicit registry of every battle (cross-framework) scenario. To add a
 * comparison, create a scenario file under `battle/scenarios/` and add it here.
 * Nothing is discovered from the filesystem.
 *
 * Note: the old middleware battle was removed after the v2 architecture reset,
 * which eliminated the separate middleware concept (infrastructure is now
 * expressed as hooks). Hooks-based battle scenarios can be added in Phase 4.
 */
export const battleScenarios: BattleScenario[] = [
  battleRoutingStatic,
  battleRoutingParam,
  battleJson,
  battleValidation,
];
