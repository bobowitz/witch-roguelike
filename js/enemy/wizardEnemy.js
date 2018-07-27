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
var bones_1 = require("../tile/bones");
var deathParticle_1 = require("../particle/deathParticle");
var wizardTeleportParticle_1 = require("../particle/wizardTeleportParticle");
var wizardFireball_1 = require("../projectile/wizardFireball");
var WizardState;
(function (WizardState) {
    WizardState[WizardState["idle"] = 0] = "idle";
    WizardState[WizardState["attack"] = 1] = "attack";
    WizardState[WizardState["justAttacked"] = 2] = "justAttacked";
    WizardState[WizardState["teleport"] = 3] = "teleport";
})(WizardState || (WizardState = {}));
var WizardEnemy = (function (_super) {
    __extends(WizardEnemy, _super);
    function WizardEnemy(level, game, x, y) {
        var _this = _super.call(this, level, game, x, y) || this;
        _this.ATTACK_RADIUS = 5;
        _this.hit = function () {
            return 1;
        };
        _this.withinAttackingRangeOfPlayer = function () {
            return (Math.pow((_this.x - _this.game.player.x), 2) + Math.pow((_this.y - _this.game.player.y), 2) <=
                Math.pow(_this.ATTACK_RADIUS, 2));
        };
        _this.tick = function () {
            if (!_this.dead && _this.level.visibilityArray[_this.x][_this.y] > 0) {
                if (_this.skipNextTurns > 0) {
                    _this.skipNextTurns--;
                    return;
                }
                switch (_this.state) {
                    case WizardState.attack:
                        _this.tileX = 7;
                        if (_this.level.getCollidable(_this.x - 1, _this.y) === null) {
                            _this.level.projectiles.push(new wizardFireball_1.WizardFireball(_this, _this.x - 1, _this.y));
                            if (_this.level.getCollidable(_this.x - 2, _this.y) === null) {
                                _this.level.projectiles.push(new wizardFireball_1.WizardFireball(_this, _this.x - 2, _this.y));
                            }
                        }
                        if (_this.level.getCollidable(_this.x + 1, _this.y) === null) {
                            _this.level.projectiles.push(new wizardFireball_1.WizardFireball(_this, _this.x + 1, _this.y));
                            if (_this.level.getCollidable(_this.x + 2, _this.y) === null) {
                                _this.level.projectiles.push(new wizardFireball_1.WizardFireball(_this, _this.x + 2, _this.y));
                            }
                        }
                        if (_this.level.getCollidable(_this.x, _this.y - 1) === null) {
                            _this.level.projectiles.push(new wizardFireball_1.WizardFireball(_this, _this.x, _this.y - 1));
                            if (_this.level.getCollidable(_this.x, _this.y - 2) === null) {
                                _this.level.projectiles.push(new wizardFireball_1.WizardFireball(_this, _this.x, _this.y - 2));
                            }
                        }
                        if (_this.level.getCollidable(_this.x, _this.y + 1) === null) {
                            _this.level.projectiles.push(new wizardFireball_1.WizardFireball(_this, _this.x, _this.y + 1));
                            if (_this.level.getCollidable(_this.x, _this.y + 2) === null) {
                                _this.level.projectiles.push(new wizardFireball_1.WizardFireball(_this, _this.x, _this.y + 2));
                            }
                        }
                        _this.state = WizardState.justAttacked;
                        break;
                    case WizardState.justAttacked:
                        _this.tileX = 6;
                        _this.state = WizardState.teleport;
                        break;
                    case WizardState.teleport:
                        var oldX = _this.x;
                        var oldY = _this.y;
                        while (_this.x === oldX && _this.y === oldY) {
                            var newPos = game_1.Game.randTable(_this.level.getEmptyTiles());
                            _this.tryMove(newPos.x, newPos.y);
                        }
                        _this.drawX = _this.x - oldX;
                        _this.drawY = _this.y - oldY;
                        _this.frame = 0; // trigger teleport animation
                        _this.level.particles.push(new wizardTeleportParticle_1.WizardTeleportParticle(oldX, oldY));
                        if (_this.withinAttackingRangeOfPlayer()) {
                            _this.state = WizardState.attack;
                        }
                        else {
                            _this.state = WizardState.idle;
                        }
                        break;
                    case WizardState.idle:
                        _this.state = WizardState.teleport;
                        break;
                }
            }
        };
        _this.draw = function () {
            if (!_this.dead) {
                var darkOffset = _this.level.visibilityArray[_this.x][_this.y] <= levelConstants_1.LevelConstants.VISIBILITY_CUTOFF &&
                    _this.hasDarkVersion
                    ? 2
                    : 0;
                _this.drawX += -0.5 * _this.drawX;
                _this.drawY += -0.5 * _this.drawY;
                if (_this.hasShadow)
                    game_1.Game.drawMob(0, 0, 1, 1, _this.x - _this.drawX, _this.y - _this.drawY, 1, 1);
                if (_this.frame >= 0) {
                    game_1.Game.drawFX(Math.floor(_this.frame), 10 + darkOffset, 1, 2, _this.x, _this.y - 1.5, 1, 2);
                    _this.frame += 0.4;
                    if (_this.frame > 11)
                        _this.frame = -1;
                }
                else {
                    game_1.Game.drawMob(_this.tileX, _this.tileY + darkOffset, 1, 2, _this.x - _this.drawX, _this.y - 1.5 - _this.drawY, 1, 2);
                }
            }
        };
        _this.dropXP = function () {
            return game_1.Game.randTable([4, 5, 5, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 10]);
        };
        _this.kill = function () {
            _this.level.levelArray[_this.x][_this.y] = new bones_1.Bones(_this.level, _this.x, _this.y);
            _this.dead = true;
            _this.level.particles.push(new deathParticle_1.DeathParticle(_this.x, _this.y));
        };
        _this.ticks = 0;
        _this.health = 1;
        _this.tileX = 6;
        _this.tileY = 0;
        _this.frame = 0;
        _this.state = WizardState.attack;
        return _this;
    }
    return WizardEnemy;
}(enemy_1.Enemy));
exports.WizardEnemy = WizardEnemy;
//# sourceMappingURL=wizardEnemy.js.map