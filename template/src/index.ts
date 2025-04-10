import { Hono } from 'hono'
import { html } from 'hono/html'
import { serveStatic } from 'hono/bun';

const app = new Hono()

app.use('*', serveStatic({ root: '/src' }));

app.get('/', (c) => {
  return c.html(
    html`<!doctype html>
<html>

<head>
    <title>Light Frame</title>
    <meta charset="utf-8" />
    <meta name="referrer" content="origin" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="App-Config" content="fullscreen=yes,useHistoryState=yes,transition=yes" />
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta content="yes" name="apple-touch-fullscreen" />
    <meta name="keywords" content="light-frame" />
    <meta name="description" content="light-frame" />
</head>

<body>
    <div id="root">
       
    </div>
</body>
<script src="./index.js"></script>
</html>
    `
  )
})

export default app
