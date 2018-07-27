"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = require("../game");
var Item = (function () {
    function Item(x, y) {
        var _this = this;
        this.draw = function () {
            game_1.Game.drawItem(0, 0, 1, 1, _this.x, _this.y, 1, 1);
            _this.frame += Math.PI * 2 / 60;
            game_1.Game.drawItem(_this.tileX, _this.tileY, 1, 2, _this.x, _this.y + Math.sin(_this.frame) * 0.0625 - 1, _this.w, _this.h);
        };
        this.drawIcon = function (x, y) {
            game_1.Game.drawItem(_this.tileX, _this.tileY, 1, 2, x, y - 1, _this.w, _this.h);
        };
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 2;
        this.tileX = 0;
        this.tileY = 0;
        this.frame = 0;
        this.dead = false;
    }
    return Item;
}());
exports.Item = Item;
//# sourceMappingURL=item.js.map