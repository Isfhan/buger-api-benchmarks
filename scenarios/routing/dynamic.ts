import { Burger } from 'burger-api';
import type { Scenario } from '../../src/types';

export const routingDynamic: Scenario = {
  id: 'routing/dynamic',
  group: 'routing',
  description: 'Dynamic GET route reading a single path parameter',
  createApp: () =>
    new Burger({
      apiRoutes: [
        {
          path: '/bench/routing/user/:id',
          handlers: {
            GET: (req) => Response.json({ id: req.params!.id }),
          },
        },
      ],
    }),
  targets: [{ method: 'GET', path: '/bench/routing/user/42' }],
};
