import { Hono } from 'hono';
import type { BattleRouteSpec, FrameworkApp } from '../types';

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
      app.get(spec.path, (c) => c.json({ id: c.req.param('id'), ...(spec.response as object) }));
      break;
    case 'middleware':
      for (let i = 0; i < spec.count; i++) {
        app.use('*', async (_c, next) => {
          await next();
        });
      }
      app.get(spec.path, (c) => c.json(spec.response));
      break;
    case 'validation':
      app.post(spec.path, async (c) => {
        const body = await c.req.json().catch(() => ({}));
        return c.json(body as object);
      });
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
