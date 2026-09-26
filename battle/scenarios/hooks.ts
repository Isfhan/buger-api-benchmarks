import { contestantsFor } from '../contestants';
import type { BattleScenario, BattleRouteSpec } from '../types';

const spec: BattleRouteSpec = {
  kind: 'auth-hook',
  path: '/bench/hooks/auth',
  response: { user: 'bench' },
};

export const battleHooksAuth: BattleScenario = {
  id: 'hooks/auth',
  group: 'hooks',
  description: 'GET guarded by a before-handler hook that checks the Authorization header',
  spec,
  contestants: contestantsFor(spec),
  target: {
    method: 'GET',
    path: spec.path,
    headers: { authorization: 'Bearer bench' },
  },
  expect: {
    status: 200,
    contentType: 'application/json',
    json: { user: 'bench' },
  },
};
