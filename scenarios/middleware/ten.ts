import { Burger } from 'burger-api';
import type { Middleware } from 'burger-api';
import type { Scenario } from '../../src/types';

const noop: Middleware = () => undefined;

export const middlewareTen: Scenario = {
  id: 'middleware/ten',
  group: 'middleware',
  description: 'Route with ten no-op middlewares',
  createApp: () =>
    new Burger({
      apiRoutes: [
        {
          path: '/bench/middleware/ten',
          handlers: { GET: () => Response.json({ ok: true }) },
          middleware: Array(10).fill(noop),
        },
      ],
    }),
  targets: [{ method: 'GET', path: '/bench/middleware/ten' }],
};
