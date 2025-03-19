import { Hono } from 'hono'
import { serve } from "bun";

const app = new Hono()

app.get('/api', (c) => {
  return c.json({ message: 'Hello world' })
})

const port = 4000;

serve({
  fetch: app.fetch,
  port: port
})

export default app