'use strict'

async function apiRoute (server, options) {
  server.get('/api/routes', { onRequest: server.useHtmlCache }, async (request, reply) => {
    await reply.code(200).send({
      message: 'Get data routes success',
      statusCode: 200,
      data: server.dataRoutes
    })
  })
}

module.exports = apiRoute
