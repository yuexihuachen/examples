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

app.post("/uploadBase64File", async (req, res) => {
  const {file, fileName, fileType} = req.body;
  const originalFile = file.replace(/^data:image\/\w+;base64,/, "");
  const writeFile = util.promisify(fs.writeFile);
  const result = await writeFile(`${__dirname}/files/${fileName}`, originalFile, { encoding: 'base64'})
  res.send(result)
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})