import { Burger } from 'burger-api';
import type { Scenario } from '../../src/types';

export const routingWildcard: Scenario = {
  id: 'routing/wildcard',
  group: 'routing',
  description: 'Wildcard GET route reading wildcard segments',
  createApp: () =>
    new Burger({
      apiRoutes: [
        {
          path: '/bench/routing/files/*',
          handlers: {
            GET: (req) => Response.json({ segments: req.wildcardParams ?? [] }),
          },
          isWildcard: true,
        },
      ],
    }),
  targets: [{ method: 'GET', path: '/bench/routing/files/a/b/c' }],
};
