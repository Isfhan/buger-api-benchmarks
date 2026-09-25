import { contestantsFor } from '../contestants';
import type { BattleScenario, BattleRouteSpec } from '../types';

const spec: BattleRouteSpec = {
  kind: 'text',
  path: '/bench/response/text',
  text: 'ok',
};

export const battleResponseText: BattleScenario = {
  id: 'response/text',
  group: 'response',
  description: 'GET returning a plain-text body',
  contestants: contestantsFor(spec),
  target: { method: 'GET', path: spec.path },
  expect: { status: 200, contentType: 'text/plain', text: 'ok' },
};
