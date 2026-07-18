import { Burger } from 'burger-api';
import { z } from 'zod';
import type { Scenario } from '../../src/types';

export const validationCoerce: Scenario = {
  id: 'validation/coerce',
  group: 'validation',
  description: 'GET route with coercion ON for a query schema',
  createApp: () =>
    new Burger({
      apiRoutes: [
        {
          path: '/bench/validation/coerce',
          handlers: {
            GET: (req) => Response.json({ v: req.validated.query }),
          },
          schema: {
            get: {
              query: z.object({ n: z.number(), b: z.boolean() }),
              coerce: true,
            },
          },
        },
      ],
      validation: { coerce: true },
    }),
  targets: [{ method: 'GET', path: '/bench/validation/coerce?n=1&b=true' }],
};
