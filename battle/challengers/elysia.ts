import Elysia, { t } from 'elysia';
import type { BattleRouteSpec, FrameworkApp } from '../types';

const validationSchema = t.Object({ name: t.String(), age: t.Number() });

/**
 * Builds an Elysia 1 app for a battle route spec. Elysia runs natively on Bun,
 * so this is a faithful, same-runtime comparison.
 */
export function createApp(spec: BattleRouteSpec): FrameworkApp {
  const app = new Elysia();

  switch (spec.kind) {
    case 'static':
    case 'json':
      app.get(spec.path, () => spec.response as object);
      break;
    case 'param':
      app.get(spec.path, (ctx: any) => ({
        id: ctx.params.id,
        ...(spec.response as object),
      }));
      break;
    case 'query':
      app.get(spec.path, (ctx: any) => ({ q: ctx.query.q, page: ctx.query.page }));
      break;
    case 'validation':
      app.post(spec.path, (ctx: any) => ctx.body as object, { body: validationSchema });
      break;
    case 'auth-hook':
      app.get(spec.path, () => spec.response as object, {
        beforeHandle(ctx: any) {
          if (ctx.headers['authorization'] !== 'Bearer bench') {
            return Response.json({ error: 'unauthorized' }, { status: 401 });
          }
        },
      });
      break;
    case 'not-found':
      app.get(spec.path, () => ({ ok: true }));
      break;
    case 'many-routes': {
      for (let i = 0; i < spec.count; i++) {
        app.get(`/bench/many/s${i}`, () => ({ ok: true }));
      }
      for (let i = 0; i < spec.count; i++) {
        app.get(`/bench/many/p${i}/:id`, (ctx: any) => ({ id: ctx.params.id }));
      }
      break;
    }
    case 'text':
      app.get(
        spec.path,
        () =>
          new Response(spec.text, { headers: { 'content-type': 'text/plain' } }),
      );
      break;
  }

  let server: ReturnType<typeof app.listen> | undefined;
  return {
    start(port: number) {
      server = app.listen(port);
    },
    stop() {
      server?.stop();
    },
  };
}
