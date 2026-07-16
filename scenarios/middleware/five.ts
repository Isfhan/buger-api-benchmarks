import { Burger } from 'burger-api';
import type { Middleware } from 'burger-api';
import type { Scenario } from '../../src/types';

const noop: Middleware = () => undefined;

export const middlewareFive: Scenario = {
  id: 'middleware/five',
  group: 'middleware',
  description: 'Route with five no-op middlewares',
  createApp: () =>
    new Burger({
      apiRoutes: [
        {
          path: '/bench/middleware/five',
          handlers: { GET: () => Response.json({ ok: true }) },
          middleware: Array(5).fill(noop),
        },
      ],
    }),
  targets: [{ method: 'GET', path: '/bench/middleware/five' }],
};
