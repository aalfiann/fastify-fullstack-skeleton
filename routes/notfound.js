'use strict'

const config = require('../config.js')
const helper = require('../lib/helper.js')
const pjson = require('../package.json')

async function handlerNotFound (server, options) {
  server.setNotFoundHandler(async function (request, reply) {
    if (request.raw.url.indexOf('/api/') !== -1) {
      reply.code(404).send({
        message: 'Route ' + request.method + ':' + request.url + ' not found!',
        error: 'Not Found',
        statusCode: 404
      })
    } else {
      const html = await server.view('404', {
        baseUrl: config.baseUrl,
        baseAssetsUrl: config.baseAssetsUrl,
        year: helper.copyrightYear(config.startYearCopyright),
        siteName: config.siteName,
        authorName: config.authorName,
        authorEmail: config.authorEmail,
        authorWebsite: config.authorWebsite,
        tracker: config.tracker,
        version: pjson.version
      })
      reply.code(200).header('Content-Type', 'text/html; charset=utf-8').send(html)
    }
    await reply
  })
}

module.exports = handlerNotFound
