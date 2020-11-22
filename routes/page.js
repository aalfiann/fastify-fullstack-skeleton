'use strict'

const config = require('../config.js')
const helper = require('../lib/helper.js')
const pjson = require('../package.json')

async function pageRoute (server, options) {
  server.get('/', { onRequest: server.useHtmlCache }, async (request, reply) => {
    const html = await server.view('index', {
      baseUrl: config.baseUrl,
      baseAssetsUrl: config.baseAssetsUrl,
      year: helper.copyrightYear(config.startYearCopyright),
      siteName: config.siteName,
      siteTitle: config.siteTitle,
      siteDescription: config.siteDescription,
      authorName: config.authorName,
      authorEmail: config.authorEmail,
      authorWebsite: config.authorWebsite,
      webmaster: config.webmaster,
      tracker: config.tracker,
      version: pjson.version
    })
    await reply.code(200).header('Content-Type', 'text/html; charset=utf-8').send(html)
  })
}

module.exports = pageRoute
