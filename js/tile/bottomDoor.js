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
var collidable_1 = require("./collidable");
var game_1 = require("../game");
var BottomDoor = (function (_super) {
    __extends(BottomDoor, _super);
    function BottomDoor(level, game, linkedTopDoor, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.onCollide = function (player) {
            _this.game.changeLevelThroughDoor(_this.linkedTopDoor);
        };
        _this.draw = function () {
            game_1.Game.drawTile(1, _this.level.env, 1, 1, _this.x, _this.y, _this.w, _this.h);
        };
        _this.game = game;
        _this.linkedTopDoor = linkedTopDoor;
        return _this;
    }
    return BottomDoor;
}(collidable_1.Collidable));
exports.BottomDoor = BottomDoor;
//# sourceMappingURL=bottomDoor.js.map