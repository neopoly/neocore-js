var
  assert = require("chai").assert,
  Service = require("../service/service").Service,
  Injector = require("../injector/injector").Injector;

describe("Service", function(){

  var service, a_key, a_val;

  beforeEach(function(){
    service = new Service();
    a_key = {};
    a_val = {};
  });

  it("should respondTo", function() {
    service.registerInstance(a_key, 123);
    assert.ok(service.respondsTo(a_key));
    assert.notOk(service.respondsTo("something else"));
  });

  it("has resolve and getInstance as aliases", function() {
    assert.strictEqual(service.resolve, service.getInstance);
  });

  it("resolves instance", function() {
    service.registerInstance(a_key, a_val);
    assert.strictEqual(service.resolve(a_key), a_val);
  });

  it("resolves factory", function() {
    service.registerFactory(a_key, function(){ return {val: "xxx"}});
    var
      resolved1 = service.resolve(a_key),
      resolved2 = service.resolve(a_key);

    assert.notEqual(resolved1, resolved2);
    assert.strictEqual(resolved1.val, "xxx");
    assert.strictEqual(resolved2.val, "xxx");
  });

  it("throws when registered factory is not a function", function(){
    assert.throws(function(){
      service.registerFactory(a_key, "not a function");
    });
  });

  it("overrides when forced", function(){
    service.registerInstance(a_key, 1);
    service.registerInstance(a_key, 2, true);
    assert.strictEqual(service.resolve(a_key), 2);
  });

  it("can override instance with factory and vice versa", function() {
    var
      inst = "instance",
      fac_count = 0;
      fac = function() { return "factory" + (++fac_count);};

    service.registerInstance(a_key, inst);
    assert.strictEqual(service.resolve(a_key), "instance");

    service.registerFactory(a_key, fac, true);
    assert.strictEqual(service.resolve(a_key), "factory1");
    assert.strictEqual(service.resolve(a_key), "factory2");

    service.registerInstance(a_key, inst, true);
    assert.strictEqual(service.resolve(a_key), "instance");
  });

  it("creates instance on first resolve", function() {
    var
      creation_function_called = 0,
      create_me = function() { creation_function_called++; return "created"; };

    service.registerInstance(a_key, create_me);
    assert.strictEqual(creation_function_called, 0);

    assert.strictEqual(service.resolve(a_key), "created");
    assert.strictEqual(creation_function_called, 1);

    service.resolve(a_key);
    assert.strictEqual(creation_function_called, 1, "not called again");
  });

  it("throws when registering for existing key", function() {
    service.registerInstance(a_key, {});
    assert.throws(function(){
      service.registerInstance(a_key, {});
    });
  });

  it("throws when not registered", function() {
    assert.throws(function(){
      service.resolve("not registered");
    });
  });

  it("throws when adding self as fallback", function() {
    assert.throws(function() {
      service.addFallbackService(service);
    });
  });

  it("makes lookup through fallback-resolver", function(){
    var
      fallback1 = new Service(),
      fallback2 = new Service();
    service.addFallbackService(fallback1);
    fallback1.addFallbackService(fallback2);

    fallback2.registerInstance(a_key, a_val);

    assert.isTrue(service.respondsTo(a_key));
    assert.strictEqual(service.resolve(a_key), a_val);
  });

  it("throws when registering keys already in fallback", function() {
    var fallback = new Service();
    fallback.registerInstance(a_key, a_val);
    service.addFallbackService(fallback);
    assert.throws(function() {
      service.registerInstance(a_key, "something else");
    });
  });

  it("overrides key from fallback when forced", function() {
    var fallback = new Service();
    fallback.registerInstance(a_key, a_val);
    service.addFallbackService(fallback);

    service.registerInstance(a_key, "overridden", true);
    assert.strictEqual(service.resolve(a_key), "overridden");
  });

  it("uses injector(when given) when creating instances", function(){
    service.registerInstance(a_key, function() {
      return {
        inject: {
          val1: "service1",
          val2: "service2"
        }
      };
    });
    service.registerInstance("service1", "resolved1");
    service.registerInstance("service2", "resolved2");

    var inst = service.resolve(a_key);
    assert.strictEqual(inst.val1, "resolved1");
    assert.strictEqual(inst.val2, "resolved2");
  });

  it("injects deep", function() {
    service.registerInstance("flat", function() {
      return {
        inject: {
          deep: "deep"
        }
      };
    });
    service.registerInstance("deep", function() {
      return {
        inject: {
          deeper: "deeper"
        }
      };
    });
    service.registerInstance("deeper", function() {
      return {
        val: "i am deeper"
      };
    });

    assert.strictEqual(service.resolve("flat").deep.deeper.val, "i am deeper");
  });

  it("registers Class for itself as factory", function() {
    var
      AClass = function() {};

    AClass.prototype.hello = function() { return "expected"; };

    service.registerClassFactory(AClass);
    assert.strictEqual(service.resolve(AClass).hello(), "expected");
  });

  it("registers factory that creates instances with new", function() {
    var
      AClass = function() {},
      AClassImplementation = function() {};

    AClass.prototype.hello = function() { return "should not be called"; };
    AClassImplementation.prototype.hello = function() { return "expected"; };

    service.registerClassFactory(AClass, AClassImplementation);
    assert.strictEqual(service.resolve(AClass).hello(), "expected");
  });

  it("registers class-instance that is created (once) with new", function() {
    var
      AClass = function() {},
      AClassImplementation = function() {};

    AClass.prototype.hello = function() { return "should not be called"; };
    AClassImplementation.prototype.hello = function() { return "expected"; };

    service.registerClassInstance(AClass, AClassImplementation);
    var returned;
    assert.strictEqual((returned = service.resolve(AClass)).hello(), "expected");
    assert.strictEqual(returned, service.resolve(AClass));
  });

  it("registers class-instance that is created (once) with new for itself", function() {
    var
      AClass = function() {};

    AClass.prototype.hello = function() { return "expected"; };

    service.registerClassInstance(AClass);
    assert.strictEqual((returned = service.resolve(AClass)).hello(), "expected");
  });

  it("register Class also injects", function() {
    var
      AClass = function() {
        this.inject = {
          "val1": "service1"
        }
      };

    service.registerInstance("service1", "resolved1");
    service.registerClassFactory(AClass);

    assert.strictEqual(service.resolve(AClass).val1, "resolved1");
  });

});