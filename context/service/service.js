var
  lodash = require("lodash"),
  Injector = require("../injector/injector").Injector;

exports.Service = (function(){
  var type_instance = {}, type_factory = {};

  var Service = function(){
    this.__registered = [];
    this.__fallbacks = [];
    this.injector = new Injector(this);
    this.registerInstance(Injector, this.injector);
  };
  var prot = Service.prototype;

  var __isForKey = function __isForKey(registry_entry, key) {
    return registry_entry[0] === key;
  };

  prot.setInjector = function setInjector(injector) {
    this.injector = injector;
  };

  prot.addFallbackService = function addFallbackService(fallback_service) {
    if(fallback_service === this) throw("Don't add self as own fallback service!");
    this.__fallbacks.push(fallback_service);
  };

  prot.respondsTo = function respondsTo(key) {
    return (
      (lodash.any(this.__registered, function(entry) { return __isForKey(entry, key); })) // local
      ||
      this.__anyFallbackRespondsTo(key)
    );
  };

  prot.__anyFallbackRespondsTo = function __anyFallbackRespondsTo(key) {
    return (lodash.any(this.__fallbacks, function(fallback) { return fallback.respondsTo(key); }));
  };

  prot.__getLocalEntryFor = function __getLocalEntryFor(key) {
    return lodash.find(this.__registered, function(entry) { return __isForKey(entry, key); }) || null;
  };

  prot.registerInstance = function registerInstance(key, instance_or_creation_function, force_override) {
    var existing_entry = this.__getLocalEntryFor(key);
    if((existing_entry || this.__anyFallbackRespondsTo(key)) && !force_override) throw ("Already registred " + key);
    if(existing_entry) {
      existing_entry[1] = instance_or_creation_function;
      existing_entry[2] = type_instance;
    } else {
      this.__registered.push([key, instance_or_creation_function, type_instance]);
    }
  };

  prot.registerFactory = function registerFactory(key, creation_function, force_override) {
    var existing_entry = this.__getLocalEntryFor(key);
    if((existing_entry || this.__anyFallbackRespondsTo(key)) && !force_override) throw ("Already registred " + key);
    if(!lodash.isFunction(creation_function)) throw("Factory value must be function");
    if(existing_entry) {
      existing_entry[1] = creation_function;
      existing_entry[2] = type_factory;
    } else {
      this.__registered.push([key, creation_function, type_factory]);
    }
  };

  prot.registerClassFactory = function registerClassFactory(key, class_to_instanciate__or__null) {
    var class_to_instanciate = class_to_instanciate__or__null || key; // assuming key is class
    this.registerFactory(key, function() { return new class_to_instanciate(); });
  };

  prot.__buildInstanceWithInjections = function(creation_function) {
    var inst = creation_function();
    if(this.injector) this.injector.inject(inst);
    return inst;
  };

  prot.resolve = prot.getInstance = function resolve(key) {
    var entry = this.__getLocalEntryFor(key);
    if(entry) {
      // local
      if(entry[2] === type_instance) {
        if(lodash.isFunction(entry[1])) {
          // instanciate as singleton
          entry[1] = this.__buildInstanceWithInjections(entry[1]);
        }
        return entry[1];
      } else if(entry[2] === type_factory) {
        return this.__buildInstanceWithInjections(entry[1]); // return new instance
      }
    }

    // from fallbacks
    var
      was_in_fallback = false,
      resolved = null;

    lodash.find(this.__fallbacks, function(fallback) {
      if(fallback.respondsTo(key)) {
        was_in_fallback = true;
        resolved = fallback.resolve(key);
        return true;
      }
      return false;
    });

    if(was_in_fallback) return resolved;

    throw ("Not registered " + key);
  };

  return Service;
})();