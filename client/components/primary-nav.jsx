var config = require('clientconfig');
var React = require('react');
var material = require('material-ui');
var Toolbar = material.Toolbar;
var ToolbarGroup = material.ToolbarGroup;
var FontIcon = material.FontIcon;
var RaisedButton = material.RaisedButton;
var GooglePlusButton = require('./google-plus-button');
var xhr = require('xhr');

module.exports = React.createClass({
  getInitialState: function() {
    return { signedIn: false };
  },
  handleSignIn: function (authResult) {
    if (authResult.code) {
      this.setState({ signedIn: true });

      xhr({
        method: 'POST',
        uri: '/api/oauth2/google/callback',
        json: { code: authResult.code }
      }, function (error, response, body) {
        if (error) console.error('auth callback failed:', error);
        else console.log(body);
      });
    } else if (authResult.error) {

    }
  },
  render: function () {
    return (
      <Toolbar>
        <ToolbarGroup key={0} float="left">
          <FontIcon className="md-icon md-icon-menu" />
        </ToolbarGroup>
        <ToolbarGroup key={1} float="right">
          { !this.state.signedIn ? <GooglePlusButton clientid={config.googlePlusClientId} scope="profile" callback={this.handleSignIn} /> : null }
        </ToolbarGroup>
      </Toolbar>
    );
  }
});
