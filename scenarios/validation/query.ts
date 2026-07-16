import { Burger } from 'burger-api';
import { z } from 'zod';
import type { Scenario } from '../../src/types';

export const validationQuery: Scenario = {
  id: 'validation/query',
  group: 'validation',
  description: 'GET route with query validation',
  createApp: () =>
    new Burger({
      apiRoutes: [
        {
          path: '/bench/validation/query',
          handlers: {
            GET: (req) => Response.json({ q: req.validated.query?.q ?? null }),
          },
          schema: { get: { query: z.object({ q: z.string() }) } },
        },
      ],
    }),
  targets: [{ method: 'GET', path: '/bench/validation/query?q=hello' }],
};
