const express = require('express')
const fileUpload = require('express-fileupload');
const fs = require("fs")
const path = require("path")
const util = require('util');
const getPixels = require('get-pixels')
const app = express()
const port = 3000

const decryptPixelData = (originalData) => {
  let oData = originalData.data;
  let decryptText = '', byte = ''
  for (let i = 0; i < 48; i++) {
    let bintry = parseInt(oData[4 * i], 10).toString(2);
    bintry = '00000000'.slice(bintry.length) + bintry
    byte += bintry.slice(7)
    if (byte.length % 8 === 0) {
      decryptText += String.fromCodePoint(parseInt(byte.slice(byte.length - 8, byte.length), 2))
    }
  }
  return decryptText
}

app.use(express.static('.'))
app.use(express.json({
  limit: 50 * 1024 * 1024
}));
app.use(fileUpload({
  limit: 50 * 1024 * 1024
}));

app.post("/uploadBase64File", async (req, res) => {
  const { imageBase64, summary } = req.body;
  const imageDecryptStr = await new Promise((resolve, reject) => {
    getPixels(imageBase64, function (err, pixels) {
      if (err) {
        reject(`get pixel error: ${err}`)
      }
      resolve(decryptPixelData(pixels))
    })
  })
  const binaryStr = Buffer.from(summary, 'base64').toString()
  let textDecryptStr = ''
  let index = 0
  while (index < 6) {
      const text = String.fromCodePoint(parseInt(binaryStr.slice(index * 8, (index + 1) * 8), 2))
      textDecryptStr += text
      ++index
  }
  res.send({
    imageDecryptStr,
    textDecryptStr
  })
})

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
