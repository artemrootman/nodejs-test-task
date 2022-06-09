const express = require('express'),
  cookieParser = require('cookie-parser'),
  usersRouter = require('./routers/users'),
  app = express(),
  path = require('path')

require('dotenv').config()

const PORT = process.env.NODE_DOCKER_PORT || 3000

app.use(express.urlencoded({ extended: true }))
// app.use(cors())
app.use(express.json())
app.use(cookieParser('MY SECRET'))

app.use('/users', usersRouter)

app.get('/', function (req, res) {
  res.sendFile(path.resolve(__dirname, './views') + '/index.html')
})

app.get('/clear_cookie', function (req, res) {
  res.clearCookie('visit')
  res.status(200).send('cookie visit cleared')
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`)
})
