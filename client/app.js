var domReady = require('domready');
var React = require('react');
var injectTapEventPlugin = require('react-tap-event-plugin');
var router = require('./router');
var auth = require('./auth');
var ContainerView = require('./pages/container');

var app = module.exports = {

  boot: function () {

    // Needed for React Developer Tools
    window.React = React;

    // Some Material-UI components use react-tap-event-plugin to
    // listen for touch events. This will no longer be needed once
    // React 1.0 has been released.
    injectTapEventPlugin();

    domReady(function () {
      auth(window, window.gapi);

      var containerView = new ContainerView();

      containerView.render();
      router.history.start({ pushState: true });
    });
  }

};

app.boot();
