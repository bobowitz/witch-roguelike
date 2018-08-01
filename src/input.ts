import { GameConstants } from "./gameConstants";

export const Input = {
  _pressed: {},

  iListener: function() {},
  iUpListener: function() {},
  mListener: function() {},
  mUpListener: function() {},
  rightListener: function() {},
  leftListener: function() {},
  upListener: function() {},
  downListener: function() {},
  mouseLeftClickListener: function(x: number, y: number) {},

  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  M: 77,
  N: 78,

  isDown: function(keyCode: number) {
    return this._pressed[keyCode];
  },

  onKeydown: (event: KeyboardEvent) => {
    Input._pressed[event.keyCode] = true;
    switch (event.keyCode) {
      case Input.LEFT:
        Input.leftListener();
        break;
      case Input.RIGHT:
        Input.rightListener();
        break;
      case Input.UP:
        Input.upListener();
        break;
      case Input.DOWN:
        Input.downListener();
        break;
      case 77:
        Input.mListener();
        break;
      case 73:
        Input.iListener();
        break;
    }
  },

  onKeyup: function(event: KeyboardEvent) {
    delete this._pressed[event.keyCode];
    if (event.keyCode === 77) Input.mUpListener();
    if (event.keyCode === 73) Input.iUpListener();
  },

  mouseClickListener: function(event: MouseEvent) {
    if (event.button === 0) {
      let rect = window.document.getElementById("gameCanvas").getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;
      Input.mouseLeftClickListener(
        Math.floor(x / GameConstants.SCALE),
        Math.floor(y / GameConstants.SCALE)
      );
    }
  },
};
window.addEventListener(
  "keyup",
  function(event) {
    Input.onKeyup(event);
  },
  false
);
window.addEventListener(
  "keydown",
  function(event) {
    Input.onKeydown(event);
  },
  false
);
window.document
  .getElementById("gameCanvas")
  .addEventListener("click", event => Input.mouseClickListener(event), false);
