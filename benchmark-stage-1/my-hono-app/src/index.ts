import { Hono } from 'hono'
import { serve } from "bun";

const app = new Hono()

app.get('/api', (c) => {
  return c.json({ message: 'Hello world' })
})

serve({
  fetch: app.fetch,
  port: 4000
})

export default app