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
var level_1 = require("../level");
var game_1 = require("../game");
var UnlockedGoldenDoor = (function (_super) {
    __extends(UnlockedGoldenDoor, _super);
    function UnlockedGoldenDoor(level, game, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.draw = function () {
            game_1.Game.drawTile(6, _this.level.env, 1, 1, _this.x, _this.y, _this.w, _this.h);
        };
        _this.onCollide = function (player) {
            _this.game.changeLevel(new level_1.Level(_this.game, null, false, true, 0, _this.level.env + 1, _this.level.difficulty + 1));
        };
        _this.game = game;
        return _this;
    }
    return UnlockedGoldenDoor;
}(collidable_1.Collidable));
exports.UnlockedGoldenDoor = UnlockedGoldenDoor;
//# sourceMappingURL=unlockedGoldenDoor.js.map