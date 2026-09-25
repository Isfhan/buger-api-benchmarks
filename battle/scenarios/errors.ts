import { contestantsFor } from '../contestants';
import type { BattleScenario, BattleRouteSpec } from '../types';

const spec: BattleRouteSpec = {
  kind: 'not-found',
  path: '/bench/errors/ok',
};

export const battleErrorsNotFound: BattleScenario = {
  id: 'errors/not-found',
  group: 'errors',
  description: 'Request to an unregistered path on a single-route app (404)',
  contestants: contestantsFor(spec),
  target: { method: 'GET', path: '/bench/missing' },
  expect: { status: 404 },
};
