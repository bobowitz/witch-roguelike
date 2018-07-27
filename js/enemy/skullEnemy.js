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
var levelConstants_1 = require("../levelConstants");
var game_1 = require("../game");
var astarclass_1 = require("../astarclass");
var SkullEnemy = (function (_super) {
    __extends(SkullEnemy, _super);
    function SkullEnemy(level, game, x, y) {
        var _this = _super.call(this, level, game, x, y) || this;
        _this.REGEN_TICKS = 5;
        _this.hit = function () {
            return 1;
        };
        _this.hurt = function (player, damage) {
            _this.ticksSinceFirstHit = 0;
            _this.health -= damage;
            if (_this.health <= 0) {
                player.stats.getXP(_this.dropXP());
                _this.kill();
            }
        };
        _this.tick = function () {
            if (!_this.dead) {
                if (_this.skipNextTurns > 0) {
                    _this.skipNextTurns--;
                    return;
                }
                if (_this.health === 1) {
                    _this.ticksSinceFirstHit++;
                    if (_this.ticksSinceFirstHit >= _this.REGEN_TICKS) {
                        _this.health = 2;
                    }
                }
                else {
                    if (_this.seenPlayer || _this.level.visibilityArray[_this.x][_this.y] > 0) {
                        _this.seenPlayer = true;
                        var oldX = _this.x;
                        var oldY = _this.y;
                        var enemyPositions = new Array();
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
            return game_1.Game.randTable([10, 11, 12, 13, 14, 15, 16]);
        };
        _this.draw = function () {
            if (!_this.dead) {
                _this.tileX = 2;
                if (_this.health === 1) {
                    _this.tileX = 3;
                    if (_this.ticksSinceFirstHit >= 3) {
                        _this.flashingFrame += 0.1;
                        if (Math.floor(_this.flashingFrame) % 2 === 0) {
                            _this.tileX = 2;
                        }
                        else {
                            _this.tileX = 3;
                        }
                    }
                }
                var darkOffset = _this.level.visibilityArray[_this.x][_this.y] <= levelConstants_1.LevelConstants.VISIBILITY_CUTOFF &&
                    _this.hasDarkVersion
                    ? 2
                    : 0;
                _this.drawX += -0.5 * _this.drawX;
                _this.drawY += -0.5 * _this.drawY;
                if (_this.hasShadow)
                    game_1.Game.drawMob(0, 0, 1, 1, _this.x - _this.drawX, _this.y - _this.drawY, 1, 1);
                game_1.Game.drawMob(_this.tileX, _this.tileY + darkOffset, 1, 2, _this.x - _this.drawX, _this.y - 1.5 - _this.drawY, 1, 2);
            }
        };
        _this.moves = new Array(); // empty move list
        _this.ticks = 0;
        _this.health = 2;
        _this.tileX = 2;
        _this.tileY = 0;
        _this.seenPlayer = false;
        _this.ticksSinceFirstHit = 0;
        _this.flashingFrame = 0;
        return _this;
    }
    return SkullEnemy;
}(enemy_1.Enemy));
exports.SkullEnemy = SkullEnemy;
//# sourceMappingURL=skullEnemy.js.map