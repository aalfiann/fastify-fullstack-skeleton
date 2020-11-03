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
      User(user).save().then(done => {
        reply.code(200).send({
          message: 'Add data user success!',
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

  server.post('/db/edit-user', async (request, reply) => {
    mongooseHandler.connect().then(done => {
      User.findOneAndUpdate({
        user_id: request.body.user_id
      }, {
        name: request.body.name,
        address: request.body.address
      }, {
        new: true
      }).then(done => {
        reply.code(200).send({
          message: 'Edit data user success!',
          statusCode: 200,
          data: done
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

  server.get('/db/get-user/:id', async (request, reply) => {
    mongooseHandler.connect().then(done => {
      User.find({ user_id: request.params.id }).sort({ user_id: 'desc' }).then(done => {
        reply.code(200).send({
          message: 'Get data user success!',
          statusCode: 200,
          data: done
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

  server.get('/db/list-user', async (request, reply) => {
    mongooseHandler.connect().then(done => {
      User.find({}).sort({ user_id: 'desc' }).then(done => {
        reply.code(200).send({
          message: 'List data user success!',
          statusCode: 200,
          data: done
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

  server.get('/db/search-user', async (request, reply) => {
    if (!request.query.q) {
      return reply.code(200).send({
        message: 'Required query parameter "q" with more than 2 chars!',
        statusCode: 200
      })
    }
    const search = decodeURIComponent(request.query.q).trim()
    if (!search || search.length < 3) {
      return reply.code(200).send({
        message: 'Query search must more than 2 chars!',
        statusCode: 200
      })
    }
    mongooseHandler.connect().then(done => {
      // Query find like for name and address only
      User.find({
        $where: 'function() { return (this.name.toString().match(/' + search + '/i) || this.address.toString().match(/' + search + '/i) ) != null; }'
      }).sort({ user_id: 'desc' }).then(done => {
        reply.code(200).send({
          message: 'Result search data user success!',
          statusCode: 200,
          data: done
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
