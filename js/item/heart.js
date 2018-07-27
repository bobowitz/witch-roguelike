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
var pickup_1 = require("./pickup");
var sound_1 = require("../sound");
var Heart = (function (_super) {
    __extends(Heart, _super);
    function Heart(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.onPickup = function (player) {
            player.health += 1;
            sound_1.Sound.heal();
        };
        _this.tileX = 8;
        _this.tileY = 0;
        return _this;
    }
    return Heart;
}(pickup_1.Pickup));
exports.Heart = Heart;
//# sourceMappingURL=heart.js.map