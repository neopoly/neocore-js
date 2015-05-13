var
  Service = require("./service/service").Service,
  Injector = require("./injector/injector").Injector;

exports.Context = (function() {
  var Context = function(name){
    this.name = name || null;

    this.service = new Service();
    this.service.registerInstance(Context, this);

    this.injector = this.service.injector;
  };
  var prot = Context.prototype;

  prot.toString = function(){
    return this.name || "Context";
  };

  return Context;
})();