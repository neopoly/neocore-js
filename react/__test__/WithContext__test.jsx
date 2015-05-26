require("__test__/dom").fakeDom();

var
  assert = require("chai").assert,
  React = require("react/addons"),
  TestUtils = React.addons.TestUtils,
  WithContext = require("./WithContext"),
  ContextMixins = require("react/context_mixins"),
  Context = require("context/context").Context;

describe("WithContext", function(){

  it("provides context and forwards props", function() {

    var context = new Context();
    context.service.registerInstance("service", "injected value");

    var Child = React.createClass({
      mixins: [ContextMixins.Child],
      inject: {
        my_service: "service"
      },
      render: function() {
        return (
          <div>
            <span>{this.my_service}</span>
            <i>{this.props.prop}</i>
          </div>
        )
      }
    });

    var WrappedChild = React.createClass({
      render: function() {
        return (
          <Child prop={this.props.given_prop}/>
        );
      }
    });

    var rendered = TestUtils.renderIntoDocument(
      WithContext(
        context,
        WrappedChild,
        {given_prop: "expected prop"}
      )
    );

    assert.strictEqual(
      TestUtils.findRenderedDOMComponentWithTag(rendered, 'span').getDOMNode().textContent,
      "injected value"
    );

    assert.strictEqual(
      TestUtils.findRenderedDOMComponentWithTag(rendered, 'i').getDOMNode().textContent,
      "expected prop"
    );
  });

});