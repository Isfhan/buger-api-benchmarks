import { Burger } from 'burger-api';
import type { Scenario } from '../../src/types';

export const validationNone: Scenario = {
  id: 'validation/none',
  group: 'validation',
  description: 'Route without any validation schema',
  createApp: () =>
    new Burger({
      apiRoutes: [
        {
          path: '/bench/validation/none',
          handlers: {
            GET: (req) => Response.json({ q: req.query?.q ?? null }),
          },
        },
      ],
    }),
  targets: [{ method: 'GET', path: '/bench/validation/none?q=hello' }],
};
