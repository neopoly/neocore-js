exports.fakeDom = function() {
  if (typeof document !== 'undefined') {
    document.body.innerHTML = '';
  } else {
    var jsdom = require('jsdom');
    global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
    global.window = global.document.defaultView;
    global.navigator = {
      userAgent: 'node.js'
    };
  }
};