var
  lodash = require("lodash");

exports.Injector = (function(){
  var Injector = function(service){
    this.service = service;
    if(!this.service) throw ("Injector needs service in constructor");
  };
  var prot = Injector.prototype;

  prot.inject = function inject(into) {
    var injections = lodash.isFunction(into.inject) ? into.inject() : into.inject;
    if(injections) {
      for(var key in injections) {
        if(injections.hasOwnProperty(key)) {
          if(!lodash.isUndefined(into[key])) throw("Key to inject already defined: " + key);
          into[key] = this.service.resolve(injections[key]);
        }
      }
    }

    var after = into.afterInject || into.after_inject;
    if(after) after();
  };

  return Injector;
})();