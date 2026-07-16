import { Burger } from 'burger-api';
import type { Scenario } from '../../src/types';

export const errors404: Scenario = {
  id: 'errors/404',
  group: 'errors',
  description: 'Request to an unregistered path (404 response)',
  createApp: () =>
    new Burger({
      apiRoutes: [
        {
          path: '/bench/errors/ok',
          handlers: { GET: () => Response.json({ ok: true }) },
        },
      ],
    }),
  targets: [{ method: 'GET', path: '/bench/errors/missing' }],
};
