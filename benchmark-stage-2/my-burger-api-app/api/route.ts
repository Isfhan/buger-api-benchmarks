// Step 1: Import the BurgerRequest type from burger-api
import type { BurgerRequest } from "burger-api";

// Step 2: Define a GET route handler that takes a BurgerRequest
export function GET(req: BurgerRequest) {
  // Step 3: Return a JSON response with a hello world message
  return Response.json({ message: "Hello world" });
}
