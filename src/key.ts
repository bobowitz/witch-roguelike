export const Key = {
  _pressed: {},

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
    Key._pressed[event.keyCode] = true;
    switch (event.keyCode) {
      case Key.LEFT:
        Key.leftListener();
        break;
      case Key.RIGHT:
        Key.rightListener();
        break;
      case Key.UP:
        Key.upListener();
        break;
      case Key.DOWN:
        Key.downListener();
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
    Key.onKeyup(event);
  },
  false
);
window.addEventListener(
  "keydown",
  function(event) {
    Key.onKeydown(event);
  },
  false
);
