require("neocore/__test__/dom").fakeDom();

var
  assert = require("chai").assert,
  React = require("react/addons"),
  WithContext = require("./WithContext"),
  ContextMixins = require("neocore/react/context_mixins"),
  Context = require("neocore/context/context").Context;

describe("ContextMixins.Child service injection", function(){

  it("injects services before getInitialState", function() {

    var
      context = new Context(),
      initially_created_state_val = null;

    context.service.registerInstance("service", "injected value");

    var Child = React.createClass({
      mixins: [ContextMixins.Child],
      inject: {
        my_service: "service"
      },
      getInitialState: function() {
        return {
          val: this.my_service
        };
      },
      render: function() {
        initially_created_state_val = this.state.val;
        return (
          <div/>
        )
      }
    });

    TestUtils.renderIntoDocument(
      WithContext(
        context,
        Child
      )
    );

    assert.strictEqual(
      initially_created_state_val,
      "injected value"
    );
  });

});