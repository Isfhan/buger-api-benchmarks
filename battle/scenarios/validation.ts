import { contestantsFor } from '../contestants';
import type { BattleScenario, BattleRouteSpec } from '../types';

const spec: BattleRouteSpec = {
  kind: 'validation',
  path: '/bench/validation/body',
};

const body = JSON.stringify({ name: 'burger', age: 7 });

export const battleValidation: BattleScenario = {
  id: 'validation/body',
  group: 'validation',
  description: 'POST with JSON body parsing + real schema validation, echoing the body',
  contestants: contestantsFor(spec),
  target: {
    method: 'POST',
    path: spec.path,
    body,
    headers: { 'content-type': 'application/json' },
  },
  expect: {
    status: 200,
    contentType: 'application/json',
    json: { name: 'burger', age: 7 },
  },
  invalidProbe: {
    body: JSON.stringify({ name: 1 }),
    expectStatusRange: [400, 499],
  },
};
