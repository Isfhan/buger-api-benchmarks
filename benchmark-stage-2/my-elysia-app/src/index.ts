import { Elysia, t } from "elysia";
const port = 3000;

const app = new Elysia()
  // .onBeforeHandle(async ({ request }) => {
  //   // console.log(`[Global Logger] ${request.method} ${request.url}`);
  //   let a = 2 + Math.random();
  //   // return a.toString();
  //   console.log(a);
  //   // console.log("Global middleware executed.");
  //   // console.log('Time:', Date.now())
  // })
  .get("/api",  () => {
    return {
      message: "Hello world",
    };
    // return "Hello world";
  })
  // .get("/api/products", ({ query }) => {
  //   // console.log("[GET] Products route invoked");
  //   return {
  //     query,
  //     name: "John Doe",
  //   };
  // })
  // .get("/api/products/detail", () => {
  //   console.log("[GET] Product Detail route invoked");
  //   return { name: "Sample Product" };
  // })
  // .get(
  //   "/api/products/:id",
  //   ({
  //     params: { id },
  //     query,
  //   }: {
  //     params: { id: string };
  //     query: { search?: string };
  //   }) => {
  //     console.log("[GET] Dynamic Product route invoked");
  //     return { id, query, name: "Sample Product" };
  //   },
  //   {
  //     params: t.Object({
  //       id: t.String(),
  //     }),
  //     query: t.Object({
  //       search: t.String(),
  //     }),
  //   }
  // )

  .listen(port);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
