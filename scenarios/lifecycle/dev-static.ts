import { Burger, setDir } from 'burger-api';
import type { Scenario } from '../../src/types';

/**
 * Exercises the Route Module pipeline (Directory Scanner → Module Loader →
 * RouteModule → Compiler) via the dev `apiDir` path, NOT the prebuilt
 * `apiRoutes` prod path. The per-request dispatch path is identical to the
 * prod routing scenarios, so this measures the same hot path while proving
 * the file-based discovery pipeline boots and serves correctly under load.
 */
export const lifecycleDevStatic: Scenario = {
  id: 'lifecycle/dev-static',
  group: 'lifecycle',
  description:
    'Static GET route served through the file-based Route Module pipeline (apiDir)',
  createApp: () =>
    new Burger({
      apiDir: setDir(__dirname, 'fixtures/static'),
      apiPrefix: '',
    }),
  targets: [{ method: 'GET', path: '/bench/lifecycle/static' }],
};
