import { Burger } from 'burger-api';
import { z } from 'zod';
import type { Scenario } from '../../src/types';

export const validationResponse: Scenario = {
  id: 'validation/response',
  group: 'validation',
  description: 'GET route declaring a response schema (response validation in dev mode)',
  createApp: () =>
    new Burger({
      apiRoutes: [
        {
          path: '/bench/validation/response',
          handlers: {
            GET: () => Response.json({ ok: true }),
          },
          schema: {
            get: {
              response: { 200: z.object({ ok: z.boolean() }) },
            },
          },
        },
      ],
      validation: { responseValidation: 'dev' },
    }),
  targets: [{ method: 'GET', path: '/bench/validation/response' }],
};
