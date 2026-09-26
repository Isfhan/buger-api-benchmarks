import { contestantsFor } from '../contestants';
import type { BattleScenario, BattleRouteSpec } from '../types';

const spec: BattleRouteSpec = {
  kind: 'json',
  path: '/bench/json/echo',
  response: { message: 'hello', n: 42, items: [1, 2, 3] },
};

export const battleJson: BattleScenario = {
  id: 'json/echo',
  group: 'json',
  description: 'GET returning a JSON object (serialization overhead)',
  spec,
  contestants: contestantsFor(spec),
  target: { method: 'GET', path: spec.path },
  expect: {
    status: 200,
    contentType: 'application/json',
    json: { message: 'hello', n: 42, items: [1, 2, 3] },
  },
};
