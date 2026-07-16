import { Burger } from 'burger-api';
import type { Scenario } from '../../src/types';

export const errors405: Scenario = {
  id: 'errors/405',
  group: 'errors',
  description: 'POST to a GET-only route (405 response)',
  createApp: () =>
    new Burger({
      apiRoutes: [
        {
          path: '/bench/errors/method',
          handlers: { GET: () => Response.json({ ok: true }) },
        },
      ],
    }),
  targets: [{ method: 'POST', path: '/bench/errors/method' }],
};
