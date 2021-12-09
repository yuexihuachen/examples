const express = require('express')
const fs = require("fs")
const path = require("path")
const util = require('util');
const app = express()
const port = 3000

app.use(express.static('.'))
app.use(express.json({
  limit: 50 * 1024 * 1024
}));

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})