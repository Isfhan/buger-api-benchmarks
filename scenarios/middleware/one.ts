import { Burger } from 'burger-api';
import type { Middleware } from 'burger-api';
import type { Scenario } from '../../src/types';

const noop: Middleware = () => undefined;

export const middlewareOne: Scenario = {
  id: 'middleware/one',
  group: 'middleware',
  description: 'Route with one no-op middleware',
  createApp: () =>
    new Burger({
      apiRoutes: [
        {
          path: '/bench/middleware/one',
          handlers: { GET: () => Response.json({ ok: true }) },
          middleware: [noop],
        },
      ],
    }),
  targets: [{ method: 'GET', path: '/bench/middleware/one' }],
};
