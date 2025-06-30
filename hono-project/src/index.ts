import { Hono } from 'hono';
import index from './index.html' with { type: "text" };

 
const app = new Hono()

app.get('/', (c) => {
  return c.html(index)
})

export default app
