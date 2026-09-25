import { contestantsFor } from '../contestants';
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

const manyRoutesSpec: BattleRouteSpec = {
  kind: 'many-routes',
  count: 100,
};

export const battleRoutingStatic: BattleScenario = {
  id: 'routing/static',
  group: 'routing',
  description: 'Static GET route returning a small JSON body',
  contestants: contestantsFor(staticSpec),
  target: { method: 'GET', path: staticSpec.path },
  expect: { status: 200, contentType: 'application/json', json: { ok: true } },
};

export const battleRoutingParam: BattleScenario = {
  id: 'routing/param',
  group: 'routing',
  description: 'Dynamic GET route with one :param returning JSON',
  contestants: contestantsFor(paramSpec),
  target: { method: 'GET', path: '/bench/routing/param/42' },
  expect: {
    status: 200,
    contentType: 'application/json',
    json: { id: '42', ok: true },
  },
};

export const battleRoutingManyRoutes: BattleScenario = {
  id: 'routing/many-routes',
  group: 'routing',
  description: 'App with 100 static + 100 parameterized routes, one param route hit',
  contestants: contestantsFor(manyRoutesSpec),
  target: { method: 'GET', path: '/bench/many/p99/abc' },
  expect: { status: 200, contentType: 'application/json', json: { id: 'abc' } },
};
