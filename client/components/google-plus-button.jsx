var React = require('react');
var material = require('material-ui');
var RaisedButton = material.RaisedButton;
var auth = require('../auth');

module.exports = React.createClass({

  handleClick: function (event) {
    auth.signIn();
  },

  render: function () {
    return (
      <RaisedButton label="Sign In With Google+" primary={true} onClick={this.handleClick} />
    );
  }

});
