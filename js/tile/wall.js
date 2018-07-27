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
var Wall = (function (_super) {
    __extends(Wall, _super);
    function Wall(level, x, y, type) {
        var _this = _super.call(this, level, x, y) || this;
        _this.draw = function () {
            if (_this.type === 0) {
                game_1.Game.drawTile(2, _this.level.env, 1, 1, _this.x, _this.y, _this.w, _this.h);
            }
            else if (_this.type === 1) {
                game_1.Game.drawTile(5, _this.level.env, 1, 1, _this.x, _this.y, _this.w, _this.h);
            }
        };
        _this.type = type;
        return _this;
    }
    return Wall;
}(collidable_1.Collidable));
exports.Wall = Wall;
//# sourceMappingURL=wall.js.map