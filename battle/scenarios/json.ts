import { Burger } from 'burger-api';
import { toFrameworkApp } from '../../src/battle-adapter';
import { createApp as elysiaApp } from '../challengers/elysia';
import { createApp as honoApp } from '../challengers/hono';
import { createApp as expressApp } from '../challengers/express';
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
  contestants: {
    burger: () =>
      toFrameworkApp(
        new Burger({
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
