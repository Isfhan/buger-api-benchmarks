import type { BattleScenario } from './types';
import { battleRoutingStatic, battleRoutingParam, battleRoutingManyRoutes } from './scenarios/routing';
import { battleJson } from './scenarios/json';
import { battleValidation } from './scenarios/validation';
import { battleRequestQuery } from './scenarios/request';
import { battleHooksAuth } from './scenarios/hooks';
import { battleErrorsNotFound } from './scenarios/errors';
import { battleResponseText } from './scenarios/response';

/**
 * Explicit registry of every battle (cross-framework) scenario. To add a
 * comparison, create a scenario file under `battle/scenarios/` and add it here.
 * Nothing is discovered from the filesystem.
 */
export const battleScenarios: BattleScenario[] = [
  battleRoutingStatic,
  battleRoutingParam,
  battleRoutingManyRoutes,
  battleJson,
  battleValidation,
  battleRequestQuery,
  battleHooksAuth,
  battleErrorsNotFound,
  battleResponseText,
];
