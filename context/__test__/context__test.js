var
  assert = require("chai").assert,
  Context = require("../context").Context,
  Injector = require("../injector/injector").Injector,
  Service = require("../service/service").Service;

describe("Context", function(){
  var context;

  beforeEach(function(){
    context = new Context();
  });

  it("should log name", function() {
    assert.strictEqual("" + new Context("expected-name"), "expected-name");
    assert.strictEqual("" + new Context(), "Context");
  });

  it("should have service resolver", function(){
    assert.isDefined(context.service, ".service");
    assert.instanceOf(context.service, Service);
  });

  it("registers itself to service for Context", function() {
    assert.strictEqual(context.service.resolve(Context), context);
  });

  it("delegates injector to service-injector", function() {
    assert.isDefined(context.injector);
    assert.strictEqual(context.injector, context.service.resolve(Injector));
  })

});