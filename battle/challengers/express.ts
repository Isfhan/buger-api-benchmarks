import express from 'express';
import { z } from 'zod';
import type { BattleRouteSpec, FrameworkApp } from '../types';

const validationSchema = z.object({ name: z.string(), age: z.number() });

const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (req.headers.authorization !== 'Bearer bench') {
    res.status(401).json({ error: 'unauthorized' });
    return;
  }
  next();
};

/**
 * Builds an Express 5 app for a battle route spec.
 *
 * NOTE: Express is Node-based. Per the battle module's "all on Bun" decision,
 * it runs here under Bun's Node compatibility layer (not native Node). Its
 * numbers therefore reflect "Express on Bun's Node compatibility" and will be
 * footnoted as such in the report. This is intentionally not hidden.
 */
export function createApp(spec: BattleRouteSpec): FrameworkApp {
  const app = express();
  app.use(express.json());

  switch (spec.kind) {
    case 'static':
    case 'json':
      app.get(spec.path, (_req, res) => res.json(spec.response));
      break;
    case 'param':
      app.get(spec.path, (req, res) =>
        res.json({ id: req.params.id, ...(spec.response as object) }),
      );
      break;
    case 'query':
      app.get(spec.path, (req, res) =>
        res.json({ q: req.query.q, page: req.query.page }),
      );
      break;
    case 'validation':
      app.post(spec.path, (req, res) => {
        const parsed = validationSchema.safeParse(req.body);
        if (!parsed.success) {
          res.status(400).json({ error: 'invalid body' });
          return;
        }
        res.json(parsed.data);
      });
      break;
    case 'auth-hook':
      app.get(spec.path, requireAuth, (_req, res) => res.json(spec.response));
      break;
    case 'not-found':
      app.get(spec.path, (_req, res) => res.json({ ok: true }));
      break;
    case 'many-routes': {
      for (let i = 0; i < spec.count; i++) {
        app.get(`/bench/many/s${i}`, (_req, res) => res.json({ ok: true }));
      }
      for (let i = 0; i < spec.count; i++) {
        app.get(`/bench/many/p${i}/:id`, (req, res) => res.json({ id: req.params.id }));
      }
      break;
    }
    case 'text':
      app.get(spec.path, (_req, res) => res.type('text/plain').send(spec.text));
      break;
  }

  let server: ReturnType<typeof app.listen> | undefined;
  return {
    start(port: number) {
      return new Promise<void>((resolve, reject) => {
        server = app.listen(port, () => resolve());
        server.on('error', reject);
      });
    },
    stop() {
      server?.close();
    },
  };
}
