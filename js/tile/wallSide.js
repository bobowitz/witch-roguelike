"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = require("../game");
var collidable_1 = require("./collidable");
var WallSide = (function (_super) {
    __extends(WallSide, _super);
    function WallSide() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.draw = function () {
            game_1.Game.drawTile(0, _this.level.env, 1, 1, _this.x, _this.y, _this.w, _this.h);
        };
        return _this;
    }
    return WallSide;
}(collidable_1.Collidable));
exports.WallSide = WallSide;
//# sourceMappingURL=wallSide.js.map