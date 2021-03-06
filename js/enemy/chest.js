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
var key_1 = require("../item/key");
var heart_1 = require("../item/heart");
var armor_1 = require("../item/armor");
var enemy_1 = require("./enemy");
var levelConstants_1 = require("../levelConstants");
var Chest = (function (_super) {
    __extends(Chest, _super);
    function Chest(level, game, x, y) {
        var _this = _super.call(this, level, game, x, y) || this;
        _this.kill = function () {
            _this.dead = true;
            // DROP TABLES!
            var drop = game_1.Game.randTable([1, 2, 3, 3, 3]);
            switch (drop) {
                case 1:
                    _this.game.level.items.push(new heart_1.Heart(_this.x, _this.y));
                    break;
                case 2:
                    _this.game.level.items.push(new key_1.Key(_this.x, _this.y));
                    break;
                case 3:
                    _this.game.level.items.push(new armor_1.Armor(_this.x, _this.y));
                    break;
            }
        };
        _this.draw = function () {
            if (!_this.dead) {
                var darkOffset = _this.level.visibilityArray[_this.x][_this.y] <= levelConstants_1.LevelConstants.VISIBILITY_CUTOFF ? 2 : 0;
                game_1.Game.drawMob(_this.tileX, _this.tileY + darkOffset, 1, 2, _this.x - _this.drawX, _this.y - 1 - _this.drawY, 1, 2);
            }
        };
        _this.tileX = 17;
        _this.tileY = 0;
        _this.health = 1;
        return _this;
    }
    return Chest;
}(enemy_1.Enemy));
exports.Chest = Chest;
//# sourceMappingURL=chest.js.map