var schema = {
  googlePlusClientId: {
    env: 'MLMS_AUTH_GOOGPLUS_CLIENT_ID',
    default: '748870292969-p9oap23kdg9u6l9ic756nsieqqiufbjp.apps.googleusercontent.com'
  }
};

module.exports = require('convict')(schema).validate().get();
