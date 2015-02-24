var config = require('clientconfig');
var xhr = require('xhr');
var EventEmitter = require('events').EventEmitter;

var initialized = false;
var emitter = new EventEmitter();

var exports = module.exports = function (root) {
  if (initialized) return;

  initialized = true;

  // The sign-in callback must be in the global scope
  root.handleSignIn = handleSignIn;

  // Add head content
  addMetaTag('google-signin-clientid', config.googlePlusClientId);
  addMetaTag('google-signin-cookiepolicy', config.googlePlusCookiePolicy);
  addMetaTag('google-signin-callback', 'handleSignIn');
  addMetaTag('google-signin-scope', 'profile');

  var gplus = document.createElement('script');
  gplus.setAttribute('src', 'https://apis.google.com/js/client:platform.js');
  gplus.async = true;
  gplus.defer = true;
  document.head.appendChild(gplus);
};

exports.signIn = function () {
  return gapi.auth.signIn();
}

exports.signOut = function () {
  return gapi.auth.signOut();
}

exports.on = emitter.on.bind(emitter);

function addMetaTag(name, content) {
  var meta = document.createElement('meta');
  meta.setAttribute('name', name);
  meta.setAttribute('content', content);
  document.head.appendChild(meta);
}

function handleSignIn(authResult) {
  if (authResult.status.signed_in && authResult.status.method === 'AUTO') {
    if (authResult.code) {
      xhr({
        method: 'POST',
        uri: '/api/oauth2/google/callback',
        json: { code: authResult.code }
      }, function (error, response, body) {
        if (error) throw error;
        emitter.emit('signIn', body);
      });
    }
  } else if (authResult.error === 'user_signed_out') {
    emitter.emit('signOut');
  }
}
