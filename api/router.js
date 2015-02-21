var authenticate = require('./auth');
var router = module.exports = require('koa-router')();

// router.post('/oauth2/google/callback', authenticate(), function *(next) {
//   this.body = this.user;
// });

router.post('/oauth2/google/callback', function *(next) {
  var self = this;

  yield* authenticate(function *(error, user, info, status) {
    self.body = user;
  }).call(this, next);
});
