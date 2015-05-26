var
  assert = require("chai").assert,
  React = require("react/addons");

/**
 * Render components that get context and injection via neocore/react/ContextMixins.Child
 *
 * Usage:
 *   var rendered = TestUtils.renderIntoDocument(
 *     WithContext(
 *       context,
 *       Component,      // component to render with context
 *       {val: "xxx"}    // props for component
 *     )
 *   );
*/
exports = module.exports = function(context, Child, props) {
  var cls = React.createClass({
    mixins: [require("react/context_mixins").Parent(context)],
    render: function(){
      return (
        React.createFactory(Child)(props || undefined)
      );
    }
  });
  return React.createElement(cls);
};