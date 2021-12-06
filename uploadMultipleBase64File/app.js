const express = require('express')
const fileUpload = require('express-fileupload');
const fs = require("fs")
const path = require("path")
const util = require('util');
const app = express()
const port = 3000
const writeFile = util.promisify(fs.writeFile);

app.use(express.static('.'))
app.use(express.json({
  limit: 50 * 1024 * 1024
}));
app.use(fileUpload({
  limit: 50 * 1024 * 1024
}));

app.post("/uploadMultipleBase64File", async (req, res) => {
  const files = req.body;
  let result = {msg: "success"}
  for (let file of files) {
    const {base64String, fileName, fileType} = file
    const originalFile = base64String.replace(/^data:image\/\w+;base64,/, "");
    // add Promise judge success
    response = await writeFile(`${__dirname}/files/${fileName}`, originalFile, { encoding: 'base64'})
    if (response) {
      result = {msg: "failed"}
    }
  }

  res.send(result)
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
