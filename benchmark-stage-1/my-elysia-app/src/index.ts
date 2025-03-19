import { Elysia } from "elysia";
const port = 3000;

const app = new Elysia()
  .get("/api", () => {
    return {
      message: "Hello world",
    };
  })
  .listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
