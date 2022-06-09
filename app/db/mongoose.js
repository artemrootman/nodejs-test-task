const mongoose = require('mongoose')
require('dotenv').config()

const { DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME } = process.env

const url = `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`

// const url = 'mongodb://127.0.0.1:27017/lit'

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected Successful')
  })
  .catch((err) => {
    console.log('Error in the Connection')
  })
