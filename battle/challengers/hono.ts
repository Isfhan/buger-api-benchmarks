import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import type { BattleRouteSpec, FrameworkApp } from '../types';

const validationSchema = z.object({ name: z.string(), age: z.number() });

/**
 * Builds a Hono app for a battle route spec. Hono runs natively on Bun, so this
 * is a faithful, same-runtime comparison.
 */
export function createApp(spec: BattleRouteSpec): FrameworkApp {
  const app = new Hono();

  switch (spec.kind) {
    case 'static':
    case 'json':
      app.get(spec.path, (c) => c.json(spec.response));
      break;
    case 'param':
      app.get(spec.path, (c) =>
        c.json({ id: c.req.param('id'), ...(spec.response as object) }),
      );
      break;
    case 'query':
      app.get(spec.path, (c) => c.json({ q: c.req.query('q'), page: c.req.query('page') }));
      break;
    case 'validation':
      app.post(
        spec.path,
        zValidator('json', validationSchema),
        (c) => c.json(c.req.valid('json')),
      );
      break;
    case 'auth-hook':
      app.get(
        spec.path,
        async (c, next) => {
          if (c.req.header('authorization') !== 'Bearer bench') {
            return c.json({ error: 'unauthorized' }, 401);
          }
          await next();
        },
        (c) => c.json(spec.response),
      );
      break;
    case 'not-found':
      app.get(spec.path, (c) => c.json({ ok: true }));
      break;
    case 'many-routes': {
      for (let i = 0; i < spec.count; i++) {
        app.get(`/bench/many/s${i}`, (c) => c.json({ ok: true }));
      }
      for (let i = 0; i < spec.count; i++) {
        app.get(`/bench/many/p${i}/:id`, (c) => c.json({ id: c.req.param('id') }));
      }
      break;
    }
    case 'text':
      app.get(spec.path, (c) => c.text(spec.text));
      break;
  }

  let server: { fetch: typeof app.fetch; stop: () => void } | undefined;
  return {
    start(port: number) {
      server = Bun.serve({ port, fetch: app.fetch });
    },
    stop() {
      server?.stop();
    },
  };
}
