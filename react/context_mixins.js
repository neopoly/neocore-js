var
  React = require("react");

exports.Parent = function(context) {
  return {
    childContextTypes: {
      service: React.PropTypes.object.isRequired,
      injector: React.PropTypes.object.isRequired
    },
    getChildContext: function() {
      return {
        service: context.service,
        injector: context.injector
      };
    }
  };
};

exports.Child = {
  contextTypes: {
    service: React.PropTypes.object.isRequired,
    injector: React.PropTypes.object.isRequired
  },
  getInitialState: function() {
    this.context.injector.inject(this);
    return {};
  }
};