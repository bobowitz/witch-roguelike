export const Keyboard = {
  _pressed: {},

  spaceListener: function() {},
  rightListener: function() {},
  leftListener: function() {},
  upListener: function() {},
  downListener: function() {},

  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,

  isDown: function(keyCode: number) {
    return this._pressed[keyCode];
  },

  onKeydown: (event: KeyboardEvent) => {
    Keyboard._pressed[event.keyCode] = true;
    switch (event.keyCode) {
      case Keyboard.SPACE:
        Keyboard.spaceListener();
        break;
      case Keyboard.LEFT:
        Keyboard.leftListener();
        break;
      case Keyboard.RIGHT:
        Keyboard.rightListener();
        break;
      case Keyboard.UP:
        Keyboard.upListener();
        break;
      case Keyboard.DOWN:
        Keyboard.downListener();
        break;
    }
  },

  onKeyup: function(event: KeyboardEvent) {
    delete this._pressed[event.keyCode];
  },
};
window.addEventListener(
  "keyup",
  function(event) {
    Keyboard.onKeyup(event);
  },
  false
);
window.addEventListener(
  "keydown",
  function(event) {
    Keyboard.onKeydown(event);
  },
  false
);
