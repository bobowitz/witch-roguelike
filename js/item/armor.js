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
var levelConstants_1 = require("../levelConstants");
var pickup_1 = require("./pickup");
var Armor = (function (_super) {
    __extends(Armor, _super);
    function Armor(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.RECHARGE_TURNS = 18;
        _this.tick = function () {
            if (_this.rechargeTurnCounter > 0) {
                _this.rechargeTurnCounter--;
                if (_this.rechargeTurnCounter === 0) {
                    _this.rechargeTurnCounter = -1;
                    _this.health = 1;
                }
            }
        };
        _this.hurt = function (damage) {
            _this.health -= damage;
            if (_this.health <= 0) {
                _this.health = 0;
                _this.rechargeTurnCounter = _this.RECHARGE_TURNS;
            }
        };
        _this.drawGUI = function (playerHealth) {
            if (_this.rechargeTurnCounter === -1)
                game_1.Game.drawItem(5, 0, 1, 2, playerHealth, levelConstants_1.LevelConstants.SCREEN_H - 2, 1, 2);
            else {
                var rechargeProportion = 1 - (_this.rechargeTurnCounter / _this.RECHARGE_TURNS);
                if (rechargeProportion < 0.33) {
                    game_1.Game.drawItem(2, 0, 1, 2, playerHealth, levelConstants_1.LevelConstants.SCREEN_H - 2, 1, 2);
                }
                else if (rechargeProportion < 0.67) {
                    game_1.Game.drawItem(3, 0, 1, 2, playerHealth, levelConstants_1.LevelConstants.SCREEN_H - 2, 1, 2);
                }
                else {
                    game_1.Game.drawItem(4, 0, 1, 2, playerHealth, levelConstants_1.LevelConstants.SCREEN_H - 2, 1, 2);
                }
            }
        };
        _this.onPickup = function (player) {
            if (player.armor === null)
                player.armor = _this;
            else {
                player.armor.health = 1;
                player.armor.rechargeTurnCounter = -1;
            }
        };
        _this.health = 1;
        _this.rechargeTurnCounter = -1;
        _this.tileX = 5;
        _this.tileY = 0;
        return _this;
    }
    return Armor;
}(pickup_1.Pickup));
exports.Armor = Armor;
//# sourceMappingURL=armor.js.map