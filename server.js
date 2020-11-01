'use strict'

require('make-promises-safe')
const path = require('path')
const config = require('./config.js')
const cluster = require('cluster')
const numCPUs = require('os').cpus().length
const nodeMailer = require('fastify-nodemailer')
const htmlMinifier = require('html-minifier')
const server = require('fastify')({
  logger: config.logger,
  maxParamLength: config.maxParamLength
})

const App = async () => {
  server.addHook('onRequest', async (request, reply) => {
    // Set Cors for API
    if (request.raw.url.indexOf('/api/') !== -1) {
      reply.headers({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Etag'
      })
    }
  })

  // Routes
  server.decorate('dataRoutes', [])
  server.addHook('onRoute', (routeOptions) => {
    server.dataRoutes.push({
      method: routeOptions.method,
      schema: routeOptions.schema,
      url: routeOptions.url,
      path: routeOptions.path,
      routePath: routeOptions.routePath,
      bodyLimit: routeOptions.bodyLimit,
      logLevel: routeOptions.logLevel,
      logSerializers: routeOptions.logSerializers,
      prefix: routeOptions.prefix
    })
  })
  server.register(require('./routes/page.js'))
  // Plugins
  server.register(require('point-of-view'), {
    engine: {
      eta: require('eta')
    },
    root: path.join(__dirname, 'views', config.templateDir),
    viewExt: 'html',
    options: {
      production: config.isProduction,
      useHtmlMinifier: htmlMinifier,
      htmlMinifierOptions: (config.useHTMLMinifier ? config.minifierOptions : {})
    }

  })
  // Set everything inside public directory is static file
  server.register(require('fastify-static'), {
    root: path.join(__dirname, 'public'),
    prefix: '/',
    maxAge: (config.maxAgeStaticCache * 1000),
    immutable: true,
    decorateReply: false
  })
  // Set maxage cache longer for all files inside assets directory
  server.register(require('fastify-static'), {
    root: path.join(__dirname, 'public', 'assets'),
    prefix: '/assets/',
    maxAge: (config.maxAgeAssetsCache * 1000),
    immutable: true,
    decorateReply: false
  })
  server.register(nodeMailer, config.nodeMailerTransport)

  // Custom Not Found Handler
  server.register(require('./routes/notfound.js'))

  // Custom Error Handler
  server.setErrorHandler(async function (error, request, reply) {
    server.log.error(error)
    await reply.code(500).send({
      message: 'Whoops, Something went wrong!',
      error: error.message,
      statusCode: 500
    })
  })

  const start = async () => {
    try {
      await server.listen(config.port)
    } catch (err) {
      server.log.error(err)
      process.exit(1)
    }
  }
  start()
}

if (config.useWorker) {
  if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`)
    for (let i = 0; i < numCPUs; i++) {
      cluster.fork()
    }
    cluster.on('exit', worker => {
      console.log(`Worker ${worker.process.pid} died`)
    })
  } else {
    App()
  }
} else {
  App()
}
