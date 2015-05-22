var immediate_call_onComplete = function(a, b, args) {
  if(args && args.onComplete) args.onComplete();
};

// just a dummy for the interface
module.exports = {
  from: immediate_call_onComplete,
  to: immediate_call_onComplete,
  killTweensOf: function() {}
};