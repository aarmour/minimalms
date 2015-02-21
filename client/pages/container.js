// The container view for all app content. This view also handles
// document-level events, such as keyboard shortcuts.

var fs = require('fs');
var domify = require('domify');
var View = require('ampersand-view');
var ViewSwitcher = require('ampersand-view-switcher');
var router = require('../router');
var navigate = router.history.navigate;

module.exports = View.extend({
  template: '<div data-hook="container"></div>',

  initialize: function () {
    // Bind to page change events
    this.listenTo(router, 'page', this.handlePageChange);
  },

  events: {
    'click a[href]': 'handleLinkClick'
  },

  render: function () {
    // Add the head content
    document.head.appendChild(domify(fs.readFileSync(__dirname + '/templates/head.html', 'utf8')));

    var gplus = document.createElement('script');
    gplus.setAttribute('src', 'https://apis.google.com/js/client:platform.js');
    gplus.async = true;
    gplus.defer = true;
    document.head.appendChild(gplus);

    this.renderWithTemplate();

    document.body.insertBefore(this.el, document.body.firstChild);

    this.pageSwitcher = new ViewSwitcher(this.queryByHook('container'), {

    });

    return this;
  },

  handlePageChange: function (view) {
    this.pageSwitcher.set(view);
  },

  handleLinkClick: function (e) {
    var aTag = e.target;
    var local = aTag.host === window.location.host;

    if (local && !isModifierKey(e)) {
      e.preventDefault();
      navigate(aTag.pathname, { trigger: true });
    }
  }
});

function isModifierKey(e) {
  return e.ctrlKey || e.shiftKey || e.altKey || e.metaKey;
}
