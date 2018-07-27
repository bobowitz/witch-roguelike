"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var input_1 = require("./input");
var gameConstants_1 = require("./gameConstants");
var game_1 = require("./game");
var door_1 = require("./tile/door");
var bottomDoor_1 = require("./tile/bottomDoor");
var trapdoor_1 = require("./tile/trapdoor");
var inventory_1 = require("./inventory");
var lockedDoor_1 = require("./tile/lockedDoor");
var sound_1 = require("./sound");
var spike_1 = require("./tile/spike");
var textParticle_1 = require("./particle/textParticle");
var dashParticle_1 = require("./particle/dashParticle");
var levelConstants_1 = require("./levelConstants");
var map_1 = require("./map");
var pickup_1 = require("./item/pickup");
var crate_1 = require("./enemy/crate");
var stats_1 = require("./stats");
var goldenDoor_1 = require("./tile/goldenDoor");
var unlockedGoldenDoor_1 = require("./tile/unlockedGoldenDoor");
var chest_1 = require("./enemy/chest");
var wizardFireball_1 = require("./projectile/wizardFireball");
var barrel_1 = require("./enemy/barrel");
var Player = (function () {
    function Player(game, x, y) {
        var _this = this;
        this.iListener = function () {
            _this.inventory.open();
            //this.game.level.enemies.push(new Crate(this.game.level, this.game, this.x, this.y));
        };
        this.iUpListener = function () {
            _this.inventory.close();
        };
        this.leftListener = function () {
            if (!_this.dead) {
                if (input_1.Input.isDown(input_1.Input.SPACE))
                    _this.tryDash(-1, 0);
                else
                    _this.tryMove(_this.x - 1, _this.y);
            }
        };
        this.rightListener = function () {
            if (!_this.dead) {
                if (input_1.Input.isDown(input_1.Input.SPACE))
                    _this.tryDash(1, 0);
                else
                    _this.tryMove(_this.x + 1, _this.y);
            }
        };
        this.upListener = function () {
            if (!_this.dead) {
                if (input_1.Input.isDown(input_1.Input.SPACE))
                    _this.tryDash(0, -1);
                else
                    _this.tryMove(_this.x, _this.y - 1);
            }
        };
        this.downListener = function () {
            if (!_this.dead) {
                if (input_1.Input.isDown(input_1.Input.SPACE))
                    _this.tryDash(0, 1);
                else
                    _this.tryMove(_this.x, _this.y + 1);
            }
        };
        this.hit = function () {
            return 1;
        };
        // dash length 2
        this.tryDash = function (dx, dy) {
            var startX = _this.x;
            var startY = _this.y;
            var x = _this.x;
            var y = _this.y;
            var particleFrameOffset = 4;
            while (x !== startX + 2 * dx || y !== startY + 2 * dy) {
                x += dx;
                y += dy;
                var other = _this.game.level.getCollidable(x, y);
                if (other === null) {
                }
                else if (other instanceof spike_1.Spike) {
                    other.onCollide(_this);
                }
                else {
                    break;
                }
                _this.game.level.particles.push(new dashParticle_1.DashParticle(_this.x, _this.y, particleFrameOffset));
                particleFrameOffset -= 2;
                var breakFlag = false;
                for (var _i = 0, _a = _this.game.level.enemies; _i < _a.length; _i++) {
                    var e = _a[_i];
                    if (e.x === x && e.y === y) {
                        var dmg = _this.hit();
                        e.hurt(_this, dmg);
                        _this.game.level.particles.push(new textParticle_1.TextParticle("" + dmg, x + 0.5, y - 0.5, gameConstants_1.GameConstants.HIT_ENEMY_TEXT_COLOR, 5));
                        if (e instanceof chest_1.Chest) {
                            breakFlag = true;
                            _this.game.level.tick();
                            break;
                        }
                    }
                }
                if (breakFlag)
                    break;
                _this.dashMove(x, y);
            }
            _this.drawX = _this.x - startX;
            _this.drawY = _this.y - startY;
            if (_this.x !== startX || _this.y !== startY) {
                _this.game.level.tick();
                _this.game.level.particles.push(new dashParticle_1.DashParticle(_this.x, _this.y, particleFrameOffset));
            }
        };
        this.tryMove = function (x, y) {
            for (var _i = 0, _a = _this.game.level.enemies; _i < _a.length; _i++) {
                var e = _a[_i];
                if (e.x === x && e.y === y) {
                    if (e instanceof crate_1.Crate || e instanceof barrel_1.Barrel) {
                        // pushing a crate or barrel
                        var oldEnemyX = e.x;
                        var oldEnemyY = e.y;
                        var dx = x - _this.x;
                        var dy = y - _this.y;
                        var nextX = x + dx;
                        var nextY = y + dy;
                        var foundEnd = false; // end of the train of whatever we're pushing
                        var enemyEnd = false; // end of the train is a solid enemy (crate/chest/barrel)
                        var pushedEnemies = [];
                        while (true) {
                            foundEnd = true;
                            for (var _b = 0, _c = _this.game.level.enemies; _b < _c.length; _b++) {
                                var f = _c[_b];
                                if (f.x === nextX && f.y === nextY) {
                                    if (f instanceof crate_1.Crate || f instanceof barrel_1.Barrel || f instanceof chest_1.Chest) {
                                        enemyEnd = true;
                                        foundEnd = true;
                                        break;
                                    }
                                    foundEnd = false;
                                    pushedEnemies.push(f);
                                    break;
                                }
                            }
                            if (foundEnd)
                                break;
                            nextX += dx;
                            nextY += dy;
                        }
                        /* if no enemies and there is a wall, no move
                        otherwise, push everything, killing last enemy if there is a wall */
                        // here, (nextX, nextY) is the position immediately after the end of the train
                        if (pushedEnemies.length === 0 &&
                            (_this.game.level.getCollidable(nextX, nextY) !== null || enemyEnd)) {
                            return;
                        }
                        else {
                            for (var _d = 0, pushedEnemies_1 = pushedEnemies; _d < pushedEnemies_1.length; _d++) {
                                var f = pushedEnemies_1[_d];
                                f.x += dx;
                                f.y += dy;
                                f.drawX = dx;
                                f.drawY = dy;
                                f.skipNextTurns = 1; // skip next turn, so they don't move while we're pushing them
                            }
                            if (_this.game.level.getCollidable(nextX, nextY) !== null || enemyEnd)
                                pushedEnemies[pushedEnemies.length - 1].killNoBones();
                            e.x += dx;
                            e.y += dy;
                            e.drawX = dx;
                            e.drawY = dy;
                            _this.move(x, y);
                            _this.game.level.tick();
                            return;
                        }
                    }
                    else {
                        // if we're trying to hit an enemy, do nothing
                        return;
                    }
                }
            }
            var other = _this.game.level.getCollidable(x, y);
            if (other === null) {
                _this.move(x, y);
                _this.game.level.tick();
            }
            else {
                if (other instanceof door_1.Door) {
                    if (x - _this.x === 0) {
                        _this.move(x, y);
                        other.onCollide(_this);
                    }
                }
                else if (other instanceof unlockedGoldenDoor_1.UnlockedGoldenDoor) {
                    if (x - _this.x === 0) {
                        _this.move(x, y);
                        other.onCollide(_this);
                    }
                }
                else if (other instanceof lockedDoor_1.LockedDoor) {
                    if (x - _this.x === 0) {
                        _this.drawX = (_this.x - x) * 0.5;
                        _this.drawY = (_this.y - y) * 0.5;
                        other.unlock(_this);
                        _this.game.level.tick();
                    }
                }
                else if (other instanceof goldenDoor_1.GoldenDoor) {
                    if (x - _this.x === 0) {
                        _this.drawX = (_this.x - x) * 0.5;
                        _this.drawY = (_this.y - y) * 0.5;
                        other.unlock(_this);
                        _this.game.level.tick();
                    }
                }
                else if (other instanceof bottomDoor_1.BottomDoor || other instanceof trapdoor_1.Trapdoor) {
                    _this.move(x, y);
                    other.onCollide(_this);
                }
                else if (other instanceof spike_1.Spike) {
                    _this.move(x, y);
                    other.onCollide(_this);
                    _this.game.level.tick();
                }
            }
        };
        this.hurt = function (damage) {
            if (_this.armor !== null && _this.armor.health > 0) {
                _this.armor.hurt(damage);
            }
            else {
                _this.flashing = true;
                _this.health -= damage;
                if (_this.health <= 0) {
                    _this.health = 0;
                    _this.dead = true;
                }
            }
        };
        this.dashMove = function (x, y) {
            _this.x = x;
            _this.y = y;
            var _loop_1 = function (i) {
                if (i.x === x && i.y === y) {
                    if (i instanceof pickup_1.Pickup) {
                        i.onPickup(_this);
                    }
                    else {
                        _this.inventory.addItem(i);
                    }
                    _this.game.level.items = _this.game.level.items.filter(function (x) { return x !== i; }); // remove item from item list
                }
            };
            for (var _i = 0, _a = _this.game.level.items; _i < _a.length; _i++) {
                var i = _a[_i];
                _loop_1(i);
            }
            _this.game.level.updateLighting();
        };
        this.move = function (x, y) {
            sound_1.Sound.footstep();
            _this.drawX = x - _this.x;
            _this.drawY = y - _this.y;
            _this.x = x;
            _this.y = y;
            var _loop_2 = function (i) {
                if (i.x === x && i.y === y) {
                    if (i instanceof pickup_1.Pickup) {
                        i.onPickup(_this);
                    }
                    else {
                        _this.inventory.addItem(i);
                    }
                    _this.game.level.items = _this.game.level.items.filter(function (x) { return x !== i; }); // remove item from item list
                }
            };
            for (var _i = 0, _a = _this.game.level.items; _i < _a.length; _i++) {
                var i = _a[_i];
                _loop_2(i);
            }
            _this.game.level.updateLighting();
        };
        this.moveNoSmooth = function (x, y) {
            _this.x = x;
            _this.y = y;
            _this.drawX = 0;
            _this.drawY = 0;
        };
        this.update = function () { };
        this.startTick = function () { };
        this.finishTick = function () {
            for (var _i = 0, _a = _this.game.level.projectiles; _i < _a.length; _i++) {
                var p = _a[_i];
                if (p instanceof wizardFireball_1.WizardFireball) {
                    if (_this.x === p.x && _this.y === p.y) {
                        p.hit(_this); // let fireball determine if it's in a damage-dealing state rn
                    }
                }
            }
            _this.flashing = false;
            var totalHealthDiff = _this.health - _this.lastTickHealth;
            _this.lastTickHealth = _this.health; // update last tick health
            if (totalHealthDiff < 0) {
                _this.flashing = true;
                _this.game.level.particles.push(new textParticle_1.TextParticle("" + totalHealthDiff, _this.x + 0.5, _this.y - 0.5, gameConstants_1.GameConstants.RED, 0));
            }
            else if (totalHealthDiff > 0) {
                _this.game.level.particles.push(new textParticle_1.TextParticle("+" + totalHealthDiff, _this.x + 0.5, _this.y - 0.5, gameConstants_1.GameConstants.RED, 0));
            }
        };
        this.draw = function () {
            _this.flashingFrame += 12 / gameConstants_1.GameConstants.FPS;
            if (!_this.dead) {
                game_1.Game.drawMob(0, 0, 1, 1, _this.x - _this.drawX, _this.y - _this.drawY, 1, 1);
                if (!_this.flashing || Math.floor(_this.flashingFrame) % 2 === 0) {
                    _this.drawX += -0.5 * _this.drawX;
                    _this.drawY += -0.5 * _this.drawY;
                    game_1.Game.drawMob(1, 0, 1, 2, _this.x - _this.drawX, _this.y - 1.5 - _this.drawY, 1, 2);
                }
            }
        };
        this.drawTopLayer = function () {
            if (!_this.dead) {
                _this.guiHeartFrame += 1;
                var FREQ = gameConstants_1.GameConstants.FPS * 1.5;
                _this.guiHeartFrame %= FREQ;
                for (var i = 0; i < _this.health; i++) {
                    var frame = (_this.guiHeartFrame + FREQ) % FREQ >= FREQ - 4 ? 1 : 0;
                    game_1.Game.drawFX(frame, 2, 1, 1, i, levelConstants_1.LevelConstants.SCREEN_H - 1, 1, 1);
                }
                if (_this.armor)
                    _this.armor.drawGUI(_this.health);
                // this.stats.drawGUI(); TODO
            }
            else {
                game_1.Game.ctx.fillStyle = levelConstants_1.LevelConstants.LEVEL_TEXT_COLOR;
                var gameOverString = "Game Over.";
                game_1.Game.ctx.fillText(gameOverString, gameConstants_1.GameConstants.WIDTH / 2 - game_1.Game.ctx.measureText(gameOverString).width / 2, gameConstants_1.GameConstants.HEIGHT / 2);
                var refreshString = "[refresh to restart]";
                game_1.Game.ctx.fillText(refreshString, gameConstants_1.GameConstants.WIDTH / 2 - game_1.Game.ctx.measureText(refreshString).width / 2, gameConstants_1.GameConstants.HEIGHT / 2 + gameConstants_1.GameConstants.FONT_SIZE);
            }
            _this.inventory.draw();
            _this.map.draw();
        };
        this.game = game;
        this.x = x;
        this.y = y;
        this.map = new map_1.Map(game);
        input_1.Input.iListener = this.iListener;
        input_1.Input.iUpListener = this.iUpListener;
        input_1.Input.leftListener = this.leftListener;
        input_1.Input.rightListener = this.rightListener;
        input_1.Input.mListener = this.map.open;
        input_1.Input.mUpListener = this.map.close;
        input_1.Input.upListener = this.upListener;
        input_1.Input.downListener = this.downListener;
        this.health = 3;
        this.stats = new stats_1.Stats();
        this.dead = false;
        this.flashing = false;
        this.flashingFrame = 0;
        this.lastTickHealth = this.health;
        this.guiHeartFrame = 0;
        this.equipped = Array();
        this.inventory = new inventory_1.Inventory(game);
        this.missProb = 0.1;
        this.armor = null;
        this.sightRadius = 4; // maybe can be manipulated by items? e.g. better torch
    }
    return Player;
}());
exports.Player = Player;
//# sourceMappingURL=player.js.map