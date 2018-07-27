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
var level_1 = require("../level");
var Door = (function (_super) {
    __extends(Door, _super);
    function Door(level, game, x, y, deadEnd, goldenKey, distFromStart) {
        var _this = _super.call(this, level, x, y) || this;
        _this.onCollide = function (player) {
            _this.opened = true;
            if (_this.linkedLevel === null)
                _this.linkedLevel = new level_1.Level(_this.game, _this, _this.deadEnd, _this.goldenKey, _this.distFromStart, _this.level.env, _this.level.difficulty);
            _this.game.changeLevel(_this.linkedLevel);
        };
        _this.draw = function () {
            if (_this.opened)
                game_1.Game.drawTile(6, _this.level.env, 1, 1, _this.x, _this.y, _this.w, _this.h);
            else
                game_1.Game.drawTile(3, _this.level.env, 1, 1, _this.x, _this.y, _this.w, _this.h);
        };
        _this.game = game;
        _this.linkedLevel = null;
        _this.deadEnd = deadEnd;
        _this.goldenKey = goldenKey;
        _this.distFromStart = distFromStart;
        _this.opened = false;
        return _this;
    }
    return Door;
}(collidable_1.Collidable));
exports.Door = Door;
//# sourceMappingURL=door.js.map