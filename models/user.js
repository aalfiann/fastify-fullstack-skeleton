'use strict'

const mongooseHandler = require('../lib/mongoose_handler.js')
const userSchema = {
  user_id: {
    type: Number,
    required: [true, 'id is required'],
    trim: true,
    unique: true
  },
  name: { type: String },
  address: { type: String }
}

module.exports = mongooseHandler.setModel('User', userSchema)
