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
var goldenKey_1 = require("../item/goldenKey");
var unlockedGoldenDoor_1 = require("./unlockedGoldenDoor");
var GoldenDoor = (function (_super) {
    __extends(GoldenDoor, _super);
    function GoldenDoor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.unlock = function (player) {
            var k = player.inventory.hasItem(goldenKey_1.GoldenKey);
            if (k !== null) {
                // remove key
                player.inventory.items = player.inventory.items.filter(function (x) { return x !== k; });
                var d = new unlockedGoldenDoor_1.UnlockedGoldenDoor(_this.level, _this.level.game, _this.x, _this.y);
                _this.level.levelArray[_this.x][_this.y] = d; // replace this door in level
            }
        };
        _this.draw = function () {
            game_1.Game.drawTile(17, _this.level.env, 1, 1, _this.x, _this.y, _this.w, _this.h);
        };
        return _this;
    }
    return GoldenDoor;
}(collidable_1.Collidable));
exports.GoldenDoor = GoldenDoor;
//# sourceMappingURL=goldenDoor.js.map