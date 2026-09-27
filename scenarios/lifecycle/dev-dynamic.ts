import { Burger, setDir } from 'burger-api';
import type { Scenario } from '../../src/types';

/**
 * Dynamic (`:param`) route served through the file-based Route Module
 * pipeline (apiDir). Mirrors `routing/dynamic` but via the dev discovery
 * path, proving the compiler emits the same trie-dispatched handler.
 */
export const lifecycleDevDynamic: Scenario = {
  id: 'lifecycle/dev-dynamic',
  group: 'lifecycle',
  description:
    'Dynamic GET route served through the file-based Route Module pipeline (apiDir)',
  createApp: () =>
    new Burger({
      apiDir: setDir(__dirname, 'fixtures/dynamic'),
      apiPrefix: '',
    }),
  targets: [{ method: 'GET', path: '/bench/lifecycle/users/42' }],
};
