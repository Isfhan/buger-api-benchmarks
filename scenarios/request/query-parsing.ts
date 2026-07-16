import { Burger } from 'burger-api';
import type { Scenario } from '../../src/types';

export const requestQueryParsing: Scenario = {
  id: 'request/query-parsing',
  group: 'request',
  description: 'Route that reads the lazily parsed query string',
  createApp: () =>
    new Burger({
      apiRoutes: [
        {
          path: '/bench/request/query',
          handlers: {
            GET: (req) => Response.json({ q: req.query?.q ?? null }),
          },
        },
      ],
    }),
  targets: [{ method: 'GET', path: '/bench/request/query?q=hello&lang=en' }],
};
