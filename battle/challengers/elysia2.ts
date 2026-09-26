import { Elysia, t } from 'elysia2';
import type {
  BattleRouteSpec,
  FrameworkApp,
  InProcessHandler,
} from '../types';

const validationSchema = t.Object({ name: t.String(), age: t.Number() });

/**
 * Builds an Elysia 2 app instance for a battle route spec. Elysia 2 takes the
 * hook object BEFORE the handler — `.post(path, hook, handler)` — and renames
 * the hook points (`beforeHandle`, no `on` prefix).
 */
export function buildApp(spec: BattleRouteSpec): Elysia {
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
      app.post(spec.path, { body: validationSchema }, (ctx: any) => ctx.body as object);
      break;
    case 'auth-hook':
      app.get(
        spec.path,
        {
          beforeHandle(ctx: any) {
            if (ctx.headers['authorization'] !== 'Bearer bench') {
              return Response.json({ error: 'unauthorized' }, { status: 401 });
            }
          },
        },
        () => spec.response as object,
      );
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

  return app;
}

/**
 * Wraps the app in the framework-agnostic server contract used by the HTTP
 * battle runner.
 */
export function createApp(spec: BattleRouteSpec): FrameworkApp {
  const app = buildApp(spec);

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

/** The public in-process handler: `app.handle(request)`. */
export async function createHandler(
  spec: BattleRouteSpec,
): Promise<InProcessHandler> {
  const app = buildApp(spec);
  return (request) => app.handle(request);
}
