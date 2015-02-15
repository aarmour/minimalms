var Router = require('ampersand-router');
var DashboardView = require('./pages/dashboard');

var AppRouter = Router.extend({

  routes: {
    'dashboard': 'dashboard',
    '*matchall': 'otherwise'
  },

  dashboard: function () {
    this.trigger('page', new DashboardView());
  },

  otherwise: function () {
    this.redirectTo('dashboard');
  }

});

module.exports = new AppRouter();
