import type { BurgerRequest, BurgerResponse } from "burger-api";

export async function GET(_: BurgerRequest, res: BurgerResponse) {
  return res.json({ message: "Hello world" });
}
