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
var tile_1 = require("./tile");
var Collidable = (function (_super) {
    __extends(Collidable, _super);
    function Collidable(level, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.onCollide = function (player) { };
        _this.w = 1;
        _this.h = 1;
        return _this;
    }
    return Collidable;
}(tile_1.Tile));
exports.Collidable = Collidable;
//# sourceMappingURL=collidable.js.map