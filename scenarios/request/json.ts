import { Burger } from 'burger-api';
import type { Scenario } from '../../src/types';

export const requestJson: Scenario = {
  id: 'request/json',
  group: 'request',
  description: 'Route returning a JSON response',
  createApp: () =>
    new Burger({
      apiRoutes: [
        {
          path: '/bench/request/json',
          handlers: {
            GET: () => Response.json({ message: 'hello', items: [1, 2, 3] }),
          },
        },
      ],
    }),
  targets: [{ method: 'GET', path: '/bench/request/json' }],
};
