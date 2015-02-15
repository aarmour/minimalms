var React = require('react');
var material = require('material-ui');
var Toolbar = material.Toolbar;
var ToolbarGroup = material.ToolbarGroup;
var FontIcon = material.FontIcon;

module.exports = React.createClass({
  render: function () {
    return (
      <Toolbar>
        <ToolbarGroup key={0} float="left">
          <FontIcon className="md-icon md-icon-menu" />
        </ToolbarGroup>
      </Toolbar>
    );
  }
});
