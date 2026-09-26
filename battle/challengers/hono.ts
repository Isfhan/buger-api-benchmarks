import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import type {
  BattleRouteSpec,
  FrameworkApp,
  InProcessHandler,
} from '../types';

const validationSchema = z.object({ name: z.string(), age: z.number() });

/**
 * Builds a Hono app instance for a battle route spec. Hono runs natively on
 * Bun, so this is a faithful, same-runtime comparison.
 */
export function buildApp(spec: BattleRouteSpec): Hono {
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
      // Explicit header: Hono's `c.text(text)` returns a bare `Response`
      // without a content-type in-process (Bun's HTTP layer adds it over the
      // wire), while the other contestants set `text/plain` themselves.
      app.get(spec.path, (c) =>
        c.text(spec.text, 200, { 'content-type': 'text/plain' }),
      );
      break;
  }

  return app;
}

/**
 * Wraps the app in the framework-agnostic server contract used by the HTTP
 * battle runner.
 */
export function createApp(spec: BattleRouteSpec): FrameworkApp {
  const app = buildApp(spec);

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

/** The public in-process handler: `app.fetch(request)`. */
export async function createHandler(
  spec: BattleRouteSpec,
): Promise<InProcessHandler> {
  const app = buildApp(spec);
  return (request) => app.fetch(request);
}
