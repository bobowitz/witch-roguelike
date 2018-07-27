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
var item_1 = require("./item");
var GoldenKey = (function (_super) {
    __extends(GoldenKey, _super);
    function GoldenKey(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.tileX = 6;
        _this.tileY = 0;
        return _this;
    }
    return GoldenKey;
}(item_1.Item));
exports.GoldenKey = GoldenKey;
//# sourceMappingURL=goldenKey.js.map