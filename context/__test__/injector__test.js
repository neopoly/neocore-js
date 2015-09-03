var
  assert = require("chai").assert,
  Injector = require("../injector/injector").Injector,
  Service = require("../service/service").Service;

describe("Injector", function() {

  var
    injector,
    service;

  beforeEach(function() {
    injector = new Injector(
      service = new Service()
    );
  });

  it("requires service in constructor", function() {
    assert.throws(function(){
      new Injector();
    })
  });

  it("injects for inject key", function() {
    service.registerInstance("service1", "resolved1");
    service.registerFactory("service2", function() { return "resolved2"; });
    var inst = {
      inject: {
        val1: "service1",
        val2: "service2"
      }
    };
    injector.inject(inst);
    assert.strictEqual(inst.val1, "resolved1");
    assert.strictEqual(inst.val2, "resolved2");
  });

  it("injects for inject function", function() {
    service.registerInstance("service1", "resolved1");
    service.registerFactory("service2", function() { return "resolved2"; });
    var inst = {
      inject: function() {
        return {
          val1: "service1",
            val2: "service2"
        };
      }
    };
    injector.inject(inst);
    assert.strictEqual(inst.val1, "resolved1");
    assert.strictEqual(inst.val2, "resolved2");
  });

  it("calls afterInject", function() {
    var
      called = false,
      inst = {
        afterInject: function() {
          called = true;
        }
      };

    assert.isFalse(called);
    injector.inject(inst);
    assert.isTrue(called);
  });

  it("calls after_inject", function() {
    var
      called = false,
      inst = {
        after_inject: function() {
          called = true;
        }
      };

    assert.isFalse(called);
    injector.inject(inst);
    assert.isTrue(called);
  });

  it("preserves this in afterInject", function() {
    var cl = function(){

    },
    this_from_afterInject;
    cl.prototype.afterInject = function() { this_from_afterInject = this; };

    var inst = new cl();
    assert.strictEqual(this_from_afterInject, cl);
  });
});