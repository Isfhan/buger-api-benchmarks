import { contestantsFor } from '../contestants';
import type { BattleScenario, BattleRouteSpec } from '../types';

const spec: BattleRouteSpec = {
  kind: 'query',
  path: '/bench/request/query',
};

export const battleRequestQuery: BattleScenario = {
  id: 'request/query',
  group: 'request',
  description: 'GET reading two query string values through each framework query API',
  contestants: contestantsFor(spec),
  target: { method: 'GET', path: '/bench/request/query?q=burger&page=2' },
  expect: {
    status: 200,
    contentType: 'application/json',
    json: { q: 'burger', page: '2' },
  },
};
