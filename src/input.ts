import { GameConstants } from "./gameConstants";
import { Game } from "./game";

export const Input = {
  _pressed: {},

  iListener: function() {},
  iUpListener: function() {},
  mListener: function() {},
  mUpListener: function() {},
  leftListener: function() {},
  rightListener: function() {},
  upListener: function() {},
  downListener: function() {},
  leftSwipeListener: function() {},
  rightSwipeListener: function() {},
  upSwipeListener: function() {},
  downSwipeListener: function() {},

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

  getTouches: function(evt) {
    return (
      evt.touches || evt.originalEvent.touches // browser API
    ); // jQuery
  },

  xDown: null,
  yDown: null,
  currentX: 0,
  currentY: 0,
  swiped: false,

  handleTouchStart: function(evt) {
    evt.preventDefault();

    const firstTouch = Input.getTouches(evt)[0];
    Input.xDown = firstTouch.clientX;
    Input.yDown = firstTouch.clientY;
    Input.currentX = firstTouch.clientX;
    Input.currentY = firstTouch.clientY;

    Input.updateMousePos({
      clientX: Input.currentX,
      clientY: Input.currentY,
    } as MouseEvent);

    Input.swiped = false;
  },

  handleTouchMove: function(evt) {
    evt.preventDefault();

    Input.currentX = evt.touches[0].clientX;
    Input.currentY = evt.touches[0].clientY;

    Input.updateMousePos({
      clientX: Input.currentX,
      clientY: Input.currentY,
    } as MouseEvent);

    if (Input.swiped) return;

    var xDiff = Input.xDown - Input.currentX;
    var yDiff = Input.yDown - Input.currentY;

    // we have not swiped yet
    // check if we've swiped
    if (xDiff ** 2 + yDiff ** 2 >= GameConstants.SWIPE_THRESH) {
      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        /*most significant*/
        if (xDiff > 0) {
          Input.leftSwipeListener();
        } else {
          Input.rightSwipeListener();
        }
        Input.swiped = true;
      } else {
        if (yDiff > 0) {
          Input.upSwipeListener();
        } else {
          Input.downSwipeListener();
        }
        Input.swiped = true;
      }
    }
  },

  handleTouchEnd: function(evt) {
    evt.preventDefault();

    // we've already swiped, don't count the click
    if (Input.swiped) return;

    Input.mouseClickListener({
      button: 0,
      clientX: Input.currentX,
      clientY: Input.currentY,
    } as MouseEvent);

    Input.updateMousePos({
      clientX: 0,
      clientY: 0,
    } as MouseEvent);
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
