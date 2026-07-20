import { Burger } from 'burger-api';
import { toFrameworkApp } from '../../src/battle-adapter';
import { createApp as elysiaApp } from '../challengers/elysia';
import { createApp as elysia2App } from '../challengers/elysia2';
import { createApp as honoApp } from '../challengers/hono';
import { createApp as expressApp } from '../challengers/express';
import type { BattleScenario, BattleRouteSpec } from '../types';

const staticSpec: BattleRouteSpec = {
  kind: 'static',
  path: '/bench/routing/static',
  response: { ok: true },
};

const paramSpec: BattleRouteSpec = {
  kind: 'param',
  path: '/bench/routing/param/:id',
  response: { ok: true },
};

export const battleRoutingStatic: BattleScenario = {
  id: 'routing/static',
  group: 'routing',
  description: 'Static GET route returning a small JSON body',
  contestants: {
    burger: () =>
      toFrameworkApp(
        new Burger({
          apiRoutes: [
            {
              path: staticSpec.path,
              handlers: { GET: () => Response.json(staticSpec.response as object) },
            },
          ],
        }),
      ),
    elysia: () => elysiaApp(staticSpec),
    elysia2: () => elysia2App(staticSpec),
    hono: () => honoApp(staticSpec),
    express: () => expressApp(staticSpec),
  },
  target: { method: 'GET', path: staticSpec.path },
};

export const battleRoutingParam: BattleScenario = {
  id: 'routing/param',
  group: 'routing',
  description: 'Dynamic GET route with one :param returning JSON',
  contestants: {
    burger: () =>
      toFrameworkApp(
        new Burger({
          apiRoutes: [
            {
              path: paramSpec.path,
              handlers: {
                GET: (req: any) =>
                  Response.json({ id: req.params.id, ...(paramSpec.response as object) }),
              },
            },
          ],
        }),
      ),
    elysia: () => elysiaApp(paramSpec),
    elysia2: () => elysia2App(paramSpec),
    hono: () => honoApp(paramSpec),
    express: () => expressApp(paramSpec),
  },
  target: { method: 'GET', path: paramSpec.path },
};
