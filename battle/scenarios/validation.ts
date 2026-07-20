import { Burger } from 'burger-api';
import { toFrameworkApp } from '../../src/battle-adapter';
import { createApp as elysiaApp } from '../challengers/elysia';
import { createApp as elysia2App } from '../challengers/elysia2';
import { createApp as honoApp } from '../challengers/hono';
import { createApp as expressApp } from '../challengers/express';
import type { BattleScenario, BattleRouteSpec } from '../types';

const spec: BattleRouteSpec = {
  kind: 'validation',
  path: '/bench/validation/body',
  response: { ok: true },
};

const body = JSON.stringify({ name: 'burger', age: 7 });

export const battleValidation: BattleScenario = {
  id: 'validation/body',
  group: 'validation',
  description: 'POST with JSON body parsing + Zod validation, echoing the body',
  contestants: {
    burger: () =>
      toFrameworkApp(
        new Burger({
          apiRoutes: [
            {
              path: spec.path,
              handlers: {
                POST: async (req: any) => Response.json(await req.json()),
              },
            },
          ],
        }),
      ),
    elysia: () => elysiaApp(spec),
    elysia2: () => elysia2App(spec),
    hono: () => honoApp(spec),
    express: () => expressApp(spec),
  },
  target: { method: 'POST', path: spec.path, body, headers: { 'content-type': 'application/json' } },
};
