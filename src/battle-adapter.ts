import type { Burger } from 'burger-api';
import type { FrameworkApp } from '../battle/types';

/**
 * Wraps a real Burger app so it satisfies the framework-agnostic `FrameworkApp`
 * contract used by the battle runner. This lets BurgerAPI compete on equal
 * footing with Elysia/Hono/Express without changing the framework itself.
 */
export function toFrameworkApp(burger: Burger): FrameworkApp {
  let server: { stop: () => void } | undefined;
  return {
    start(port: number) {
      burger.serve(port);
      server = burger.getServer() as { stop: () => void } | undefined;
    },
    stop() {
      server?.stop();
    },
  };
}
