var fs = require('fs');
var React = require('react');
var View = require('ampersand-view');
var PrimaryNav = require('../components/primary-nav');

module.exports = View.extend({

  template: fs.readFileSync(__dirname + '/templates/dashboard.html', 'utf8'),

  render: function () {
    var self = this;

    this.renderWithTemplate(this);

    setTimeout(function () {
      React.render(React.createElement(PrimaryNav), self.el);
    }, 0);

    return this;
  }

});
