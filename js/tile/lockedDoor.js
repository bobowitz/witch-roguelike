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
var door_1 = require("./door");
var key_1 = require("../item/key");
var LockedDoor = (function (_super) {
    __extends(LockedDoor, _super);
    function LockedDoor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.unlock = function (player) {
            var k = player.inventory.hasItem(key_1.Key);
            if (k !== null) {
                // remove key
                player.inventory.items = player.inventory.items.filter(function (x) { return x !== k; });
                var d = new door_1.Door(_this.level, _this.level.game, _this.x, _this.y, game_1.Game.rand(1, 10) !== 1, false, 0 // doesn't really matter here cause it'll be a dead end
                );
                _this.level.levelArray[_this.x][_this.y] = d; // replace this door in level
                _this.level.doors.push(d); // add it to the door list so it can get rendered on the map
                _this.level.doors.sort(function (a, b) { return a.x - b.x; });
            }
        };
        _this.draw = function () {
            game_1.Game.drawTile(16, _this.level.env, 1, 1, _this.x, _this.y, _this.w, _this.h);
        };
        return _this;
    }
    return LockedDoor;
}(collidable_1.Collidable));
exports.LockedDoor = LockedDoor;
//# sourceMappingURL=lockedDoor.js.map