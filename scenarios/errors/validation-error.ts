import { Burger } from 'burger-api';
import { z } from 'zod';
import type { Scenario } from '../../src/types';

export const errorsValidation: Scenario = {
  id: 'errors/validation',
  group: 'errors',
  description: 'POST with an invalid body (validation error response)',
  createApp: () =>
    new Burger({
      apiRoutes: [
        {
          path: '/bench/errors/validate',
          handlers: {
            POST: () => Response.json({ ok: true }),
          },
          schema: {
            post: { body: z.object({ name: z.string(), price: z.number() }) },
          },
        },
      ],
    }),
  targets: [
    {
      method: 'POST',
      path: '/bench/errors/validate',
      body: JSON.stringify({ name: 'burger' }),
      headers: { 'content-type': 'application/json' },
    },
  ],
};
