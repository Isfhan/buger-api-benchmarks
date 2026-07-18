import { Burger } from 'burger-api';
import { toFrameworkApp } from '../../src/battle-adapter';
import { createApp as elysiaApp } from '../challengers/elysia';
import { createApp as honoApp } from '../challengers/hono';
import { createApp as expressApp } from '../challengers/express';
import type { BattleScenario, BattleRouteSpec } from '../types';

const spec: BattleRouteSpec = {
  kind: 'middleware',
  count: 10,
  path: '/bench/middleware/ten',
  response: { ok: true },
};

export const battleMiddlewareTen: BattleScenario = {
  id: 'middleware/ten',
  group: 'middleware',
  description: 'Ten global middleware hooks, then a JSON response',
  contestants: {
    burger: () =>
      toFrameworkApp(
        new Burger({
          globalMiddleware: Array.from({ length: spec.count }, () => () => undefined),
          apiRoutes: [
            {
              path: spec.path,
              handlers: { GET: () => Response.json(spec.response as object) },
            },
          ],
        }),
      ),
    elysia: () => elysiaApp(spec),
    hono: () => honoApp(spec),
    express: () => expressApp(spec),
  },
  target: { method: 'GET', path: spec.path },
};
