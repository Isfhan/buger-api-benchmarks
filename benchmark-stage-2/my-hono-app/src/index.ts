import { Hono } from "hono";

const app = new Hono();

// app.use(async (c, next) => {
//   // console.log(`[Global Logger] ${request.method} ${request.url}`);
//   let a = 2 + Math.random();
//   // return a.toString();
//   console.log(a);
//   // console.log("Global middleware executed.");
//   // console.log('Time:', Date.now())
//   await next();
// });

app.get("/api", (c) => {
  return c.json({ message: "Hello world" });
});

const port = 2000;

export default {
  port,
  fetch: app.fetch,
};
