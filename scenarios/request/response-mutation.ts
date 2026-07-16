import { Burger } from 'burger-api';
import type { Scenario } from '../../src/types';

export const requestResponseMutation: Scenario = {
  id: 'request/response-mutation',
  group: 'request',
  description: 'Route that mutates the response via req.set',
  createApp: () =>
    new Burger({
      apiRoutes: [
        {
          path: '/bench/request/set',
          handlers: {
            GET: (req) => {
              req.set = { status: 203, headers: { 'x-bench': '1' } };
              return Response.json({ ok: true });
            },
          },
        },
      ],
    }),
  targets: [{ method: 'GET', path: '/bench/request/set' }],
};
