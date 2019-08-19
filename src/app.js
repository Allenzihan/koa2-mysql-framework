import Koa from 'koa'
import session from 'koa-session'
import views from 'koa-views'
import json from 'koa-json'
import onerror from 'koa-onerror'
import bodyparser from 'koa-bodyparser'
import koaLogger from 'koa-logger'
import path from 'path'
import jwt from 'koa-jwt'
import fs from 'fs'
import {errorRoute, notFoundRoute} from './middleware/errorRouteCatch'
import {accessLogger, logger} from '../config/logger.config'
import sessConfig from '../config/session.config'
import routers from './routes/index'

// error handler
const app = new Koa()
const publicKey = fs.readFileSync(path.join(__dirname, '../publicKey.pub'))
onerror(app)
logger.error('start app', 'env:', process.env.NODE_ENV) 
// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(accessLogger())
app.use(koaLogger())

// router error
app.use(errorRoute())

app.use(require('koa-static')(__dirname + '../assets'))

// set the signature, control api to be accessed
app.use(jwt({ 
  secret: publicKey.toString()
}).unless({
  path: [
    /^\/users\/login/,
    /^\/home/,
    /^\/assets/
  ] 
}))

// set template type, if use hbs, only change "extension: 'hbs'" and "hbs: 'handlebars'"
app.use(views(__dirname + '/views', {
  extension: 'html',
  map: { html: 'handlebars' }
}))

// extends request header info
app.use(async (ctx, next) => {
  ctx.request.header.publicKey = publicKey.toString()
  // test authorization 
  // ctx.request.header = {'authorization': "Bearer " + (ctx.request.headers.)}
  await next()
})

// if donot use session, you can remove the session middleware here.
app.keys = [publicKey.toString()]
app.use(session(sessConfig, app))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
routers.forEach(router => {
  app.use(router.routes(), router.allowedMethods())
})

// not found router
app.use(notFoundRoute())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
  logger.error('server error', err, ctx)
})

module.exports = app
