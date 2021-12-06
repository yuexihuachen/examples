const express = require('express')
const fileUpload = require('express-fileupload');
const fs = require("fs")
const path = require("path")
const util = require('util');
const app = express()
const port = 3000

app.use(express.static('.'))
app.use(express.json({
  limit: 50 * 1024 * 1024
}));
app.use(fileUpload({
  limit: 50 * 1024 * 1024
}));

app.post("/uploadFormFile", (req, res) => {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  sampleFile = req.files.sampleFile;
  uploadPath = __dirname + '/files/' + sampleFile.name;

  sampleFile.mv(uploadPath, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send({
      result: 'File uploaded!'
    });
  });
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
