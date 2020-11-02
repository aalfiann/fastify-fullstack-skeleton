'use strict'

const mongooseHandler = require('../lib/mongoose_handler.js')
const User = require('../models/user')

async function dbRoute (server, options) {
  server.post('/db/add-user', async (request, reply) => {
    const user = {
      user_id: request.body.user_id,
      name: request.body.name,
      address: request.body.address
    }
    mongooseHandler.connect().then(done => {
      new User(user).save().then(done => {
        reply.code(200).send({
          message: 'Test input data user success!',
          statusCode: 200
        })
      }).catch(err => {
        reply.code(400).send(mongooseHandler.errorBuilder(err))
      })
    }).catch(err => {
      reply.code(500).send({
        message: err.message,
        statusCode: 500
      })
    })
    await reply
  })
}

module.exports = dbRoute
