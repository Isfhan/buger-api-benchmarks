import { Burger, type RouteDefinition } from 'burger-api';
import { z } from 'zod';
import { toFrameworkApp } from '../../src/battle-adapter';
import type { BattleRouteSpec, FrameworkApp } from '../types';

const validationSchema = z.object({ name: z.string(), age: z.number() });

/** A beforeRoute hook that short-circuits with 401 unless the Bearer token matches. */
const authHook = (ctx: any) => {
  if (ctx.headers.get('authorization') !== 'Bearer bench') {
    return Response.json({ error: 'unauthorized' }, { status: 401 });
  }
};

/**
 * Builds a BurgerAPI app for a battle route spec using only public APIs
 * (`apiRoutes`, `schema`, `hooks`) the same way a user would.
 */
export function createApp(spec: BattleRouteSpec): FrameworkApp {
  switch (spec.kind) {
    case 'static':
    case 'json':
      return toFrameworkApp(
        new Burger({
          apiRoutes: [
            {
              path: spec.path,
              handlers: { GET: () => Response.json(spec.response as object) },
            },
          ],
        }),
      );
    case 'param':
      return toFrameworkApp(
        new Burger({
          apiRoutes: [
            {
              path: spec.path,
              handlers: {
                GET: (ctx) =>
                  Response.json({ id: ctx.params.id, ...(spec.response as object) }),
              },
            },
          ],
        }),
      );
    case 'query':
      return toFrameworkApp(
        new Burger({
          apiRoutes: [
            {
              path: spec.path,
              handlers: {
                GET: (ctx) => Response.json({ q: ctx.query.q, page: ctx.query.page }),
              },
            },
          ],
        }),
      );
    case 'validation':
      return toFrameworkApp(
        new Burger({
          apiRoutes: [
            {
              path: spec.path,
              handlers: { POST: (ctx: any) => Response.json(ctx.validated.body) },
              schema: { post: { body: validationSchema } },
            },
          ],
        }),
      );
    case 'auth-hook':
      return toFrameworkApp(
        new Burger({
          apiRoutes: [
            {
              path: spec.path,
              handlers: { GET: () => Response.json(spec.response as object) },
              hooks: { beforeRoute: [authHook] },
            },
          ],
        }),
      );
    case 'not-found':
      return toFrameworkApp(
        new Burger({
          apiRoutes: [
            {
              path: spec.path,
              handlers: { GET: () => Response.json({ ok: true }) },
            },
          ],
        }),
      );
    case 'many-routes': {
      const apiRoutes: RouteDefinition[] = [];
      for (let i = 0; i < spec.count; i++) {
        apiRoutes.push({
          path: `/bench/many/s${i}`,
          handlers: { GET: () => Response.json({ ok: true }) },
        });
      }
      for (let i = 0; i < spec.count; i++) {
        apiRoutes.push({
          path: `/bench/many/p${i}/:id`,
          handlers: { GET: (ctx) => Response.json({ id: ctx.params.id }) },
        });
      }
      return toFrameworkApp(new Burger({ apiRoutes }));
    }
    case 'text':
      return toFrameworkApp(
        new Burger({
          apiRoutes: [
            {
              path: spec.path,
              handlers: {
                GET: () =>
                  new Response(spec.text, {
                    headers: { 'content-type': 'text/plain' },
                  }),
              },
            },
          ],
        }),
      );
  }
}
