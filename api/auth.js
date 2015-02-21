var config = require('./configuration');
var passport = require('koa-passport');
var GooglePlusStrategy = require('passport-google-plus');

module.exports = passport.authenticate.bind(passport, 'google');

passport.serializeUser(function(user, callback) {
  // TODO
  callback(null, user);
});

passport.deserializeUser(function(id, callback) {
  // TODO
  callback(null, id);
});

function onSuccess(tokens, profile, callback) {
  // TODO: create/update user
  callback(null, profile, tokens);
}

var options = {
  clientId: config.auth.googlePlus.clientId,
  clientSecret: config.auth.googlePlus.clientSecret
};

passport.use(new GooglePlusStrategy(options, onSuccess));
