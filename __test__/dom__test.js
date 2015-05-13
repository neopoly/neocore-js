var
  dom = require("./dom"),
  assert = require("chai").assert;

describe("dom.fakeDom()", function(){
  it("defines document and window, has basic DOM functionality", function(){
    dom.fakeDom();
    assert.isDefined(global.document);
    assert.isDefined(global.window);
    global.document.body.innerHTML = "<div class='test'>expected</div>";
    assert.strictEqual(global.document.getElementsByClassName("test")[0].innerHTML, "expected");
  });
});