const express = require('express')
const fileUpload = require('express-fileupload');
const fs = require("fs")
const path = require("path")
const util = require('util');
const getPixels = require('get-pixels')
const crypto = require('crypto')

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

const privateKeyData = `
-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEAygGoUiTD+LjwZIgwFZyjiibWNQ2LM9xZ2pjKQGP8iUBtAuAW
629/Ofw8qxToMyixPrG4A7j8+KOPwYrWPGV6Og//4zm3cG+1hQvnNUWtMjHHBY8O
ByUPQ6/T8XHER1DxFBfnWfFLZ1yFX6oNNuvtLgOreI6ehehJd5IB/4mOjMvFEBgO
Eejado2n55VNdcFpdQ3RcvGV+f/rl/lsIM08QvL3lc5gqawj53sW9YZi1DL/uN48
R+ghvAYhtx2jpHDBvlH1NCF1rU6CynYsgV9QIksv0ihwl4T+k5F9ir0uv0WIS6kK
KS1SRpAprRKunos4PlE8l2+jC6LaJUPhDZlj/wIDAQABAoIBAHIcX5YPeLie2AUi
PW9n7aYT7DtJ7FGebw+h8dZP5Q8vWqUeKzRR5p+90hOemtCTcxSEVfucWyKlWoat
Q/oYJOR5t0YHi40zPWnr4G7ibkUFg3Sra/QzRh0pTON+La9PlO+R1TmkqcC4rgrt
R8u3mGK+5fUTM49XOXEXBJPyg5kaXQpiA4BoIRdRnCSitNxWA8kxMkQYJYlwAYab
cKo4Ik/J6+YGG7m2FtrUAWpWVUMBzEYOmGJ7JhSJ1u0UC/Oh1HOS1xlGopkmexbd
EygY3hTNWzHmYaYcYQs0f+8aVcVL64Gm0dtqvAHNnBvudMThhQgdYPc39mNLbrwI
ks4uS8ECgYEA9XfvcGKsNrHA0nqoPUPMT0Nfvv/4XCaKOYk25brH4LbqJPm6CiU6
uNlKFQsxzHPmx7OEK7EYVVZCbSO9s4t/xCzDVNbOZ9kDL6bkTX9DArLE4d6IRF/1
WW/AlNPuwVgxl0kcJILFtLqA1WoC5UWMhbYe2YB/Q3rCozmn0AiwyqECgYEA0qxd
KClKAMIsrB0WJ9gZEsJOpFi4q4g6T1BwT40Xj6Ul6o6DHi6hFhPgZAstqmnY0ANz
ezQ2yxtIm7zSy7S+nwDUycjY9riJcomc/YQZNA2QVM16hEv84VLwH1MVV2wkTb41
DWjbcg/ZNofZHl9AQIw7es+R3mmtDN+8BZOZSp8CgYBHtwmaUQm1VQtbswAyHfuz
8KApgklCSvQ5SRBj38UDrw0LTnZ+/k+Ar+MH8ORUskvrblQgG7ZbQD9Z+YYzzX6/
hsBuqe9Vwb4/jsfGqHagdDA3OTegmlRpE9A06xInJKggZfi15gry+UYok7dS2pXq
fsHWk8capOP2oiKYEeHs4QKBgF2KcLaDVrtte/5Tz+GTHtbodZidWCm5jAJpeeSo
hfye3G4AJxHArH+sBacGG5md88mwrpbWwTl/fMbBmWsfbsAU02ZhCozJtSWpGo6q
F7K4DwzIS4zwXHEDrWCLOF+fwaLPQKkalM1ZYh3HRc0ph9LhMQu/nEn/6/laYhar
yZWLAoGASvCrpFKn0qllMKNUetBmYFpgtjmnNuW7l0xT2UftkW6AuFjU19gKgXhe
I+uZciHQ8kIUHfNLYBbhETsF3iqsklKfeoIr23zYHLE5GpoC151IpKf4guoPbCHX
a1oCDuZm//f5HMePb9juJN0WR//d5jWuizAycZf41XoEd8Bqydg=
-----END RSA PRIVATE KEY-----
`

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

  const detext = crypto.privateDecrypt({
    key: privateKeyData,
    padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
  }, Buffer.from(req.body.rsaOAEP, 'base64'))

  //crypto.publicEncrypt({key:publicKey, padding: crypto.constants.RSA_PKCS1_PADDING}, Buffer.from(fields[y], 'utf8') ).toString('base64');

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
