var React = require('react');
var material = require('material-ui');
var RaisedButton = material.RaisedButton;

module.exports = React.createClass({
  handleClick: function (event) {
    gapi.auth.signIn({
      clientid: this.props.clientid,
      scope: this.props.scope,
      cookiepolicy: 'single_host_origin',
      callback: this.props.callback
    });
  },
  render: function () {
    return (
      <RaisedButton label="Sign In With Google+"
                    primary={true}
                    clientid={this.props.clientid}
                    scope={this.props.scope}
                    callback={this.props.callback}
                    onClick={this.handleClick} />
    );
  }
});
