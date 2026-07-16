import { Burger } from 'burger-api';
import type { Middleware } from 'burger-api';
import type { Scenario } from '../../src/types';

const noop: Middleware = () => undefined;

export const middlewareNone: Scenario = {
  id: 'middleware/none',
  group: 'middleware',
  description: 'Route with no middleware',
  createApp: () =>
    new Burger({
      apiRoutes: [
        {
          path: '/bench/middleware/none',
          handlers: { GET: () => Response.json({ ok: true }) },
        },
      ],
    }),
  targets: [{ method: 'GET', path: '/bench/middleware/none' }],
};
