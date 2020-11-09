'use strict'

const mongooseHandler = require('../lib/mongoose_handler.js')
const Contact = require('../models/contact')
const schema = require('../schemas/contact')

async function dbRoute (server, options) {
  server.post('/db/add-contact', { schema: schema.addContact }, async (request, reply) => {
    const contact = {
      user_id: request.body.user_id,
      name: request.body.name,
      address: request.body.address
    }
    mongooseHandler.connect().then(done => {
      Contact(contact).save().then(done => {
        reply.code(200).send({
          message: 'Add data user contact success!',
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

  server.post('/db/edit-contact', { schema: schema.editContact }, async (request, reply) => {
    mongooseHandler.connect().then(done => {
      Contact.findOneAndUpdate({
        user_id: request.body.user_id
      }, {
        name: request.body.name,
        address: request.body.address
      }, {
        new: true
      }).then(done => {
        reply.code(200).send({
          message: 'Edit data user contact success!',
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

  server.get('/db/get-contact/:id', { schema: schema.getContact }, async (request, reply) => {
    mongooseHandler.connect().then(done => {
      Contact.find({ user_id: request.params.id }).sort({ user_id: 'desc' }).then(done => {
        reply.code(200).send({
          message: 'Get data user contact success!',
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

  server.get('/db/list-contact', async (request, reply) => {
    mongooseHandler.connect().then(done => {
      Contact.find({}).sort({ user_id: 'desc' }).then(done => {
        reply.code(200).send({
          message: 'List data user contact success!',
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

  server.get('/db/search-contact', { schema: schema.searchContact }, async (request, reply) => {
    const search = decodeURIComponent(request.query.q).trim()
    mongooseHandler.connect().then(done => {
      // Query find like for name and address only
      Contact.find({
        $where: 'function() { return (this.name.toString().match(/' + search + '/i) || this.address.toString().match(/' + search + '/i) ) != null; }'
      }).sort({ user_id: 'desc' }).then(done => {
        reply.code(200).send({
          message: 'Result search data user contact success!',
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
