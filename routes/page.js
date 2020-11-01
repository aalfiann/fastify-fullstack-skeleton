'use strict'

const config = require('../config.js')
const moment = require('moment')
const helper = require('../lib/helper.js')
const md5 = require('md5')
const pjson = require('../package.json')

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

async function pageRoute (server, options) {
  server.get('/', async (request, reply) => {
    // EJS view doesn't have browser cache, so we must inject it manually each routes.
    if (config.isProduction) {
      const etag = '"' + md5(request.url + helper.autoEtag(config.autoEtagAfterHour)) + '"'
      if (request.headers['if-none-match'] === etag) {
        return reply.code(304).send('')
      }
      reply.headers(injectResponseHeader(etag))
    }

    const html = await server.view('index.ejs', {
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
