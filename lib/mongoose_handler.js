'use strict'

const mongoose = require('mongoose')
const config = require('../config.js')
const MongooseSchema = mongoose.Schema

/**
 * Make a connection to MongoDB
 * @param {(err: MongoError)} callback
 * @return pseudo promise wrapper around this
 */
function connect (callback) {
  if (callback && typeof callback === 'function') {
    return mongoose.connect(config.mongoDBUrl, config.mongoDBOptions, callback)
  }
  return mongoose.connect(config.mongoDBUrl, config.mongoDBOptions)
}

/**
 * Close connection from MongoDB
 * @param {(err: MongoError)} callback
 * @return pseudo promise wrapper around this
 */
function close (callback) {
  if (callback && typeof callback === 'function') {
    return mongoose.connection.close(callback)
  }
  return mongoose.connection.close()
}

/**
 * Transform document object
 * @param {*} doc
 * @param {*} ret
 * @return {object}
 */
function _transform (doc, ret) {
  ret._id = doc._id.toString()
  return ret
}

/**
 * Create Mongoose schema
 * @param {object} obj
 * @return {schema}
 */
function createSchema (obj) {
  const schema = new MongooseSchema(obj, {
    toObject: { _transform },
    toJSON: { _transform }
  })

  schema.set('toObject', { virtuals: true })
  return schema
}

/**
 * Set Mongoose model
 * @param {string} name
 * @param {object} schema
 * @return {model}
 */
function setModel (name, schema) {
  return mongoose.model(name, createSchema(schema))
}

/**
 * Error builder from Mongoose to Fastify formatted
 * @param {object} err          this is the error object from Mongoose Error
 * @return {object}
 */
function errorBuilder (err) {
  const error = {
    statusCode: 400,
    message: (err.errmsg) ? err.errmsg : (err.name) ? err.name : 'Unknown error!',
    error: {
      driver: err.driver,
      name: err.name,
      index: err.index,
      keyPattern: err.keyPattern,
      keyValue: err.keyValue
    }
  }
  return error
}

module.exports = {
  connect,
  close,
  createSchema,
  setModel,
  errorBuilder,
  mongoose
}
