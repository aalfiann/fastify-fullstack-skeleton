'use strict'

const mongooseHandler = require('../lib/mongoose_handler.js')
const contactSchema = {
  user_id: {
    type: Number,
    required: [true, 'user_id is required'],
    trim: true,
    unique: true
  },
  name: { type: String },
  address: { type: String }
}

module.exports = mongooseHandler.setModel('Contact', contactSchema)
