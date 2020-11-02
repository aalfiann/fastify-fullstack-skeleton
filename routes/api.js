'use strict'

const config = require('../config.js')
const moment = require('moment')
const helper = require('../lib/helper.js')
const md5 = require('md5')

/**
 * Inject Response Header for EJS only
 * We need etag if your website sitting behind proxy server like nginx, haproxy, etc.
 * @param {string} etag this is the etag value in string
 * @returns {object}
 */
function injectResponseHeader (etag) {
  return {
    'Content-Type': 'text/html; charset=utf-8',
    'Cache-Control': 'public, max-age=' + 86400,
    Expires: moment().add(86400, 'seconds').utc().format('ddd, DD MMM YYYY HH:mm:ss') + ' GMT',
    Pragma: 'public',
    Etag: etag
  }
}

async function apiRoute (server, options) {
  server.get('/api/routes', async (request, reply) => {
    // EJS view doesn't have browser cache, so we must inject it manually each routes
    if (config.isProduction) {
      const etag = '"' + md5(request.url + helper.autoEtag(config.autoEtagAfterHour)) + '"'
      if (request.headers['if-none-match'] === etag) {
        return reply.code(304).send('')
      }
      reply.headers(injectResponseHeader(etag))
    }
    await reply.code(200).send({
      message: 'Get data routes success',
      statusCode: 200,
      data: server.dataRoutes
    })
  })
}

module.exports = apiRoute
