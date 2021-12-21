const express = require('express')
const app = express()
const port = 3002

app.use(express.static('.'))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/getJson',(req, res) => {
  res.set({
    'Access-Control-Allow-Credentials': true, //允许后端接收headers cookie
    'Access-Control-Allow-Origin': req.headers.origin || '*', //任意域名都可以访问,或者基于我请求头里面的域
    'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type', //设置请求头格式和类型
    'Access-Control-Allow-Methods': 'POST,GET',//允许支持的请求方式
    'Content-Type': 'application/json; charset=utf-8',//默认与允许的文本格式json和编码格式
    'Access-Control-Max-Age': 86400 //允许缓存该条回应
  })
  res.json({
    json: 'hello world!'
  })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})