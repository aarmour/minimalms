var config = require('./configuration');
var app = require('koa')();
var mount = require('koa-mount');
var router = require('./router');
var bodyParser = require('koa-bodyparser');
var session = require('koa-session');
var passport = require('koa-passport');

app
  .use(passport.initialize())
  .use(bodyParser())
  .use(mount('/api', router.routes()))
  .use(mount('/api', router.allowedMethods()));

app.listen(config.port, config.host);
