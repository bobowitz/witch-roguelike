/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var gameConstants_1 = __webpack_require__(2);
var player_1 = __webpack_require__(42);
var sound_1 = __webpack_require__(15);
var levelConstants_1 = __webpack_require__(3);
var levelGenerator_1 = __webpack_require__(49);
var bottomDoor_1 = __webpack_require__(6);
var input_1 = __webpack_require__(16);
var LevelState;
(function (LevelState) {
    LevelState[LevelState["IN_LEVEL"] = 0] = "IN_LEVEL";
    LevelState[LevelState["TRANSITIONING"] = 1] = "TRANSITIONING";
    LevelState[LevelState["TRANSITIONING_LADDER"] = 2] = "TRANSITIONING_LADDER";
})(LevelState = exports.LevelState || (exports.LevelState = {}));
var Game = (function () {
    function Game() {
        var _this = this;
        this.changeLevel = function (newLevel) {
            _this.level.exitLevel();
            _this.level = newLevel;
            _this.level.enterLevel();
        };
        this.changeLevelThroughLadder = function (ladder) {
            _this.levelState = LevelState.TRANSITIONING_LADDER;
            _this.transitionStartTime = Date.now();
            _this.prevLevel = _this.level;
            _this.level.exitLevel();
            _this.level = ladder.level;
            _this.transitioningLadder = ladder;
        };
        this.changeLevelThroughDoor = function (door) {
            _this.levelState = LevelState.TRANSITIONING;
            _this.transitionStartTime = Date.now();
            _this.transitionX = _this.player.x;
            _this.transitionY = _this.player.y;
            _this.prevLevel = _this.level;
            _this.level.exitLevel();
            _this.level = door.level;
            _this.level.enterLevelThroughDoor(door);
            _this.transitionX = (_this.player.x - _this.transitionX) * gameConstants_1.GameConstants.TILESIZE;
            _this.transitionY = (_this.player.y - _this.transitionY) * gameConstants_1.GameConstants.TILESIZE;
            _this.upwardTransition = false;
            if (door instanceof bottomDoor_1.BottomDoor)
                _this.upwardTransition = true;
        };
        this.run = function () {
            _this.update();
            _this.draw();
        };
        this.update = function () {
            if (input_1.Input.lastPressTime !== 0 &&
                Date.now() - input_1.Input.lastPressTime > gameConstants_1.GameConstants.KEY_REPEAT_TIME) {
                input_1.Input.onKeydown({ repeat: false, keyCode: input_1.Input.lastPressKeyCode });
            }
            if (_this.levelState === LevelState.TRANSITIONING) {
                if (Date.now() - _this.transitionStartTime >= levelConstants_1.LevelConstants.LEVEL_TRANSITION_TIME) {
                    _this.levelState = LevelState.IN_LEVEL;
                }
            }
            if (_this.levelState === LevelState.TRANSITIONING_LADDER) {
                if (Date.now() - _this.transitionStartTime >= levelConstants_1.LevelConstants.LEVEL_TRANSITION_TIME_LADDER) {
                    _this.levelState = LevelState.IN_LEVEL;
                }
            }
            _this.player.update();
            _this.level.update();
        };
        this.lerp = function (a, b, t) {
            return (1 - t) * a + t * b;
        };
        this.onResize = function () {
            var maxWidthScale = Math.floor(window.innerWidth / gameConstants_1.GameConstants.WIDTH);
            var maxHeightScale = Math.floor(window.innerHeight / gameConstants_1.GameConstants.HEIGHT);
            var scale = Math.min(maxWidthScale, maxHeightScale);
            Game.ctx.canvas.setAttribute("style", "width: " + window.innerWidth + "px; height: " + window.innerHeight + "px;\n    display: block;\n    margin: 0 auto;\n  \n    image-rendering: optimizeSpeed; /* Older versions of FF          */\n    image-rendering: -moz-crisp-edges; /* FF 6.0+                       */\n    image-rendering: -webkit-optimize-contrast; /* Safari                        */\n    image-rendering: -o-crisp-edges; /* OS X & Windows Opera (12.02+) */\n    image-rendering: pixelated; /* Awesome future-browsers       */\n  \n    -ms-interpolation-mode: nearest-neighbor;");
            //Game.ctx.canvas.width = window.innerWidth;
            //Game.ctx.canvas.height = window.innerHeight;
        };
        this.draw = function () {
            Game.ctx.globalAlpha = 1;
            Game.ctx.fillStyle = "black";
            Game.ctx.fillRect(0, 0, gameConstants_1.GameConstants.WIDTH, gameConstants_1.GameConstants.HEIGHT);
            if (_this.levelState === LevelState.TRANSITIONING) {
                var levelOffsetX = Math.floor(_this.lerp((Date.now() - _this.transitionStartTime) / levelConstants_1.LevelConstants.LEVEL_TRANSITION_TIME, 0, -_this.transitionX));
                var levelOffsetY = Math.floor(_this.lerp((Date.now() - _this.transitionStartTime) / levelConstants_1.LevelConstants.LEVEL_TRANSITION_TIME, 0, -_this.transitionY));
                var playerOffsetX = levelOffsetX - _this.transitionX;
                var playerOffsetY = levelOffsetY - _this.transitionY;
                var extraTileLerp = Math.floor(_this.lerp((Date.now() - _this.transitionStartTime) / levelConstants_1.LevelConstants.LEVEL_TRANSITION_TIME, 0, gameConstants_1.GameConstants.TILESIZE));
                var newLevelOffsetX = playerOffsetX;
                var newLevelOffsetY = playerOffsetY;
                if (_this.upwardTransition) {
                    levelOffsetY -= extraTileLerp;
                    newLevelOffsetY += -extraTileLerp - gameConstants_1.GameConstants.TILESIZE;
                }
                else {
                    levelOffsetY += extraTileLerp;
                    newLevelOffsetY += extraTileLerp + gameConstants_1.GameConstants.TILESIZE;
                }
                var ditherFrame = Math.floor((7 * (Date.now() - _this.transitionStartTime)) / levelConstants_1.LevelConstants.LEVEL_TRANSITION_TIME);
                Game.ctx.translate(levelOffsetX, levelOffsetY);
                _this.prevLevel.draw();
                _this.prevLevel.drawEntitiesBehindPlayer();
                Game.ctx.translate(-levelOffsetX, -levelOffsetY);
                Game.ctx.translate(levelOffsetX, levelOffsetY);
                _this.prevLevel.drawEntitiesInFrontOfPlayer();
                for (var x = _this.prevLevel.roomX - 1; x <= _this.prevLevel.roomX + _this.prevLevel.width; x++) {
                    for (var y = _this.prevLevel.roomY - 1; y <= _this.prevLevel.roomY + _this.prevLevel.height; y++) {
                        Game.drawFX(7 - ditherFrame, 10, 1, 1, x, y, 1, 1);
                    }
                }
                Game.ctx.translate(-levelOffsetX, -levelOffsetY);
                Game.ctx.translate(newLevelOffsetX, newLevelOffsetY);
                _this.level.draw();
                _this.level.drawEntitiesBehindPlayer();
                _this.level.drawEntitiesInFrontOfPlayer();
                for (var x = _this.level.roomX - 1; x <= _this.level.roomX + _this.level.width; x++) {
                    for (var y = _this.level.roomY - 1; y <= _this.level.roomY + _this.level.height; y++) {
                        Game.drawFX(ditherFrame, 10, 1, 1, x, y, 1, 1);
                    }
                }
                Game.ctx.translate(-newLevelOffsetX, -newLevelOffsetY);
                Game.ctx.translate(playerOffsetX, playerOffsetY);
                _this.player.draw();
                Game.ctx.translate(-playerOffsetX, -playerOffsetY);
                _this.level.drawTopLayer();
                _this.player.drawTopLayer();
            }
            else if (_this.levelState === LevelState.TRANSITIONING_LADDER) {
                var deadFrames = 6;
                var ditherFrame = Math.floor(((7 * 2 + deadFrames) * (Date.now() - _this.transitionStartTime)) /
                    levelConstants_1.LevelConstants.LEVEL_TRANSITION_TIME_LADDER);
                if (ditherFrame < 7) {
                    _this.prevLevel.draw();
                    _this.prevLevel.drawEntitiesBehindPlayer();
                    _this.player.draw();
                    _this.prevLevel.drawEntitiesInFrontOfPlayer();
                    _this.prevLevel.drawTopLayer();
                    for (var x = _this.prevLevel.roomX - 1; x <= _this.prevLevel.roomX + _this.prevLevel.width; x++) {
                        for (var y = _this.prevLevel.roomY - 1; y <= _this.prevLevel.roomY + _this.prevLevel.height; y++) {
                            Game.drawFX(7 - ditherFrame, 10, 1, 1, x, y, 1, 1);
                        }
                    }
                }
                else if (ditherFrame >= 7 + deadFrames) {
                    if (_this.transitioningLadder) {
                        _this.level.enterLevelThroughLadder(_this.transitioningLadder);
                        _this.transitioningLadder = null;
                    }
                    _this.level.draw();
                    _this.level.drawEntitiesBehindPlayer();
                    _this.player.draw();
                    _this.level.drawEntitiesInFrontOfPlayer();
                    for (var x = _this.level.roomX - 1; x <= _this.level.roomX + _this.level.width; x++) {
                        for (var y = _this.level.roomY - 1; y <= _this.level.roomY + _this.level.height; y++) {
                            Game.drawFX(ditherFrame - (7 + deadFrames), 10, 1, 1, x, y, 1, 1);
                        }
                    }
                }
                _this.level.drawTopLayer();
                _this.player.drawTopLayer();
            }
            else {
                _this.level.draw();
                _this.level.drawEntitiesBehindPlayer();
                _this.player.draw();
                _this.level.drawEntitiesInFrontOfPlayer();
                _this.level.drawTopLayer();
                _this.player.drawTopLayer();
            }
            // game version
            Game.ctx.globalAlpha = 0.2;
            Game.ctx.fillStyle = levelConstants_1.LevelConstants.LEVEL_TEXT_COLOR;
            Game.ctx.fillText(gameConstants_1.GameConstants.VERSION, gameConstants_1.GameConstants.WIDTH - Game.ctx.measureText(gameConstants_1.GameConstants.VERSION).width - 1, gameConstants_1.GameConstants.HEIGHT - (gameConstants_1.GameConstants.FONT_SIZE - 1));
            Game.ctx.globalAlpha = 1;
        };
        window.addEventListener("load", function () {
            Game.ctx = document.getElementById("gameCanvas").getContext("2d");
            Game.ctx.font = gameConstants_1.GameConstants.FONT_SIZE + "px PixelFont";
            Game.ctx.textBaseline = "top";
            Game.tileset = new Image();
            Game.tileset.src = "res/tileset.png";
            Game.objset = new Image();
            Game.objset.src = "res/objset.png";
            Game.mobset = new Image();
            Game.mobset.src = "res/mobset.png";
            Game.itemset = new Image();
            Game.itemset.src = "res/itemset.png";
            Game.fxset = new Image();
            Game.fxset.src = "res/fxset.png";
            Game.inventory = new Image();
            Game.inventory.src = "res/inventory.png";
            Game.tilesetShadow = new Image();
            Game.tilesetShadow.src = "res/tilesetShadow.png";
            Game.objsetShadow = new Image();
            Game.objsetShadow.src = "res/objsetShadow.png";
            Game.mobsetShadow = new Image();
            Game.mobsetShadow.src = "res/mobsetShadow.png";
            sound_1.Sound.loadSounds();
            sound_1.Sound.playMusic(); // loops forever
            _this.player = new player_1.Player(_this, 0, 0);
            _this.levels = Array();
            _this.levelgen = new levelGenerator_1.LevelGenerator();
            _this.levelgen.generate(_this, 0);
            _this.level = _this.levels[0];
            _this.level.enterLevel();
            _this.levelState = LevelState.IN_LEVEL;
            setInterval(_this.run, 1000.0 / gameConstants_1.GameConstants.FPS);
            _this.onResize();
            window.addEventListener("resize", _this.onResize);
        });
    }
    // [min, max] inclusive
    Game.rand = function (min, max) {
        if (max < min)
            return min;
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    Game.randTable = function (table) {
        return table[Game.rand(0, table.length - 1)];
    };
    Game.drawTile = function (sX, sY, sW, sH, dX, dY, dW, dH, shaded) {
        if (shaded === void 0) { shaded = false; }
        var set = Game.tileset;
        //if (shaded) set = Game.tilesetShadow;
        Game.ctx.drawImage(set, Math.round(sX * gameConstants_1.GameConstants.TILESIZE), Math.round(sY * gameConstants_1.GameConstants.TILESIZE), Math.round(sW * gameConstants_1.GameConstants.TILESIZE), Math.round(sH * gameConstants_1.GameConstants.TILESIZE), Math.round(dX * gameConstants_1.GameConstants.TILESIZE), Math.round(dY * gameConstants_1.GameConstants.TILESIZE), Math.round(dW * gameConstants_1.GameConstants.TILESIZE), Math.round(dH * gameConstants_1.GameConstants.TILESIZE));
    };
    Game.drawObj = function (sX, sY, sW, sH, dX, dY, dW, dH, shaded) {
        if (shaded === void 0) { shaded = false; }
        var set = Game.objset;
        //if (shaded) set = Game.objsetShadow;
        Game.ctx.drawImage(set, Math.round(sX * gameConstants_1.GameConstants.TILESIZE), Math.round(sY * gameConstants_1.GameConstants.TILESIZE), Math.round(sW * gameConstants_1.GameConstants.TILESIZE), Math.round(sH * gameConstants_1.GameConstants.TILESIZE), Math.round(dX * gameConstants_1.GameConstants.TILESIZE), Math.round(dY * gameConstants_1.GameConstants.TILESIZE), Math.round(dW * gameConstants_1.GameConstants.TILESIZE), Math.round(dH * gameConstants_1.GameConstants.TILESIZE));
    };
    Game.drawMob = function (sX, sY, sW, sH, dX, dY, dW, dH, shaded) {
        if (shaded === void 0) { shaded = false; }
        var set = Game.mobset;
        //if (shaded) set = Game.mobsetShadow;
        Game.ctx.drawImage(set, Math.round(sX * gameConstants_1.GameConstants.TILESIZE), Math.round(sY * gameConstants_1.GameConstants.TILESIZE), Math.round(sW * gameConstants_1.GameConstants.TILESIZE), Math.round(sH * gameConstants_1.GameConstants.TILESIZE), Math.round(dX * gameConstants_1.GameConstants.TILESIZE), Math.round(dY * gameConstants_1.GameConstants.TILESIZE), Math.round(dW * gameConstants_1.GameConstants.TILESIZE), Math.round(dH * gameConstants_1.GameConstants.TILESIZE));
    };
    Game.drawItem = function (sX, sY, sW, sH, dX, dY, dW, dH) {
        Game.ctx.drawImage(Game.itemset, Math.round(sX * gameConstants_1.GameConstants.TILESIZE), Math.round(sY * gameConstants_1.GameConstants.TILESIZE), Math.round(sW * gameConstants_1.GameConstants.TILESIZE), Math.round(sH * gameConstants_1.GameConstants.TILESIZE), Math.round(dX * gameConstants_1.GameConstants.TILESIZE), Math.round(dY * gameConstants_1.GameConstants.TILESIZE), Math.round(dW * gameConstants_1.GameConstants.TILESIZE), Math.round(dH * gameConstants_1.GameConstants.TILESIZE));
    };
    Game.drawFX = function (sX, sY, sW, sH, dX, dY, dW, dH) {
        Game.ctx.drawImage(Game.fxset, Math.round(sX * gameConstants_1.GameConstants.TILESIZE), Math.round(sY * gameConstants_1.GameConstants.TILESIZE), Math.round(sW * gameConstants_1.GameConstants.TILESIZE), Math.round(sH * gameConstants_1.GameConstants.TILESIZE), Math.round(dX * gameConstants_1.GameConstants.TILESIZE), Math.round(dY * gameConstants_1.GameConstants.TILESIZE), Math.round(dW * gameConstants_1.GameConstants.TILESIZE), Math.round(dH * gameConstants_1.GameConstants.TILESIZE));
    };
    return Game;
}());
exports.Game = Game;
var game = new Game();


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var levelConstants_1 = __webpack_require__(3);
var SkinType;
(function (SkinType) {
    SkinType[SkinType["DUNGEON"] = 0] = "DUNGEON";
    SkinType[SkinType["GRASS"] = 1] = "GRASS";
})(SkinType = exports.SkinType || (exports.SkinType = {}));
var Tile = (function () {
    function Tile(level, x, y) {
        var _this = this;
        this.isShaded = function () {
            return _this.level.visibilityArray[_this.x][_this.y] <= levelConstants_1.LevelConstants.SHADED_TILE_CUTOFF;
        };
        this.isSolid = function () {
            return false;
        };
        this.isOpaque = function () {
            return false;
        };
        this.onCollide = function (player) { };
        this.onCollideEnemy = function (enemy) { };
        this.tick = function () { };
        this.tickEnd = function () { };
        this.draw = function () { };
        this.drawUnderPlayer = function () { };
        this.drawAbovePlayer = function () { };
        this.skin = level.skin;
        this.level = level;
        this.x = x;
        this.y = y;
    }
    return Tile;
}());
exports.Tile = Tile;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var levelConstants_1 = __webpack_require__(3);
var GameConstants = (function () {
    function GameConstants() {
    }
    GameConstants.VERSION = "v0.2.0";
    GameConstants.FPS = 60;
    GameConstants.TILESIZE = 16;
    GameConstants.SCALE = 2;
    GameConstants.KEY_REPEAT_TIME = 300; // milliseconds
    GameConstants.WIDTH = levelConstants_1.LevelConstants.SCREEN_W * GameConstants.TILESIZE;
    GameConstants.HEIGHT = levelConstants_1.LevelConstants.SCREEN_H * GameConstants.TILESIZE;
    GameConstants.SCRIPT_FONT_SIZE = 13;
    GameConstants.FONT_SIZE = 10; // 20
    GameConstants.RED = "#ac3232";
    GameConstants.GREEN = "#6abe30";
    GameConstants.ARMOR_GREY = "#9badb7";
    GameConstants.OUTLINE = "#222034";
    GameConstants.HIT_ENEMY_TEXT_COLOR = "#76428a";
    GameConstants.HEALTH_BUFF_COLOR = "#d77bba";
    GameConstants.MISS_COLOR = "#639bff";
    return GameConstants;
}());
exports.GameConstants = GameConstants;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LevelConstants = (function () {
    function LevelConstants() {
    }
    LevelConstants.MIN_LEVEL_W = 5;
    LevelConstants.MIN_LEVEL_H = 5;
    LevelConstants.MAX_LEVEL_W = 13;
    LevelConstants.MAX_LEVEL_H = 13;
    LevelConstants.SCREEN_W = 17; // screen size in tiles
    LevelConstants.SCREEN_H = 17; // screen size in tiles
    LevelConstants.TURN_TIME = 1000; // milliseconds
    LevelConstants.LEVEL_TRANSITION_TIME = 300; // milliseconds
    LevelConstants.LEVEL_TRANSITION_TIME_LADDER = 1000; // milliseconds
    LevelConstants.ROOM_COUNT = 15;
    LevelConstants.SHADED_TILE_CUTOFF = 1;
    LevelConstants.SMOOTH_LIGHTING = false;
    LevelConstants.MIN_VISIBILITY = 1.9; // visibility level of places you've already seen
    LevelConstants.LIGHTING_ANGLE_STEP = 5; // how many degrees between each ray
    LevelConstants.LEVEL_TEXT_COLOR = "white"; // not actually a constant
    return LevelConstants;
}());
exports.LevelConstants = LevelConstants;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var bones_1 = __webpack_require__(18);
var levelConstants_1 = __webpack_require__(3);
var deathParticle_1 = __webpack_require__(19);
var floor_1 = __webpack_require__(5);
var genericParticle_1 = __webpack_require__(53);
var EnemyDirection;
(function (EnemyDirection) {
    EnemyDirection[EnemyDirection["DOWN"] = 0] = "DOWN";
    EnemyDirection[EnemyDirection["UP"] = 1] = "UP";
    EnemyDirection[EnemyDirection["RIGHT"] = 2] = "RIGHT";
    EnemyDirection[EnemyDirection["LEFT"] = 3] = "LEFT";
})(EnemyDirection = exports.EnemyDirection || (exports.EnemyDirection = {}));
var Enemy = (function () {
    function Enemy(level, game, x, y) {
        var _this = this;
        this.tryMove = function (x, y) {
            for (var _i = 0, _a = _this.level.enemies; _i < _a.length; _i++) {
                var e = _a[_i];
                if (e !== _this && e.x === x && e.y === y) {
                    return;
                }
            }
            if (_this.game.player.x === x && _this.game.player.y === y) {
                return;
            }
            if (!_this.level.levelArray[x][y].isSolid()) {
                _this.level.levelArray[x][y].onCollideEnemy(_this);
                _this.x = x;
                _this.y = y;
            }
        };
        this.hit = function () {
            return 0;
        };
        this.hurt = function (damage) {
            _this.health -= damage;
            if (_this.health <= 0) {
                _this.kill();
            }
        };
        this.dropLoot = function () { };
        this.kill = function () {
            if (_this.level.levelArray[_this.x][_this.y] instanceof floor_1.Floor) {
                var b = new bones_1.Bones(_this.level, _this.x, _this.y);
                b.skin = _this.level.levelArray[_this.x][_this.y].skin;
                _this.level.levelArray[_this.x][_this.y] = b;
            }
            _this.dead = true;
            genericParticle_1.GenericParticle.spawnCluster(_this.level, _this.x + 0.5, _this.y + 0.5, _this.deathParticleColor);
            _this.level.particles.push(new deathParticle_1.DeathParticle(_this.x, _this.y));
            _this.dropLoot();
        };
        this.killNoBones = function () {
            _this.dead = true;
            genericParticle_1.GenericParticle.spawnCluster(_this.level, _this.x + 0.5, _this.y + 0.5, _this.deathParticleColor);
            _this.level.particles.push(new deathParticle_1.DeathParticle(_this.x, _this.y));
        };
        this.isShaded = function () {
            return _this.level.visibilityArray[_this.x][_this.y] <= levelConstants_1.LevelConstants.SHADED_TILE_CUTOFF;
        };
        this.doneMoving = function () {
            var EPSILON = 0.01;
            return Math.abs(_this.drawX) < EPSILON && Math.abs(_this.drawY) < EPSILON;
        };
        this.facePlayer = function () {
            var dx = _this.game.player.x - _this.x;
            var dy = _this.game.player.y - _this.y;
            if (Math.abs(dx) === Math.abs(dy)) {
                // just moved, already facing player
            }
            else if (Math.abs(dx) > Math.abs(dy)) {
                if (dx > 0)
                    _this.direction = EnemyDirection.RIGHT;
                if (dx < 0)
                    _this.direction = EnemyDirection.LEFT;
            }
            else {
                if (dy > 0)
                    _this.direction = EnemyDirection.DOWN;
                if (dy < 0)
                    _this.direction = EnemyDirection.UP;
            }
        };
        this.draw = function () {
            if (!_this.dead) {
                _this.drawX += -0.5 * _this.drawX;
                _this.drawY += -0.5 * _this.drawY;
                if (_this.hasShadow)
                    game_1.Game.drawMob(0, 0, 1, 1, _this.x - _this.drawX, _this.y - _this.drawY, 1, 1, _this.isShaded());
                game_1.Game.drawMob(_this.tileX, _this.tileY + _this.direction * 2, 1, 2, _this.x - _this.drawX, _this.y - 1.5 - _this.drawY, 1, 2, _this.isShaded());
            }
        };
        this.tick = function () { };
        this.drawTopLayer = function () { };
        this.level = level;
        this.x = x;
        this.y = y;
        this.game = game;
        this.drawX = 0;
        this.drawY = 0;
        this.health = 1;
        this.tileX = 0;
        this.tileY = 0;
        this.hasShadow = true;
        this.skipNextTurns = 0;
        this.direction = EnemyDirection.DOWN;
        this.destroyable = true;
        this.pushable = false;
        this.chainPushable = true;
        this.deathParticleColor = "#ff00ff";
    }
    return Enemy;
}());
exports.Enemy = Enemy;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

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
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var Floor = (function (_super) {
    __extends(Floor, _super);
    function Floor(level, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.draw = function () {
            game_1.Game.drawTile(_this.variation, _this.skin, 1, 1, _this.x, _this.y, 1, 1, _this.isShaded());
        };
        _this.variation = 1;
        if (_this.skin == tile_1.SkinType.DUNGEON)
            _this.variation = game_1.Game.randTable([1, 1, 1, 1, 1, 1, 8, 8, 8, 9, 10, 10, 10, 10, 10, 12]);
        if (_this.skin == tile_1.SkinType.GRASS)
            _this.variation = game_1.Game.randTable([1, 1, 1, 1, 8, 9, 10, 12]);
        return _this;
    }
    return Floor;
}(tile_1.Tile));
exports.Floor = Floor;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

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
var tile_1 = __webpack_require__(1);
var BottomDoor = (function (_super) {
    __extends(BottomDoor, _super);
    function BottomDoor(level, game, x, y, linkedDoor) {
        var _this = _super.call(this, level, x, y) || this;
        _this.onCollide = function (player) {
            _this.game.changeLevelThroughDoor(_this.linkedDoor);
        };
        _this.game = game;
        _this.linkedDoor = linkedDoor;
        return _this;
    }
    return BottomDoor;
}(tile_1.Tile));
exports.BottomDoor = BottomDoor;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Particle = (function () {
    function Particle() {
        this.drawBehind = function () { }; // drawing behind player and such
        this.draw = function () { }; // drawing on top of player and such
    }
    return Particle;
}());
exports.Particle = Particle;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

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
var item_1 = __webpack_require__(12);
var game_1 = __webpack_require__(0);
var textParticle_1 = __webpack_require__(13);
var gameConstants_1 = __webpack_require__(2);
var Gem = (function (_super) {
    __extends(Gem, _super);
    function Gem(level, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.TICKS = 1;
        _this.tick = function () {
            if (_this.firstTickCounter < _this.TICKS)
                _this.firstTickCounter++;
        };
        _this.getDescription = function () {
            return "GEM\nA shiny emerald.";
        };
        _this.onPickup = function (player) {
            if (_this.firstTickCounter < _this.TICKS)
                return;
            player.inventory.addItem(_this);
            _this.level.particles.push(new textParticle_1.TextParticle("+1", _this.x + 0.5, _this.y - 0.5, gameConstants_1.GameConstants.GREEN, 0));
            _this.level.items = _this.level.items.filter(function (x) { return x !== _this; }); // removes itself from the level
        };
        _this.draw = function () {
            if (_this.firstTickCounter < _this.TICKS)
                return;
            if (_this.scaleFactor < 1)
                _this.scaleFactor += 0.04;
            else
                _this.scaleFactor = 1;
            game_1.Game.drawItem(0, 0, 1, 1, _this.x, _this.y - 0.25, 1, 1);
            _this.frame += (Math.PI * 2) / 60;
            game_1.Game.drawItem(_this.tileX, _this.tileY, 1, 2, _this.x + _this.w * (_this.scaleFactor * -0.5 + 0.5), _this.y + Math.sin(_this.frame) * 0.07 - 1.5 + _this.h * (_this.scaleFactor * -0.5 + 0.5), _this.w * _this.scaleFactor, _this.h * _this.scaleFactor);
        };
        _this.tileX = 17;
        _this.tileY = 0;
        _this.stackable = true;
        _this.firstTickCounter = 0;
        _this.scaleFactor = 0.2;
        return _this;
    }
    return Gem;
}(item_1.Item));
exports.Gem = Gem;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

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
var item_1 = __webpack_require__(12);
var game_1 = __webpack_require__(0);
var Equippable = (function (_super) {
    __extends(Equippable, _super);
    function Equippable(level, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.coEquippable = function (other) {
            return true;
        };
        _this.drawEquipped = function (x, y) {
            game_1.Game.drawItem(_this.tileX, _this.tileY, 1, 2, x, y - 1, _this.w, _this.h);
        };
        _this.equipped = false;
        return _this;
    }
    return Equippable;
}(item_1.Item));
exports.Equippable = Equippable;


/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

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
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var Door = (function (_super) {
    __extends(Door, _super);
    function Door(level, game, x, y, linkedDoor) {
        var _this = _super.call(this, level, x, y) || this;
        _this.onCollide = function (player) {
            _this.opened = true;
            _this.game.changeLevelThroughDoor(_this.linkedDoor);
        };
        _this.draw = function () {
            if (_this.opened)
                game_1.Game.drawTile(6, _this.skin, 1, 1, _this.x, _this.y, 1, 1, _this.isShaded());
            else
                game_1.Game.drawTile(3, _this.skin, 1, 1, _this.x, _this.y, 1, 1, _this.isShaded());
        };
        _this.drawAbovePlayer = function () {
            if (!_this.opened)
                game_1.Game.drawTile(13, 0, 1, 1, _this.x, _this.y - 1, 1, 1, _this.isShaded());
            else
                game_1.Game.drawTile(14, 0, 1, 1, _this.x, _this.y - 1, 1, 1, _this.isShaded());
        };
        _this.game = game;
        _this.linkedDoor = linkedDoor;
        _this.opened = false;
        return _this;
    }
    return Door;
}(tile_1.Tile));
exports.Door = Door;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

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
var projectile_1 = __webpack_require__(21);
var game_1 = __webpack_require__(0);
var HitWarning = (function (_super) {
    __extends(HitWarning, _super);
    function HitWarning(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.tick = function () {
            _this.dead = true;
        };
        _this.draw = function () {
            game_1.Game.drawFX(18 + Math.floor(HitWarning.frame), 6, 1, 1, _this.x, _this.y, 1, 1);
        };
        return _this;
    }
    HitWarning.frame = 0;
    HitWarning.updateFrame = function () {
        HitWarning.frame += 0.25;
        if (HitWarning.frame >= 4)
            HitWarning.frame = 0;
    };
    return HitWarning;
}(projectile_1.Projectile));
exports.HitWarning = HitWarning;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var Item = (function () {
    function Item(level, x, y) {
        var _this = this;
        this.tick = function () { };
        this.tickInInventory = function () { }; // different tick behavior for when we have the item in our inventory
        this.getDescription = function () {
            return "";
        };
        this.onPickup = function (player) {
            player.inventory.addItem(_this);
            _this.level.items = _this.level.items.filter(function (x) { return x !== _this; }); // removes itself from the level
        };
        this.draw = function () {
            game_1.Game.drawItem(0, 0, 1, 1, _this.x, _this.y, 1, 1);
            _this.frame += (Math.PI * 2) / 60;
            game_1.Game.drawItem(_this.tileX, _this.tileY, 1, 2, _this.x, _this.y + Math.sin(_this.frame) * 0.07 - 1, _this.w, _this.h);
        };
        this.drawIcon = function (x, y) {
            game_1.Game.drawItem(_this.tileX, _this.tileY, 1, 2, x, y - 1, _this.w, _this.h);
        };
        this.level = level;
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 2;
        this.tileX = 0;
        this.tileY = 0;
        this.frame = 0;
        this.dead = false;
        this.stackable = false;
        this.stackCount = 1;
    }
    return Item;
}());
exports.Item = Item;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

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
var game_1 = __webpack_require__(0);
var gameConstants_1 = __webpack_require__(2);
var particle_1 = __webpack_require__(7);
var TextParticle = (function (_super) {
    __extends(TextParticle, _super);
    function TextParticle(text, x, y, color, delay) {
        var _this = _super.call(this) || this;
        _this.draw = function () {
            if (_this.delay > 0) {
                _this.delay--;
            }
            else {
                var GRAVITY = 0.2;
                var TIMEOUT = 1; // lasts for 1 second
                _this.z += _this.dz;
                if (_this.z < 0) {
                    _this.z = 0;
                    _this.dz *= -0.6;
                }
                _this.dz -= GRAVITY;
                _this.time++;
                if (_this.time > gameConstants_1.GameConstants.FPS * TIMEOUT)
                    _this.dead = true;
                var width = game_1.Game.ctx.measureText(_this.text).width;
                for (var xx = -1; xx <= 1; xx++) {
                    for (var yy = -1; yy <= 1; yy++) {
                        game_1.Game.ctx.fillStyle = gameConstants_1.GameConstants.OUTLINE;
                        game_1.Game.ctx.fillText(_this.text, _this.x - width / 2 + xx, _this.y - _this.z + yy);
                    }
                }
                game_1.Game.ctx.fillStyle = _this.color;
                game_1.Game.ctx.fillText(_this.text, _this.x - width / 2, _this.y - _this.z);
            }
        };
        _this.text = text;
        _this.x = x * gameConstants_1.GameConstants.TILESIZE;
        _this.y = y * gameConstants_1.GameConstants.TILESIZE;
        _this.z = gameConstants_1.GameConstants.TILESIZE;
        _this.dz = 1;
        _this.color = color;
        _this.dead = false;
        _this.time = 0;
        if (delay === undefined)
            _this.delay = game_1.Game.rand(0, 10);
        else
            _this.delay = delay;
        return _this;
    }
    return TextParticle;
}(particle_1.Particle));
exports.TextParticle = TextParticle;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

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
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var crate_1 = __webpack_require__(22);
var barrel_1 = __webpack_require__(23);
var SpikeTrap = (function (_super) {
    __extends(SpikeTrap, _super);
    function SpikeTrap(level, x, y, tickCount) {
        var _this = _super.call(this, level, x, y) || this;
        _this.tick = function () {
            _this.tickCount++;
            if (_this.tickCount >= 4)
                _this.tickCount = 0;
            _this.on = _this.tickCount === 0;
            if (_this.on) {
                if (_this.level.game.player.x === _this.x && _this.level.game.player.y === _this.y)
                    _this.level.game.player.hurt(1);
            }
        };
        _this.tickEnd = function () {
            if (_this.on) {
                for (var _i = 0, _a = _this.level.enemies; _i < _a.length; _i++) {
                    var e = _a[_i];
                    if (e.x === _this.x && e.y === _this.y) {
                        e.hurt(1);
                    }
                }
            }
        };
        _this.onCollideEnemy = function (enemy) {
            if (_this.on && !(enemy instanceof crate_1.Crate || enemy instanceof barrel_1.Barrel))
                enemy.hurt(1);
        };
        _this.draw = function () {
            game_1.Game.drawTile(1, _this.skin, 1, 1, _this.x, _this.y, 1, 1, _this.isShaded());
        };
        _this.t = 0;
        _this.drawUnderPlayer = function () {
            var rumbleOffsetX = 0;
            _this.t++;
            if (!_this.on && _this.tickCount === 3) {
                if (_this.t % 4 === 1)
                    rumbleOffsetX = 0.0325;
                if (_this.t % 4 === 3)
                    rumbleOffsetX = -0.0325;
            }
            var frames = [0, 1, 2, 3, 3, 4, 2, 0];
            var f = 6 + frames[Math.floor(_this.frame)];
            if (_this.tickCount === 1 || (_this.tickCount === 0 && frames[Math.floor(_this.frame)] === 0)) {
                f = 5;
            }
            game_1.Game.drawObj(f, 0, 1, 2, _this.x + rumbleOffsetX, _this.y - 1, 1, 2, _this.isShaded());
            if (_this.on && _this.frame < frames.length - 1) {
                if (frames[Math.floor(_this.frame)] < 3)
                    _this.frame += 0.4;
                else
                    _this.frame += 0.2;
            }
            if (!_this.on)
                _this.frame = 0;
        };
        if (tickCount)
            _this.tickCount = tickCount;
        else
            _this.tickCount = 0;
        _this.on = false;
        _this.frame = 0;
        return _this;
    }
    return SpikeTrap;
}(tile_1.Tile));
exports.SpikeTrap = SpikeTrap;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var Sound = (function () {
    function Sound() {
    }
    Sound.loadSounds = function () {
        Sound.footsteps = new Array();
        Sound.footsteps.push(new Audio("res/step1.wav"));
        Sound.footsteps.push(new Audio("res/step2.wav"));
        Sound.footsteps.push(new Audio("res/step3.wav"));
        Sound.footsteps.push(new Audio("res/step4.wav"));
        for (var _i = 0, _a = Sound.footsteps; _i < _a.length; _i++) {
            var f = _a[_i];
            f.volume = 1.0;
        }
        Sound.powerupSound = new Audio("res/powerup.wav");
        Sound.powerupSound.volume = 0.5;
        Sound.healSound = new Audio("res/heal.wav");
        Sound.healSound.volume = 0.5;
        Sound.music = new Audio("res/bewitched.mp3");
    };
    Sound.footstep = function () {
        var i = game_1.Game.rand(0, Sound.footsteps.length - 1);
        Sound.footsteps[i].play();
        Sound.footsteps[i].currentTime = 0;
    };
    Sound.powerup = function () {
        Sound.powerupSound.play();
        Sound.powerupSound.currentTime = 0;
    };
    Sound.heal = function () {
        Sound.healSound.play();
        Sound.healSound.currentTime = 0;
    };
    Sound.playMusic = function () {
        Sound.music.addEventListener("ended", function () {
            Sound.music.currentTime = 0;
            Sound.music.play();
        }, false);
        //Sound.music.play();
    };
    return Sound;
}());
exports.Sound = Sound;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var gameConstants_1 = __webpack_require__(2);
exports.Input = {
    _pressed: {},
    iListener: function () { },
    iUpListener: function () { },
    mListener: function () { },
    mUpListener: function () { },
    rightListener: function () { },
    leftListener: function () { },
    upListener: function () { },
    downListener: function () { },
    mouseLeftClickListener: function (x, y) { },
    mouseX: 0,
    mouseY: 0,
    lastPressTime: 0,
    lastPressKeyCode: 0,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    W: 87,
    A: 65,
    S: 83,
    D: 68,
    M: 77,
    N: 78,
    I: 73,
    isDown: function (keyCode) {
        return this._pressed[keyCode];
    },
    onKeydown: function (event) {
        if (event.repeat)
            return; // ignore repeat keypresses
        exports.Input.lastPressTime = Date.now();
        exports.Input.lastPressKeyCode = event.keyCode;
        exports.Input._pressed[event.keyCode] = true;
        switch (event.keyCode) {
            case exports.Input.A:
            case exports.Input.LEFT:
                exports.Input.leftListener();
                break;
            case exports.Input.D:
            case exports.Input.RIGHT:
                exports.Input.rightListener();
                break;
            case exports.Input.W:
            case exports.Input.UP:
                exports.Input.upListener();
                break;
            case exports.Input.S:
            case exports.Input.DOWN:
                exports.Input.downListener();
                break;
            case exports.Input.M:
                exports.Input.mListener();
                break;
            case exports.Input.I:
                exports.Input.iListener();
                break;
        }
    },
    onKeyup: function (event) {
        delete this._pressed[event.keyCode];
        if (event.keyCode === this.lastPressKeyCode) {
            this.lastPressTime = 0;
            this.lastPressKeyCode = 0;
        }
        if (event.keyCode === 77)
            exports.Input.mUpListener();
        if (event.keyCode === 73)
            exports.Input.iUpListener();
    },
    mouseClickListener: function (event) {
        if (event.button === 0) {
            var rect = window.document.getElementById("gameCanvas").getBoundingClientRect();
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
            exports.Input.mouseLeftClickListener(Math.floor(x / gameConstants_1.GameConstants.SCALE), Math.floor(y / gameConstants_1.GameConstants.SCALE));
        }
    },
    updateMousePos: function (event) {
        var rect = window.document.getElementById("gameCanvas").getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        exports.Input.mouseX = Math.floor(x / gameConstants_1.GameConstants.SCALE);
        exports.Input.mouseY = Math.floor(y / gameConstants_1.GameConstants.SCALE);
    },
};
window.addEventListener("keyup", function (event) {
    exports.Input.onKeyup(event);
}, false);
window.addEventListener("keydown", function (event) {
    exports.Input.onKeydown(event);
}, false);
window.document
    .getElementById("gameCanvas")
    .addEventListener("click", function (event) { return exports.Input.mouseClickListener(event); }, false);
window.document
    .getElementById("gameCanvas")
    .addEventListener("mousemove", function (event) { return exports.Input.updateMousePos(event); });


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var wall_1 = __webpack_require__(27);
var levelConstants_1 = __webpack_require__(3);
var floor_1 = __webpack_require__(5);
var game_1 = __webpack_require__(0);
var door_1 = __webpack_require__(10);
var bottomDoor_1 = __webpack_require__(6);
var wallSide_1 = __webpack_require__(28);
var tile_1 = __webpack_require__(1);
var knightEnemy_1 = __webpack_require__(29);
var chest_1 = __webpack_require__(24);
var goldenKey_1 = __webpack_require__(31);
var spawnfloor_1 = __webpack_require__(32);
var spike_1 = __webpack_require__(54);
var gameConstants_1 = __webpack_require__(2);
var wizardEnemy_1 = __webpack_require__(33);
var skullEnemy_1 = __webpack_require__(36);
var barrel_1 = __webpack_require__(23);
var crate_1 = __webpack_require__(22);
var spiketrap_1 = __webpack_require__(14);
var fountainTile_1 = __webpack_require__(37);
var coffinTile_1 = __webpack_require__(38);
var pottedPlant_1 = __webpack_require__(39);
var insideLevelDoor_1 = __webpack_require__(40);
var button_1 = __webpack_require__(41);
var hitWarning_1 = __webpack_require__(11);
var upLadder_1 = __webpack_require__(51);
var downLadder_1 = __webpack_require__(52);
var RoomType;
(function (RoomType) {
    RoomType[RoomType["DUNGEON"] = 0] = "DUNGEON";
    RoomType[RoomType["TREASURE"] = 1] = "TREASURE";
    RoomType[RoomType["FOUNTAIN"] = 2] = "FOUNTAIN";
    RoomType[RoomType["COFFIN"] = 3] = "COFFIN";
    RoomType[RoomType["GRASS"] = 4] = "GRASS";
    RoomType[RoomType["PUZZLE"] = 5] = "PUZZLE";
    RoomType[RoomType["KEYROOM"] = 6] = "KEYROOM";
    RoomType[RoomType["CHESSBOARD"] = 7] = "CHESSBOARD";
    RoomType[RoomType["MAZE"] = 8] = "MAZE";
    RoomType[RoomType["CORRIDOR"] = 9] = "CORRIDOR";
    RoomType[RoomType["SPIKECORRIDOR"] = 10] = "SPIKECORRIDOR";
    RoomType[RoomType["UPLADDER"] = 11] = "UPLADDER";
    RoomType[RoomType["DOWNLADDER"] = 12] = "DOWNLADDER";
})(RoomType = exports.RoomType || (exports.RoomType = {}));
var TurnState;
(function (TurnState) {
    TurnState[TurnState["playerTurn"] = 0] = "playerTurn";
    TurnState[TurnState["computerTurn"] = 1] = "computerTurn";
})(TurnState = exports.TurnState || (exports.TurnState = {}));
// LevelGenerator -> Level()
// Level.generate()
var Level = (function () {
    function Level(game, x, y, w, h, type, difficulty) {
        var _this = this;
        this.generateDungeon = function () {
            _this.skin = tile_1.SkinType.DUNGEON;
            _this.buildEmptyRoom();
            _this.addWallBlocks();
            _this.addFingers();
            _this.fixWalls();
            _this.addPlants(game_1.Game.randTable([0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 4]));
            _this.addSpikeTraps(game_1.Game.randTable([0, 0, 0, 1, 1, 2, 5]));
            var numEmptyTiles = _this.getEmptyTiles().length;
            _this.addEnemies(Math.floor(numEmptyTiles * (_this.depth * 0.5 + 0.5) * game_1.Game.randTable([0, 0, 0.1, 0.1, 0.12, 0.15, 0.3])) // 0.25, 0.2, 0.3, 0.5
            );
            _this.addObstacles(game_1.Game.randTable([0, 0, 1, 1, 2, 3, 5]));
        };
        this.generateKeyRoom = function () {
            _this.skin = tile_1.SkinType.DUNGEON;
            _this.buildEmptyRoom();
            _this.fixWalls();
            _this.items.push(new goldenKey_1.GoldenKey(_this, Math.floor(_this.roomX + _this.width / 2), Math.floor(_this.roomY + _this.height / 2)));
        };
        this.generateFountain = function () {
            _this.skin = tile_1.SkinType.DUNGEON;
            _this.buildEmptyRoom();
            _this.fixWalls();
            var centerX = Math.floor(_this.roomX + _this.width / 2);
            var centerY = Math.floor(_this.roomY + _this.height / 2);
            for (var x = centerX - 1; x <= centerX + 1; x++) {
                for (var y = centerY - 1; y <= centerY + 1; y++) {
                    _this.levelArray[x][y] = new fountainTile_1.FountainTile(_this, x, y, x - (centerX - 1), y - (centerY - 1));
                }
            }
            _this.addPlants(game_1.Game.randTable([0, 0, 1, 2]));
        };
        this.placeCoffin = function (x, y) {
            _this.levelArray[x][y] = new coffinTile_1.CoffinTile(_this, x, y, 0);
            _this.levelArray[x][y + 1] = new coffinTile_1.CoffinTile(_this, x, y + 1, 1);
        };
        this.generateCoffin = function () {
            _this.skin = tile_1.SkinType.DUNGEON;
            _this.buildEmptyRoom();
            _this.fixWalls();
            _this.placeCoffin(Math.floor(_this.roomX + _this.width / 2 - 2), Math.floor(_this.roomY + _this.height / 2));
            _this.placeCoffin(Math.floor(_this.roomX + _this.width / 2), Math.floor(_this.roomY + _this.height / 2));
            _this.placeCoffin(Math.floor(_this.roomX + _this.width / 2) + 2, Math.floor(_this.roomY + _this.height / 2));
        };
        this.generatePuzzle = function () {
            _this.skin = tile_1.SkinType.DUNGEON;
            _this.buildEmptyRoom();
            var d;
            for (var x_1 = _this.roomX; x_1 < _this.roomX + _this.width; x_1++) {
                var y_1 = _this.roomY + Math.floor(_this.height / 2);
                if (x_1 === _this.roomX + Math.floor(_this.width / 2)) {
                    d = new insideLevelDoor_1.InsideLevelDoor(_this, _this.game, x_1, y_1 + 1);
                    _this.levelArray[x_1][y_1 + 1] = d;
                }
                else {
                    _this.levelArray[x_1][y_1] = new wall_1.Wall(_this, x_1, y_1, 0);
                }
            }
            var x = game_1.Game.rand(_this.roomX, _this.roomX + _this.width - 1);
            var y = game_1.Game.rand(_this.roomY + Math.floor(_this.height / 2) + 3, _this.roomY + _this.height - 2);
            _this.levelArray[x][y] = new button_1.Button(_this, x, y, d);
            var crateTiles = _this.getEmptyTiles().filter(function (t) {
                return t.x >= _this.roomX + 1 &&
                    t.x <= _this.roomX + _this.width - 2 &&
                    t.y >= _this.roomY + Math.floor(_this.height / 2) + 3 &&
                    t.y <= _this.roomY + _this.height - 2;
            });
            var numCrates = game_1.Game.randTable([1, 2, 2, 3, 4]);
            for (var i = 0; i < numCrates; i++) {
                var t = crateTiles.splice(game_1.Game.rand(0, crateTiles.length - 1), 1)[0];
                _this.enemies.push(new crate_1.Crate(_this, _this.game, t.x, t.y));
            }
            _this.fixWalls();
            _this.addPlants(game_1.Game.randTable([0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 4]));
        };
        this.generateSpikeCorridor = function () {
            _this.skin = tile_1.SkinType.DUNGEON;
            _this.buildEmptyRoom();
            for (var x = _this.roomX; x < _this.roomX + _this.width; x++) {
                for (var y = _this.roomY + 1; y < _this.roomY + _this.height - 1; y++) {
                    _this.levelArray[x][y] = new spiketrap_1.SpikeTrap(_this, x, y, game_1.Game.rand(0, 3));
                }
            }
            _this.addEnemies(5);
            _this.fixWalls();
        };
        this.generateTreasure = function () {
            _this.skin = tile_1.SkinType.DUNGEON;
            _this.buildEmptyRoom();
            _this.addWallBlocks();
            _this.fixWalls();
            _this.addChests(game_1.Game.randTable([2, 4, 4, 5, 5, 6, 7, 8]));
            _this.addPlants(game_1.Game.randTable([0, 1, 2, 4, 5, 6]));
        };
        this.generateChessboard = function () {
            _this.skin = tile_1.SkinType.DUNGEON;
            _this.buildEmptyRoom();
            _this.fixWalls();
        };
        this.generateGrass = function () {
            _this.skin = tile_1.SkinType.GRASS;
            _this.buildEmptyRoom();
            _this.addWallBlocks();
            _this.addFingers();
            _this.fixWalls();
            _this.addPlants(game_1.Game.randTable([0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 4]));
            _this.addSpikes(game_1.Game.randTable([0, 0, 0, 1, 1, 2, 3, 5]));
            var numEmptyTiles = _this.getEmptyTiles().length;
            _this.addEnemies(numEmptyTiles * (_this.depth * 0.5 + 0.5) * game_1.Game.randTable([0, 0, 0.1, 0.1, 0.12, 0.15, 0.3]));
            _this.addObstacles(game_1.Game.randTable([0, 0, 1, 1, 2, 3, 5]));
            for (var x = 0; x < _this.levelArray.length; x++) {
                for (var y = 0; y < _this.levelArray[0].length; y++) {
                    _this.levelArray[x][y].skin = tile_1.SkinType.GRASS;
                }
            }
        };
        this.generateUpLadder = function () {
            _this.skin = tile_1.SkinType.DUNGEON;
            _this.buildEmptyRoom();
            _this.fixWalls();
            var cX = Math.floor(_this.roomX + _this.width / 2);
            var cY = Math.floor(_this.roomY + _this.height / 2);
            _this.upLadder = new upLadder_1.UpLadder(_this, _this.game, cX, cY);
            _this.levelArray[cX][cY] = _this.upLadder;
        };
        this.generateDownLadder = function () {
            _this.skin = tile_1.SkinType.DUNGEON;
            _this.buildEmptyRoom();
            _this.fixWalls();
            var cX = Math.floor(_this.roomX + _this.width / 2);
            var cY = Math.floor(_this.roomY + _this.height / 2);
            _this.levelArray[cX][cY] = new downLadder_1.DownLadder(_this, _this.game, cX, cY);
        };
        this.addDoor = function (location, link) {
            var d;
            switch (location) {
                case 0:
                    d = new door_1.Door(_this, _this.game, _this.roomX, _this.roomY, link);
                    break;
                case 1:
                    d = new door_1.Door(_this, _this.game, _this.roomX + Math.floor(_this.width / 2), _this.roomY, link);
                    break;
                case 2:
                    d = new door_1.Door(_this, _this.game, _this.roomX + _this.width - 1, _this.roomY, link);
                    break;
                case 3:
                    _this.levelArray[_this.roomX][_this.roomY + _this.height] = new floor_1.Floor(_this, _this.roomX, _this.roomY + _this.height);
                    d = new bottomDoor_1.BottomDoor(_this, _this.game, _this.roomX, _this.roomY + _this.height + 1, link);
                    break;
                case 4:
                    _this.levelArray[_this.roomX + Math.floor(_this.width / 2)][_this.roomY + _this.height] = new floor_1.Floor(_this, _this.roomX + Math.floor(_this.width / 2), _this.roomY + _this.height);
                    d = new bottomDoor_1.BottomDoor(_this, _this.game, _this.roomX + Math.floor(_this.width / 2), _this.roomY + _this.height + 1, link);
                    break;
                case 5:
                    _this.levelArray[_this.roomX + _this.width - 1][_this.roomY + _this.height] = new floor_1.Floor(_this, _this.roomX + _this.width - 1, _this.roomY + _this.height);
                    d = new bottomDoor_1.BottomDoor(_this, _this.game, _this.roomX + _this.width - 1, _this.roomY + _this.height + 1, link);
                    break;
            }
            _this.doors.push(d);
            _this.levelArray[d.x][d.y] = d;
            return d;
        };
        this.exitLevel = function () {
            _this.particles.splice(0, _this.particles.length);
        };
        this.updateLevelTextColor = function () {
            levelConstants_1.LevelConstants.LEVEL_TEXT_COLOR = "white";
            // no more color backgrounds:
            // if (this.env === 3) LevelConstants.LEVEL_TEXT_COLOR = "black";
        };
        this.enterLevel = function () {
            _this.updateLevelTextColor();
            _this.game.player.moveSnap(_this.roomX + Math.floor(_this.width / 2), _this.roomY + _this.height - 1);
            _this.updateLighting();
            _this.entered = true;
        };
        this.enterLevelThroughDoor = function (door) {
            _this.updateLevelTextColor();
            if (door instanceof door_1.Door) {
                door.opened = true;
                _this.game.player.moveNoSmooth(door.x, door.y + 1);
            }
            else {
                _this.game.player.moveNoSmooth(door.x, door.y - 1);
            }
            _this.updateLighting();
            _this.entered = true;
        };
        this.enterLevelThroughLadder = function (ladder) {
            _this.updateLevelTextColor();
            _this.game.player.moveSnap(ladder.x, ladder.y + 1);
            _this.updateLighting();
            _this.entered = true;
        };
        this.getEmptyTiles = function () {
            var returnVal = [];
            for (var x = _this.roomX; x < _this.roomX + _this.width; x++) {
                for (var y = _this.roomY + 2; y < _this.roomY + _this.height - 1; y++) {
                    if (!_this.levelArray[x][y].isSolid()) {
                        returnVal.push(_this.levelArray[x][y]);
                    }
                }
            }
            var _loop_1 = function (e) {
                returnVal = returnVal.filter(function (t) { return t.x !== e.x || t.y !== e.y; });
            };
            for (var _i = 0, _a = _this.enemies; _i < _a.length; _i++) {
                var e = _a[_i];
                _loop_1(e);
            }
            return returnVal;
        };
        this.getTile = function (x, y) {
            for (var _i = 0, _a = _this.levelArray; _i < _a.length; _i++) {
                var col = _a[_i];
                for (var _b = 0, col_1 = col; _b < col_1.length; _b++) {
                    var tile = col_1[_b];
                    if (tile !== null && tile.x === x && tile.y === y)
                        return tile;
                }
            }
            return null;
        };
        this.fadeLighting = function () {
            for (var x = 0; x < _this.levelArray.length; x++) {
                for (var y = 0; y < _this.levelArray[0].length; y++) {
                    if (_this.visibilityArray[x][y] <= levelConstants_1.LevelConstants.MIN_VISIBILITY)
                        _this.visibilityArray[x][y] -= 0.01;
                }
            }
        };
        this.updateLighting = function () {
            var oldVisibilityArray = [];
            for (var x = 0; x < _this.levelArray.length; x++) {
                oldVisibilityArray[x] = [];
                for (var y = 0; y < _this.levelArray[0].length; y++) {
                    oldVisibilityArray[x][y] = _this.visibilityArray[x][y];
                    _this.visibilityArray[x][y] = 0;
                    //if (this.visibilityArray[x][y] > LevelConstants.MIN_VISIBILITY)
                    //  this.visibilityArray[x][y] = 0;
                }
            }
            for (var i = 0; i < 360; i += levelConstants_1.LevelConstants.LIGHTING_ANGLE_STEP) {
                _this.castShadowsAtAngle(i, _this.game.player.sightRadius);
            }
            if (levelConstants_1.LevelConstants.SMOOTH_LIGHTING)
                _this.visibilityArray = _this.blur3x3(_this.visibilityArray, [[1, 2, 1], [2, 8, 2], [1, 2, 1]]);
            for (var x = 0; x < _this.visibilityArray.length; x++) {
                for (var y = 0; y < _this.visibilityArray[0].length; y++) {
                    if (_this.visibilityArray[x][y] < oldVisibilityArray[x][y]) {
                        _this.visibilityArray[x][y] = Math.min(oldVisibilityArray[x][y], levelConstants_1.LevelConstants.MIN_VISIBILITY);
                    }
                }
            }
        };
        this.castShadowsAtAngle = function (angle, radius) {
            var dx = Math.cos((angle * Math.PI) / 180);
            var dy = Math.sin((angle * Math.PI) / 180);
            var px = _this.game.player.x + 0.5;
            var py = _this.game.player.y + 0.5;
            var returnVal = 0;
            var i = 0;
            var hitWall = false; // flag for if we already hit a wall. we'll keep scanning and see if there's more walls. if so, light them up!
            for (; i < radius; i++) {
                if (Math.floor(px) < 0 ||
                    Math.floor(px) >= _this.levelArray.length ||
                    Math.floor(py) < 0 ||
                    Math.floor(py) >= _this.levelArray[0].length)
                    return; // we're outside the level
                var tile = _this.levelArray[Math.floor(px)][Math.floor(py)];
                if (tile instanceof wall_1.Wall && tile.type === 1) {
                    return returnVal;
                }
                if (!(tile instanceof wall_1.Wall) && hitWall) {
                    // fun's over, we hit something that wasn't a wall
                    return returnVal;
                }
                if (tile.isOpaque()) {
                    if (!hitWall)
                        returnVal = i;
                    hitWall = true;
                }
                _this.visibilityArray[Math.floor(px)][Math.floor(py)] = 2; //Math.min(2 - (2 / radius) * i, 2);
                px += dx;
                py += dy;
            }
            return returnVal;
        };
        this.blur3x3 = function (array, weights) {
            var blurredArray = [];
            for (var x = 0; x < array.length; x++) {
                blurredArray[x] = [];
                for (var y = 0; y < array[0].length; y++) {
                    if (array[x][y] === 0) {
                        blurredArray[x][y] = 0;
                        continue;
                    }
                    var total = 0;
                    var totalWeights = 0;
                    for (var xx = -1; xx <= 1; xx++) {
                        for (var yy = -1; yy <= 1; yy++) {
                            if (x + xx >= 0 && x + xx < array.length && y + yy >= 0 && y + yy < array[0].length) {
                                total += array[x + xx][y + yy] * weights[xx + 1][yy + 1];
                                totalWeights += weights[xx + 1][yy + 1];
                            }
                        }
                    }
                    blurredArray[x][y] = total / totalWeights;
                }
            }
            return blurredArray;
        };
        this.tick = function () {
            if (_this.turn === TurnState.computerTurn)
                _this.computerTurn(); // player skipped computer's turn, catch up
            _this.enemies = _this.enemies.filter(function (e) { return !e.dead; });
            _this.updateLighting();
            for (var x = 0; x < _this.levelArray.length; x++) {
                for (var y = 0; y < _this.levelArray[0].length; y++) {
                    _this.levelArray[x][y].tick();
                }
            }
            _this.turn = TurnState.computerTurn;
        };
        this.update = function () {
            if (_this.turn == TurnState.computerTurn) {
                if (_this.game.player.doneMoving()) {
                    _this.computerTurn();
                }
            }
        };
        this.computerTurn = function () {
            // take computer turn
            for (var _i = 0, _a = _this.projectiles; _i < _a.length; _i++) {
                var p = _a[_i];
                p.tick();
            }
            for (var _b = 0, _c = _this.enemies; _b < _c.length; _b++) {
                var e = _c[_b];
                e.tick();
            }
            for (var _d = 0, _e = _this.items; _d < _e.length; _d++) {
                var i = _e[_d];
                i.tick();
            }
            for (var _f = 0, _g = _this.projectiles; _f < _g.length; _f++) {
                var p = _g[_f];
                if (_this.levelArray[p.x][p.y].isSolid())
                    p.dead = true;
                if (p.x === _this.game.player.x && p.y === _this.game.player.y) {
                    p.hitPlayer(_this.game.player);
                }
                for (var _h = 0, _j = _this.enemies; _h < _j.length; _h++) {
                    var e = _j[_h];
                    if (p.x === e.x && p.y === e.y) {
                        p.hitEnemy(e);
                    }
                }
            }
            for (var x = 0; x < _this.levelArray.length; x++) {
                for (var y = 0; y < _this.levelArray[0].length; y++) {
                    _this.levelArray[x][y].tickEnd();
                }
            }
            _this.game.player.finishTick();
            _this.turn = TurnState.playerTurn; // now it's the player's turn
        };
        this.draw = function () {
            hitWarning_1.HitWarning.updateFrame();
            _this.fadeLighting();
            for (var x = _this.roomX - 1; x < _this.roomX + _this.width + 1; x++) {
                for (var y = _this.roomY - 1; y < _this.roomY + _this.height + 1; y++) {
                    if (_this.visibilityArray[x][y] > 0)
                        _this.levelArray[x][y].draw();
                }
            }
        };
        this.drawEntitiesBehindPlayer = function () {
            for (var x = 0; x < _this.levelArray.length; x++) {
                for (var y = 0; y < _this.levelArray[0].length; y++) {
                    if (_this.visibilityArray[x][y] > 0)
                        _this.levelArray[x][y].drawUnderPlayer();
                }
            }
            _this.enemies.sort(function (a, b) { return a.y - b.y; });
            _this.items.sort(function (a, b) { return a.y - b.y; });
            for (var _i = 0, _a = _this.particles; _i < _a.length; _i++) {
                var p = _a[_i];
                p.drawBehind();
            }
            _this.projectiles = _this.projectiles.filter(function (p) { return !p.dead; });
            for (var _b = 0, _c = _this.projectiles; _b < _c.length; _b++) {
                var p = _c[_b];
                p.draw();
            }
            for (var _d = 0, _e = _this.enemies; _d < _e.length; _d++) {
                var e = _e[_d];
                if (e.y <= _this.game.player.y && _this.visibilityArray[e.x][e.y] > 0)
                    e.draw();
            }
            for (var _f = 0, _g = _this.items; _f < _g.length; _f++) {
                var i = _g[_f];
                if (i.y <= _this.game.player.y && _this.visibilityArray[i.x][i.y] > 0)
                    i.draw();
            }
        };
        this.drawEntitiesInFrontOfPlayer = function () {
            for (var x = 0; x < _this.levelArray.length; x++) {
                for (var y = 0; y < _this.levelArray[0].length; y++) {
                    if (_this.visibilityArray[x][y] > 0)
                        _this.levelArray[x][y].drawAbovePlayer();
                }
            }
            for (var _i = 0, _a = _this.enemies; _i < _a.length; _i++) {
                var e = _a[_i];
                if (e.y > _this.game.player.y && _this.visibilityArray[e.x][e.y] > 0)
                    e.draw();
            }
            for (var _b = 0, _c = _this.items; _b < _c.length; _b++) {
                var i = _c[_b];
                if (i.y > _this.game.player.y && _this.visibilityArray[i.x][i.y] > 0)
                    i.draw();
            }
            for (var _d = 0, _e = _this.enemies; _d < _e.length; _d++) {
                var e = _e[_d];
                e.drawTopLayer(); // health bars
            }
            _this.particles = _this.particles.filter(function (x) { return !x.dead; });
            for (var _f = 0, _g = _this.particles; _f < _g.length; _f++) {
                var p = _g[_f];
                p.draw();
            }
            // D I T H E R E D     S H A D I N G
            for (var x = _this.roomX - 1; x < _this.roomX + _this.width + 1; x++) {
                for (var y = _this.roomY - 1; y < _this.roomY + _this.height + 1; y++) {
                    if (_this.visibilityArray[x][y] > 0 &&
                        _this.visibilityArray[x][y] < levelConstants_1.LevelConstants.MIN_VISIBILITY) {
                        var frame = Math.round(6 * (_this.visibilityArray[x][y] / levelConstants_1.LevelConstants.MIN_VISIBILITY));
                        game_1.Game.drawFX(frame, 10, 1, 1, x, y, 1, 1);
                    }
                }
            }
        };
        // for stuff rendered on top of the player
        this.drawTopLayer = function () {
            // gui stuff
            // room name
            game_1.Game.ctx.fillStyle = levelConstants_1.LevelConstants.LEVEL_TEXT_COLOR;
            game_1.Game.ctx.fillText(_this.name, gameConstants_1.GameConstants.WIDTH / 2 - game_1.Game.ctx.measureText(_this.name).width / 2, (_this.roomY - 1) * gameConstants_1.GameConstants.TILESIZE - (gameConstants_1.GameConstants.FONT_SIZE - 1));
        };
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        this.type = type;
        this.depth = difficulty;
        this.entered = false;
        this.turn = TurnState.playerTurn;
        this.items = Array();
        this.projectiles = Array();
        this.particles = Array();
        this.doors = Array();
        this.enemies = Array();
        this.levelArray = [];
        for (var x_2 = 0; x_2 < levelConstants_1.LevelConstants.SCREEN_W; x_2++) {
            this.levelArray[x_2] = [];
        }
        this.visibilityArray = [];
        for (var x_3 = 0; x_3 < levelConstants_1.LevelConstants.SCREEN_W; x_3++) {
            this.visibilityArray[x_3] = [];
            for (var y_2 = 0; y_2 < levelConstants_1.LevelConstants.SCREEN_H; y_2++) {
                this.visibilityArray[x_3][y_2] = 0;
            }
        }
        this.roomX = Math.floor(levelConstants_1.LevelConstants.SCREEN_W / 2 - this.width / 2);
        this.roomY = Math.floor(levelConstants_1.LevelConstants.SCREEN_H / 2 - this.height / 2);
        this.upLadder = null;
        switch (this.type) {
            case RoomType.DUNGEON:
                this.generateDungeon();
                break;
            case RoomType.FOUNTAIN:
                this.generateFountain();
                break;
            case RoomType.COFFIN:
                this.generateCoffin();
                break;
            case RoomType.PUZZLE:
                this.generatePuzzle();
                break;
            case RoomType.SPIKECORRIDOR:
                this.generateSpikeCorridor();
                break;
            case RoomType.TREASURE:
                this.generateTreasure();
                break;
            case RoomType.CHESSBOARD:// TODO
                this.generateChessboard();
                break;
            case RoomType.KEYROOM:
                this.generateKeyRoom();
                break;
            case RoomType.GRASS:
                this.generateGrass();
                break;
            case RoomType.UPLADDER:
                this.generateUpLadder();
                break;
            case RoomType.DOWNLADDER:
                this.generateDownLadder();
                break;
        }
        this.name = ""; // + RoomType[this.type];
    }
    Level.prototype.pointInside = function (x, y, rX, rY, rW, rH) {
        if (x < rX || x >= rX + rW)
            return false;
        if (y < rY || y >= rY + rH)
            return false;
        return true;
    };
    Level.prototype.fixWalls = function () {
        for (var x = this.roomX; x < this.roomX + this.width; x++) {
            this.levelArray[x][this.roomY + 1] = new floor_1.Floor(this, x, this.roomY + 1);
            this.levelArray[x][this.roomY + this.height - 1] = new floor_1.Floor(this, x, this.roomY + this.height - 1);
        }
        // fixWalls performs these changes:
        // Wall     Wall
        // Floor -> WallSide
        // Floor    Floor
        // Wall     Wall
        // Wall  -> WallSide
        // Floor    Floor
        // Wall     Wall
        // Floor    Floor
        // Wall  -> Floor
        // Floor    Floor
        // Wall     Wall
        for (var x = 0; x < levelConstants_1.LevelConstants.SCREEN_W; x++) {
            for (var y = 0; y < levelConstants_1.LevelConstants.SCREEN_H; y++) {
                if (this.levelArray[x][y] instanceof wall_1.Wall) {
                    if (this.levelArray[x][y + 1] instanceof floor_1.Floor ||
                        this.levelArray[x][y + 1] instanceof spawnfloor_1.SpawnFloor) {
                        if (this.levelArray[x][y + 2] instanceof floor_1.Floor ||
                            this.levelArray[x][y + 2] instanceof spawnfloor_1.SpawnFloor)
                            this.levelArray[x][y + 1] = new wallSide_1.WallSide(this, x, y + 1);
                        else {
                            if (this.levelArray[x][y - 1] instanceof wall_1.Wall)
                                this.levelArray[x][y] = new wallSide_1.WallSide(this, x, y);
                            else
                                this.levelArray[x][y] = new floor_1.Floor(this, x, y);
                        }
                    }
                }
            }
        }
    };
    Level.prototype.buildEmptyRoom = function () {
        // fill in outside walls
        for (var x = 0; x < levelConstants_1.LevelConstants.SCREEN_W; x++) {
            for (var y = 0; y < levelConstants_1.LevelConstants.SCREEN_H; y++) {
                this.levelArray[x][y] = new wall_1.Wall(this, x, y, 1);
            }
        }
        // put in floors
        for (var x = 0; x < levelConstants_1.LevelConstants.SCREEN_W; x++) {
            for (var y = 0; y < levelConstants_1.LevelConstants.SCREEN_H; y++) {
                if (this.pointInside(x, y, this.roomX, this.roomY, this.width, this.height)) {
                    this.levelArray[x][y] = new floor_1.Floor(this, x, y);
                }
            }
        }
        // outer ring walls
        for (var x = 0; x < levelConstants_1.LevelConstants.SCREEN_W; x++) {
            for (var y = 0; y < levelConstants_1.LevelConstants.SCREEN_H; y++) {
                if (this.pointInside(x, y, this.roomX - 1, this.roomY - 1, this.width + 2, this.height + 2)) {
                    if (!this.pointInside(x, y, this.roomX, this.roomY, this.width, this.height)) {
                        this.levelArray[x][y] = new wall_1.Wall(this, x, y, 0);
                    }
                }
            }
        }
    };
    Level.prototype.addWallBlocks = function () {
        // put some random wall blocks in the room
        var numBlocks = game_1.Game.randTable([0, 1, 1, 2, 2, 2, 2, 3, 3]);
        for (var i = 0; i < numBlocks; i++) {
            var blockW = Math.min(game_1.Game.randTable([2, 2, 2, 2, 2, 2, 3, 3, 3, 4, 5, 6, 7, 9]), this.width - 2);
            var blockH = Math.min(blockW + game_1.Game.rand(-1, 1), this.height - 3);
            var x = game_1.Game.rand(this.roomX + 1, this.roomX + this.width - blockW - 1);
            var y = game_1.Game.rand(this.roomY + 2, this.roomY + this.height - blockH - 2);
            for (var xx = x; xx < x + blockW; xx++) {
                for (var yy = y; yy < y + blockH; yy++) {
                    this.levelArray[xx][yy] = new wall_1.Wall(this, xx, yy, 0);
                }
            }
        }
    };
    Level.prototype.addFingers = function () {
        // add "finger" blocks extending from ring walls inward
        var numFingers = game_1.Game.randTable([0, 1, 1, 2, 2, 3, 4, 5]);
        if (game_1.Game.rand(1, 13) > this.width)
            numFingers += this.width * 0.3;
        for (var i = 0; i < numFingers; i++) {
            var x = 0;
            var y = 0;
            var blockW = 0;
            var blockH = 0;
            if (game_1.Game.rand(0, 1) === 0) {
                // horizontal
                blockW = game_1.Game.rand(1, this.width - 1);
                blockH = 1;
                if (game_1.Game.rand(0, 1) === 0) {
                    // left
                    x = this.roomX;
                    y = game_1.Game.rand(this.roomY + 2, this.roomY + this.height - blockH - 2);
                    for (var xx = x; xx < x + blockW + 1; xx++) {
                        for (var yy = y - 2; yy < y + blockH + 2; yy++) {
                            this.levelArray[xx][yy] = new floor_1.Floor(this, xx, yy);
                        }
                    }
                    for (var xx = x; xx < x + blockW; xx++) {
                        for (var yy = y; yy < y + blockH; yy++) {
                            this.levelArray[xx][yy] = new wall_1.Wall(this, xx, yy, 0);
                        }
                    }
                }
                else {
                    x = this.roomX + this.width - blockW;
                    y = game_1.Game.rand(this.roomY + 2, this.roomY + this.height - blockH - 2);
                    for (var xx = x - 1; xx < x + blockW; xx++) {
                        for (var yy = y - 2; yy < y + blockH + 2; yy++) {
                            this.levelArray[xx][yy] = new floor_1.Floor(this, xx, yy);
                        }
                    }
                    for (var xx = x; xx < x + blockW; xx++) {
                        for (var yy = y; yy < y + blockH; yy++) {
                            this.levelArray[xx][yy] = new wall_1.Wall(this, xx, yy, 0);
                        }
                    }
                }
            }
            else {
                blockW = 1;
                blockH = game_1.Game.rand(1, this.height - 4);
                if (game_1.Game.rand(0, 1) === 0) {
                    // top
                    y = this.roomY + 2;
                    x = game_1.Game.rand(this.roomX + 2, this.roomX + this.width - 3);
                    for (var xx = x - 1; xx < x + blockW + 1; xx++) {
                        for (var yy = y + 1; yy < y + blockH + 2; yy++) {
                            this.levelArray[xx][yy] = new floor_1.Floor(this, xx, yy);
                        }
                    }
                    for (var xx = x; xx < x + blockW; xx++) {
                        for (var yy = y; yy < y + blockH; yy++) {
                            this.levelArray[xx][yy] = new wall_1.Wall(this, xx, yy, 0);
                        }
                    }
                }
                else {
                    y = this.roomY + this.height - blockH - 1;
                    x = game_1.Game.rand(this.roomX + 2, this.roomX + this.width - 3);
                    for (var xx = x - 1; xx < x + blockW + 1; xx++) {
                        for (var yy = y - 2; yy < y + blockH; yy++) {
                            this.levelArray[xx][yy] = new floor_1.Floor(this, xx, yy);
                        }
                    }
                    for (var xx = x; xx < x + blockW; xx++) {
                        for (var yy = y; yy < y + blockH; yy++) {
                            this.levelArray[xx][yy] = new wall_1.Wall(this, xx, yy, 0);
                        }
                    }
                }
            }
        }
    };
    Level.prototype.addChests = function (numChests) {
        // add chests
        var tiles = this.getEmptyTiles();
        for (var i = 0; i < numChests; i++) {
            var t = void 0, x = void 0, y = void 0;
            if (tiles.length == 0)
                return;
            t = tiles.splice(game_1.Game.rand(0, tiles.length - 1), 1)[0];
            x = t.x;
            y = t.y;
            this.enemies.push(new chest_1.Chest(this, this.game, x, y));
        }
    };
    Level.prototype.addSpikeTraps = function (numSpikes) {
        // add spikes
        var tiles = this.getEmptyTiles();
        for (var i = 0; i < numSpikes; i++) {
            var t = tiles.splice(game_1.Game.rand(0, tiles.length - 1), 1)[0];
            if (tiles.length == 0)
                return;
            var x = t.x;
            var y = t.y;
            this.levelArray[x][y] = new spiketrap_1.SpikeTrap(this, x, y);
        }
    };
    Level.prototype.addSpikes = function (numSpikes) {
        // add spikes
        var tiles = this.getEmptyTiles();
        for (var i = 0; i < numSpikes; i++) {
            var t = tiles.splice(game_1.Game.rand(0, tiles.length - 1), 1)[0];
            if (tiles.length == 0)
                return;
            var x = t.x;
            var y = t.y;
            this.levelArray[x][y] = new spike_1.Spike(this, x, y);
        }
    };
    Level.prototype.addEnemies = function (numEnemies) {
        var tiles = this.getEmptyTiles();
        for (var i = 0; i < numEnemies; i++) {
            var t = tiles.splice(game_1.Game.rand(0, tiles.length - 1), 1)[0];
            if (tiles.length == 0)
                return;
            var x = t.x;
            var y = t.y;
            if (this.depth !== 0) {
                switch (game_1.Game.rand(1, this.depth)) {
                    case 1:
                        this.enemies.push(new knightEnemy_1.KnightEnemy(this, this.game, x, y));
                        break;
                    case 2:
                        this.enemies.push(new skullEnemy_1.SkullEnemy(this, this.game, x, y));
                        break;
                    case 3:
                        this.enemies.push(new wizardEnemy_1.WizardEnemy(this, this.game, x, y));
                        break;
                }
            }
        }
    };
    Level.prototype.addObstacles = function (numObstacles) {
        // add crates/barrels
        var tiles = this.getEmptyTiles();
        for (var i = 0; i < numObstacles; i++) {
            var t = tiles.splice(game_1.Game.rand(0, tiles.length - 1), 1)[0];
            if (tiles.length == 0)
                return;
            var x = t.x;
            var y = t.y;
            switch (game_1.Game.rand(1, 2)) {
                case 1:
                    this.enemies.push(new crate_1.Crate(this, this.game, x, y));
                    break;
                case 2:
                    this.enemies.push(new barrel_1.Barrel(this, this.game, x, y));
                    break;
            }
        }
    };
    Level.prototype.addPlants = function (numPlants) {
        var tiles = this.getEmptyTiles();
        for (var i = 0; i < numPlants; i++) {
            var t = tiles.splice(game_1.Game.rand(0, tiles.length - 1), 1)[0];
            if (tiles.length == 0)
                return;
            var x = t.x;
            var y = t.y;
            this.enemies.push(new pottedPlant_1.PottedPlant(this, this.game, x, y));
        }
    };
    return Level;
}());
exports.Level = Level;


/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

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
var game_1 = __webpack_require__(0);
var floor_1 = __webpack_require__(5);
var Bones = (function (_super) {
    __extends(Bones, _super);
    function Bones() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.draw = function () {
            game_1.Game.drawTile(7, _this.skin, 1, 1, _this.x, _this.y, 1, 1, _this.isShaded());
        };
        return _this;
    }
    return Bones;
}(floor_1.Floor));
exports.Bones = Bones;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

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
var game_1 = __webpack_require__(0);
var gameConstants_1 = __webpack_require__(2);
var particle_1 = __webpack_require__(7);
var DeathParticle = (function (_super) {
    __extends(DeathParticle, _super);
    function DeathParticle(x, y) {
        var _this = _super.call(this) || this;
        _this.draw = function () {
            var yOffset = Math.max(0, (_this.frame - 3) * 3 / gameConstants_1.GameConstants.TILESIZE);
            game_1.Game.drawFX(Math.round(_this.frame), 4, 1, 2, _this.x, _this.y - yOffset, 1, 2);
            _this.frame += 0.3;
            if (_this.frame > 10)
                _this.dead = true;
        };
        _this.x = x;
        _this.y = y - 1.5;
        _this.dead = false;
        _this.frame = 0;
        return _this;
    }
    return DeathParticle;
}(particle_1.Particle));
exports.DeathParticle = DeathParticle;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var astar;
(function (astar_1) {
    //================== start graph js
    /*
      graph.js http://github.com/bgrins/javascript-astar
      MIT License
      Creates a Graph class used in the astar search algorithm.
      Includes Binary Heap (with modifications) from Marijn Haverbeke
          URL: http://eloquentjavascript.net/appendix2.html
          License: http://creativecommons.org/licenses/by/3.0/
      */
    var GraphNodeType;
    (function (GraphNodeType) {
        GraphNodeType[GraphNodeType["WALL"] = 0] = "WALL";
        GraphNodeType[GraphNodeType["OPEN"] = 1] = "OPEN";
    })(GraphNodeType = astar_1.GraphNodeType || (astar_1.GraphNodeType = {}));
    var getTileCost = function (tile) {
        return tile.isSolid() ? 99999999 : 1;
    };
    var Graph = (function () {
        function Graph(grid) {
            this.elements = grid;
            var nodes = [];
            var row, rowLength, len = grid.length;
            for (var x = 0; x < len; ++x) {
                row = grid[x];
                rowLength = row.length;
                nodes[x] = new Array(rowLength); // optimum array with size
                for (var y = 0; y < rowLength; ++y) {
                    nodes[x][y] = new GraphNode(x, y, row[y]);
                }
            }
            this.nodes = nodes;
        }
        Graph.prototype.toString = function () {
            var graphString = "\n";
            var nodes = this.nodes;
            var rowDebug, row, y, l;
            for (var x = 0, len = nodes.length; x < len;) {
                rowDebug = "";
                row = nodes[x++];
                for (y = 0, l = row.length; y < l;) {
                    rowDebug += row[y++].type + " ";
                }
                graphString = graphString + rowDebug + "\n";
            }
            return graphString;
        };
        return Graph;
    }());
    astar_1.Graph = Graph;
    var GraphNode = (function () {
        function GraphNode(x, y, type) {
            this.data = {};
            this.x = x;
            this.y = y;
            this.pos = { x: x, y: y };
            this.type = type;
        }
        GraphNode.prototype.toString = function () {
            return "[" + this.x + " " + this.y + "]";
        };
        GraphNode.prototype.isWall = function () {
            return this.type == GraphNodeType.WALL;
        };
        return GraphNode;
    }());
    astar_1.GraphNode = GraphNode;
    var BinaryHeap = (function () {
        function BinaryHeap(scoreFunction) {
            this.content = [];
            this.scoreFunction = scoreFunction;
        }
        BinaryHeap.prototype.push = function (node) {
            // Add the new node to the end of the array.
            this.content.push(node);
            // Allow it to sink down.
            this.sinkDown(this.content.length - 1);
        };
        BinaryHeap.prototype.pop = function () {
            // Store the first node so we can return it later.
            var result = this.content[0];
            // Get the node at the end of the array.
            var end = this.content.pop();
            // If there are any elements left, put the end node at the
            // start, and let it bubble up.
            if (this.content.length > 0) {
                this.content[0] = end;
                this.bubbleUp(0);
            }
            return result;
        };
        BinaryHeap.prototype.remove = function (node) {
            var i = this.content.indexOf(node);
            // When it is found, the process seen in 'pop' is repeated
            // to fill up the hole.
            var end = this.content.pop();
            if (i !== this.content.length - 1) {
                this.content[i] = end;
                if (this.scoreFunction(end) < this.scoreFunction(node))
                    this.sinkDown(i);
                else
                    this.bubbleUp(i);
            }
        };
        BinaryHeap.prototype.size = function () {
            return this.content.length;
        };
        BinaryHeap.prototype.rescoreElement = function (node) {
            this.sinkDown(this.content.indexOf(node));
        };
        BinaryHeap.prototype.sinkDown = function (n) {
            // Fetch the element that has to be sunk.
            var element = this.content[n];
            // When at 0, an element can not sink any further.
            while (n > 0) {
                // Compute the parent element's index, and fetch it.
                var parentN = ((n + 1) >> 1) - 1, parent = this.content[parentN];
                // Swap the elements if the parent is greater.
                if (this.scoreFunction(element) < this.scoreFunction(parent)) {
                    this.content[parentN] = element;
                    this.content[n] = parent;
                    // Update 'n' to continue at the new position.
                    n = parentN;
                }
                else {
                    // Found a parent that is less, no need to sink any further.
                    break;
                }
            }
        };
        BinaryHeap.prototype.bubbleUp = function (n) {
            // Look up the target element and its score.
            var length = this.content.length, element = this.content[n], elemScore = this.scoreFunction(element);
            while (true) {
                // Compute the indices of the child elements.
                var child2N = (n + 1) << 1, child1N = child2N - 1;
                // This is used to store the new position of the element,
                // if any.
                var swap = null;
                // If the first child exists (is inside the array)...
                if (child1N < length) {
                    // Look it up and compute its score.
                    var child1 = this.content[child1N], child1Score = this.scoreFunction(child1);
                    // If the score is less than our element's, we need to swap.
                    if (child1Score < elemScore)
                        swap = child1N;
                }
                // Do the same checks for the other child.
                if (child2N < length) {
                    var child2 = this.content[child2N], child2Score = this.scoreFunction(child2);
                    if (child2Score < (swap === null ? elemScore : child1Score))
                        swap = child2N;
                }
                // If the element needs to be moved, swap it, and continue.
                if (swap !== null) {
                    this.content[n] = this.content[swap];
                    this.content[swap] = element;
                    n = swap;
                }
                else {
                    // Otherwise, we are done.
                    break;
                }
            }
        };
        return BinaryHeap;
    }());
    astar_1.BinaryHeap = BinaryHeap;
    var AStar = (function () {
        function AStar(grid, disablePoints, enableCost) {
            this.grid = [];
            for (var x = 0, xl = grid.length; x < xl; x++) {
                this.grid[x] = [];
                for (var y = 0, yl = grid[x].length; y < yl; y++) {
                    var cost = getTileCost(grid[x][y]);
                    this.grid[x][y] = {
                        org: grid[x][y],
                        f: 0,
                        g: 0,
                        h: 0,
                        cost: cost,
                        visited: false,
                        closed: false,
                        pos: {
                            x: x,
                            y: y,
                        },
                        parent: null,
                    };
                }
            }
            if (disablePoints !== undefined) {
                for (var i = 0; i < disablePoints.length; i++)
                    this.grid[disablePoints[i].x][disablePoints[i].y].cost = 99999999;
            }
        }
        AStar.prototype.heap = function () {
            return new BinaryHeap(function (node) {
                return node.f;
            });
        };
        AStar.prototype._find = function (org) {
            for (var x = 0; x < this.grid.length; x++)
                for (var y = 0; y < this.grid[x].length; y++)
                    if (this.grid[x][y].org == org)
                        return this.grid[x][y];
        };
        AStar.prototype._search = function (start, end, diagonal, heuristic) {
            heuristic = heuristic || this.manhattan;
            diagonal = !!diagonal;
            var openHeap = this.heap();
            var _start, _end;
            if (start.x !== undefined && start.y !== undefined)
                _start = this.grid[start.x][start.y];
            else
                _start = this._find(start);
            if (end.x !== undefined && end.y !== undefined)
                _end = this.grid[end.x][end.y];
            else
                _end = this._find(end);
            if (AStar.NO_CHECK_START_POINT == false && _start.cost <= 0)
                return [];
            openHeap.push(_start);
            while (openHeap.size() > 0) {
                // Grab the lowest f(x) to process next.  Heap keeps this sorted for us.
                var currentNode = openHeap.pop();
                // End case -- result has been found, return the traced path.
                if (currentNode === _end) {
                    var curr = currentNode;
                    var ret = [];
                    while (curr.parent) {
                        ret.push(curr);
                        curr = curr.parent;
                    }
                    return ret.reverse();
                }
                // Normal case -- move currentNode from open to closed, process each of its neighbors.
                currentNode.closed = true;
                // Find all neighbors for the current node. Optionally find diagonal neighbors as well (false by default).
                var neighbors = this.neighbors(currentNode, diagonal);
                for (var i = 0, il = neighbors.length; i < il; i++) {
                    var neighbor = neighbors[i];
                    if (neighbor.closed || neighbor.cost <= 0) {
                        // Not a valid node to process, skip to next neighbor.
                        continue;
                    }
                    // The g score is the shortest distance from start to current node.
                    // We need to check if the path we have arrived at this neighbor is the shortest one we have seen yet.
                    var gScore = currentNode.g + neighbor.cost;
                    var beenVisited = neighbor.visited;
                    if (!beenVisited || gScore < neighbor.g) {
                        // Found an optimal (so far) path to this node.  Take score for node to see how good it is.
                        neighbor.visited = true;
                        neighbor.parent = currentNode;
                        neighbor.h = neighbor.h || heuristic(neighbor.pos, _end.pos);
                        neighbor.g = gScore;
                        neighbor.f = neighbor.g + neighbor.h;
                        if (!beenVisited) {
                            // Pushing to heap will put it in proper place based on the 'f' value.
                            openHeap.push(neighbor);
                        }
                        else {
                            // Already seen the node, but since it has been rescored we need to reorder it in the heap
                            openHeap.rescoreElement(neighbor);
                        }
                    }
                }
            }
            // No result was found - empty array signifies failure to find path.
            return [];
        };
        AStar.search = function (grid, start, end, disablePoints, diagonal, heuristic) {
            var astar = new AStar(grid, disablePoints);
            return astar._search(start, end, diagonal, heuristic);
        };
        AStar.prototype.manhattan = function (pos0, pos1) {
            // See list of heuristics: http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html
            var d1 = Math.abs(pos1.x - pos0.x);
            var d2 = Math.abs(pos1.y - pos0.y);
            return d1 + d2;
        };
        AStar.prototype.neighbors = function (node, diagonals) {
            var grid = this.grid;
            var ret = [];
            var x = node.pos.x;
            var y = node.pos.y;
            // West
            if (grid[x - 1] && grid[x - 1][y]) {
                ret.push(grid[x - 1][y]);
            }
            // East
            if (grid[x + 1] && grid[x + 1][y]) {
                ret.push(grid[x + 1][y]);
            }
            // South
            if (grid[x] && grid[x][y - 1]) {
                ret.push(grid[x][y - 1]);
            }
            // North
            if (grid[x] && grid[x][y + 1]) {
                ret.push(grid[x][y + 1]);
            }
            if (diagonals) {
                // Southwest
                if (grid[x - 1] && grid[x - 1][y - 1]) {
                    ret.push(grid[x - 1][y - 1]);
                }
                // Southeast
                if (grid[x + 1] && grid[x + 1][y - 1]) {
                    ret.push(grid[x + 1][y - 1]);
                }
                // Northwest
                if (grid[x - 1] && grid[x - 1][y + 1]) {
                    ret.push(grid[x - 1][y + 1]);
                }
                // Northeast
                if (grid[x + 1] && grid[x + 1][y + 1]) {
                    ret.push(grid[x + 1][y + 1]);
                }
            }
            return ret;
        };
        AStar.NO_CHECK_START_POINT = false;
        return AStar;
    }());
    astar_1.AStar = AStar;
})(astar = exports.astar || (exports.astar = {}));


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Projectile = (function () {
    function Projectile(x, y) {
        this.hitPlayer = function (player) { };
        this.hitEnemy = function (enemy) { };
        this.tick = function () { };
        this.draw = function () { };
        this.x = x;
        this.y = y;
        this.dead = false;
    }
    return Projectile;
}());
exports.Projectile = Projectile;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

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
var enemy_1 = __webpack_require__(4);
var game_1 = __webpack_require__(0);
var genericParticle_1 = __webpack_require__(53);
var Crate = (function (_super) {
    __extends(Crate, _super);
    function Crate(level, game, x, y) {
        var _this = _super.call(this, level, game, x, y) || this;
        _this.kill = function () {
            _this.dead = true;
            genericParticle_1.GenericParticle.spawnCluster(_this.level, _this.x + 0.5, _this.y + 0.5, "#d9a066");
        };
        _this.draw = function () {
            // not inherited because it doesn't have the 0.5 offset
            if (!_this.dead) {
                _this.drawX += -0.5 * _this.drawX;
                _this.drawY += -0.5 * _this.drawY;
                game_1.Game.drawObj(_this.tileX, _this.tileY, 1, 2, _this.x - _this.drawX, _this.y - 1 - _this.drawY, 1, 2, _this.isShaded());
            }
        };
        _this.level = level;
        _this.health = 1;
        _this.tileX = 0;
        _this.tileY = 0;
        _this.hasShadow = false;
        _this.pushable = true;
        return _this;
    }
    return Crate;
}(enemy_1.Enemy));
exports.Crate = Crate;


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

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
var enemy_1 = __webpack_require__(4);
var game_1 = __webpack_require__(0);
var genericParticle_1 = __webpack_require__(53);
var Barrel = (function (_super) {
    __extends(Barrel, _super);
    function Barrel(level, game, x, y) {
        var _this = _super.call(this, level, game, x, y) || this;
        _this.kill = function () {
            _this.dead = true;
            genericParticle_1.GenericParticle.spawnCluster(_this.level, _this.x + 0.5, _this.y + 0.5, "#9badb7");
        };
        _this.draw = function () {
            // not inherited because it doesn't have the 0.5 offset
            if (!_this.dead) {
                _this.drawX += -0.5 * _this.drawX;
                _this.drawY += -0.5 * _this.drawY;
                game_1.Game.drawObj(_this.tileX, _this.tileY, 1, 2, _this.x - _this.drawX, _this.y - 1 - _this.drawY, 1, 2, _this.isShaded());
            }
        };
        _this.level = level;
        _this.health = 1;
        _this.tileX = 1;
        _this.tileY = 0;
        _this.hasShadow = false;
        _this.pushable = true;
        return _this;
    }
    return Barrel;
}(enemy_1.Enemy));
exports.Barrel = Barrel;


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

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
var game_1 = __webpack_require__(0);
var key_1 = __webpack_require__(25);
var heart_1 = __webpack_require__(30);
var armor_1 = __webpack_require__(26);
var enemy_1 = __webpack_require__(4);
var gem_1 = __webpack_require__(8);
var genericParticle_1 = __webpack_require__(53);
var Chest = (function (_super) {
    __extends(Chest, _super);
    function Chest(level, game, x, y) {
        var _this = _super.call(this, level, game, x, y) || this;
        _this.kill = function () {
            _this.dead = true;
            // DROP TABLES!
            genericParticle_1.GenericParticle.spawnCluster(_this.level, _this.x + 0.5, _this.y + 0.5, "#fbf236");
            var drop = game_1.Game.randTable([1, 2, 2, 2, 3, 4, 4, 4, 4, 4]);
            switch (drop) {
                case 1:
                    _this.game.level.items.push(new gem_1.Gem(_this.level, _this.x, _this.y));
                    break;
                case 2:
                    _this.game.level.items.push(new heart_1.Heart(_this.level, _this.x, _this.y));
                    break;
                case 3:
                    _this.game.level.items.push(new key_1.Key(_this.level, _this.x, _this.y));
                    break;
                case 4:
                    _this.game.level.items.push(new armor_1.Armor(_this.level, _this.x, _this.y));
                    break;
            }
        };
        _this.draw = function () {
            if (!_this.dead) {
                game_1.Game.drawObj(_this.tileX, _this.tileY, 1, 2, _this.x - _this.drawX, _this.y - 1 - _this.drawY, 1, 2, _this.isShaded());
            }
        };
        _this.tileX = 4;
        _this.tileY = 0;
        _this.health = 1;
        return _this;
    }
    return Chest;
}(enemy_1.Enemy));
exports.Chest = Chest;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

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
var equippable_1 = __webpack_require__(9);
var Key = (function (_super) {
    __extends(Key, _super);
    function Key(level, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.getDescription = function () {
            return "KEY\nAn iron key.";
        };
        _this.tileX = 1;
        _this.tileY = 0;
        return _this;
    }
    return Key;
}(equippable_1.Equippable));
exports.Key = Key;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

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
var game_1 = __webpack_require__(0);
var levelConstants_1 = __webpack_require__(3);
var textParticle_1 = __webpack_require__(13);
var gameConstants_1 = __webpack_require__(2);
var equippable_1 = __webpack_require__(9);
var Armor = (function (_super) {
    __extends(Armor, _super);
    function Armor(level, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.RECHARGE_TURNS = 15;
        _this.coEquippable = function (other) {
            if (other instanceof Armor)
                return false;
            return true;
        };
        _this.getDescription = function () {
            return ("ENCHANTED ARMOR\nA magic suit of armor. Absorbs one hit and regenerates after " +
                _this.RECHARGE_TURNS +
                " turns.");
        };
        _this.tickInInventory = function () {
            if (_this.rechargeTurnCounter > 0) {
                _this.rechargeTurnCounter--;
                if (_this.rechargeTurnCounter === 0) {
                    _this.rechargeTurnCounter = -1;
                    _this.health = 1;
                }
            }
        };
        _this.hurt = function (damage) {
            if (_this.health <= 0)
                return;
            _this.health -= damage;
            _this.rechargeTurnCounter = _this.RECHARGE_TURNS + 1;
            _this.level.game.level.particles.push(new textParticle_1.TextParticle("" + -damage, _this.level.game.player.x + 0.5, _this.level.game.player.y + 0.5, gameConstants_1.GameConstants.ARMOR_GREY));
        };
        _this.drawGUI = function (playerHealth) {
            if (_this.rechargeTurnCounter === -1)
                game_1.Game.drawItem(5, 0, 1, 2, playerHealth, levelConstants_1.LevelConstants.SCREEN_H - 2, 1, 2);
            else {
                var rechargeProportion = 1 - _this.rechargeTurnCounter / _this.RECHARGE_TURNS;
                if (rechargeProportion < 0.33) {
                    game_1.Game.drawItem(2, 0, 1, 2, playerHealth, levelConstants_1.LevelConstants.SCREEN_H - 2, 1, 2);
                }
                else if (rechargeProportion < 0.67) {
                    game_1.Game.drawItem(3, 0, 1, 2, playerHealth, levelConstants_1.LevelConstants.SCREEN_H - 2, 1, 2);
                }
                else {
                    game_1.Game.drawItem(4, 0, 1, 2, playerHealth, levelConstants_1.LevelConstants.SCREEN_H - 2, 1, 2);
                }
            }
        };
        _this.health = 1;
        _this.rechargeTurnCounter = -1;
        _this.tileX = 5;
        _this.tileY = 0;
        return _this;
    }
    return Armor;
}(equippable_1.Equippable));
exports.Armor = Armor;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

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
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var Wall = (function (_super) {
    __extends(Wall, _super);
    function Wall(level, x, y, type) {
        var _this = _super.call(this, level, x, y) || this;
        _this.isSolid = function () {
            return true;
        };
        _this.isOpaque = function () {
            return true;
        };
        _this.draw = function () {
            if (_this.type === 0) {
                game_1.Game.drawTile(2, _this.skin, 1, 1, _this.x, _this.y, 1, 1, _this.isShaded());
            }
            else if (_this.type === 1) {
                game_1.Game.drawTile(5, _this.skin, 1, 1, _this.x, _this.y, 1, 1, _this.isShaded());
            }
        };
        _this.type = type;
        return _this;
    }
    return Wall;
}(tile_1.Tile));
exports.Wall = Wall;


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

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
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var WallSide = (function (_super) {
    __extends(WallSide, _super);
    function WallSide() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isSolid = function () {
            return true;
        };
        _this.isOpaque = function () {
            return true;
        };
        _this.draw = function () {
            game_1.Game.drawTile(0, _this.skin, 1, 1, _this.x, _this.y, 1, 1, _this.isShaded());
        };
        return _this;
    }
    return WallSide;
}(tile_1.Tile));
exports.WallSide = WallSide;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

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
var enemy_1 = __webpack_require__(4);
var game_1 = __webpack_require__(0);
var astarclass_1 = __webpack_require__(20);
var hitWarning_1 = __webpack_require__(11);
var gem_1 = __webpack_require__(8);
var spiketrap_1 = __webpack_require__(14);
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
                if (_this.seenPlayer || _this.level.visibilityArray[_this.x][_this.y] > 0) {
                    if (_this.ticks % 2 === 0) {
                        _this.tileX = 4;
                        // visible to player, chase them
                        // now that we've seen the player, we can keep chasing them even if we lose line of sight
                        _this.seenPlayer = true;
                        var oldX = _this.x;
                        var oldY = _this.y;
                        var disablePositions = Array();
                        for (var _i = 0, _a = _this.level.enemies; _i < _a.length; _i++) {
                            var e = _a[_i];
                            if (e !== _this) {
                                disablePositions.push({ x: e.x, y: e.y });
                            }
                        }
                        for (var xx = _this.x - 1; xx <= _this.x + 1; xx++) {
                            for (var yy = _this.y - 1; yy <= _this.y + 1; yy++) {
                                if (_this.level.levelArray[xx][yy] instanceof spiketrap_1.SpikeTrap &&
                                    _this.level.levelArray[xx][yy].on) {
                                    // don't walk on active spiketraps
                                    disablePositions.push({ x: xx, y: yy });
                                }
                            }
                        }
                        _this.moves = astarclass_1.astar.AStar.search(_this.level.levelArray, _this, _this.game.player, disablePositions);
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
                        if (_this.x > oldX)
                            _this.direction = enemy_1.EnemyDirection.RIGHT;
                        else if (_this.x < oldX)
                            _this.direction = enemy_1.EnemyDirection.LEFT;
                        else if (_this.y > oldY)
                            _this.direction = enemy_1.EnemyDirection.DOWN;
                        else if (_this.y < oldY)
                            _this.direction = enemy_1.EnemyDirection.UP;
                    }
                    else {
                        _this.level.projectiles.push(new hitWarning_1.HitWarning(_this.x - 1, _this.y));
                        _this.level.projectiles.push(new hitWarning_1.HitWarning(_this.x + 1, _this.y));
                        _this.level.projectiles.push(new hitWarning_1.HitWarning(_this.x, _this.y - 1));
                        _this.level.projectiles.push(new hitWarning_1.HitWarning(_this.x, _this.y + 1));
                    }
                }
            }
        };
        _this.draw = function () {
            if (!_this.dead) {
                _this.drawX += -0.5 * _this.drawX;
                _this.drawY += -0.5 * _this.drawY;
                if (_this.doneMoving() && _this.game.player.doneMoving())
                    _this.facePlayer();
                if (_this.hasShadow)
                    game_1.Game.drawMob(0, 0, 1, 1, _this.x - _this.drawX, _this.y - _this.drawY, 1, 1, _this.isShaded());
                game_1.Game.drawMob(_this.tileX, _this.tileY + _this.direction * 2, 1, 2, _this.x - _this.drawX, _this.y - 1.5 - _this.drawY, 1, 2, _this.isShaded());
            }
        };
        _this.dropLoot = function () {
            _this.game.level.items.push(new gem_1.Gem(_this.level, _this.x, _this.y));
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


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

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
var item_1 = __webpack_require__(12);
var sound_1 = __webpack_require__(15);
var Heart = (function (_super) {
    __extends(Heart, _super);
    function Heart(level, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.onPickup = function (player) {
            player.health += 1;
            sound_1.Sound.heal();
            _this.level.items = _this.level.items.filter(function (x) { return x !== _this; }); // removes itself from the level
        };
        _this.tileX = 8;
        _this.tileY = 0;
        return _this;
    }
    return Heart;
}(item_1.Item));
exports.Heart = Heart;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

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
var equippable_1 = __webpack_require__(9);
var GoldenKey = (function (_super) {
    __extends(GoldenKey, _super);
    function GoldenKey(level, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.getDescription = function () {
            return "GOLD KEY\nA heavy gold key.";
        };
        _this.tileX = 6;
        _this.tileY = 0;
        return _this;
    }
    return GoldenKey;
}(equippable_1.Equippable));
exports.GoldenKey = GoldenKey;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

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
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var SpawnFloor = (function (_super) {
    __extends(SpawnFloor, _super);
    function SpawnFloor(level, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.draw = function () {
            game_1.Game.drawTile(_this.variation, _this.skin, 1, 1, _this.x, _this.y, _this.w, _this.h, _this.isShaded());
        };
        _this.w = 1;
        _this.h = 1;
        _this.variation = 1;
        if (game_1.Game.rand(1, 20) == 1)
            _this.variation = game_1.Game.randTable([8, 9, 10, 12]);
        return _this;
    }
    return SpawnFloor;
}(tile_1.Tile));
exports.SpawnFloor = SpawnFloor;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

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
var enemy_1 = __webpack_require__(4);
var game_1 = __webpack_require__(0);
var floor_1 = __webpack_require__(5);
var bones_1 = __webpack_require__(18);
var deathParticle_1 = __webpack_require__(19);
var wizardTeleportParticle_1 = __webpack_require__(34);
var wizardFireball_1 = __webpack_require__(35);
var gem_1 = __webpack_require__(8);
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
                        if (!_this.level.levelArray[_this.x - 1][_this.y].isSolid()) {
                            _this.level.projectiles.push(new wizardFireball_1.WizardFireball(_this, _this.x - 1, _this.y));
                            if (!_this.level.levelArray[_this.x - 2][_this.y].isSolid()) {
                                _this.level.projectiles.push(new wizardFireball_1.WizardFireball(_this, _this.x - 2, _this.y));
                            }
                        }
                        if (!_this.level.levelArray[_this.x + 1][_this.y].isSolid()) {
                            _this.level.projectiles.push(new wizardFireball_1.WizardFireball(_this, _this.x + 1, _this.y));
                            if (!_this.level.levelArray[_this.x + 2][_this.y].isSolid()) {
                                _this.level.projectiles.push(new wizardFireball_1.WizardFireball(_this, _this.x + 2, _this.y));
                            }
                        }
                        if (!_this.level.levelArray[_this.x][_this.y - 1].isSolid()) {
                            _this.level.projectiles.push(new wizardFireball_1.WizardFireball(_this, _this.x, _this.y - 1));
                            if (!_this.level.levelArray[_this.x][_this.y - 2].isSolid()) {
                                _this.level.projectiles.push(new wizardFireball_1.WizardFireball(_this, _this.x, _this.y - 2));
                            }
                        }
                        if (!_this.level.levelArray[_this.x][_this.y + 1].isSolid()) {
                            _this.level.projectiles.push(new wizardFireball_1.WizardFireball(_this, _this.x, _this.y + 1));
                            if (!_this.level.levelArray[_this.x][_this.y + 2].isSolid()) {
                                _this.level.projectiles.push(new wizardFireball_1.WizardFireball(_this, _this.x, _this.y + 2));
                            }
                        }
                        _this.state = WizardState.justAttacked;
                        break;
                    case WizardState.justAttacked:
                        _this.tileX = 6;
                        _this.state = WizardState.idle;
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
                _this.drawX += -0.5 * _this.drawX;
                _this.drawY += -0.5 * _this.drawY;
                if (_this.hasShadow)
                    game_1.Game.drawMob(0, 0, 1, 1, _this.x - _this.drawX, _this.y - _this.drawY, 1, 1, _this.isShaded());
                if (_this.frame >= 0) {
                    game_1.Game.drawMob(Math.floor(_this.frame) + 6, 2, 1, 2, _this.x, _this.y - 1.5, 1, 2, _this.isShaded());
                    _this.frame += 0.4;
                    if (_this.frame > 11)
                        _this.frame = -1;
                }
                else {
                    game_1.Game.drawMob(_this.tileX, _this.tileY, 1, 2, _this.x - _this.drawX, _this.y - 1.5 - _this.drawY, 1, 2, _this.isShaded());
                }
            }
        };
        _this.kill = function () {
            if (_this.level.levelArray[_this.x][_this.y] instanceof floor_1.Floor) {
                var b = new bones_1.Bones(_this.level, _this.x, _this.y);
                b.skin = _this.level.levelArray[_this.x][_this.y].skin;
                _this.level.levelArray[_this.x][_this.y] = b;
            }
            _this.dead = true;
            _this.level.particles.push(new deathParticle_1.DeathParticle(_this.x, _this.y));
            _this.dropLoot();
        };
        _this.dropLoot = function () {
            _this.game.level.items.push(new gem_1.Gem(_this.level, _this.x, _this.y));
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


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

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
var particle_1 = __webpack_require__(7);
var game_1 = __webpack_require__(0);
var WizardTeleportParticle = (function (_super) {
    __extends(WizardTeleportParticle, _super);
    function WizardTeleportParticle(x, y) {
        var _this = _super.call(this) || this;
        _this.draw = function () {
            game_1.Game.drawFX(Math.floor(_this.frame), 3, 1, 1, _this.x, _this.y - _this.z, 1, 1);
            _this.z += _this.dz;
            _this.dz *= 0.9;
            _this.frame += 0.25;
            if (_this.frame > 6)
                _this.dead = true;
        };
        _this.x = x;
        _this.y = y;
        _this.dead = false;
        _this.frame = 0;
        _this.z = 0;
        _this.dz = 0.1;
        return _this;
    }
    return WizardTeleportParticle;
}(particle_1.Particle));
exports.WizardTeleportParticle = WizardTeleportParticle;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

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
var projectile_1 = __webpack_require__(21);
var game_1 = __webpack_require__(0);
var WizardFireball = (function (_super) {
    __extends(WizardFireball, _super);
    function WizardFireball(parent, x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.tick = function () {
            if (_this.parent.dead)
                _this.dead = true;
            _this.state++;
            if (_this.state === 2) {
                _this.frame = 0;
                _this.delay = game_1.Game.rand(0, 10);
            }
        };
        _this.hitPlayer = function (player) {
            if (_this.state === 2 && !_this.dead) {
                player.hurt(1);
            }
        };
        _this.draw = function () {
            if (_this.state === 0) {
                _this.frame += 0.25;
                if (_this.frame >= 4)
                    _this.frame = 0;
                game_1.Game.drawFX(22 + Math.floor(_this.frame), 7, 1, 1, _this.x, _this.y, 1, 1);
            }
            else if (_this.state === 1) {
                _this.frame += 0.25;
                if (_this.frame >= 4)
                    _this.frame = 0;
                game_1.Game.drawFX(18 + Math.floor(_this.frame), 7, 1, 1, _this.x, _this.y, 1, 1);
            }
            else {
                if (_this.delay > 0) {
                    _this.delay--;
                    return;
                }
                _this.frame += 0.3;
                if (_this.frame > 17)
                    _this.dead = true;
                game_1.Game.drawFX(Math.floor(_this.frame), 6, 1, 2, _this.x, _this.y - 1, 1, 2);
            }
        };
        _this.parent = parent;
        _this.state = 0;
        _this.frame = 0;
        return _this;
    }
    return WizardFireball;
}(projectile_1.Projectile));
exports.WizardFireball = WizardFireball;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

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
var enemy_1 = __webpack_require__(4);
var game_1 = __webpack_require__(0);
var astarclass_1 = __webpack_require__(20);
var hitWarning_1 = __webpack_require__(11);
var gem_1 = __webpack_require__(8);
var spiketrap_1 = __webpack_require__(14);
var SkullEnemy = (function (_super) {
    __extends(SkullEnemy, _super);
    function SkullEnemy(level, game, x, y) {
        var _this = _super.call(this, level, game, x, y) || this;
        _this.REGEN_TICKS = 5;
        _this.hit = function () {
            return 1;
        };
        _this.hurt = function (damage) {
            _this.ticksSinceFirstHit = 0;
            _this.health -= damage;
            if (_this.health <= 0) {
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
                        var disablePositions = new Array();
                        for (var _i = 0, _a = _this.level.enemies; _i < _a.length; _i++) {
                            var e = _a[_i];
                            if (e !== _this) {
                                disablePositions.push({ x: e.x, y: e.y });
                            }
                        }
                        for (var xx = _this.x - 1; xx <= _this.x + 1; xx++) {
                            for (var yy = _this.y - 1; yy <= _this.y + 1; yy++) {
                                if (_this.level.levelArray[xx][yy] instanceof spiketrap_1.SpikeTrap &&
                                    _this.level.levelArray[xx][yy].on) {
                                    // don't walk on active spiketraps
                                    disablePositions.push({ x: xx, y: yy });
                                }
                            }
                        }
                        _this.moves = astarclass_1.astar.AStar.search(_this.level.levelArray, _this, _this.game.player, disablePositions);
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
                        if (_this.x > oldX)
                            _this.direction = enemy_1.EnemyDirection.RIGHT;
                        else if (_this.x < oldX)
                            _this.direction = enemy_1.EnemyDirection.LEFT;
                        else if (_this.y > oldY)
                            _this.direction = enemy_1.EnemyDirection.DOWN;
                        else if (_this.y < oldY)
                            _this.direction = enemy_1.EnemyDirection.UP;
                        _this.level.projectiles.push(new hitWarning_1.HitWarning(_this.x - 1, _this.y));
                        _this.level.projectiles.push(new hitWarning_1.HitWarning(_this.x + 1, _this.y));
                        _this.level.projectiles.push(new hitWarning_1.HitWarning(_this.x, _this.y - 1));
                        _this.level.projectiles.push(new hitWarning_1.HitWarning(_this.x, _this.y + 1));
                    }
                }
            }
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
                _this.drawX += -0.5 * _this.drawX;
                _this.drawY += -0.5 * _this.drawY;
                if (_this.health === 2 && _this.doneMoving() && _this.game.player.doneMoving())
                    _this.facePlayer();
                if (_this.hasShadow)
                    game_1.Game.drawMob(0, 0, 1, 1, _this.x - _this.drawX, _this.y - _this.drawY, 1, 1, _this.isShaded());
                game_1.Game.drawMob(_this.tileX, _this.tileY + _this.direction * 2, 1, 2, _this.x - _this.drawX, _this.y - 1.5 - _this.drawY, 1, 2, _this.isShaded());
            }
        };
        _this.dropLoot = function () {
            _this.game.level.items.push(new gem_1.Gem(_this.level, _this.x, _this.y));
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


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

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
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var FountainTile = (function (_super) {
    __extends(FountainTile, _super);
    function FountainTile(level, x, y, subTileX, subTileY) {
        var _this = _super.call(this, level, x, y) || this;
        _this.isSolid = function () {
            return true;
        };
        _this.draw = function () {
            game_1.Game.drawTile(1, _this.skin, 1, 1, _this.x, _this.y, 1, 1, _this.isShaded());
            game_1.Game.drawTile(_this.subTileX, 2 + _this.subTileY, 1, 1, _this.x, _this.y, 1, 1, _this.isShaded());
        };
        _this.subTileX = subTileX;
        _this.subTileY = subTileY;
        return _this;
    }
    return FountainTile;
}(tile_1.Tile));
exports.FountainTile = FountainTile;


/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

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
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var CoffinTile = (function (_super) {
    __extends(CoffinTile, _super);
    function CoffinTile(level, x, y, subTileY) {
        var _this = _super.call(this, level, x, y) || this;
        _this.isSolid = function () {
            return true;
        };
        _this.drawUnderPlayer = function () {
            if (_this.subTileY === 0) {
                game_1.Game.drawTile(0, 5, 1, 1, _this.x - 1, _this.y - 1, 1, 1, _this.isShaded());
                game_1.Game.drawTile(1, 5, 1, 1, _this.x, _this.y - 1, 1, 1, _this.isShaded());
                game_1.Game.drawTile(2, 5, 1, 1, _this.x + 1, _this.y - 1, 1, 1, _this.isShaded());
                game_1.Game.drawTile(0, 6, 1, 1, _this.x - 1, _this.y, 1, 1, _this.isShaded());
                game_1.Game.drawTile(1, 6, 1, 1, _this.x, _this.y, 1, 1, _this.isShaded());
                game_1.Game.drawTile(2, 6, 1, 1, _this.x + 1, _this.y, 1, 1, _this.isShaded());
            }
            else {
                game_1.Game.drawTile(0, 7, 1, 1, _this.x - 1, _this.y, 1, 1, _this.isShaded());
                game_1.Game.drawTile(1, 7, 1, 1, _this.x, _this.y, 1, 1, _this.isShaded());
                game_1.Game.drawTile(2, 7, 1, 1, _this.x + 1, _this.y, 1, 1, _this.isShaded());
            }
        };
        _this.subTileY = subTileY;
        return _this;
    }
    return CoffinTile;
}(tile_1.Tile));
exports.CoffinTile = CoffinTile;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

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
var enemy_1 = __webpack_require__(4);
var game_1 = __webpack_require__(0);
var genericParticle_1 = __webpack_require__(53);
var PottedPlant = (function (_super) {
    __extends(PottedPlant, _super);
    function PottedPlant(level, game, x, y) {
        var _this = _super.call(this, level, game, x, y) || this;
        _this.kill = function () {
            _this.dead = true;
            genericParticle_1.GenericParticle.spawnCluster(_this.level, _this.x + 0.5, _this.y + 0.5, "#ce736a");
        };
        _this.draw = function () {
            // not inherited because it doesn't have the 0.5 offset
            if (!_this.dead) {
                _this.drawX += -0.5 * _this.drawX;
                _this.drawY += -0.5 * _this.drawY;
                game_1.Game.drawObj(_this.tileX, _this.tileY, 1, 2, _this.x - _this.drawX, _this.y - 1 - _this.drawY, 1, 2, _this.isShaded());
            }
        };
        _this.level = level;
        _this.health = 1;
        _this.tileX = 3;
        _this.tileY = 0;
        _this.hasShadow = false;
        return _this;
    }
    return PottedPlant;
}(enemy_1.Enemy));
exports.PottedPlant = PottedPlant;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

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
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var InsideLevelDoor = (function (_super) {
    __extends(InsideLevelDoor, _super);
    function InsideLevelDoor(level, game, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.isSolid = function () {
            return !_this.opened;
        };
        _this.isOpaque = function () {
            return !_this.opened;
        };
        _this.draw = function () {
            game_1.Game.drawTile(1, 0, 1, 1, _this.x, _this.y, 1, 1, _this.isShaded());
            if (_this.opened)
                game_1.Game.drawTile(15, 1, 1, 1, _this.x, _this.y, 1, 1, _this.isShaded());
            else
                game_1.Game.drawTile(3, _this.skin, 1, 1, _this.x, _this.y, 1, 1, _this.isShaded());
        };
        _this.drawAbovePlayer = function () {
            if (!_this.opened)
                game_1.Game.drawTile(13, 0, 1, 1, _this.x, _this.y - 1, 1, 1, _this.isShaded());
            else
                game_1.Game.drawTile(14, 0, 1, 1, _this.x, _this.y - 1, 1, 1, _this.isShaded());
        };
        _this.game = game;
        _this.opened = false;
        return _this;
    }
    return InsideLevelDoor;
}(tile_1.Tile));
exports.InsideLevelDoor = InsideLevelDoor;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

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
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var Button = (function (_super) {
    __extends(Button, _super);
    function Button(level, x, y, linkedDoor) {
        var _this = _super.call(this, level, x, y) || this;
        _this.press = function () {
            _this.pressed = true;
            _this.linkedDoor.opened = true;
        };
        _this.unpress = function () {
            _this.pressed = false;
            _this.linkedDoor.opened = false;
        };
        /*onCollide = (player: Player) => {
          this.press();
        };
      
        onCollideEnemy = (enemy: Enemy) => {
          this.press();
        };*/
        _this.tickEnd = function () {
            _this.unpress();
            if (_this.level.game.player.x === _this.x && _this.level.game.player.y === _this.y)
                _this.press();
            for (var _i = 0, _a = _this.level.enemies; _i < _a.length; _i++) {
                var e = _a[_i];
                if (e.x === _this.x && e.y === _this.y)
                    _this.press();
            }
        };
        _this.draw = function () {
            game_1.Game.drawTile(1, 0, 1, 1, _this.x, _this.y, 1, 1, _this.isShaded());
            if (_this.pressed)
                game_1.Game.drawTile(18, 0, 1, 1, _this.x, _this.y, _this.w, _this.h, _this.isShaded());
            else
                game_1.Game.drawTile(17, 0, 1, 1, _this.x, _this.y, _this.w, _this.h, _this.isShaded());
        };
        _this.w = 1;
        _this.h = 1;
        _this.pressed = false;
        _this.turnsSincePressed = 1;
        _this.linkedDoor = linkedDoor;
        return _this;
    }
    return Button;
}(tile_1.Tile));
exports.Button = Button;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var input_1 = __webpack_require__(16);
var gameConstants_1 = __webpack_require__(2);
var game_1 = __webpack_require__(0);
var door_1 = __webpack_require__(10);
var bottomDoor_1 = __webpack_require__(6);
var trapdoor_1 = __webpack_require__(50);
var inventory_1 = __webpack_require__(43);
var lockedDoor_1 = __webpack_require__(44);
var sound_1 = __webpack_require__(15);
var textParticle_1 = __webpack_require__(13);
var dashParticle_1 = __webpack_require__(45);
var levelConstants_1 = __webpack_require__(3);
var stats_1 = __webpack_require__(46);
var chest_1 = __webpack_require__(24);
var map_1 = __webpack_require__(48);
var PlayerDirection;
(function (PlayerDirection) {
    PlayerDirection[PlayerDirection["DOWN"] = 0] = "DOWN";
    PlayerDirection[PlayerDirection["UP"] = 1] = "UP";
    PlayerDirection[PlayerDirection["RIGHT"] = 2] = "RIGHT";
    PlayerDirection[PlayerDirection["LEFT"] = 3] = "LEFT";
})(PlayerDirection || (PlayerDirection = {}));
var Player = (function () {
    function Player(game, x, y) {
        var _this = this;
        this.iListener = function () {
            _this.inventory.open();
        };
        this.iUpListener = function () {
            _this.inventory.close();
        };
        this.leftListener = function () {
            if (!_this.dead && _this.game.levelState === game_1.LevelState.IN_LEVEL) {
                //if (Input.isDown(Input.SPACE)) this.tryDash(-1, 0);
                //else
                _this.tryMove(_this.x - 1, _this.y);
                _this.direction = PlayerDirection.LEFT;
            }
        };
        this.rightListener = function () {
            if (!_this.dead && _this.game.levelState === game_1.LevelState.IN_LEVEL) {
                //if (Input.isDown(Input.SPACE)) this.tryDash(1, 0);
                //else
                _this.tryMove(_this.x + 1, _this.y);
                _this.direction = PlayerDirection.RIGHT;
            }
        };
        this.upListener = function () {
            if (!_this.dead && _this.game.levelState === game_1.LevelState.IN_LEVEL) {
                //if (Input.isDown(Input.SPACE)) this.tryDash(0, -1);
                //else
                _this.tryMove(_this.x, _this.y - 1);
                _this.direction = PlayerDirection.UP;
            }
        };
        this.downListener = function () {
            if (!_this.dead && _this.game.levelState === game_1.LevelState.IN_LEVEL) {
                //if (Input.isDown(Input.SPACE)) this.tryDash(0, 1);
                //else
                _this.tryMove(_this.x, _this.y + 1);
                _this.direction = PlayerDirection.DOWN;
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
                var other = _this.game.level.levelArray[x][y];
                if (other.isSolid())
                    break;
                if (other instanceof door_1.Door || other instanceof bottomDoor_1.BottomDoor) {
                    _this.move(x, y);
                    other.onCollide(_this);
                    return;
                }
                other.onCollide(_this);
                _this.game.level.particles.push(new dashParticle_1.DashParticle(_this.x, _this.y, particleFrameOffset));
                particleFrameOffset -= 2;
                var breakFlag = false;
                for (var _i = 0, _a = _this.game.level.enemies; _i < _a.length; _i++) {
                    var e = _a[_i];
                    if (e.x === x && e.y === y) {
                        var dmg = _this.hit();
                        e.hurt(dmg);
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
                    if (e.pushable) {
                        // pushing a crate or barrel
                        var oldEnemyX = e.x;
                        var oldEnemyY = e.y;
                        var dx = x - _this.x;
                        var dy = y - _this.y;
                        var nextX = x + dx;
                        var nextY = y + dy;
                        var foundEnd = false; // end of the train of whatever we're pushing
                        var enemyEnd = false; // end of the train is a solid enemy (none currently exist)
                        var pushedEnemies = [];
                        while (true) {
                            foundEnd = true;
                            for (var _b = 0, _c = _this.game.level.enemies; _b < _c.length; _b++) {
                                var f = _c[_b];
                                if (f.x === nextX && f.y === nextY) {
                                    if (!f.chainPushable) {
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
                            (_this.game.level.levelArray[nextX][nextY].isSolid() || enemyEnd)) {
                            if (e.destroyable) {
                                e.kill();
                                _this.game.level.tick();
                                return;
                            }
                        }
                        else {
                            // here pushedEnemies may still be []
                            for (var _d = 0, pushedEnemies_1 = pushedEnemies; _d < pushedEnemies_1.length; _d++) {
                                var f = pushedEnemies_1[_d];
                                f.x += dx;
                                f.y += dy;
                                f.drawX = dx;
                                f.drawY = dy;
                                f.skipNextTurns = 1; // skip next turn, so they don't move while we're pushing them
                            }
                            if (_this.game.level.levelArray[nextX][nextY].isSolid() || enemyEnd)
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
                        // if we're trying to hit an enemy, check if it's destroyable
                        if (e.destroyable) {
                            // and kill it
                            e.kill();
                            _this.game.level.tick();
                            return;
                        }
                    }
                }
            }
            var other = _this.game.level.levelArray[x][y];
            if (!other.isSolid()) {
                _this.move(x, y);
                other.onCollide(_this);
                if (!(other instanceof door_1.Door || other instanceof bottomDoor_1.BottomDoor || other instanceof trapdoor_1.Trapdoor))
                    _this.game.level.tick();
            }
            else {
                if (other instanceof lockedDoor_1.LockedDoor) {
                    _this.drawX = (_this.x - x) * 0.5;
                    _this.drawY = (_this.y - y) * 0.5;
                    other.unlock(_this);
                    _this.game.level.tick();
                }
            }
        };
        this.hurt = function (damage) {
            if (_this.inventory.getArmor() && _this.inventory.getArmor().health > 0) {
                _this.inventory.getArmor().hurt(damage);
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
            for (var _i = 0, _a = _this.game.level.items; _i < _a.length; _i++) {
                var i = _a[_i];
                if (i.x === x && i.y === y) {
                    i.onPickup(_this);
                }
            }
            _this.game.level.updateLighting();
        };
        this.doneMoving = function () {
            var EPSILON = 0.01;
            return Math.abs(_this.drawX) < EPSILON && Math.abs(_this.drawY) < EPSILON;
        };
        this.move = function (x, y) {
            sound_1.Sound.footstep();
            _this.drawX = x - _this.x;
            _this.drawY = y - _this.y;
            _this.x = x;
            _this.y = y;
            for (var _i = 0, _a = _this.game.level.items; _i < _a.length; _i++) {
                var i = _a[_i];
                if (i.x === x && i.y === y) {
                    i.onPickup(_this);
                }
            }
            _this.game.level.updateLighting();
        };
        this.moveNoSmooth = function (x, y) {
            // doesn't touch smoothing
            _this.x = x;
            _this.y = y;
        };
        this.moveSnap = function (x, y) {
            // no smoothing
            _this.x = x;
            _this.y = y;
            _this.drawX = 0;
            _this.drawY = 0;
        };
        this.update = function () { };
        this.finishTick = function () {
            _this.inventory.tick();
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
        this.drawPlayerSprite = function () {
            game_1.Game.drawMob(1, _this.direction * 2, 1, 2, _this.x - _this.drawX, _this.y - 1.5 - _this.drawY, 1, 2);
            if (_this.inventory.getArmor() && _this.inventory.getArmor().health > 0) {
                game_1.Game.drawMob(1, 8 + _this.direction * 2, 1, 2, _this.x - _this.drawX, _this.y - 1.5 - _this.drawY, 1, 2);
            }
        };
        this.draw = function () {
            _this.flashingFrame += 12 / gameConstants_1.GameConstants.FPS;
            if (!_this.dead) {
                game_1.Game.drawMob(0, 0, 1, 1, _this.x - _this.drawX, _this.y - _this.drawY, 1, 1);
                if (!_this.flashing || Math.floor(_this.flashingFrame) % 2 === 0) {
                    _this.drawX += -0.5 * _this.drawX;
                    _this.drawY += -0.5 * _this.drawY;
                    _this.drawPlayerSprite();
                }
            }
        };
        this.heartbeat = function () {
            _this.guiHeartFrame = 1;
        };
        this.drawTopLayer = function () {
            if (!_this.dead) {
                if (_this.guiHeartFrame > 0)
                    _this.guiHeartFrame++;
                if (_this.guiHeartFrame > 5) {
                    _this.guiHeartFrame = 0;
                }
                for (var i = 0; i < _this.health; i++) {
                    var frame = _this.guiHeartFrame > 0 ? 1 : 0;
                    game_1.Game.drawFX(frame, 2, 1, 1, i, levelConstants_1.LevelConstants.SCREEN_H - 1, 1, 1);
                }
                if (_this.inventory.getArmor())
                    _this.inventory.getArmor().drawGUI(_this.health);
            }
            else {
                game_1.Game.ctx.fillStyle = levelConstants_1.LevelConstants.LEVEL_TEXT_COLOR;
                var gameOverString = "Game Over.";
                game_1.Game.ctx.fillText(gameOverString, gameConstants_1.GameConstants.WIDTH / 2 - game_1.Game.ctx.measureText(gameOverString).width / 2, gameConstants_1.GameConstants.HEIGHT / 2);
                var refreshString = "[refresh to restart]";
                game_1.Game.ctx.fillText(refreshString, gameConstants_1.GameConstants.WIDTH / 2 - game_1.Game.ctx.measureText(refreshString).width / 2, gameConstants_1.GameConstants.HEIGHT / 2 + gameConstants_1.GameConstants.FONT_SIZE);
            }
            _this.inventory.draw();
            if (input_1.Input.isDown(input_1.Input.N)) {
                _this.map.draw(true);
            }
            if (input_1.Input.isDown(input_1.Input.M)) {
                _this.map.draw();
            }
        };
        this.game = game;
        this.x = x;
        this.y = y;
        this.direction = PlayerDirection.UP;
        input_1.Input.iListener = this.iListener;
        input_1.Input.iUpListener = this.iUpListener;
        input_1.Input.leftListener = this.leftListener;
        input_1.Input.rightListener = this.rightListener;
        input_1.Input.upListener = this.upListener;
        input_1.Input.downListener = this.downListener;
        this.health = 3;
        this.stats = new stats_1.Stats();
        this.dead = false;
        this.flashing = false;
        this.flashingFrame = 0;
        this.lastTickHealth = this.health;
        this.guiHeartFrame = 0;
        this.inventory = new inventory_1.Inventory(game);
        this.missProb = 0.1;
        this.sightRadius = 3; // maybe can be manipulated by items? e.g. better torch
        this.map = new map_1.Map(this.game);
    }
    return Player;
}());
exports.Player = Player;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var input_1 = __webpack_require__(16);
var gameConstants_1 = __webpack_require__(2);
var equippable_1 = __webpack_require__(9);
var armor_1 = __webpack_require__(26);
var Inventory = (function () {
    function Inventory(game) {
        var _this = this;
        this.tileX = 0;
        this.tileY = 0;
        this.open = function () {
            _this.isOpen = !_this.isOpen;
        };
        this.close = function () {
            //this.isOpen = false;
        };
        this.hasItem = function (itemType) {
            // itemType is class of Item we're looking for
            for (var _i = 0, _a = _this.items; _i < _a.length; _i++) {
                var i = _a[_i];
                if (i instanceof itemType)
                    return i;
            }
            return null;
        };
        this.addItem = function (item) {
            if (item.stackable) {
                for (var _i = 0, _a = _this.items; _i < _a.length; _i++) {
                    var i = _a[_i];
                    if (i.constructor === item.constructor) {
                        // we already have an item of the same type
                        i.stackCount++;
                        return;
                    }
                }
            }
            // item is either not stackable, or its stackable but we don't have one yet
            _this.items.push(item);
        };
        this.getArmor = function () {
            for (var _i = 0, _a = _this.equipped; _i < _a.length; _i++) {
                var e = _a[_i];
                if (e instanceof armor_1.Armor)
                    return e;
            }
            return null;
        };
        this.mouseLeftClickListener = function (x, y) {
            var tileX = Math.floor((x - 51) / 19);
            var tileY = Math.floor((y - 70) / 19);
            var i = tileX + tileY * 9;
            if (i >= 0 && i < _this.items.length && _this.items[i] instanceof equippable_1.Equippable) {
                var e = _this.items[i];
                e.equipped = !e.equipped; // toggle
                if (e.equipped) {
                    for (var _i = 0, _a = _this.items; _i < _a.length; _i++) {
                        var i_1 = _a[_i];
                        if (i_1 instanceof equippable_1.Equippable && i_1 !== e && !e.coEquippable(i_1)) {
                            i_1.equipped = false; // prevent user from equipping two notCoEquippable items
                        }
                    }
                }
            }
            _this.equipped = _this.items.filter(function (x) { return x instanceof equippable_1.Equippable && x.equipped; });
        };
        this.tick = function () {
            for (var _i = 0, _a = _this.items; _i < _a.length; _i++) {
                var i = _a[_i];
                i.tickInInventory();
            }
        };
        this.textWrap = function (text, x, y, maxWidth) {
            // returns y value for next line
            var words = text.split(" ");
            var line = "";
            while (words.length > 0) {
                if (game_1.Game.ctx.measureText(line + words[0]).width > maxWidth) {
                    game_1.Game.ctx.fillText(line, x, y);
                    line = "";
                    y += 10;
                }
                else {
                    if (line !== "")
                        line += " ";
                    line += words[0];
                    words.splice(0, 1);
                }
            }
            if (line !== " ") {
                game_1.Game.ctx.fillText(line, x, y);
                y += 10;
            }
            return y;
        };
        this.draw = function () {
            if (_this.isOpen) {
                game_1.Game.ctx.fillStyle = "rgb(0, 0, 0, 0.9)";
                game_1.Game.ctx.fillRect(0, 0, gameConstants_1.GameConstants.WIDTH, gameConstants_1.GameConstants.HEIGHT);
                game_1.Game.ctx.drawImage(game_1.Game.inventory, 0, 0);
                // check equips too
                _this.items = _this.items.filter(function (x) { return !x.dead; });
                if (input_1.Input.mouseX >= 51 && input_1.Input.mouseX <= 221 && input_1.Input.mouseY >= 70 && input_1.Input.mouseY <= 145) {
                    var highlightedSlotX = Math.floor((input_1.Input.mouseX - 51) / 19) * 19 + 51;
                    var highlightedSlotY = Math.floor((input_1.Input.mouseY - 70) / 19) * 19 + 70;
                    game_1.Game.ctx.fillStyle = "#9babd7";
                    game_1.Game.ctx.fillRect(highlightedSlotX, highlightedSlotY, 18, 18);
                }
                for (var i_2 = 0; i_2 < _this.items.length; i_2++) {
                    var s = 9;
                    var x = (52 + 19 * (i_2 % s)) / gameConstants_1.GameConstants.TILESIZE;
                    var y = (71 + 19 * Math.floor(i_2 / s)) / gameConstants_1.GameConstants.TILESIZE;
                    _this.items[i_2].drawIcon(x, y);
                    if (_this.items[i_2] instanceof equippable_1.Equippable && _this.items[i_2].equipped) {
                        game_1.Game.drawItem(0, 4, 2, 2, x - 0.5, y - 0.5, 2, 2);
                    }
                }
                var tileX = Math.floor((input_1.Input.mouseX - 51) / 19);
                var tileY = Math.floor((input_1.Input.mouseY - 70) / 19);
                var i = tileX + tileY * 9;
                if (i >= 0 && i < _this.items.length) {
                    game_1.Game.ctx.font = gameConstants_1.GameConstants.SCRIPT_FONT_SIZE + "px Script";
                    game_1.Game.ctx.fillStyle = "white";
                    var lines = _this.items[i].getDescription().split("\n");
                    if (_this.items[i] instanceof equippable_1.Equippable && _this.items[i].equipped) {
                        lines.push("EQUIPPED");
                    }
                    if (_this.items[i].stackable && _this.items[i].stackCount > 1) {
                        lines.push("x" + _this.items[i].stackCount);
                    }
                    var nextY = 147;
                    for (var j = 0; j < lines.length; j++) {
                        nextY = _this.textWrap(lines[j], 55, nextY, 162);
                    }
                    game_1.Game.ctx.font = gameConstants_1.GameConstants.FONT_SIZE + "px PixelFont";
                }
            }
        };
        this.game = game;
        this.items = new Array();
        this.equipped = new Array();
        input_1.Input.mouseLeftClickListener = this.mouseLeftClickListener;
    }
    return Inventory;
}());
exports.Inventory = Inventory;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

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
var game_1 = __webpack_require__(0);
var key_1 = __webpack_require__(25);
var tile_1 = __webpack_require__(1);
var LockedDoor = (function (_super) {
    __extends(LockedDoor, _super);
    function LockedDoor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.unlock = function (player) {
            var k = player.inventory.hasItem(key_1.Key);
            if (k !== null) {
                // remove key
                player.inventory.items = player.inventory.items.filter(function (x) { return x !== k; });
                _this.level.levelArray[_this.x][_this.y] = _this.unlockedDoor; // replace this door in level
                _this.level.doors.push(_this.unlockedDoor); // add it to the door list so it can get rendered on the map
            }
        };
        _this.isSolid = function () {
            return true;
        };
        _this.isOpaque = function () {
            return true;
        };
        _this.draw = function () {
            game_1.Game.drawTile(17, _this.skin, 1, 1, _this.x, _this.y, 1, 1, _this.isShaded());
        };
        return _this;
    }
    return LockedDoor;
}(tile_1.Tile));
exports.LockedDoor = LockedDoor;


/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

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
var game_1 = __webpack_require__(0);
var particle_1 = __webpack_require__(7);
var DashParticle = (function (_super) {
    __extends(DashParticle, _super);
    function DashParticle(x, y, frameOffset) {
        var _this = _super.call(this) || this;
        _this.drawBehind = function () {
            game_1.Game.drawFX(Math.round(_this.frame), 0, 1, 2, _this.x, _this.y, 1, 2);
            _this.frame += 0.4;
            if (_this.frame > 7)
                _this.dead = true;
        };
        _this.x = x;
        _this.y = y - 1;
        _this.dead = false;
        _this.frame = frameOffset;
        return _this;
    }
    return DashParticle;
}(particle_1.Particle));
exports.DashParticle = DashParticle;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var statconstants_1 = __webpack_require__(47);
var game_1 = __webpack_require__(0);
var gameConstants_1 = __webpack_require__(2);
var levelConstants_1 = __webpack_require__(3);
var Stats = (function () {
    function Stats() {
        var _this = this;
        this.getLevel = function (xp) {
            for (var i = 0; i < statconstants_1.StatConstants.LEVELS; i++) {
                if (xp < statconstants_1.StatConstants.LEVEL_UP_TABLE[i])
                    return i + 1;
            }
            return statconstants_1.StatConstants.LEVELS;
        };
        this.getXP = function (amount) {
            _this.xp += amount;
            _this.level = _this.getLevel(_this.xp);
            if (_this.xp > _this.xpToLevelUp) {
                console.log("level up!");
            }
            _this.xpToLevelUp = statconstants_1.StatConstants.LEVEL_UP_TABLE[_this.level - 1];
        };
        this.drawGUI = function () {
            game_1.Game.ctx.fillStyle = gameConstants_1.GameConstants.OUTLINE;
            game_1.Game.ctx.fillRect(1, gameConstants_1.GameConstants.HEIGHT - 30, gameConstants_1.GameConstants.WIDTH - 2, 14);
            game_1.Game.ctx.fillStyle = gameConstants_1.GameConstants.RED;
            game_1.Game.ctx.fillRect(2, gameConstants_1.GameConstants.HEIGHT - 29, gameConstants_1.GameConstants.WIDTH - 4, 12);
            game_1.Game.ctx.fillStyle = gameConstants_1.GameConstants.GREEN;
            game_1.Game.ctx.fillRect(2, gameConstants_1.GameConstants.HEIGHT - 29, Math.floor((_this.xp / _this.xpToLevelUp) * (gameConstants_1.GameConstants.WIDTH - 4)), 12);
            game_1.Game.ctx.fillStyle = levelConstants_1.LevelConstants.LEVEL_TEXT_COLOR;
            game_1.Game.ctx.fillText("" + _this.xp + "/" + _this.xpToLevelUp, 3, gameConstants_1.GameConstants.HEIGHT - (gameConstants_1.GameConstants.FONT_SIZE - 1) - 15);
            game_1.Game.ctx.fillText("Level " + _this.level, gameConstants_1.GameConstants.WIDTH - game_1.Game.ctx.measureText(gameConstants_1.GameConstants.VERSION).width + 1, gameConstants_1.GameConstants.HEIGHT - (gameConstants_1.GameConstants.FONT_SIZE - 1) - 15);
        };
        this.xp = 0;
        this.level = 1;
        this.xpToLevelUp = statconstants_1.StatConstants.LEVEL_UP_TABLE[this.level - 1];
    }
    return Stats;
}());
exports.Stats = Stats;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var StatConstants = (function () {
    function StatConstants() {
    }
    StatConstants.LEVELS = 8;
    // length should be LEVELS - 1
    StatConstants.LEVEL_UP_TABLE = [100, 500, 2500, 10000, 50000, 250000, 1000000];
    return StatConstants;
}());
exports.StatConstants = StatConstants;


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var gameConstants_1 = __webpack_require__(2);
var door_1 = __webpack_require__(10);
var bottomDoor_1 = __webpack_require__(6);
// class MapRoom {
//   x: number;
//   y: number;
//   w: number;
//   h: number;
//   isCurrent: boolean;
//   constructor() {
//     this.parent = null;
//     this.children = Array<TreeNode>();
//     this.width = 0;
//     this.isCurrent = false;
//     this.unopened = false;
//   }
// }
var Map = (function () {
    function Map(game) {
        var _this = this;
        this.draw = function (drawAll) {
            if (drawAll === void 0) { drawAll = false; }
            var SCALE = 2;
            var startLevel = _this.game.levels[0];
            game_1.Game.ctx.translate(startLevel.x + Math.floor(startLevel.width / 2), startLevel.y + Math.floor(startLevel.height / 2));
            game_1.Game.ctx.scale(SCALE, SCALE);
            game_1.Game.ctx.translate(-(startLevel.x + Math.floor(startLevel.width / 2)), -(startLevel.y + Math.floor(startLevel.height / 2)));
            game_1.Game.ctx.globalAlpha = 0.5;
            game_1.Game.ctx.fillStyle = "white";
            game_1.Game.ctx.fillRect(0, 0, gameConstants_1.GameConstants.WIDTH, gameConstants_1.GameConstants.HEIGHT);
            game_1.Game.ctx.globalAlpha = 1;
            for (var _i = 0, _a = _this.game.levels; _i < _a.length; _i++) {
                var level = _a[_i];
                if (_this.game.level.depth == level.depth && (level.entered || drawAll)) {
                    game_1.Game.ctx.fillStyle = "black";
                    game_1.Game.ctx.fillRect(level.x, level.y + 1, level.width, level.height - 1);
                    for (var _b = 0, _c = level.doors; _b < _c.length; _b++) {
                        var door = _c[_b];
                        //Game.ctx.fillStyle = "#0085ff";
                        if (door instanceof door_1.Door)
                            game_1.Game.ctx.fillRect(level.x - level.roomX + door.x, level.y - level.roomY + door.y, 1, 1);
                        if (door instanceof bottomDoor_1.BottomDoor)
                            game_1.Game.ctx.fillRect(level.x - level.roomX + door.x, level.y - level.roomY + door.y - 1, 1, 1);
                    }
                }
            }
            game_1.Game.ctx.fillStyle = gameConstants_1.GameConstants.RED;
            game_1.Game.ctx.fillRect(_this.game.level.x - _this.game.level.roomX + _this.game.player.x, _this.game.level.y - _this.game.level.roomY + _this.game.player.y, 1, 1);
            game_1.Game.ctx.setTransform(1, 0, 0, 1, 0, 0);
        };
        this.game = game;
    }
    return Map;
}());
exports.Map = Map;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var level_1 = __webpack_require__(17);
var ROOM_SIZE = [5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 13];
var N = (function () {
    function N(type, difficulty, children) {
        this.type = type;
        this.difficulty = difficulty;
        this.children = children;
    }
    return N;
}());
var Room = (function () {
    function Room() {
        var _this = this;
        this.collides = function (r) {
            if (_this.x > r.x + r.w || _this.x + _this.w < r.x)
                return false;
            if (_this.y >= r.y + r.h || _this.y + _this.h <= r.y)
                return false;
            return true;
        };
        this.getPoints = function () {
            return [
                { x: _this.x, y: _this.y },
                { x: Math.floor(_this.x + _this.w / 2), y: _this.y },
                { x: _this.x + _this.w - 1, y: _this.y },
                { x: _this.x, y: _this.y + _this.h },
                { x: Math.floor(_this.x + _this.w / 2), y: _this.y + _this.h },
                { x: _this.x + _this.w - 1, y: _this.y + _this.h },
            ];
        };
        this.getDoors = function () {
            return _this.doors;
        };
        this.generateAroundPoint = function (p, dir, w, h) {
            _this.x = 0;
            _this.y = 0;
            if (w) {
                _this.w = w;
                _this.h = h;
            }
            else {
                _this.w = ROOM_SIZE[Math.floor(Math.random() * ROOM_SIZE.length)];
                _this.h = ROOM_SIZE[Math.floor(Math.random() * ROOM_SIZE.length)];
            }
            var ind = 1;
            if (dir === 0 || dir === 1 || dir === 2) {
                ind = 3 + Math.floor(Math.random() * 3);
            }
            else {
                ind = Math.floor(Math.random() * 3);
            }
            var point = _this.getPoints()[ind];
            _this.x += p.x - point.x;
            _this.y += p.y - point.y;
            return ind;
        };
        this.x = 0;
        this.y = 0;
        this.w = 0;
        this.h = 0;
        this.doneAdding = false;
        this.doors = [null, null, null, null, null, null];
    }
    return Room;
}());
var LevelGenerator = (function () {
    function LevelGenerator() {
        var _this = this;
        this.rooms = [];
        this.levels = [];
        this.upLadder = null;
        this.noCollisions = function (r) {
            for (var _i = 0, _a = _this.rooms; _i < _a.length; _i++) {
                var room = _a[_i];
                if (r.collides(room)) {
                    return false;
                }
            }
            return true;
        };
        this.pickType = function (r) {
            var type = level_1.RoomType.DUNGEON;
            switch (game_1.Game.rand(1, 9)) {
                case 1:
                    type = level_1.RoomType.FOUNTAIN;
                    if (r.h <= 5 || (r.w > 9 && r.h > 9))
                        type = _this.pickType(r);
                    break;
                case 2:
                    type = level_1.RoomType.COFFIN;
                    if (r.w <= 5)
                        type = _this.pickType(r);
                    break;
                case 3:
                    type = level_1.RoomType.TREASURE;
                    break;
                case 4:
                case 5:
                    type = level_1.RoomType.GRASS;
                    break;
            }
            return type;
        };
        this.shuffle = function (a) {
            var j, x, i;
            for (i = a.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = a[i];
                a[i] = a[j];
                a[j] = x;
            }
            return a;
        };
        this.addRooms = function (thisNode, parent, parentLevel) {
            var order = _this.shuffle([0, 1, 2, 3, 4, 5]);
            //console.log(thisNode, parent);
            var points;
            if (parent)
                points = parent.getPoints();
            for (var i = 0; i < order.length; i++) {
                var ind = order[i];
                for (var j = 0; j < 20; j++) {
                    var r = new Room();
                    r.x = 0;
                    r.y = 0;
                    var newLevelDoorDir = game_1.Game.rand(1, 6);
                    if (parent) {
                        switch (thisNode.type) {
                            case level_1.RoomType.UPLADDER:
                            case level_1.RoomType.DOWNLADDER:
                                newLevelDoorDir = r.generateAroundPoint(points[ind], ind, 5, 5);
                                break;
                            case level_1.RoomType.PUZZLE:
                            case level_1.RoomType.COFFIN:
                            case level_1.RoomType.FOUNTAIN:
                                newLevelDoorDir = r.generateAroundPoint(points[ind], ind, 11, 11);
                                break;
                            case level_1.RoomType.SPIKECORRIDOR:
                                newLevelDoorDir = r.generateAroundPoint(points[ind], ind, game_1.Game.randTable([3, 5]), game_1.Game.randTable([9, 10, 11]));
                                break;
                            default:
                                newLevelDoorDir = r.generateAroundPoint(points[ind], ind);
                                break;
                        }
                    }
                    else {
                        r.x = 128;
                        r.y = 128;
                        r.w = 5; //ROOM_SIZE[Math.floor(Math.random() * ROOM_SIZE.length)];
                        r.h = 5; //ROOM_SIZE[Math.floor(Math.random() * ROOM_SIZE.length)];
                    }
                    if (_this.noCollisions(r)) {
                        var level = new level_1.Level(_this.game, r.x, r.y, r.w, r.h, thisNode.type, thisNode.difficulty);
                        if (level.upLadder)
                            _this.upLadder = level.upLadder;
                        _this.levels.push(level);
                        if (parentLevel) {
                            var newDoor = level.addDoor(newLevelDoorDir, null);
                            parentLevel.doors[ind] = parentLevel.addDoor(ind, newDoor);
                            newDoor.linkedDoor = parentLevel.doors[ind];
                            r.doors[newLevelDoorDir] = newDoor;
                        }
                        _this.rooms.push(r);
                        for (var _i = 0, _a = thisNode.children; _i < _a.length; _i++) {
                            var child = _a[_i];
                            if (!_this.addRooms(child, r, level))
                                return false;
                        }
                        return true;
                    }
                }
            }
            return false;
        };
        this.generate = function (game, depth) {
            var d = depth;
            // prettier-ignore
            var node = new N(d == 0 ? level_1.RoomType.DUNGEON : level_1.RoomType.UPLADDER, d, [
                new N(level_1.RoomType.DUNGEON, d, [new N(level_1.RoomType.DOWNLADDER, d, [])])
            ]);
            /*  new N(RoomType.DUNGEON, d, [
                new N(RoomType.COFFIN, d, [])
              ]),
              new N(RoomType.PUZZLE, d, [
                new N(RoomType.SPIKECORRIDOR, d, [
                  new N(RoomType.TREASURE, d, [])
                ])
              ]),
              new N(RoomType.DUNGEON, d, [
                new N(RoomType.DUNGEON, d, [
                  new N(RoomType.DUNGEON, d, [
                    new N(RoomType.FOUNTAIN, d, [
                      new N(RoomType.DUNGEON, d, [
                        new N(RoomType.SPIKECORRIDOR, d, [
                          new N(RoomType.KEYROOM, d, [])
                        ]),
                      ]),
                      new N(RoomType.TREASURE, d, []),
                    ]),
                  ]),
                  new N(RoomType.GRASS, d, [
                    new N(RoomType.GRASS, d, [
                      new N(RoomType.TREASURE, d, [])
                    ])
                  ]),
                ]),
              ]),
            ]);*/
            _this.game = game;
            var success = false;
            do {
                _this.rooms.splice(0);
                _this.levels.splice(0);
                success = _this.addRooms(node, null, null);
            } while (!success);
            _this.game.levels = _this.game.levels.concat(_this.levels);
            if (d != 0) {
                return _this.upLadder;
            }
        };
    }
    return LevelGenerator;
}());
exports.LevelGenerator = LevelGenerator;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

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
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var Trapdoor = (function (_super) {
    __extends(Trapdoor, _super);
    function Trapdoor(level, game, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.draw = function () {
            game_1.Game.drawTile(13, _this.skin, 1, 1, _this.x, _this.y, 1, 1, _this.isShaded());
        };
        _this.onCollide = function (player) {
            // TODO
        };
        _this.game = game;
        return _this;
    }
    return Trapdoor;
}(tile_1.Tile));
exports.Trapdoor = Trapdoor;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

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
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var UpLadder = (function (_super) {
    __extends(UpLadder, _super);
    function UpLadder(level, game, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.onCollide = function (player) {
            _this.game.changeLevelThroughLadder(_this.linkedLadder);
        };
        _this.draw = function () {
            game_1.Game.drawTile(1, _this.skin, 1, 1, _this.x, _this.y, 1, 1, _this.isShaded());
            game_1.Game.drawTile(29, 0, 1, 1, _this.x, _this.y - 1, 1, 1, _this.isShaded());
            game_1.Game.drawTile(29, 1, 1, 1, _this.x, _this.y, 1, 1, _this.isShaded());
        };
        _this.drawAbovePlayer = function () { };
        _this.game = game;
        return _this;
    }
    return UpLadder;
}(tile_1.Tile));
exports.UpLadder = UpLadder;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

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
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var DownLadder = (function (_super) {
    __extends(DownLadder, _super);
    function DownLadder(level, game, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.onCollide = function (player) {
            if (!_this.linkedLadder) {
                _this.linkedLadder = _this.game.levelgen.generate(_this.game, _this.level.depth + 1);
                _this.linkedLadder.linkedLadder = _this;
            }
            _this.game.changeLevelThroughLadder(_this.linkedLadder);
        };
        _this.draw = function () {
            game_1.Game.drawTile(4, _this.skin, 1, 1, _this.x, _this.y, 1, 1, _this.isShaded());
        };
        _this.drawAbovePlayer = function () { };
        _this.game = game;
        _this.linkedLadder = null;
        return _this;
    }
    return DownLadder;
}(tile_1.Tile));
exports.DownLadder = DownLadder;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

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
var particle_1 = __webpack_require__(7);
var game_1 = __webpack_require__(0);
var gameConstants_1 = __webpack_require__(2);
var GenericParticle = (function (_super) {
    __extends(GenericParticle, _super);
    function GenericParticle(level, x, y, z, dx, dy, dz, color, delay) {
        var _this = _super.call(this) || this;
        _this.draw = function () {
            _this.x += _this.dx;
            _this.y += _this.dy;
            _this.z += _this.dz;
            _this.dx *= 0.93;
            _this.dy *= 0.93;
            if (_this.z <= 0) {
                _this.z = 0;
                _this.dz *= -0.6;
                if (_this.dz < 0.01)
                    _this.dead = true;
            }
            // apply gravity
            _this.dz -= 0.01;
            if (_this.y >= _this.level.game.player.y) {
                var scale = gameConstants_1.GameConstants.TILESIZE;
                var halfS = 0.5 * _this.s;
                var oldFillStyle = game_1.Game.ctx.fillStyle;
                game_1.Game.ctx.fillStyle = _this.color;
                game_1.Game.ctx.fillRect(Math.floor((_this.x - halfS) * scale), Math.floor((_this.y - _this.z - halfS) * scale), halfS * scale, halfS * scale);
                game_1.Game.ctx.fillStyle = oldFillStyle;
            }
        };
        _this.drawBehind = function () {
            if (_this.y < _this.level.game.player.y) {
                var scale = gameConstants_1.GameConstants.TILESIZE;
                var halfS = 0.5 * _this.s;
                var oldFillStyle = game_1.Game.ctx.fillStyle;
                game_1.Game.ctx.fillStyle = _this.color;
                game_1.Game.ctx.fillRect(Math.floor((_this.x - halfS) * scale), Math.floor((_this.y - _this.z - halfS) * scale), halfS * scale, halfS * scale);
                game_1.Game.ctx.fillStyle = oldFillStyle;
            }
        };
        _this.level = level;
        _this.x = x;
        _this.y = y;
        _this.z = z;
        _this.s = game_1.Game.rand(8, 16) / 16.0;
        _this.dx = dx;
        _this.dy = dy;
        _this.dz = dz;
        _this.color = color;
        if (delay !== undefined)
            _this.delay = delay;
        return _this;
    }
    GenericParticle.spawnCluster = function (level, cx, cy, color) {
        for (var i = 0; i < 4; i++) {
            level.particles.push(new GenericParticle(level, cx + Math.random() * 0.05 - 0.025, cy + Math.random() * 0.05 - 0.025, Math.random() * 0.5, 0.05 * (Math.random() * 2 - 1), 0.05 * (Math.random() * 2 - 1), 0.2 * (Math.random() - 1), color, 0));
        }
    };
    return GenericParticle;
}(particle_1.Particle));
exports.GenericParticle = GenericParticle;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

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
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var Spike = (function (_super) {
    __extends(Spike, _super);
    function Spike() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onCollide = function (player) {
            player.hurt(1);
        };
        _this.draw = function () {
            game_1.Game.drawTile(11, 0, 1, 1, _this.x, _this.y, 1, 1, _this.isShaded());
        };
        return _this;
    }
    return Spike;
}(tile_1.Tile));
exports.Spike = Spike;


/***/ })
/******/ ]);