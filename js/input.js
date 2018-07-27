"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gameConstants_1 = require("./gameConstants");
exports.Input = {
    _pressed: {},
    iListener: function () { },
    iUpListener: function () { },
    mListener: function () { },
    mUpListener: function () { },
    rightListener: function () { },
    leftListener: function () { },
    upListener: function () { },
    downListener: function () { },
    mouseLeftClickListener: function (x, y) { },
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    isDown: function (keyCode) {
        return this._pressed[keyCode];
    },
    onKeydown: function (event) {
        exports.Input._pressed[event.keyCode] = true;
        switch (event.keyCode) {
            case exports.Input.LEFT:
                exports.Input.leftListener();
                break;
            case exports.Input.RIGHT:
                exports.Input.rightListener();
                break;
            case exports.Input.UP:
                exports.Input.upListener();
                break;
            case exports.Input.DOWN:
                exports.Input.downListener();
                break;
            case 77:
                exports.Input.mListener();
                break;
            case 73:
                exports.Input.iListener();
                break;
        }
    },
    onKeyup: function (event) {
        delete this._pressed[event.keyCode];
        if (event.keyCode === 77)
            exports.Input.mUpListener();
        if (event.keyCode === 73)
            exports.Input.iUpListener();
    },
    mouseClickListener: function (event) {
        if (event.button === 0) {
            var rect = window.document.getElementById("gameCanvas").getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
            exports.Input.mouseLeftClickListener(Math.floor(x / gameConstants_1.GameConstants.SCALE), Math.floor(y / gameConstants_1.GameConstants.SCALE));
        }
    },
};
window.addEventListener("keyup", function (event) {
    exports.Input.onKeyup(event);
}, false);
window.addEventListener("keydown", function (event) {
    exports.Input.onKeydown(event);
}, false);
window.document
    .getElementById("gameCanvas")
    .addEventListener("click", function (event) { return exports.Input.mouseClickListener(event); }, false);
//# sourceMappingURL=input.js.map