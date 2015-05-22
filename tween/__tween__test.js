var
  assert = require("chai").assert,
  Tween = require("./tween");

describe("Tween when used in node", function() {

  it("calls callback immediately on .from", function() {
    var called = false;
    Tween.from(null, null, {
      onComplete: function() {called = true;}
    });
    assert.isTrue(called);
  });

  it("calls callback immediately on .to", function() {
    var called = false;
    Tween.to(null, null, {
      onComplete: function() {called = true;}
    });
    assert.isTrue(called);
  });
});