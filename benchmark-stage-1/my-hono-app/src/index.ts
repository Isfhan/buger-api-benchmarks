import { Hono } from "hono";

const app = new Hono();

app.get("/api", (c) => {
  return c.json({ message: "Hello world" });
});

const port = 4000;

export default {
  port,
  fetch: app.fetch,
};
