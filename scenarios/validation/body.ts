import { Burger } from 'burger-api';
import { z } from 'zod';
import type { Scenario } from '../../src/types';

export const validationBody: Scenario = {
  id: 'validation/body',
  group: 'validation',
  description: 'POST route with body validation',
  createApp: () =>
    new Burger({
      apiRoutes: [
        {
          path: '/bench/validation/body',
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
      path: '/bench/validation/body',
      body: JSON.stringify({ name: 'burger', price: 9.99 }),
      headers: { 'content-type': 'application/json' },
    },
  ],
};
