import type { BurgerRequest, Middleware, BurgerNext } from "burger-api";

// Global middleware example: a simple logger.
export const globalLogger: Middleware = async (
  req: BurgerRequest
): BurgerNext => {
  // console.log(`[Global Logger] ${request.method} ${request.url}`);
  let a = 2 + Math.random();
  // return a.toString();
  console.log(a);
  // console.log("Global middleware executed.");
  // console.log('Time:', Date.now())
  return undefined;
};
