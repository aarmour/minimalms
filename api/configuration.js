var schema = {
  host: {
    env: 'MLMS_HOST',
    default: '0.0.0.0'
  },
  port: {
    env: 'MLMS_PORT',
    default: 8000
  },
  session: {
    secret: {
      env: 'MLMS_SESSION_SECRET',
      default: 'development'
    }
  },
  auth: {
    googlePlus: {
      clientId: {
        env: 'MLMS_AUTH_GOOGPLUS_CLIENT_ID',
        default: '748870292969-p9oap23kdg9u6l9ic756nsieqqiufbjp.apps.googleusercontent.com'
      },
      clientSecret: {
        doc: 'Google Plus client secret. This *must never* be checked into source control.',
        env: 'MLMS_AUTH_GOOGPLUS_CLIENT_SECRET',
        default: 'development'
      }
    }
  }
};

module.exports = require('convict')(schema).validate().get();
