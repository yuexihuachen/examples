import { Hono } from 'hono'
import { serveStatic } from 'hono/bun';

const app = new Hono()

app.use('*', serveStatic({ root: '/dist/' }));
app.use('/dist/static/*', serveStatic({ root: './' }));

app.get('/', async (c) => {
  const filePath = Bun.resolveSync("./dist/index.html", process.cwd());
  const file = Bun.file(filePath);
  const htmltext = await file.text();
  return c.html(htmltext)
})

export default app
