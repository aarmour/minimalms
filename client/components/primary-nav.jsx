var config = require('clientconfig');
var auth = require('../auth');
var React = require('react');
var material = require('material-ui');
var Toolbar = material.Toolbar;
var ToolbarGroup = material.ToolbarGroup;
var FontIcon = material.FontIcon;
var RaisedButton = material.RaisedButton;
var GooglePlusButton = require('./google-plus-button');
var UserProfile = require('./user-profile/user-profile');

module.exports = React.createClass({

  handleSignIn: function (userProfile) {
    this.props.userProfile = userProfile;
    this.setState({signedIn: true});
  },

  handleSignOut: function () {
    delete this.props.userProfile;
    this.setState({signedIn: false});
  },

  componentWillMount: function () {
    auth.on('signIn', this.handleSignIn);
    auth.on('signOut', this.handleSignOut);
  },

  componentWillUnmount: function () {
    auth.removeListener('signIn', this.handleSignIn);
    auth.removeListener('signOut', this.handleSignOut);
  },

  getInitialState: function () {
    return {signedIn: false};
  },

  getDefaultProps: function () {
    return {userProfile: {image: {}}};
  },

  render: function () {
    return (
      <Toolbar>
        <ToolbarGroup key={0} float="left">
          <FontIcon className="md-icon md-icon-menu" />
        </ToolbarGroup>
        <ToolbarGroup key={1} float="right">
          {!this.state.signedIn ? <GooglePlusButton /> : <UserProfile meUrl={this.props.userProfile.url} avatarUrl={this.props.userProfile.image.url} displayName={this.props.userProfile.displayName} />}
        </ToolbarGroup>
      </Toolbar>
    );
  }

});
