const express = require('express')
const {port} = require('./config/index')

const app = express()

app.get('/', (req, res) => {
  res.send('Hello world!')
})

app.listen(port, err => {
  if(err) console.log(err)
  else console.log(`Listening on http://localhost:${port}`)
})
