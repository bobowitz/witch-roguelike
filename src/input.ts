import { GameConstants } from "./gameConstants";
import { Game } from "./game";

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

  mouseLeftClickListeners: [],

  mouseLeftClickListener: function(x: number, y: number) {
    for (let i = 0; i < Input.mouseLeftClickListeners.length; i++)
      Input.mouseLeftClickListeners[i](x, y);
  },

  mouseX: 0,
  mouseY: 0,

  lastPressTime: 0,
  lastPressKeyCode: 0,

  SPACE: 32,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  W: 87,
  A: 65,
  S: 83,
  D: 68,
  M: 77,
  N: 78,
  I: 73,

  isDown: function(keyCode: number) {
    return this._pressed[keyCode];
  },

  onKeydown: (event: KeyboardEvent) => {
    if (event.repeat) return; // ignore repeat keypresses
    Input.lastPressTime = Date.now();
    Input.lastPressKeyCode = event.keyCode;
    Input._pressed[event.keyCode] = true;
    switch (event.keyCode) {
      case Input.A:
      case Input.LEFT:
        Input.leftListener();
        break;
      case Input.D:
      case Input.RIGHT:
        Input.rightListener();
        break;
      case Input.W:
      case Input.UP:
        Input.upListener();
        break;
      case Input.S:
      case Input.DOWN:
        Input.downListener();
        break;
      case Input.M:
        Input.mListener();
        break;
      case Input.I:
        Input.iListener();
        break;
    }
  },

  onKeyup: function(event: KeyboardEvent) {
    delete this._pressed[event.keyCode];
    if (event.keyCode === this.lastPressKeyCode) {
      this.lastPressTime = 0;
      this.lastPressKeyCode = 0;
    }
    if (event.keyCode === 77) Input.mUpListener();
    if (event.keyCode === 73) Input.iUpListener();
  },

  mouseClickListener: function(event: MouseEvent) {
    if (event.button === 0) {
      let rect = window.document.getElementById("gameCanvas").getBoundingClientRect();
      let x = event.clientX - rect.left;
      let y = event.clientY - rect.top;
      Input.mouseLeftClickListener(Math.floor(x / Game.scale), Math.floor(y / Game.scale));
    }
  },

  updateMousePos: function(event: MouseEvent) {
    let rect = window.document.getElementById("gameCanvas").getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;

    Input.mouseX = Math.floor(x / Game.scale);
    Input.mouseY = Math.floor(y / Game.scale);
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
window.document
  .getElementById("gameCanvas")
  .addEventListener("mousemove", event => Input.updateMousePos(event));
