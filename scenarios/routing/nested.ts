import { Burger } from 'burger-api';
import type { Scenario } from '../../src/types';

export const routingNested: Scenario = {
  id: 'routing/nested',
  group: 'routing',
  description: 'Nested dynamic route with two path parameters',
  createApp: () =>
    new Burger({
      apiRoutes: [
        {
          path: '/bench/routing/api/users/:userId/posts/:postId',
          handlers: {
            GET: (req) =>
              Response.json({
                userId: req.params!.userId,
                postId: req.params!.postId,
              }),
          },
        },
      ],
    }),
  targets: [{ method: 'GET', path: '/bench/routing/api/users/7/posts/99' }],
};
