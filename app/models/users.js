const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      max: [50, 'Max Length is 50 characters'],
    },
    ua: {
      type: String,
      required: true,
      max: [50, 'Max Length is 50 characters'],
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
)

const Users = mongoose.model('Users', usersSchema)

module.exports = Users
