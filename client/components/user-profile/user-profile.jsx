var React = require('react');
var material = require('material-ui');
var auth = require('../../auth');

module.exports = React.createClass({

  render: function () {
    return (
      <div className="user-profile">
        <a href={this.props.meUrl}>{this.props.displayName}</a>
        <a href="/signed-out" onClick={auth.signOut}>Sign Out</a>
        <img src={this.props.avatarUrl} className="avatar" />
      </div>
    );
  }

});
