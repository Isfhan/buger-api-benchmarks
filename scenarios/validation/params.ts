import { Burger } from 'burger-api';
import { z } from 'zod';
import type { Scenario } from '../../src/types';

export const validationParams: Scenario = {
  id: 'validation/params',
  group: 'validation',
  description: 'Dynamic route with params validation',
  createApp: () =>
    new Burger({
      apiRoutes: [
        {
          path: '/bench/validation/user/:id',
          handlers: {
            GET: (req) => Response.json({ id: req.validated.params?.id ?? null }),
          },
          schema: { get: { params: z.object({ id: z.string() }) } },
        },
      ],
    }),
  targets: [{ method: 'GET', path: '/bench/validation/user/42' }],
};
