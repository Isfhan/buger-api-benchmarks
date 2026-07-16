import { Burger } from 'burger-api';
import type { Scenario } from '../../src/types';

export const routingStatic: Scenario = {
  id: 'routing/static',
  group: 'routing',
  description: 'Static GET route returning a small JSON body',
  createApp: () =>
    new Burger({
      apiRoutes: [
        {
          path: '/bench/routing/static',
          handlers: { GET: () => Response.json({ ok: true }) },
        },
      ],
    }),
  targets: [{ method: 'GET', path: '/bench/routing/static' }],
};
