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
var enemy_1 = require("./enemy");
var game_1 = require("../game");
var astarclass_1 = require("../astarclass");
var KnightEnemy = (function (_super) {
    __extends(KnightEnemy, _super);
    function KnightEnemy(level, game, x, y) {
        var _this = _super.call(this, level, game, x, y) || this;
        _this.hit = function () {
            return 1;
        };
        _this.tick = function () {
            if (!_this.dead) {
                if (_this.skipNextTurns > 0) {
                    _this.skipNextTurns--;
                    return;
                }
                _this.ticks++;
                _this.tileX = 5;
                if (_this.ticks % 2 === 0) {
                    _this.tileX = 4;
                    if (_this.seenPlayer || _this.level.visibilityArray[_this.x][_this.y] > 0) {
                        // visible to player, chase them
                        // now that we've seen the player, we can keep chasing them even if we lose line of sight
                        _this.seenPlayer = true;
                        var oldX = _this.x;
                        var oldY = _this.y;
                        var enemyPositions = Array();
                        for (var _i = 0, _a = _this.level.enemies; _i < _a.length; _i++) {
                            var e = _a[_i];
                            if (e !== _this) {
                                enemyPositions.push({ x: e.x, y: e.y });
                            }
                        }
                        _this.moves = astarclass_1.astar.AStar.search(_this.level.levelArray, _this, _this.game.player, enemyPositions);
                        if (_this.moves.length > 0) {
                            if (_this.game.player.x === _this.moves[0].pos.x &&
                                _this.game.player.y === _this.moves[0].pos.y) {
                                _this.game.player.hurt(_this.hit());
                            }
                            else {
                                _this.tryMove(_this.moves[0].pos.x, _this.moves[0].pos.y);
                            }
                        }
                        _this.drawX = _this.x - oldX;
                        _this.drawY = _this.y - oldY;
                    }
                }
            }
        };
        _this.dropXP = function () {
            return game_1.Game.randTable([4, 5, 5, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 10]);
        };
        _this.moves = new Array(); // empty move list
        _this.ticks = 0;
        _this.health = 1;
        _this.tileX = 4;
        _this.tileY = 0;
        _this.seenPlayer = false;
        return _this;
    }
    return KnightEnemy;
}(enemy_1.Enemy));
exports.KnightEnemy = KnightEnemy;
//# sourceMappingURL=knightEnemy.js.map