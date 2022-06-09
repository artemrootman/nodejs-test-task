const Users = require('../models/users')
const express = require('express'),
  router = express.Router(),
  crypto = require('crypto')

require('../db/mongoose')

const cookie = function (user) {
  var arr = [user._id, user.email, user.ua]
  var data = JSON.stringify(arr)
  var hash = crypto.createHash('md5').update(data).digest('hex')
  var buff = Buffer.from(user.email + '|' + hash, 'utf-8')
  var base64 = buff.toString('base64')
  return base64
}

const decode = function (cookie) {
  var base64 = cookie
  var buff = Buffer.from(base64, 'base64')
  var str = buff.toString('utf-8')
  return str.split('|')
}

// get user list
router.get('/list', function (req, res) {
  Users.find({}, function (err, foundUsers) {
    if (err) {
      res.status(422).send({
        errors: [{ title: 'List Error!', detail: 'Could not find users!' }],
      })
    }
    res.json(foundUsers)
  })
})

// get hash by cookie
router.get('/:cookie', function (req, res) {
  const cookieData = decode(req.params.cookie)

  Users.find({ email: cookieData[0] }, function (err, foundUser) {
    if (err) {
      res.status(422).send({
        errors: [{ title: 'User Error!', detail: 'Could not find User!' }],
      })
    }
    const newCookie = cookie(foundUser)
    const validCookie = decode(req.params.cookie)[1]

    if (newCookie == validCookie) {
      res.status(200).send({
        message: 'success',
        data: newCookie,
        email: cookieData[0],
      })
    } else {
      res.status(404).send({
        errors: [
          { title: 'User Error!', detail: 'Could not find valid User!' },
        ],
      })
    }
  })
})

// create new user
router.post('/new', function (req, res) {
  const email = req.body.email || null
  const ua = req.body.ua || null

  if (!email) {
    res.status(400).send({
      message: 'error',
      error: 'email reuquired',
    })
    return
  }

  if (!ua) {
    res.status(400).send({
      message: 'error',
      error: 'userAgent reuquired',
    })
    return
  }
  // debug
  // console.log('email:', email)
  // console.log('ua:', ua)

  Users.find({ email: email }, function (err, foundUser) {
    if (err) {
      const user = new Users(req.body)

      user
        .save()
        .then((data) => {
          res.status(201).send({
            message: 'success',
            data: cookie(data),
          })
        })
        .catch((err) => {
          res.status(400).send({
            message: 'error',
            error: err,
            description: 'email must be unique',
          })
        })
    } else {
      res.status(200).send({
        message: 'success',
        data: cookie(foundUser),
      })
    }
  })
})

module.exports = router
