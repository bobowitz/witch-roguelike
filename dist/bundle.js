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
var player_1 = __webpack_require__(31);
var sound_1 = __webpack_require__(6);
var levelConstants_1 = __webpack_require__(5);
var levelGenerator_1 = __webpack_require__(44);
var bottomDoor_1 = __webpack_require__(11);
var input_1 = __webpack_require__(10);
var LevelState;
(function (LevelState) {
    LevelState[LevelState["IN_LEVEL"] = 0] = "IN_LEVEL";
    LevelState[LevelState["TRANSITIONING"] = 1] = "TRANSITIONING";
    LevelState[LevelState["TRANSITIONING_LADDER"] = 2] = "TRANSITIONING_LADDER";
})(LevelState = exports.LevelState || (exports.LevelState = {}));
var Game = /** @class */ (function () {
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
            Game.scale = Math.min(maxWidthScale, maxHeightScale);
            console.log(Game.scale);
            Game.ctx.canvas.setAttribute("style", "width: " + gameConstants_1.GameConstants.WIDTH * Game.scale + "px; height: " + gameConstants_1.GameConstants.HEIGHT * Game.scale + "px;\n    display: block;\n    margin: 0 auto;\n  \n    image-rendering: optimizeSpeed; /* Older versions of FF          */\n    image-rendering: -moz-crisp-edges; /* FF 6.0+                       */\n    image-rendering: -webkit-optimize-contrast; /* Safari                        */\n    image-rendering: -o-crisp-edges; /* OS X & Windows Opera (12.02+) */\n    image-rendering: pixelated; /* Awesome future-browsers       */\n  \n    -ms-interpolation-mode: nearest-neighbor;");
            //Game.ctx.canvas.width = window.innerWidth;
            //Game.ctx.canvas.height = window.innerHeight;
        };
        this.shakeScreen = function (shakeX, shakeY) {
            _this.screenShakeX = shakeX;
            _this.screenShakeY = shakeY;
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
                _this.player.drawGUI();
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
                _this.player.drawGUI();
            }
            else {
                _this.screenShakeX *= -0.8;
                _this.screenShakeY *= -0.8;
                Game.ctx.translate(Math.round(_this.screenShakeX), Math.round(_this.screenShakeY));
                _this.level.draw();
                _this.level.drawEntitiesBehindPlayer();
                _this.player.draw();
                _this.level.drawEntitiesInFrontOfPlayer();
                Game.ctx.translate(-Math.round(_this.screenShakeX), -Math.round(_this.screenShakeY));
                _this.level.drawTopLayer();
                _this.player.drawTopLayer();
                _this.player.drawGUI();
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
            Game.shopset = new Image();
            Game.shopset.src = "res/shopset.png";
            Game.tilesetShadow = new Image();
            Game.tilesetShadow.src = "res/tilesetShadow.png";
            Game.objsetShadow = new Image();
            Game.objsetShadow.src = "res/objsetShadow.png";
            Game.mobsetShadow = new Image();
            Game.mobsetShadow.src = "res/mobsetShadow.png";
            Game.scale = 1;
            _this.onResize();
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
    Game.drawShop = function (sX, sY, sW, sH, dX, dY, dW, dH) {
        Game.ctx.drawImage(Game.shopset, Math.round(sX * gameConstants_1.GameConstants.TILESIZE), Math.round(sY * gameConstants_1.GameConstants.TILESIZE), Math.round(sW * gameConstants_1.GameConstants.TILESIZE), Math.round(sH * gameConstants_1.GameConstants.TILESIZE), Math.round(dX * gameConstants_1.GameConstants.TILESIZE), Math.round(dY * gameConstants_1.GameConstants.TILESIZE), Math.round(dW * gameConstants_1.GameConstants.TILESIZE), Math.round(dH * gameConstants_1.GameConstants.TILESIZE));
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
var levelConstants_1 = __webpack_require__(5);
var SkinType;
(function (SkinType) {
    SkinType[SkinType["DUNGEON"] = 0] = "DUNGEON";
    SkinType[SkinType["CAVE"] = 1] = "CAVE";
})(SkinType = exports.SkinType || (exports.SkinType = {}));
var Tile = /** @class */ (function () {
    function Tile(level, x, y) {
        var _this = this;
        this.isShaded = function () {
            return _this.level.softVisibilityArray[_this.x][_this.y] <= levelConstants_1.LevelConstants.SHADED_TILE_CUTOFF;
        };
        this.isSolid = function () {
            return false;
        };
        this.canCrushEnemy = function () {
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
        this.drawAboveShading = function () { };
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
var levelConstants_1 = __webpack_require__(5);
var GameConstants = /** @class */ (function () {
    function GameConstants() {
    }
    GameConstants.VERSION = "v0.3.2";
    GameConstants.FPS = 60;
    GameConstants.TILESIZE = 16;
    GameConstants.SCALE = 2;
    GameConstants.KEY_REPEAT_TIME = 300; // milliseconds
    GameConstants.WIDTH = levelConstants_1.LevelConstants.SCREEN_W * GameConstants.TILESIZE;
    GameConstants.HEIGHT = levelConstants_1.LevelConstants.SCREEN_H * GameConstants.TILESIZE;
    GameConstants.SCRIPT_FONT_SIZE = 13;
    GameConstants.FONT_SIZE = 10;
    GameConstants.BIG_FONT_SIZE = 20;
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

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var particle_1 = __webpack_require__(8);
var game_1 = __webpack_require__(0);
var gameConstants_1 = __webpack_require__(2);
var GenericParticle = /** @class */ (function (_super) {
    __extends(GenericParticle, _super);
    function GenericParticle(level, x, y, z, s, dx, dy, dz, color, delay) {
        var _this = _super.call(this) || this;
        _this.render = function () {
            var scale = gameConstants_1.GameConstants.TILESIZE;
            var scaledS = _this.s * _this.alpha; // using alpha for scaling, not alpha
            var halfS = 0.5 * scaledS;
            var oldFillStyle = game_1.Game.ctx.fillStyle;
            game_1.Game.ctx.fillStyle = _this.color;
            /* Game.ctx.fillRect(
              Math.round((this.x - halfS) * scale),
              Math.round((this.y - this.z - halfS) * scale),
              Math.round(scaledS * scale),
              Math.round(scaledS * scale)
            ); */
            game_1.Game.ctx.beginPath();
            game_1.Game.ctx.arc(Math.round(_this.x * scale), Math.round((_this.y - _this.z) * scale), Math.round(halfS * scale), 0, 2 * Math.PI, false);
            game_1.Game.ctx.fill();
            game_1.Game.ctx.fillStyle = oldFillStyle;
        };
        _this.draw = function () {
            _this.x += _this.dx;
            _this.y += _this.dy;
            _this.z += _this.dz;
            _this.dx *= 0.97;
            _this.dy *= 0.97;
            if (_this.z <= 0) {
                _this.z = 0;
                _this.dz *= -0.8;
            }
            // apply gravity
            _this.dz -= 0.01;
            if (_this.alpha < 0.2)
                _this.alpha -= 0.007;
            else
                _this.alpha -= 0.02;
            if (_this.alpha <= 0.1)
                _this.dead = true;
            if (_this.dead)
                return;
            if (_this.y >= _this.level.game.player.y) {
                _this.render();
            }
        };
        _this.drawBehind = function () {
            if (_this.dead)
                return;
            if (_this.y < _this.level.game.player.y) {
                _this.render();
            }
        };
        _this.level = level;
        _this.x = x;
        _this.y = y;
        _this.z = z;
        _this.s = s;
        _this.dx = dx;
        _this.dy = dy;
        _this.dz = dz;
        _this.color = color;
        _this.alpha = 1.0;
        if (delay !== undefined)
            _this.delay = delay;
        return _this;
    }
    GenericParticle.spawnCluster = function (level, cx, cy, color) {
        for (var i = 0; i < 4; i++) {
            level.particles.push(new GenericParticle(level, cx + Math.random() * 0.05 - 0.025, cy + Math.random() * 0.05 - 0.025, Math.random() * 0.5, 0.0625 * (i + 8), 0.025 * (Math.random() * 2 - 1), 0.025 * (Math.random() * 2 - 1), 0.2 * (Math.random() - 1), color, 0));
        }
    };
    return GenericParticle;
}(particle_1.Particle));
exports.GenericParticle = GenericParticle;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var bones_1 = __webpack_require__(22);
var levelConstants_1 = __webpack_require__(5);
var deathParticle_1 = __webpack_require__(23);
var floor_1 = __webpack_require__(14);
var genericParticle_1 = __webpack_require__(3);
var healthbar_1 = __webpack_require__(24);
var EnemyDirection;
(function (EnemyDirection) {
    EnemyDirection[EnemyDirection["DOWN"] = 0] = "DOWN";
    EnemyDirection[EnemyDirection["UP"] = 1] = "UP";
    EnemyDirection[EnemyDirection["RIGHT"] = 2] = "RIGHT";
    EnemyDirection[EnemyDirection["LEFT"] = 3] = "LEFT";
})(EnemyDirection = exports.EnemyDirection || (exports.EnemyDirection = {}));
var Enemy = /** @class */ (function () {
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
        this.hurtCallback = function () { };
        this.hurt = function (damage) {
            _this.healthBar.hurt();
            _this.health -= damage;
            if (_this.health <= 0)
                _this.kill();
            else
                _this.hurtCallback();
        };
        this.interact = function () { };
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
            return _this.level.softVisibilityArray[_this.x][_this.y] <= levelConstants_1.LevelConstants.SHADED_TILE_CUTOFF;
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
        this.drawTopLayer = function () {
            _this.healthBar.draw(_this.health, _this.maxHealth, _this.x, _this.y, true);
        };
        this.level = level;
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 1;
        this.game = game;
        this.drawX = 0;
        this.drawY = 0;
        this.health = 1;
        this.maxHealth = 1;
        this.tileX = 0;
        this.tileY = 0;
        this.hasShadow = true;
        this.skipNextTurns = 0;
        this.direction = EnemyDirection.DOWN;
        this.destroyable = true;
        this.pushable = false;
        this.chainPushable = true;
        this.interactable = false;
        this.deathParticleColor = "#ff00ff";
        this.healthBar = new healthbar_1.HealthBar();
    }
    return Enemy;
}());
exports.Enemy = Enemy;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var LevelConstants = /** @class */ (function () {
    function LevelConstants() {
    }
    LevelConstants.MIN_LEVEL_W = 5;
    LevelConstants.MIN_LEVEL_H = 5;
    LevelConstants.MAX_LEVEL_W = 13;
    LevelConstants.MAX_LEVEL_H = 13;
    LevelConstants.SCREEN_W = 17; // screen size in tiles
    LevelConstants.SCREEN_H = 17; // screen size in tiles
    LevelConstants.COMPUTER_TURN_DELAY = 250; // milliseconds
    LevelConstants.TURN_TIME = 1000; // milliseconds
    LevelConstants.LEVEL_TRANSITION_TIME = 300; // milliseconds
    LevelConstants.LEVEL_TRANSITION_TIME_LADDER = 1000; // milliseconds
    LevelConstants.ROOM_COUNT = 15;
    LevelConstants.HEALTH_BAR_FADEIN = 100;
    LevelConstants.HEALTH_BAR_FADEOUT = 100;
    LevelConstants.HEALTH_BAR_TOTALTIME = 2500;
    LevelConstants.SHADED_TILE_CUTOFF = 1;
    LevelConstants.SMOOTH_LIGHTING = false;
    LevelConstants.MIN_VISIBILITY = 2.0; // visibility level of places you've already seen
    LevelConstants.LIGHTING_ANGLE_STEP = 5; // how many degrees between each ray
    LevelConstants.LEVEL_TEXT_COLOR = "white"; // not actually a constant
    return LevelConstants;
}());
exports.LevelConstants = LevelConstants;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var Sound = /** @class */ (function () {
    function Sound() {
    }
    Sound.loadSounds = function () {
        Sound.playerStoneFootsteps = new Array();
        [1, 2, 3].forEach(function (i) {
            return Sound.playerStoneFootsteps.push(new Audio("res/SFX/footsteps/stone/footstep" + i + ".wav"));
        });
        for (var _i = 0, _a = Sound.playerStoneFootsteps; _i < _a.length; _i++) {
            var f = _a[_i];
            f.volume = 1.0;
        }
        Sound.enemyFootsteps = new Array();
        [1, 2, 3, 4, 5].forEach(function (i) {
            return Sound.enemyFootsteps.push(new Audio("res/SFX/footsteps/enemy/enemyfootstep" + i + ".wav"));
        });
        for (var _b = 0, _c = Sound.enemyFootsteps; _b < _c.length; _b++) {
            var f = _c[_b];
            f.volume = 1.0;
        }
        Sound.hitSounds = new Array();
        [1, 2, 3, 4].forEach(function (i) {
            return Sound.hitSounds.push(new Audio("res/SFX/attacks/swing" + i + ".wav"));
        });
        for (var _d = 0, _e = Sound.hitSounds; _d < _e.length; _d++) {
            var f = _e[_d];
            f.volume = 1.0;
        }
        Sound.enemySpawnSound = new Audio("res/SFX/attacks/enemyspawn.wav");
        Sound.enemySpawnSound.volume = 1.0;
        Sound.chestSounds = new Array();
        [1, 2, 3].forEach(function (i) { return Sound.chestSounds.push(new Audio("res/SFX/items/chest" + i + ".wav")); });
        for (var _f = 0, _g = Sound.chestSounds; _f < _g.length; _f++) {
            var f = _g[_f];
            f.volume = 1.0;
        }
        Sound.coinPickupSounds = new Array();
        [1, 2, 3, 4].forEach(function (i) {
            return Sound.coinPickupSounds.push(new Audio("res/SFX/items/coins" + i + ".wav"));
        });
        for (var _h = 0, _j = Sound.coinPickupSounds; _h < _j.length; _h++) {
            var f = _j[_h];
            f.volume = 1.0;
        }
        Sound.miningSounds = new Array();
        [1, 2, 3, 4].forEach(function (i) {
            return Sound.miningSounds.push(new Audio("res/SFX/resources/Pickaxe" + i + ".wav"));
        });
        for (var _k = 0, _l = Sound.miningSounds; _k < _l.length; _k++) {
            var f = _l[_k];
            f.volume = 1.0;
        }
        Sound.hurtSounds = new Array();
        [1].forEach(function (i) { return Sound.hurtSounds.push(new Audio("res/SFX/attacks/hit.wav")); });
        for (var _m = 0, _o = Sound.hurtSounds; _m < _o.length; _m++) {
            var f = _o[_m];
            f.volume = 1.0;
        }
        Sound.genericPickupSound = new Audio("res/SFX/items/pickup.wav");
        Sound.genericPickupSound.volume = 1.0;
        Sound.breakRockSound = new Audio("res/SFX/resources/rockbreak.wav");
        Sound.breakRockSound.volume = 1.0;
        Sound.pushSounds = new Array();
        [1, 2].forEach(function (i) { return Sound.pushSounds.push(new Audio("res/SFX/pushing/push" + i + ".wav")); });
        for (var _p = 0, _q = Sound.pushSounds; _p < _q.length; _p++) {
            var f = _q[_p];
            f.volume = 1.0;
        }
        Sound.powerupSound = new Audio("res/powerup.wav");
        Sound.powerupSound.volume = 0.5;
        Sound.healSound = new Audio("res/heal.wav");
        Sound.healSound.volume = 0.5;
        Sound.music = new Audio("res/bewitched.mp3");
    };
    Sound.playerStoneFootstep = function () {
        var f = game_1.Game.randTable(Sound.playerStoneFootsteps);
        f.play();
        f.currentTime = 0;
    };
    Sound.enemyFootstep = function () {
        var f = game_1.Game.randTable(Sound.enemyFootsteps);
        f.play();
        f.currentTime = 0;
    };
    Sound.hit = function () {
        var f = game_1.Game.randTable(Sound.hitSounds);
        f.play();
        f.currentTime = 0;
        f = game_1.Game.randTable(Sound.hurtSounds);
        f.volume = 0.5;
        f.play();
        f.currentTime = 0;
        f.volume = 1.0;
    };
    Sound.hurt = function () {
        var f = game_1.Game.randTable(Sound.hurtSounds);
        f.play();
        f.currentTime = 0;
    };
    Sound.enemySpawn = function () {
        Sound.enemySpawnSound.play();
        Sound.enemySpawnSound.currentTime = 0;
    };
    Sound.chest = function () {
        var f = game_1.Game.randTable(Sound.chestSounds);
        f.play();
        f.currentTime = 0;
    };
    Sound.pickupCoin = function () {
        var f = game_1.Game.randTable(Sound.coinPickupSounds);
        f.play();
        f.currentTime = 0;
    };
    Sound.mine = function () {
        var f = game_1.Game.randTable(Sound.miningSounds);
        f.play();
        f.currentTime = 0;
    };
    Sound.breakRock = function () {
        Sound.breakRockSound.play();
        Sound.breakRockSound.currentTime = 0;
    };
    Sound.powerup = function () {
        Sound.powerupSound.play();
        Sound.powerupSound.currentTime = 0;
    };
    Sound.heal = function () {
        Sound.healSound.play();
        Sound.healSound.currentTime = 0;
    };
    Sound.genericPickup = function () {
        Sound.genericPickupSound.play();
        Sound.genericPickupSound.currentTime = 0;
    };
    Sound.push = function () {
        var f = game_1.Game.randTable(Sound.pushSounds);
        f.play();
        f.currentTime = 0;
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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var gameConstants_1 = __webpack_require__(2);
var sound_1 = __webpack_require__(6);
var Item = /** @class */ (function () {
    function Item(level, x, y) {
        var _this = this;
        this.tick = function () { };
        this.tickInInventory = function () { }; // different tick behavior for when we have the item in our inventory
        this.getDescription = function () {
            return "";
        };
        this.pickupSound = function () {
            sound_1.Sound.genericPickup();
        };
        this.onPickup = function (player) {
            if (!_this.pickedUp) {
                _this.pickupSound();
                _this.pickedUp = true;
                player.inventory.addItem(_this);
            }
        };
        this.draw = function () {
            if (!_this.pickedUp) {
                game_1.Game.drawItem(0, 0, 1, 1, _this.x, _this.y, 1, 1);
                _this.frame += (Math.PI * 2) / 60;
                game_1.Game.drawItem(_this.tileX, _this.tileY, 1, 2, _this.x, _this.y + Math.sin(_this.frame) * 0.07 - 1, _this.w, _this.h);
            }
        };
        this.drawTopLayer = function () {
            if (_this.pickedUp) {
                _this.y -= 0.125;
                _this.alpha -= 0.03;
                if (_this.y < -1)
                    _this.level.items = _this.level.items.filter(function (x) { return x !== _this; }); // removes itself from the level
                game_1.Game.ctx.globalAlpha = Math.max(0, _this.alpha);
                game_1.Game.drawItem(_this.tileX, _this.tileY, 1, 2, _this.x, _this.y - 1, _this.w, _this.h);
                game_1.Game.ctx.globalAlpha = 1.0;
            }
        };
        this.drawIcon = function (x, y) {
            game_1.Game.drawItem(_this.tileX, _this.tileY, 1, 2, x, y - 1, _this.w, _this.h);
            var countText = _this.stackCount <= 1 ? "" : "" + _this.stackCount;
            var width = game_1.Game.ctx.measureText(countText).width;
            var countX = 16 - width;
            var countY = 8;
            game_1.Game.ctx.fillStyle = "black";
            for (var xx = -1; xx <= 1; xx++) {
                for (var yy = -1; yy <= 1; yy++) {
                    game_1.Game.ctx.fillStyle = gameConstants_1.GameConstants.OUTLINE;
                    game_1.Game.ctx.fillText(countText, x * gameConstants_1.GameConstants.TILESIZE + countX + xx, y * gameConstants_1.GameConstants.TILESIZE + countY + yy);
                }
            }
            game_1.Game.ctx.fillStyle = "white";
            game_1.Game.ctx.fillText(countText, x * gameConstants_1.GameConstants.TILESIZE + countX, y * gameConstants_1.GameConstants.TILESIZE + countY);
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
        this.pickedUp = false;
        this.alpha = 1;
    }
    return Item;
}());
exports.Item = Item;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Particle = /** @class */ (function () {
    function Particle() {
        this.drawBehind = function () { }; // drawing behind player and such
        this.draw = function () { }; // drawing on top of player and such
    }
    return Particle;
}());
exports.Particle = Particle;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var item_1 = __webpack_require__(7);
var game_1 = __webpack_require__(0);
var Gem = /** @class */ (function (_super) {
    __extends(Gem, _super);
    function Gem(level, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.TICKS = 0;
        _this.tick = function () {
            if (_this.firstTickCounter < _this.TICKS)
                _this.firstTickCounter++;
        };
        _this.getDescription = function () {
            return "GEM\nA shiny emerald.";
        };
        _this.draw = function () {
            if (_this.firstTickCounter < _this.TICKS)
                return;
            if (_this.pickedUp)
                return;
            if (_this.scaleFactor < 1)
                _this.scaleFactor += 0.04;
            else
                _this.scaleFactor = 1;
            game_1.Game.drawItem(0, 0, 1, 1, _this.x, _this.y - 0.25, 1, 1);
            _this.frame += (Math.PI * 2) / 60;
            game_1.Game.drawItem(_this.tileX, _this.tileY, 1, 2, _this.x + _this.w * (_this.scaleFactor * -0.5 + 0.5), _this.y + Math.sin(_this.frame) * 0.07 - 1.5 + _this.h * (_this.scaleFactor * -0.5 + 0.5), _this.w * _this.scaleFactor, _this.h * _this.scaleFactor);
        };
        _this.tileX = 14;
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
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
    mouseLeftClickListeners: [],
    mouseLeftClickListener: function (x, y) {
        for (var i = 0; i < exports.Input.mouseLeftClickListeners.length; i++)
            exports.Input.mouseLeftClickListeners[i](x, y);
    },
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
            exports.Input.mouseLeftClickListener(Math.floor(x / game_1.Game.scale), Math.floor(y / game_1.Game.scale));
        }
    },
    updateMousePos: function (event) {
        var rect = window.document.getElementById("gameCanvas").getBoundingClientRect();
        var x = event.clientX - rect.left;
        var y = event.clientY - rect.top;
        exports.Input.mouseX = Math.floor(x / game_1.Game.scale);
        exports.Input.mouseY = Math.floor(y / game_1.Game.scale);
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
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var BottomDoor = /** @class */ (function (_super) {
    __extends(BottomDoor, _super);
    function BottomDoor(level, game, x, y, linkedDoor) {
        var _this = _super.call(this, level, x, y) || this;
        _this.canCrushEnemy = function () {
            return true;
        };
        _this.onCollide = function (player) {
            _this.game.changeLevelThroughDoor(_this.linkedDoor);
        };
        _this.drawAboveShading = function () {
            game_1.Game.drawFX(2, 2, 1, 1, _this.x, _this.y - 1.25 + 0.125 * Math.sin(0.006 * Date.now()), 1, 1);
        };
        _this.game = game;
        _this.linkedDoor = linkedDoor;
        return _this;
    }
    return BottomDoor;
}(tile_1.Tile));
exports.BottomDoor = BottomDoor;


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var item_1 = __webpack_require__(7);
var game_1 = __webpack_require__(0);
var Equippable = /** @class */ (function (_super) {
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
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var item_1 = __webpack_require__(7);
var game_1 = __webpack_require__(0);
var sound_1 = __webpack_require__(6);
var Coin = /** @class */ (function (_super) {
    __extends(Coin, _super);
    function Coin(level, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.TICKS = 0;
        _this.tick = function () {
            if (_this.firstTickCounter < _this.TICKS)
                _this.firstTickCounter++;
        };
        _this.pickupSound = function () {
            sound_1.Sound.pickupCoin();
        };
        _this.getDescription = function () {
            return "COINS\nA pound of gold coins.";
        };
        _this.draw = function () {
            if (_this.firstTickCounter < _this.TICKS)
                return;
            if (_this.pickedUp)
                return;
            if (_this.scaleFactor < 1)
                _this.scaleFactor += 0.04;
            else
                _this.scaleFactor = 1;
            game_1.Game.drawItem(0, 0, 1, 1, _this.x, _this.y - 0.25, 1, 1);
            _this.frame += (Math.PI * 2) / 60;
            game_1.Game.drawItem(_this.tileX, _this.tileY, 1, 2, _this.x + _this.w * (_this.scaleFactor * -0.5 + 0.5), _this.y + Math.sin(_this.frame) * 0.07 - 1.5 + _this.h * (_this.scaleFactor * -0.5 + 0.5), _this.w * _this.scaleFactor, _this.h * _this.scaleFactor);
        };
        _this.tileX = 20;
        _this.tileY = 0;
        _this.stackable = true;
        _this.firstTickCounter = 0;
        _this.scaleFactor = 0.2;
        return _this;
    }
    return Coin;
}(item_1.Item));
exports.Coin = Coin;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var Floor = /** @class */ (function (_super) {
    __extends(Floor, _super);
    function Floor(level, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.draw = function () {
            game_1.Game.drawTile(_this.variation, _this.skin, 1, 1, _this.x, _this.y, 1, 1, _this.isShaded());
        };
        _this.variation = 1;
        if (_this.skin == tile_1.SkinType.DUNGEON)
            _this.variation = game_1.Game.randTable([1, 1, 1, 1, 1, 1, 8, 8, 8, 9, 10, 10, 10, 10, 10, 12]);
        if (_this.skin == tile_1.SkinType.CAVE)
            //this.variation = Game.randTable([1, 1, 1, 1, 8, 9, 10, 12]);
            _this.variation = game_1.Game.randTable([1, 1, 1, 1, 1, 1, 8, 8, 8, 9, 10, 10, 10, 10, 10, 12]);
        return _this;
    }
    return Floor;
}(tile_1.Tile));
exports.Floor = Floor;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var Door = /** @class */ (function (_super) {
    __extends(Door, _super);
    function Door(level, game, x, y, linkedDoor) {
        var _this = _super.call(this, level, x, y) || this;
        _this.canCrushEnemy = function () {
            return true;
        };
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
        _this.drawAboveShading = function () {
            game_1.Game.drawFX(2, 2, 1, 1, _this.x, _this.y - 1.25 + 0.125 * Math.sin(0.006 * Date.now()), 1, 1);
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
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var levelConstants_1 = __webpack_require__(5);
var equippable_1 = __webpack_require__(12);
var Armor = /** @class */ (function (_super) {
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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var projectile_1 = __webpack_require__(18);
var game_1 = __webpack_require__(0);
var HitWarning = /** @class */ (function (_super) {
    __extends(HitWarning, _super);
    function HitWarning(game, x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.tick = function () {
            _this.dead = true;
        };
        _this.draw = function () {
            if ((_this.x === _this.game.player.x && Math.abs(_this.y - _this.game.player.y) <= 1) ||
                (_this.y === _this.game.player.y && Math.abs(_this.x - _this.game.player.x) <= 1))
                game_1.Game.drawFX(18 + Math.floor(HitWarning.frame), 6, 1, 1, _this.x, _this.y, 1, 1);
        };
        _this.game = game;
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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Projectile = /** @class */ (function () {
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
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var enemy_1 = __webpack_require__(4);
var Resource = /** @class */ (function (_super) {
    __extends(Resource, _super);
    function Resource(level, game, x, y) {
        var _this = _super.call(this, level, game, x, y) || this;
        _this.kill = function () {
            _this.dead = true;
        };
        _this.killNoBones = function () {
            _this.kill();
        };
        _this.draw = function () {
            if (!_this.dead) {
                game_1.Game.drawObj(_this.tileX, _this.tileY, 1, 2, _this.x - _this.drawX, _this.y - 1 - _this.drawY, 1, 2, _this.isShaded());
            }
        };
        _this.drawTopLayer = function () { };
        _this.tileX = 12;
        _this.tileY = 0;
        _this.health = 1;
        _this.chainPushable = false;
        return _this;
    }
    return Resource;
}(enemy_1.Enemy));
exports.Resource = Resource;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var equippable_1 = __webpack_require__(12);
var Key = /** @class */ (function (_super) {
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
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var key_1 = __webpack_require__(20);
var heart_1 = __webpack_require__(39);
var armor_1 = __webpack_require__(16);
var enemy_1 = __webpack_require__(4);
var gem_1 = __webpack_require__(9);
var genericParticle_1 = __webpack_require__(3);
var coin_1 = __webpack_require__(13);
var sound_1 = __webpack_require__(6);
var Chest = /** @class */ (function (_super) {
    __extends(Chest, _super);
    function Chest(level, game, x, y) {
        var _this = _super.call(this, level, game, x, y) || this;
        _this.kill = function () {
            sound_1.Sound.chest();
            _this.dead = true;
            // DROP TABLES!
            genericParticle_1.GenericParticle.spawnCluster(_this.level, _this.x + 0.5, _this.y + 0.5, "#fbf236");
            var drop = game_1.Game.randTable([1, 1, 1, 2, 2, 3]);
            switch (drop) {
                case 1:
                    _this.game.level.items.push(new coin_1.Coin(_this.level, _this.x, _this.y));
                    break;
                case 2:
                    _this.game.level.items.push(new heart_1.Heart(_this.level, _this.x, _this.y));
                    break;
                case 3:
                    _this.game.level.items.push(new gem_1.Gem(_this.level, _this.x, _this.y));
                    break;
                case 3:
                    _this.game.level.items.push(new key_1.Key(_this.level, _this.x, _this.y));
                    break;
                case 4:
                    _this.game.level.items.push(new armor_1.Armor(_this.level, _this.x, _this.y));
                    break;
            }
        };
        _this.killNoBones = function () {
            _this.kill();
        };
        _this.draw = function () {
            if (!_this.dead) {
                game_1.Game.drawObj(_this.tileX, _this.tileY, 1, 2, _this.x - _this.drawX, _this.y - 1 - _this.drawY, 1, 2, _this.isShaded());
            }
        };
        _this.drawTopLayer = function () { };
        _this.tileX = 4;
        _this.tileY = 0;
        _this.health = 1;
        return _this;
    }
    return Chest;
}(enemy_1.Enemy));
exports.Chest = Chest;


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var floor_1 = __webpack_require__(14);
var Bones = /** @class */ (function (_super) {
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
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var gameConstants_1 = __webpack_require__(2);
var particle_1 = __webpack_require__(8);
var DeathParticle = /** @class */ (function (_super) {
    __extends(DeathParticle, _super);
    function DeathParticle(x, y) {
        var _this = _super.call(this) || this;
        _this.draw = function () {
            var yOffset = Math.max(0, ((_this.frame - 3) * 3) / gameConstants_1.GameConstants.TILESIZE);
            var f = Math.round(_this.frame);
            if (f == 2 || f == 4 || f == 6)
                game_1.Game.drawMob(2, 0, 1, 2, _this.x, _this.y - yOffset, 1, 2, false);
            else
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
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var levelConstants_1 = __webpack_require__(5);
var HealthBar = /** @class */ (function () {
    function HealthBar() {
        var _this = this;
        this.hurt = function () {
            _this.hurtTimer = Date.now();
        };
        this.draw = function (hearts, maxHearts, x, y, flashing) {
            var t = Date.now() - _this.hurtTimer;
            if (t <= levelConstants_1.LevelConstants.HEALTH_BAR_TOTALTIME) {
                var fullHearts = Math.floor(hearts);
                var halfHearts = Math.ceil(hearts - fullHearts);
                var emptyHearts = maxHearts - fullHearts - halfHearts;
                // I wouldn't normally use magic numbers here, but these are hardcoded based on the tileset
                //   (which isn't really parameterizable)
                var drawWidth = Math.round(Math.min(9, Math.min(0.05 * (levelConstants_1.LevelConstants.HEALTH_BAR_TOTALTIME - t), 0.05 * t)));
                var drawHeight = Math.round(Math.min(0.5, Math.min(0.003 * (levelConstants_1.LevelConstants.HEALTH_BAR_TOTALTIME - t), 0.003 * t)) * 16) / 16.0;
                var width = (drawWidth * (maxHearts - 1) + 8) / 16.0;
                var xxStart = 0.5 + -width / 2;
                for (var i = 0; i < Math.ceil(0.5 * maxHearts); i++) {
                    var tileX = 0;
                    if (!flashing)
                        tileX = 1.5;
                    else if (i < fullHearts)
                        tileX = 0;
                    else if (i < fullHearts + halfHearts)
                        tileX = 0.5;
                    else
                        tileX = 1;
                    var xx = (drawWidth * i) / 16.0 + xxStart;
                    game_1.Game.drawFX(tileX, 8, 0.5, 0.5, x + xx, y - 1 - drawHeight / 2, 0.5, drawHeight);
                    xx += 9.0 / 16.0;
                    var j = maxHearts - i - 1;
                    if (j !== i) {
                        var tileX_1 = 0;
                        if (!flashing)
                            tileX_1 = 1.5;
                        else if (j < fullHearts)
                            tileX_1 = 0;
                        else if (j < fullHearts + halfHearts)
                            tileX_1 = 0.5;
                        else
                            tileX_1 = 1;
                        var xx_1 = (drawWidth * j) / 16.0 + xxStart;
                        game_1.Game.drawFX(tileX_1, 8, 0.5, 0.5, x + xx_1, y - 1 - drawHeight / 2, 0.5, drawHeight);
                        xx_1 += 9.0 / 16.0;
                    }
                }
            }
        };
        this.hurtTimer = 0;
    }
    return HealthBar;
}());
exports.HealthBar = HealthBar;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var item_1 = __webpack_require__(7);
var game_1 = __webpack_require__(0);
var Coal = /** @class */ (function (_super) {
    __extends(Coal, _super);
    function Coal(level, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.TICKS = 0;
        _this.tick = function () {
            if (_this.firstTickCounter < _this.TICKS)
                _this.firstTickCounter++;
        };
        _this.getDescription = function () {
            return "COAL\nA lump of coal.";
        };
        _this.draw = function () {
            if (_this.firstTickCounter < _this.TICKS)
                return;
            if (_this.pickedUp)
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
    return Coal;
}(item_1.Item));
exports.Coal = Coal;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var item_1 = __webpack_require__(7);
var game_1 = __webpack_require__(0);
var Gold = /** @class */ (function (_super) {
    __extends(Gold, _super);
    function Gold(level, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.TICKS = 0;
        _this.tick = function () {
            if (_this.firstTickCounter < _this.TICKS)
                _this.firstTickCounter++;
        };
        _this.getDescription = function () {
            return "GOLD\nA nugget of gold.";
        };
        _this.draw = function () {
            if (_this.firstTickCounter < _this.TICKS)
                return;
            if (_this.pickedUp)
                return;
            if (_this.scaleFactor < 1)
                _this.scaleFactor += 0.04;
            else
                _this.scaleFactor = 1;
            game_1.Game.drawItem(0, 0, 1, 1, _this.x, _this.y - 0.25, 1, 1);
            _this.frame += (Math.PI * 2) / 60;
            game_1.Game.drawItem(_this.tileX, _this.tileY, 1, 2, _this.x + _this.w * (_this.scaleFactor * -0.5 + 0.5), _this.y + Math.sin(_this.frame) * 0.07 - 1.5 + _this.h * (_this.scaleFactor * -0.5 + 0.5), _this.w * _this.scaleFactor, _this.h * _this.scaleFactor);
        };
        _this.tileX = 18;
        _this.tileY = 0;
        _this.stackable = true;
        _this.firstTickCounter = 0;
        _this.scaleFactor = 0.2;
        return _this;
    }
    return Gold;
}(item_1.Item));
exports.Gold = Gold;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var crate_1 = __webpack_require__(28);
var barrel_1 = __webpack_require__(29);
var SpikeTrap = /** @class */ (function (_super) {
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
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var enemy_1 = __webpack_require__(4);
var game_1 = __webpack_require__(0);
var genericParticle_1 = __webpack_require__(3);
var Crate = /** @class */ (function (_super) {
    __extends(Crate, _super);
    function Crate(level, game, x, y) {
        var _this = _super.call(this, level, game, x, y) || this;
        _this.kill = function () {
            _this.dead = true;
            genericParticle_1.GenericParticle.spawnCluster(_this.level, _this.x + 0.5, _this.y + 0.5, "#d9a066");
        };
        _this.killNoBones = function () {
            _this.kill();
        };
        _this.draw = function () {
            // not inherited because it doesn't have the 0.5 offset
            if (!_this.dead) {
                _this.drawX += -0.5 * _this.drawX;
                _this.drawY += -0.5 * _this.drawY;
                game_1.Game.drawObj(_this.tileX, _this.tileY, 1, 2, _this.x - _this.drawX, _this.y - 1 - _this.drawY, 1, 2, _this.isShaded());
            }
        };
        _this.drawTopLayer = function () { };
        _this.level = level;
        _this.health = 1;
        _this.maxHealth = 1;
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
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var enemy_1 = __webpack_require__(4);
var game_1 = __webpack_require__(0);
var genericParticle_1 = __webpack_require__(3);
var Barrel = /** @class */ (function (_super) {
    __extends(Barrel, _super);
    function Barrel(level, game, x, y) {
        var _this = _super.call(this, level, game, x, y) || this;
        _this.kill = function () {
            _this.dead = true;
            genericParticle_1.GenericParticle.spawnCluster(_this.level, _this.x + 0.5, _this.y + 0.5, "#9badb7");
        };
        _this.killNoBones = function () {
            _this.kill();
        };
        _this.draw = function () {
            // not inherited because it doesn't have the 0.5 offset
            if (!_this.dead) {
                _this.drawX += -0.5 * _this.drawX;
                _this.drawY += -0.5 * _this.drawY;
                game_1.Game.drawObj(_this.tileX, _this.tileY, 1, 2, _this.x - _this.drawX, _this.y - 1 - _this.drawY, 1, 2, _this.isShaded());
            }
        };
        _this.drawTopLayer = function () { };
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
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var enemy_1 = __webpack_require__(4);
var game_1 = __webpack_require__(0);
var hitWarning_1 = __webpack_require__(17);
var genericParticle_1 = __webpack_require__(3);
var coin_1 = __webpack_require__(13);
var SkullEnemy = /** @class */ (function (_super) {
    __extends(SkullEnemy, _super);
    function SkullEnemy(level, game, x, y) {
        var _this = _super.call(this, level, game, x, y) || this;
        _this.REGEN_TICKS = 5;
        _this.hit = function () {
            return 0.5;
        };
        _this.hurt = function (damage) {
            _this.ticksSinceFirstHit = 0;
            _this.health -= damage;
            _this.healthBar.hurt();
            if (_this.health <= 0) {
                _this.kill();
            }
            else {
                genericParticle_1.GenericParticle.spawnCluster(_this.level, _this.x + 0.5, _this.y + 0.5, _this.deathParticleColor);
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
                    if (_this.seenPlayer || _this.level.softVisibilityArray[_this.x][_this.y] > 0) {
                        _this.seenPlayer = true;
                        var oldX = _this.x;
                        var oldY = _this.y;
                        if (_this.game.player.x > _this.x)
                            _this.dx++;
                        if (_this.game.player.x < _this.x)
                            _this.dx--;
                        if (_this.game.player.y > _this.y)
                            _this.dy++;
                        if (_this.game.player.y < _this.y)
                            _this.dy--;
                        var moveX = _this.x;
                        var moveY = _this.y;
                        if (Math.abs(_this.dx) > Math.abs(_this.dy) ||
                            (_this.dx === _this.dy &&
                                Math.abs(_this.game.player.x - _this.x) >= Math.abs(_this.game.player.y - _this.y))) {
                            if (_this.dx > 0) {
                                moveX++;
                                _this.dx--;
                            }
                            else if (_this.dx < 0) {
                                moveX--;
                                _this.dx++;
                            }
                        }
                        else {
                            if (_this.dy > 0) {
                                moveY++;
                                _this.dy--;
                            }
                            else if (_this.dy < 0) {
                                moveY--;
                                _this.dy++;
                            }
                        }
                        if (_this.game.player.x === moveX && _this.game.player.y === moveY) {
                            _this.game.player.hurt(_this.hit());
                            _this.drawX = 0.5 * (_this.x - _this.game.player.x);
                            _this.drawY = 0.5 * (_this.y - _this.game.player.y);
                            _this.game.shakeScreen(10 * _this.drawX, 10 * _this.drawY);
                        }
                        else {
                            _this.tryMove(moveX, moveY);
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
                        _this.level.projectiles.push(new hitWarning_1.HitWarning(_this.game, _this.x - 1, _this.y));
                        _this.level.projectiles.push(new hitWarning_1.HitWarning(_this.game, _this.x + 1, _this.y));
                        _this.level.projectiles.push(new hitWarning_1.HitWarning(_this.game, _this.x, _this.y - 1));
                        _this.level.projectiles.push(new hitWarning_1.HitWarning(_this.game, _this.x, _this.y + 1));
                    }
                }
            }
        };
        _this.draw = function () {
            if (!_this.dead) {
                _this.tileX = 5;
                _this.tileY = 8;
                if (_this.health === 1) {
                    _this.tileX = 3;
                    _this.tileY = 0;
                    if (_this.ticksSinceFirstHit >= 3) {
                        _this.flashingFrame += 0.1;
                        if (Math.floor(_this.flashingFrame) % 2 === 0) {
                            _this.tileX = 2;
                        }
                    }
                }
                _this.frame += 0.1;
                if (_this.frame >= 4)
                    _this.frame = 0;
                _this.drawX += -0.5 * _this.drawX;
                _this.drawY += -0.5 * _this.drawY;
                if (_this.health === 2 && _this.doneMoving() && _this.game.player.doneMoving())
                    _this.facePlayer();
                if (_this.hasShadow)
                    game_1.Game.drawMob(0, 0, 1, 1, _this.x - _this.drawX, _this.y - _this.drawY, 1, 1, _this.isShaded());
                game_1.Game.drawMob(_this.tileX + (_this.tileX === 5 ? Math.floor(_this.frame) : 0), _this.tileY + _this.direction * 2, 1, 2, _this.x - _this.drawX, _this.y - 1.5 - _this.drawY, 1, 2, _this.isShaded());
            }
        };
        _this.dropLoot = function () {
            _this.game.level.items.push(new coin_1.Coin(_this.level, _this.x, _this.y));
        };
        _this.ticks = 0;
        _this.frame = 0;
        _this.health = 2;
        _this.maxHealth = 2;
        _this.tileX = 5;
        _this.tileY = 8;
        _this.seenPlayer = true;
        _this.ticksSinceFirstHit = 0;
        _this.flashingFrame = 0;
        _this.dx = 0;
        _this.dy = 0;
        _this.deathParticleColor = "#ffffff";
        return _this;
    }
    return SkullEnemy;
}(enemy_1.Enemy));
exports.SkullEnemy = SkullEnemy;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var input_1 = __webpack_require__(10);
var gameConstants_1 = __webpack_require__(2);
var game_1 = __webpack_require__(0);
var door_1 = __webpack_require__(15);
var bottomDoor_1 = __webpack_require__(11);
var trapdoor_1 = __webpack_require__(32);
var inventory_1 = __webpack_require__(33);
var lockedDoor_1 = __webpack_require__(34);
var sound_1 = __webpack_require__(6);
var textParticle_1 = __webpack_require__(35);
var dashParticle_1 = __webpack_require__(36);
var levelConstants_1 = __webpack_require__(5);
var stats_1 = __webpack_require__(37);
var chest_1 = __webpack_require__(21);
var map_1 = __webpack_require__(40);
var slashParticle_1 = __webpack_require__(41);
var healthbar_1 = __webpack_require__(24);
var shopScreen_1 = __webpack_require__(42);
var PlayerDirection;
(function (PlayerDirection) {
    PlayerDirection[PlayerDirection["DOWN"] = 0] = "DOWN";
    PlayerDirection[PlayerDirection["UP"] = 1] = "UP";
    PlayerDirection[PlayerDirection["RIGHT"] = 2] = "RIGHT";
    PlayerDirection[PlayerDirection["LEFT"] = 3] = "LEFT";
})(PlayerDirection || (PlayerDirection = {}));
var Player = /** @class */ (function () {
    function Player(game, x, y) {
        var _this = this;
        this.iListener = function () {
            _this.inventory.open();
            _this.shopScreen.close();
        };
        this.iUpListener = function () {
            //this.inventory.close();
        };
        this.leftListener = function () {
            if (!_this.dead && _this.game.levelState === game_1.LevelState.IN_LEVEL) {
                if (_this.shopScreen.isOpen)
                    _this.shopScreen.close();
                /*if (Input.isDown(Input.SPACE)) {
                  GenericParticle.spawnCluster(this.game.level, this.x - 1 + 0.5, this.y + 0.5, "#ff00ff");
                  this.healthBar.hurt();
                  this.game.level.items.push(new Coal(this.game.level, this.x - 1, this.y));
                } else */
                _this.tryMove(_this.x - 1, _this.y);
                _this.direction = PlayerDirection.LEFT;
            }
        };
        this.rightListener = function () {
            if (!_this.dead && _this.game.levelState === game_1.LevelState.IN_LEVEL) {
                //if (Input.isDown(Input.SPACE)) this.tryDash(1, 0);
                //else
                if (_this.shopScreen.isOpen)
                    _this.shopScreen.close();
                _this.tryMove(_this.x + 1, _this.y);
                _this.direction = PlayerDirection.RIGHT;
            }
        };
        this.upListener = function () {
            if (!_this.dead && _this.game.levelState === game_1.LevelState.IN_LEVEL) {
                //if (Input.isDown(Input.SPACE)) this.tryDash(0, -1);
                //else
                if (_this.shopScreen.isOpen)
                    _this.shopScreen.close();
                _this.tryMove(_this.x, _this.y - 1);
                _this.direction = PlayerDirection.UP;
            }
        };
        this.downListener = function () {
            if (!_this.dead && _this.game.levelState === game_1.LevelState.IN_LEVEL) {
                //if (Input.isDown(Input.SPACE)) this.tryDash(0, 1);
                //else
                if (_this.shopScreen.isOpen)
                    _this.shopScreen.close();
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
        this.tryCollide = function (other, newX, newY) {
            if (newX >= other.x + other.w || newX + _this.w <= other.x)
                return false;
            if (newY >= other.y + other.h || newY + _this.h <= other.y)
                return false;
            return true;
        };
        this.tryMove = function (x, y) {
            for (var _i = 0, _a = _this.game.level.enemies; _i < _a.length; _i++) {
                var e = _a[_i];
                if (_this.tryCollide(e, x, y)) {
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
                            (_this.game.level.levelArray[nextX][nextY].canCrushEnemy() || enemyEnd)) {
                            if (e.destroyable) {
                                e.kill();
                                sound_1.Sound.hit();
                                _this.drawX = 0.5 * (_this.x - e.x);
                                _this.drawY = 0.5 * (_this.y - e.y);
                                _this.game.level.particles.push(new slashParticle_1.SlashParticle(e.x, e.y));
                                _this.game.level.tick();
                                _this.game.shakeScreen(10 * _this.drawX, 10 * _this.drawY);
                                return;
                            }
                        }
                        else {
                            sound_1.Sound.push();
                            // here pushedEnemies may still be []
                            for (var _d = 0, pushedEnemies_1 = pushedEnemies; _d < pushedEnemies_1.length; _d++) {
                                var f = pushedEnemies_1[_d];
                                f.x += dx;
                                f.y += dy;
                                f.drawX = dx;
                                f.drawY = dy;
                                f.skipNextTurns = 1; // skip next turn, so they don't move while we're pushing them
                            }
                            if (_this.game.level.levelArray[nextX][nextY].canCrushEnemy() || enemyEnd)
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
                            // and hurt it
                            e.hurt(1);
                            sound_1.Sound.hit();
                            _this.drawX = 0.5 * (_this.x - e.x);
                            _this.drawY = 0.5 * (_this.y - e.y);
                            _this.game.level.particles.push(new slashParticle_1.SlashParticle(e.x, e.y));
                            _this.game.level.tick();
                            _this.game.shakeScreen(10 * _this.drawX, 10 * _this.drawY);
                            return;
                        }
                        else if (e.interactable) {
                            e.interact();
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
            sound_1.Sound.hurt();
            if (_this.inventory.getArmor() && _this.inventory.getArmor().health > 0) {
                _this.inventory.getArmor().hurt(damage);
            }
            else {
                _this.healthBar.hurt();
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
            sound_1.Sound.playerStoneFootstep();
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
            }
        };
        this.drawPlayerSprite = function () {
            _this.frame += 0.1;
            if (_this.frame >= 4)
                _this.frame = 0;
            game_1.Game.drawMob(1 + Math.floor(_this.frame), 8 + _this.direction * 2, 1, 2, _this.x - _this.drawX, _this.y - 1.5 - _this.drawY, 1, 2);
            if (_this.inventory.getArmor() && _this.inventory.getArmor().health > 0) {
                // TODO draw armor
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
            _this.healthBar.draw(_this.health, _this.maxHealth, _this.x - _this.drawX, _this.y - _this.drawY, !_this.flashing || Math.floor(_this.flashingFrame) % 2 === 0);
        };
        this.drawGUI = function () {
            if (!_this.dead) {
                _this.shopScreen.draw();
                _this.inventory.draw();
                if (_this.guiHeartFrame > 0)
                    _this.guiHeartFrame++;
                if (_this.guiHeartFrame > 5) {
                    _this.guiHeartFrame = 0;
                }
                for (var i = 0; i < _this.maxHealth; i++) {
                    var frame = _this.guiHeartFrame > 0 ? 1 : 0;
                    if (i >= Math.floor(_this.health)) {
                        if (i == Math.floor(_this.health) && (_this.health * 2) % 2 == 1) {
                            // draw half heart
                            game_1.Game.drawFX(4, 2, 1, 1, i, levelConstants_1.LevelConstants.SCREEN_H - 1, 1, 1);
                        }
                        else {
                            game_1.Game.drawFX(3, 2, 1, 1, i, levelConstants_1.LevelConstants.SCREEN_H - 1, 1, 1);
                        }
                    }
                    else
                        game_1.Game.drawFX(frame, 2, 1, 1, i, levelConstants_1.LevelConstants.SCREEN_H - 1, 1, 1);
                }
                if (_this.inventory.getArmor())
                    _this.inventory.getArmor().drawGUI(_this.maxHealth);
            }
            else {
                game_1.Game.ctx.fillStyle = levelConstants_1.LevelConstants.LEVEL_TEXT_COLOR;
                var gameOverString = "Game Over.";
                game_1.Game.ctx.fillText(gameOverString, gameConstants_1.GameConstants.WIDTH / 2 - game_1.Game.ctx.measureText(gameOverString).width / 2, gameConstants_1.GameConstants.HEIGHT / 2);
                var refreshString = "[refresh to restart]";
                game_1.Game.ctx.fillText(refreshString, gameConstants_1.GameConstants.WIDTH / 2 - game_1.Game.ctx.measureText(refreshString).width / 2, gameConstants_1.GameConstants.HEIGHT / 2 + gameConstants_1.GameConstants.FONT_SIZE);
            }
            if (input_1.Input.isDown(input_1.Input.M)) {
                _this.map.draw();
            }
        };
        this.game = game;
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 1;
        this.frame = 0;
        this.direction = PlayerDirection.UP;
        input_1.Input.iListener = this.iListener;
        input_1.Input.iUpListener = this.iUpListener;
        input_1.Input.leftListener = this.leftListener;
        input_1.Input.rightListener = this.rightListener;
        input_1.Input.upListener = this.upListener;
        input_1.Input.downListener = this.downListener;
        this.health = 1;
        this.maxHealth = 1;
        this.healthBar = new healthbar_1.HealthBar();
        this.stats = new stats_1.Stats();
        this.dead = false;
        this.flashing = false;
        this.flashingFrame = 0;
        this.lastTickHealth = this.health;
        this.guiHeartFrame = 0;
        this.inventory = new inventory_1.Inventory(game);
        this.shopScreen = new shopScreen_1.ShopScreen(game);
        this.missProb = 0.1;
        this.sightRadius = 5; // maybe can be manipulated by items? e.g. better torch
        this.map = new map_1.Map(this.game);
    }
    return Player;
}());
exports.Player = Player;


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var Trapdoor = /** @class */ (function (_super) {
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
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var input_1 = __webpack_require__(10);
var gameConstants_1 = __webpack_require__(2);
var equippable_1 = __webpack_require__(12);
var armor_1 = __webpack_require__(16);
var coin_1 = __webpack_require__(13);
var Inventory = /** @class */ (function () {
    function Inventory(game) {
        var _this = this;
        this.tileX = 0;
        this.tileY = 0;
        this.open = function () {
            _this.isOpen = !_this.isOpen;
        };
        this.close = function () {
            _this.isOpen = false;
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
        this.coinCount = function () {
            return _this.coins;
        };
        this.subtractCoins = function (n) {
            _this.coins -= n;
        };
        this.addCoins = function (n) {
            _this.coins += n;
        };
        this.addItem = function (item) {
            if (item instanceof coin_1.Coin) {
                _this.coins += 1;
                return;
            }
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
        this.removeItem = function (item) {
            var i = _this.items.indexOf(item);
            if (i !== -1) {
                _this.items.splice(i, 1);
            }
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
            if (!_this.isOpen)
                return;
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
            var coinX = 15.5;
            var coinY = 15.5;
            game_1.Game.drawItem(20, 0, 1, 2, coinX, coinY - 1, 1, 2);
            var countText = "" + _this.coins;
            var width = game_1.Game.ctx.measureText(countText).width;
            var countX = 16 - width;
            var countY = 8;
            game_1.Game.ctx.fillStyle = "black";
            for (var xx = -1; xx <= 1; xx++) {
                for (var yy = -1; yy <= 1; yy++) {
                    game_1.Game.ctx.fillStyle = gameConstants_1.GameConstants.OUTLINE;
                    game_1.Game.ctx.fillText(countText, coinX * gameConstants_1.GameConstants.TILESIZE + countX + xx, coinY * gameConstants_1.GameConstants.TILESIZE + countY + yy);
                }
            }
            game_1.Game.ctx.fillStyle = "white";
            game_1.Game.ctx.fillText(countText, coinX * gameConstants_1.GameConstants.TILESIZE + countX, coinY * gameConstants_1.GameConstants.TILESIZE + countY);
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
        input_1.Input.mouseLeftClickListeners.push(this.mouseLeftClickListener);
        this.coins = 0;
    }
    return Inventory;
}());
exports.Inventory = Inventory;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var key_1 = __webpack_require__(20);
var tile_1 = __webpack_require__(1);
var LockedDoor = /** @class */ (function (_super) {
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
        _this.canCrushEnemy = function () {
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
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var gameConstants_1 = __webpack_require__(2);
var particle_1 = __webpack_require__(8);
var TextParticle = /** @class */ (function (_super) {
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
        // up to a 10 tick delay
        else
            _this.delay = delay;
        return _this;
    }
    return TextParticle;
}(particle_1.Particle));
exports.TextParticle = TextParticle;


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var particle_1 = __webpack_require__(8);
var DashParticle = /** @class */ (function (_super) {
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
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var statconstants_1 = __webpack_require__(38);
var game_1 = __webpack_require__(0);
var gameConstants_1 = __webpack_require__(2);
var levelConstants_1 = __webpack_require__(5);
var Stats = /** @class */ (function () {
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
            if (_this.xp > _this.xpToLevelUp) { // level up
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
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var StatConstants = /** @class */ (function () {
    function StatConstants() {
    }
    StatConstants.LEVELS = 8;
    // length should be LEVELS - 1
    StatConstants.LEVEL_UP_TABLE = [100, 500, 2500, 10000, 50000, 250000, 1000000];
    return StatConstants;
}());
exports.StatConstants = StatConstants;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var item_1 = __webpack_require__(7);
var sound_1 = __webpack_require__(6);
var Heart = /** @class */ (function (_super) {
    __extends(Heart, _super);
    function Heart(level, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.onPickup = function (player) {
            player.health = Math.min(player.maxHealth, player.health + 1);
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
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var gameConstants_1 = __webpack_require__(2);
var door_1 = __webpack_require__(15);
var bottomDoor_1 = __webpack_require__(11);
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
var Map = /** @class */ (function () {
    function Map(game) {
        var _this = this;
        this.draw = function () {
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
                if (_this.game.level.depth == level.depth) {
                    game_1.Game.ctx.fillStyle = "black";
                    if (!level.entered)
                        game_1.Game.ctx.fillStyle = "#606060";
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
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var particle_1 = __webpack_require__(8);
var SlashParticle = /** @class */ (function (_super) {
    __extends(SlashParticle, _super);
    function SlashParticle(x, y) {
        var _this = _super.call(this) || this;
        _this.draw = function () {
            game_1.Game.drawFX(Math.round(_this.frame), 13, 1, 1, _this.x, _this.y, 1, 1);
            _this.frame += 0.5;
            if (_this.frame > 9)
                _this.dead = true;
        };
        _this.x = x;
        _this.y = y - 0.25;
        _this.dead = false;
        _this.frame = 0;
        return _this;
    }
    return SlashParticle;
}(particle_1.Particle));
exports.SlashParticle = SlashParticle;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var input_1 = __webpack_require__(10);
var gameConstants_1 = __webpack_require__(2);
var armor_1 = __webpack_require__(16);
var shopData_1 = __webpack_require__(43);
var coal_1 = __webpack_require__(25);
var gem_1 = __webpack_require__(9);
var gold_1 = __webpack_require__(26);
var ShopState;
(function (ShopState) {
    ShopState[ShopState["MAINSCREEN"] = 0] = "MAINSCREEN";
    ShopState[ShopState["BUYING"] = 1] = "BUYING";
    ShopState[ShopState["SELLING"] = 2] = "SELLING";
})(ShopState = exports.ShopState || (exports.ShopState = {}));
var BACK_BUTTON_X = 3;
var BACK_BUTTON_Y = 3;
var LEFT_BUTTON_X = 0.5 * (17 - 11);
var LEFT_BUTTON_Y = 0.5 * (17 - 5);
var RIGHT_BUTTON_X = 0.5 * (17 - 11) + 0.5 * 11;
var RIGHT_BUTTON_Y = 0.5 * (17 - 5);
var ShopScreen = /** @class */ (function () {
    function ShopScreen(game) {
        var _this = this;
        this.tileX = 0;
        this.tileY = 0;
        this.open = function () {
            _this.isOpen = true;
            _this.game.player.inventory.close();
        };
        this.close = function () {
            _this.isOpen = false;
        };
        this.mouseLeftClickListener = function (x, y) {
            if (!_this.isOpen)
                return;
            var tileX = Math.floor(x / gameConstants_1.GameConstants.TILESIZE);
            var tileY = Math.floor(y / gameConstants_1.GameConstants.TILESIZE);
            var slotX = Math.floor((x - 51) / 19);
            var slotY = Math.floor((y - 70) / 19);
            var i = slotX + slotY * 9;
            var backButtonLit = tileX >= BACK_BUTTON_X &&
                tileY >= BACK_BUTTON_Y &&
                tileX < BACK_BUTTON_X + 3 &&
                tileY < BACK_BUTTON_Y + 1;
            switch (_this.shopState) {
                case ShopState.MAINSCREEN:
                    var leftButtonLit = tileX >= LEFT_BUTTON_X &&
                        tileY >= LEFT_BUTTON_Y &&
                        tileX < LEFT_BUTTON_X + 5 &&
                        tileY < LEFT_BUTTON_Y + 5;
                    if (leftButtonLit)
                        _this.shopState = ShopState.BUYING;
                    var rightButtonLit = tileX >= RIGHT_BUTTON_X &&
                        tileY >= RIGHT_BUTTON_Y &&
                        tileX < RIGHT_BUTTON_X + 5 &&
                        tileY < RIGHT_BUTTON_Y + 5;
                    if (rightButtonLit)
                        _this.shopState = ShopState.SELLING;
                    if (backButtonLit)
                        _this.close();
                    break;
                case ShopState.BUYING:
                    if (i >= 0 && i < _this.shopData.buyItems.length) {
                        if (_this.game.player.inventory.coinCount() >= _this.shopData.buyItems[i].price) {
                            if (_this.shopData.buyItems[i].item === null) {
                                switch (_this.shopData.buyItems[i].shopItem) {
                                    case shopData_1.ShopItems.TORCH:
                                        _this.game.player.sightRadius += 2;
                                        _this.game.player.inventory.subtractCoins(_this.shopData.buyItems[i].price);
                                        var t = Math.floor(0.5 * _this.game.player.sightRadius);
                                        _this.shopData.buyItems[i].price = Math.round(Math.pow(5, t + Math.pow(1.05, t) - 2.05));
                                        break;
                                    case shopData_1.ShopItems.EMPTYHEART:
                                        _this.game.player.maxHealth += 1;
                                        _this.game.player.inventory.subtractCoins(_this.shopData.buyItems[i].price);
                                        var h = _this.game.player.maxHealth;
                                        _this.shopData.buyItems[i].price = Math.round(Math.pow(4, h + Math.pow(1.05, h) - 2.05));
                                        break;
                                    case shopData_1.ShopItems.FILLHEARTS:
                                        _this.game.player.health = _this.game.player.maxHealth;
                                        _this.game.player.inventory.subtractCoins(_this.shopData.buyItems[i].price);
                                        break;
                                }
                            }
                            else {
                                _this.game.player.inventory.addItem(_this.shopData.buyItems[i].item);
                                _this.game.player.inventory.subtractCoins(_this.shopData.buyItems[i].price);
                            }
                            if (!_this.shopData.buyItems[i].unlimited) {
                                _this.shopData.buyItems.splice(i, 1);
                            }
                        }
                    }
                    if (backButtonLit)
                        _this.shopState = ShopState.MAINSCREEN;
                    break;
                case ShopState.SELLING:
                    if (i >= 0 && i < _this.game.player.inventory.items.length) {
                        for (var _i = 0, _a = _this.shopData.sellItems; _i < _a.length; _i++) {
                            var sellItem = _a[_i];
                            if (sellItem.item.constructor === _this.game.player.inventory.items[i].constructor) {
                                _this.game.player.inventory.addCoins(sellItem.price * _this.game.player.inventory.items[i].stackCount);
                                _this.game.player.inventory.removeItem(_this.game.player.inventory.items[i]);
                            }
                        }
                    }
                    if (backButtonLit)
                        _this.shopState = ShopState.MAINSCREEN;
                    break;
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
        this.drawItemSlots = function () {
            game_1.Game.drawShop(17, 5, 10.625, 9.4375, 0.5 * (17 - 10.625), 4.375, 10.625, 9.4375);
            if (input_1.Input.mouseX >= 51 && input_1.Input.mouseX <= 221 && input_1.Input.mouseY >= 70 && input_1.Input.mouseY <= 145) {
                var highlightedSlotX = Math.floor((input_1.Input.mouseX - 51) / 19) * 19 + 51;
                var highlightedSlotY = Math.floor((input_1.Input.mouseY - 70) / 19) * 19 + 70;
                game_1.Game.ctx.fillStyle = "#9babd7";
                game_1.Game.ctx.fillRect(highlightedSlotX, highlightedSlotY, 18, 18);
            }
        };
        this.drawBackButton = function (tileX, tileY) {
            var backButtonLit = tileX >= BACK_BUTTON_X &&
                tileY >= BACK_BUTTON_Y &&
                tileX < BACK_BUTTON_X + 3 &&
                tileY < BACK_BUTTON_Y + 1;
            game_1.Game.drawShop(37, backButtonLit ? 1 : 0, 3, 1, BACK_BUTTON_X, BACK_BUTTON_Y, 3, 1);
        };
        this.draw = function () {
            if (_this.isOpen) {
                game_1.Game.ctx.fillStyle = "rgb(0, 0, 0, 0.9)";
                game_1.Game.ctx.fillRect(0, 0, gameConstants_1.GameConstants.WIDTH, gameConstants_1.GameConstants.HEIGHT);
                game_1.Game.drawShop(0, 0, 17, 17, 0, 0, 17, 17);
                var tileX = Math.floor(input_1.Input.mouseX / gameConstants_1.GameConstants.TILESIZE);
                var tileY = Math.floor(input_1.Input.mouseY / gameConstants_1.GameConstants.TILESIZE);
                var slotX = Math.floor((input_1.Input.mouseX - 51) / 19);
                var slotY = Math.floor((input_1.Input.mouseY - 70) / 19);
                var i = slotX + slotY * 9;
                switch (_this.shopState) {
                    case ShopState.MAINSCREEN:
                        _this.drawBackButton(tileX, tileY);
                        var leftButtonLit = tileX >= LEFT_BUTTON_X &&
                            tileY >= LEFT_BUTTON_Y &&
                            tileX < LEFT_BUTTON_X + 5 &&
                            tileY < LEFT_BUTTON_Y + 5;
                        game_1.Game.drawShop(17 + (leftButtonLit ? 10 : 0), 0, 5, 5, LEFT_BUTTON_X, LEFT_BUTTON_Y, 5, 5);
                        var rightButtonLit = tileX >= RIGHT_BUTTON_X &&
                            tileY >= RIGHT_BUTTON_Y &&
                            tileX < RIGHT_BUTTON_X + 5 &&
                            tileY < RIGHT_BUTTON_Y + 5;
                        game_1.Game.drawShop(22 + (rightButtonLit ? 10 : 0), 0, 5, 5, RIGHT_BUTTON_X, RIGHT_BUTTON_Y, 5, 5);
                        break;
                    case ShopState.BUYING:
                        _this.drawItemSlots();
                        _this.drawBackButton(tileX, tileY);
                        for (var i_1 = 0; i_1 < _this.shopData.buyItems.length; i_1++) {
                            var s = 9;
                            var x = (52 + 19 * (i_1 % s)) / gameConstants_1.GameConstants.TILESIZE;
                            var y = (71 + 19 * Math.floor(i_1 / s)) / gameConstants_1.GameConstants.TILESIZE;
                            if (_this.shopData.buyItems[i_1].item)
                                _this.shopData.buyItems[i_1].item.drawIcon(x, y);
                            else {
                                var xx = 0;
                                var yy = 0;
                                switch (_this.shopData.buyItems[i_1].shopItem) {
                                    case shopData_1.ShopItems.TORCH:
                                        xx = 21;
                                        break;
                                    case shopData_1.ShopItems.EMPTYHEART:
                                        xx = 7;
                                        break;
                                    case shopData_1.ShopItems.FILLHEARTS:
                                        xx = 8;
                                        break;
                                }
                                game_1.Game.drawItem(xx, yy, 1, 2, x, y - 1, 1, 2);
                            }
                        }
                        if (i >= 0 && i < _this.shopData.buyItems.length) {
                            game_1.Game.ctx.font = gameConstants_1.GameConstants.SCRIPT_FONT_SIZE + "px Script";
                            game_1.Game.ctx.fillStyle = "white";
                            var desc = "";
                            if (_this.shopData.buyItems[i].item === null) {
                                switch (_this.shopData.buyItems[i].shopItem) {
                                    case shopData_1.ShopItems.TORCH:
                                        desc = "TORCH UPGRADE\n+2 sight radius";
                                        break;
                                    case shopData_1.ShopItems.EMPTYHEART:
                                        desc = "EXTRA LIFE\n+1 total hearts";
                                        break;
                                    case shopData_1.ShopItems.FILLHEARTS:
                                        desc = "RESTORE HEALTH\nFill all hearts";
                                        break;
                                }
                            }
                            else {
                                desc = _this.shopData.buyItems[i].item.getDescription();
                            }
                            var lines = desc.split("\n");
                            if (_this.game.player.inventory.coinCount() >= _this.shopData.buyItems[i].price)
                                lines.push("CLICK TO BUY FOR " +
                                    _this.shopData.buyItems[i].price +
                                    (_this.shopData.buyItems[i].price === 1 ? " COIN" : " COINS"));
                            else
                                lines.push("COSTS " +
                                    _this.shopData.buyItems[i].price +
                                    (_this.shopData.buyItems[i].price === 1 ? " COIN" : " COINS"));
                            var nextY = 147;
                            for (var j = 0; j < lines.length; j++) {
                                nextY = _this.textWrap(lines[j], 55, nextY, 162);
                            }
                            game_1.Game.ctx.font = gameConstants_1.GameConstants.FONT_SIZE + "px PixelFont";
                        }
                        break;
                    case ShopState.SELLING:
                        _this.drawItemSlots();
                        _this.drawBackButton(tileX, tileY);
                        for (var i_2 = 0; i_2 < _this.game.player.inventory.items.length; i_2++) {
                            var s = 9;
                            var x = (52 + 19 * (i_2 % s)) / gameConstants_1.GameConstants.TILESIZE;
                            var y = (71 + 19 * Math.floor(i_2 / s)) / gameConstants_1.GameConstants.TILESIZE;
                            _this.game.player.inventory.items[i_2].drawIcon(x, y);
                        }
                        if (i >= 0 && i < _this.game.player.inventory.items.length) {
                            game_1.Game.ctx.font = gameConstants_1.GameConstants.SCRIPT_FONT_SIZE + "px Script";
                            game_1.Game.ctx.fillStyle = "white";
                            var desc = "";
                            var price = -1;
                            for (var _i = 0, _a = _this.shopData.sellItems; _i < _a.length; _i++) {
                                var sellItem = _a[_i];
                                if (sellItem.item.constructor === _this.game.player.inventory.items[i].constructor) {
                                    desc = sellItem.description;
                                    price = sellItem.price;
                                }
                            }
                            var lines = desc.split("\n");
                            if (price !== -1)
                                lines.push("CLICK TO SELL FOR " +
                                    price +
                                    (price === 1 ? " COIN" : " COINS") +
                                    (_this.game.player.inventory.items[i].stackCount > 1 ? " EACH" : ""));
                            var nextY = 147;
                            for (var j = 0; j < lines.length; j++) {
                                nextY = _this.textWrap(lines[j], 55, nextY, 162);
                            }
                            game_1.Game.ctx.font = gameConstants_1.GameConstants.FONT_SIZE + "px PixelFont";
                        }
                        break;
                }
            }
        };
        this.game = game;
        this.shopData = new shopData_1.ShopData();
        var i = new shopData_1.BuyItem();
        i.item = null;
        i.shopItem = shopData_1.ShopItems.EMPTYHEART;
        i.price = 1;
        i.unlimited = true;
        this.shopData.buyItems.push(i);
        i = new shopData_1.BuyItem();
        i.item = null;
        i.shopItem = shopData_1.ShopItems.FILLHEARTS;
        i.price = 1;
        i.unlimited = true;
        this.shopData.buyItems.push(i);
        i = new shopData_1.BuyItem();
        i.item = null;
        i.shopItem = shopData_1.ShopItems.TORCH;
        i.price = 1;
        i.unlimited = true;
        this.shopData.buyItems.push(i);
        i = new shopData_1.BuyItem();
        i.item = new armor_1.Armor(this.game.level, 0, 0);
        i.price = 1;
        i.unlimited = false;
        this.shopData.buyItems.push(i);
        var s = new shopData_1.SellItem();
        s.item = new coal_1.Coal(this.game.level, 0, 0);
        s.description = s.item.getDescription();
        s.price = 1;
        this.shopData.sellItems.push(s);
        s = new shopData_1.SellItem();
        s.item = new gold_1.Gold(this.game.level, 0, 0);
        s.description = s.item.getDescription();
        s.price = 10;
        this.shopData.sellItems.push(s);
        s = new shopData_1.SellItem();
        s.item = new gem_1.Gem(this.game.level, 0, 0);
        s.description = s.item.getDescription();
        s.price = 100;
        this.shopData.sellItems.push(s);
        this.shopState = ShopState.MAINSCREEN;
        input_1.Input.mouseLeftClickListeners.push(this.mouseLeftClickListener);
    }
    return ShopScreen;
}());
exports.ShopScreen = ShopScreen;


/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ShopItems;
(function (ShopItems) {
    ShopItems[ShopItems["TORCH"] = 0] = "TORCH";
    ShopItems[ShopItems["EMPTYHEART"] = 1] = "EMPTYHEART";
    ShopItems[ShopItems["FILLHEARTS"] = 2] = "FILLHEARTS";
})(ShopItems = exports.ShopItems || (exports.ShopItems = {}));
var BuyItem = /** @class */ (function () {
    function BuyItem() {
    }
    return BuyItem;
}());
exports.BuyItem = BuyItem;
var SellItem = /** @class */ (function () {
    function SellItem() {
    }
    return SellItem;
}());
exports.SellItem = SellItem;
var ShopData = /** @class */ (function () {
    function ShopData() {
        this.buyItems = [];
        this.sellItems = [];
    }
    return ShopData;
}());
exports.ShopData = ShopData;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var level_1 = __webpack_require__(45);
var ROOM_SIZE = [5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 13];
var N = /** @class */ (function () {
    function N(type, difficulty, children) {
        this.type = type;
        this.difficulty = difficulty;
        this.children = children;
    }
    return N;
}());
var Room = /** @class */ (function () {
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
var LevelGenerator = /** @class */ (function () {
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
                            case level_1.RoomType.DUNGEON:
                                newLevelDoorDir = r.generateAroundPoint(points[ind], ind, game_1.Game.randTable([5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 9, 9, 10]), game_1.Game.randTable([5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 9, 9, 10]));
                                break;
                            case level_1.RoomType.BIGDUNGEON:
                                newLevelDoorDir = r.generateAroundPoint(points[ind], ind, game_1.Game.randTable([10, 11, 12, 13]), game_1.Game.randTable([10, 11, 12, 13]));
                                break;
                            case level_1.RoomType.UPLADDER:
                            case level_1.RoomType.DOWNLADDER:
                                newLevelDoorDir = r.generateAroundPoint(points[ind], ind, 5, 5);
                                break;
                            case level_1.RoomType.SPAWNER:
                                newLevelDoorDir = r.generateAroundPoint(points[ind], ind, game_1.Game.randTable([9, 10, 11]), game_1.Game.randTable([9, 10, 11]));
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
            var node;
            if (d == 0) {
                node = new N(level_1.RoomType.DUNGEON, d, [
                    new N(level_1.RoomType.DOWNLADDER, d, []),
                    new N(level_1.RoomType.SHOP, d, []),
                ]);
            }
            else {
                switch (game_1.Game.rand(1, 10)) {
                    case 1:
                    case 2:
                    case 3:
                    case 4:
                    case 5:
                    case 6:
                        node = new N(level_1.RoomType.UPLADDER, d, [
                            new N(level_1.RoomType.DUNGEON, d, [
                                new N(level_1.RoomType.SPAWNER, d, [
                                    new N(level_1.RoomType.DOWNLADDER, d, [
                                        new N(level_1.RoomType.CAVE, d, [
                                            new N(level_1.RoomType.CAVE, d, []),
                                            new N(level_1.RoomType.CAVE, d, []),
                                        ]),
                                    ]),
                                    new N(level_1.RoomType.CAVE, d, [new N(level_1.RoomType.CAVE, d, [new N(level_1.RoomType.CAVE, d, [])])]),
                                    new N(game_1.Game.rand(1, 3) === 1 ? level_1.RoomType.TREASURE : level_1.RoomType.DUNGEON, d, []),
                                    new N(level_1.RoomType.DUNGEON, d, [new N(level_1.RoomType.DOWNLADDER, d, [])]),
                                ]),
                            ]),
                            new N(level_1.RoomType.DUNGEON, d, [new N(level_1.RoomType.DUNGEON, d, [])]),
                        ]);
                        break;
                    case 7:
                    case 8:
                    case 9:
                    case 10:
                        node = new N(level_1.RoomType.UPLADDER, d, [
                            new N(level_1.RoomType.DUNGEON, d, [
                                new N(level_1.RoomType.DUNGEON, d, [new N(level_1.RoomType.DOWNLADDER, d, [])]),
                                new N(level_1.RoomType.BIGDUNGEON, d, [
                                    new N(level_1.RoomType.SPIKECORRIDOR, d, [new N(level_1.RoomType.TREASURE, d, [])]),
                                    new N(level_1.RoomType.DUNGEON, d, [
                                        new N(level_1.RoomType.CAVE, d, []),
                                        new N(level_1.RoomType.CAVE, d, []),
                                    ]),
                                ]),
                                new N(level_1.RoomType.DUNGEON, d, [
                                    new N(level_1.RoomType.CAVE, d, [
                                        new N(level_1.RoomType.CAVE, d, [new N(level_1.RoomType.CAVE, d, [])]),
                                        new N(level_1.RoomType.CAVE, d, [new N(level_1.RoomType.CAVE, d, [])]),
                                        new N(level_1.RoomType.CAVE, d, []),
                                    ]),
                                ]),
                            ]),
                        ]);
                        break;
                }
            }
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
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var wall_1 = __webpack_require__(46);
var levelConstants_1 = __webpack_require__(5);
var floor_1 = __webpack_require__(14);
var game_1 = __webpack_require__(0);
var door_1 = __webpack_require__(15);
var bottomDoor_1 = __webpack_require__(11);
var wallSide_1 = __webpack_require__(47);
var tile_1 = __webpack_require__(1);
var knightEnemy_1 = __webpack_require__(48);
var chest_1 = __webpack_require__(21);
var goldenKey_1 = __webpack_require__(50);
var spawnfloor_1 = __webpack_require__(51);
var spike_1 = __webpack_require__(52);
var gameConstants_1 = __webpack_require__(2);
var wizardEnemy_1 = __webpack_require__(53);
var skullEnemy_1 = __webpack_require__(30);
var barrel_1 = __webpack_require__(29);
var crate_1 = __webpack_require__(28);
var spiketrap_1 = __webpack_require__(27);
var fountainTile_1 = __webpack_require__(56);
var coffinTile_1 = __webpack_require__(57);
var pottedPlant_1 = __webpack_require__(58);
var insideLevelDoor_1 = __webpack_require__(59);
var button_1 = __webpack_require__(60);
var hitWarning_1 = __webpack_require__(17);
var upLadder_1 = __webpack_require__(61);
var downLadder_1 = __webpack_require__(62);
var coalResource_1 = __webpack_require__(63);
var goldResource_1 = __webpack_require__(64);
var emeraldResource_1 = __webpack_require__(65);
var chasm_1 = __webpack_require__(66);
var spawner_1 = __webpack_require__(67);
var shopTable_1 = __webpack_require__(69);
var RoomType;
(function (RoomType) {
    RoomType[RoomType["DUNGEON"] = 0] = "DUNGEON";
    RoomType[RoomType["BIGDUNGEON"] = 1] = "BIGDUNGEON";
    RoomType[RoomType["TREASURE"] = 2] = "TREASURE";
    RoomType[RoomType["FOUNTAIN"] = 3] = "FOUNTAIN";
    RoomType[RoomType["COFFIN"] = 4] = "COFFIN";
    RoomType[RoomType["GRASS"] = 5] = "GRASS";
    RoomType[RoomType["PUZZLE"] = 6] = "PUZZLE";
    RoomType[RoomType["KEYROOM"] = 7] = "KEYROOM";
    RoomType[RoomType["CHESSBOARD"] = 8] = "CHESSBOARD";
    RoomType[RoomType["MAZE"] = 9] = "MAZE";
    RoomType[RoomType["CORRIDOR"] = 10] = "CORRIDOR";
    RoomType[RoomType["SPIKECORRIDOR"] = 11] = "SPIKECORRIDOR";
    RoomType[RoomType["UPLADDER"] = 12] = "UPLADDER";
    RoomType[RoomType["DOWNLADDER"] = 13] = "DOWNLADDER";
    RoomType[RoomType["SHOP"] = 14] = "SHOP";
    RoomType[RoomType["CAVE"] = 15] = "CAVE";
    RoomType[RoomType["SPAWNER"] = 16] = "SPAWNER";
})(RoomType = exports.RoomType || (exports.RoomType = {}));
var TurnState;
(function (TurnState) {
    TurnState[TurnState["playerTurn"] = 0] = "playerTurn";
    TurnState[TurnState["computerTurn"] = 1] = "computerTurn";
})(TurnState = exports.TurnState || (exports.TurnState = {}));
// LevelGenerator -> Level()
// Level.generate()
var Level = /** @class */ (function () {
    function Level(game, x, y, w, h, type, difficulty) {
        var _this = this;
        this.generateDungeon = function () {
            _this.skin = tile_1.SkinType.DUNGEON;
            var factor = game_1.Game.rand(1, 36);
            _this.buildEmptyRoom();
            if (factor < 30)
                _this.addWallBlocks();
            if (factor < 26)
                _this.addFingers();
            if (factor % 4 === 0)
                _this.addChasms();
            _this.fixWalls();
            if (factor % 3 === 0)
                _this.addPlants(game_1.Game.randTable([0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 4]));
            if (factor > 15)
                _this.addSpikeTraps(game_1.Game.randTable([0, 0, 0, 1, 1, 2, 5]));
            var numEmptyTiles = _this.getEmptyTiles().length;
            var numEnemies = Math.ceil(numEmptyTiles * (_this.depth * 0.5 + 0.5) * game_1.Game.randTable([0, 0, 0.05, 0.05, 0.06, 0.07, 0.1]));
            _this.addEnemies(numEnemies);
            if (numEnemies > 0)
                _this.addObstacles(numEnemies / game_1.Game.rand(1, 2));
            else
                _this.addObstacles(game_1.Game.randTable([0, 0, 1, 1, 2, 3, 5]));
        };
        this.generateBigDungeon = function () {
            _this.skin = tile_1.SkinType.DUNGEON;
            _this.buildEmptyRoom();
            if (game_1.Game.rand(1, 4) === 1)
                _this.addChasms();
            _this.fixWalls();
            if (game_1.Game.rand(1, 4) === 1)
                _this.addPlants(game_1.Game.randTable([0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 4]));
            if (game_1.Game.rand(1, 3) === 1)
                _this.addSpikeTraps(game_1.Game.randTable([3, 5, 7, 8]));
            var numEmptyTiles = _this.getEmptyTiles().length;
            var numEnemies = Math.ceil(numEmptyTiles * (_this.depth * 0.5 + 0.5) * game_1.Game.randTable([0.05, 0.05, 0.06, 0.07, 0.1]));
            _this.addEnemies(numEnemies);
            if (numEnemies > 0)
                _this.addObstacles(numEnemies / game_1.Game.rand(1, 2));
            else
                _this.addObstacles(game_1.Game.randTable([0, 0, 1, 1, 2, 3, 5]));
        };
        this.generateSpawner = function () {
            _this.skin = tile_1.SkinType.DUNGEON;
            _this.buildEmptyRoom();
            _this.fixWalls();
            _this.enemies.push(new spawner_1.Spawner(_this, _this.game, Math.floor(_this.roomX + _this.width / 2), Math.floor(_this.roomY + _this.height / 2)));
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
            var crateTiles = _this.getEmptyMiddleTiles().filter(function (t) {
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
            _this.addChests(game_1.Game.randTable([3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 6]));
            _this.addPlants(game_1.Game.randTable([0, 1, 2, 4, 5, 6]));
        };
        this.generateChessboard = function () {
            _this.skin = tile_1.SkinType.DUNGEON;
            _this.buildEmptyRoom();
            _this.fixWalls();
        };
        this.generateCave = function () {
            _this.skin = tile_1.SkinType.CAVE;
            var factor = game_1.Game.rand(1, 36);
            _this.buildEmptyRoom();
            if (factor < 30)
                _this.addWallBlocks();
            if (factor < 26)
                _this.addFingers();
            if (factor % 4 === 0)
                _this.addChasms();
            _this.fixWalls();
            if (factor > 15)
                _this.addSpikeTraps(game_1.Game.randTable([0, 0, 0, 1, 1, 2, 5]));
            var numEmptyTiles = _this.getEmptyTiles().length;
            var numEnemies = Math.ceil(numEmptyTiles * (_this.depth * 0.5 + 0.5) * game_1.Game.randTable([0, 0.07, 0.08, 0.09, 0.1, 0.15]));
            //if (Game.rand(1, 100) > numEmptyTiles) numEnemies = 0;
            _this.addEnemies(numEnemies);
            _this.addResources(game_1.Game.randTable([1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9, 10, 11, 12]));
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
        this.generateShop = function () {
            _this.skin = tile_1.SkinType.DUNGEON;
            _this.buildEmptyRoom();
            _this.fixWalls();
            var cX = Math.floor(_this.roomX + _this.width / 2 - 1);
            var cY = Math.floor(_this.roomY + _this.height / 2);
            _this.enemies.push(new shopTable_1.ShopTable(_this, _this.game, cX, cY));
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
        // doesn't include top row or bottom row, as to not block doors
        this.getEmptyMiddleTiles = function () {
            var returnVal = [];
            for (var x = _this.roomX; x < _this.roomX + _this.width; x++) {
                for (var y = _this.roomY + 2; y < _this.roomY + _this.height - 1; y++) {
                    if (!_this.levelArray[x][y].isSolid() && !(_this.levelArray[x][y] instanceof spiketrap_1.SpikeTrap)) {
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
        // includes top row and bottom row
        this.getEmptyTiles = function () {
            var returnVal = [];
            for (var x = _this.roomX; x < _this.roomX + _this.width; x++) {
                for (var y = _this.roomY + 1; y < _this.roomY + _this.height; y++) {
                    if (!_this.levelArray[x][y].isSolid() && !(_this.levelArray[x][y] instanceof spiketrap_1.SpikeTrap)) {
                        returnVal.push(_this.levelArray[x][y]);
                    }
                }
            }
            var _loop_2 = function (e) {
                returnVal = returnVal.filter(function (t) { return t.x !== e.x || t.y !== e.y; });
            };
            for (var _i = 0, _a = _this.enemies; _i < _a.length; _i++) {
                var e = _a[_i];
                _loop_2(e);
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
                    if (_this.softVisibilityArray[x][y] < _this.visibilityArray[x][y])
                        _this.softVisibilityArray[x][y] += 0.1;
                    else if (_this.softVisibilityArray[x][y] > _this.visibilityArray[x][y])
                        _this.softVisibilityArray[x][y] -= 0.05;
                    if (_this.softVisibilityArray[x][y] < 0.1)
                        _this.softVisibilityArray[x][y] = 0;
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
                _this.castShadowsAtAngle(i, _this.game.player.sightRadius - _this.depth);
            }
            if (levelConstants_1.LevelConstants.SMOOTH_LIGHTING)
                _this.visibilityArray = _this.blur3x3(_this.visibilityArray, [[1, 2, 1], [2, 8, 2], [1, 2, 1]]);
            /*for (let x = 0; x < this.visibilityArray.length; x++) {
              for (let y = 0; y < this.visibilityArray[0].length; y++) {
                if (this.visibilityArray[x][y] < oldVisibilityArray[x][y]) {
                  this.visibilityArray[x][y] = Math.min(
                    oldVisibilityArray[x][y],
                    LevelConstants.MIN_VISIBILITY
                  );
                }
              }
            }*/
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
            _this.playerTurnTime = Date.now();
        };
        this.update = function () {
            if (_this.turn == TurnState.computerTurn) {
                if (Date.now() - _this.playerTurnTime >= levelConstants_1.LevelConstants.COMPUTER_TURN_DELAY) {
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
            _this.turn = TurnState.playerTurn;
        };
        /* TODO fix turn skipping bug
        
        computerTurnDelayed = () => {
          // take computer turn
          for (const p of this.projectiles) {
            p.tickDelayAnim();
          }
          for (const e of this.enemies) {
            e.tickDelayAnim();
          }
          for (const i of this.items) {
            i.tickDelayAnim();
          }
      
          this.turn = TurnState.playerTurn; // now it's the player's turn
        };*/
        this.draw = function () {
            hitWarning_1.HitWarning.updateFrame();
            _this.fadeLighting();
            for (var x = _this.roomX - 1; x < _this.roomX + _this.width + 1; x++) {
                for (var y = _this.roomY - 1; y < _this.roomY + _this.height + 1; y++) {
                    if (_this.softVisibilityArray[x][y] > 0)
                        _this.levelArray[x][y].draw();
                }
            }
        };
        this.drawEntitiesBehindPlayer = function () {
            for (var x = 0; x < _this.levelArray.length; x++) {
                for (var y = 0; y < _this.levelArray[0].length; y++) {
                    if (_this.softVisibilityArray[x][y] > 0)
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
            for (var _d = 0, _e = _this.items; _d < _e.length; _d++) {
                var i = _e[_d];
                if (i.y <= _this.game.player.y)
                    i.draw();
            }
            for (var _f = 0, _g = _this.enemies; _f < _g.length; _f++) {
                var e = _g[_f];
                if (e.y <= _this.game.player.y)
                    e.draw();
            }
        };
        this.drawEntitiesInFrontOfPlayer = function () {
            for (var x = 0; x < _this.levelArray.length; x++) {
                for (var y = 0; y < _this.levelArray[0].length; y++) {
                    if (_this.softVisibilityArray[x][y] > 0)
                        _this.levelArray[x][y].drawAbovePlayer();
                }
            }
            for (var _i = 0, _a = _this.items; _i < _a.length; _i++) {
                var i = _a[_i];
                if (i.y > _this.game.player.y)
                    i.draw();
            }
            for (var _b = 0, _c = _this.enemies; _b < _c.length; _b++) {
                var e = _c[_b];
                if (e.y > _this.game.player.y)
                    e.draw();
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
                    var frame = Math.round(6 * (_this.softVisibilityArray[x][y] / levelConstants_1.LevelConstants.MIN_VISIBILITY));
                    game_1.Game.drawFX(frame, 10, 1, 1, x, y, 1, 1);
                }
            }
            for (var _h = 0, _j = _this.items; _h < _j.length; _h++) {
                var i = _j[_h];
                if (i.y <= _this.game.player.y)
                    i.drawTopLayer();
            }
            // draw over dithered shading
            for (var x = 0; x < _this.levelArray.length; x++) {
                for (var y = 0; y < _this.levelArray[0].length; y++) {
                    _this.levelArray[x][y].drawAboveShading();
                }
            }
        };
        // for stuff rendered on top of the player
        this.drawTopLayer = function () {
            // gui stuff
            // room name
            var old = game_1.Game.ctx.font;
            game_1.Game.ctx.font = gameConstants_1.GameConstants.BIG_FONT_SIZE + "px PixelFont";
            game_1.Game.ctx.fillStyle = levelConstants_1.LevelConstants.LEVEL_TEXT_COLOR;
            game_1.Game.ctx.fillText(_this.name, gameConstants_1.GameConstants.WIDTH / 2 - game_1.Game.ctx.measureText(_this.name).width / 2, (_this.roomY - 1) * gameConstants_1.GameConstants.TILESIZE - (gameConstants_1.GameConstants.FONT_SIZE - 1));
            game_1.Game.ctx.font = old;
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
        this.playerTurnTime = Date.now();
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
        this.softVisibilityArray = [];
        for (var x_3 = 0; x_3 < levelConstants_1.LevelConstants.SCREEN_W; x_3++) {
            this.visibilityArray[x_3] = [];
            this.softVisibilityArray[x_3] = [];
            for (var y_2 = 0; y_2 < levelConstants_1.LevelConstants.SCREEN_H; y_2++) {
                this.visibilityArray[x_3][y_2] = 0;
                this.softVisibilityArray[x_3][y_2] = 0;
            }
        }
        this.roomX = Math.floor(levelConstants_1.LevelConstants.SCREEN_W / 2 - this.width / 2);
        this.roomY = Math.floor(levelConstants_1.LevelConstants.SCREEN_H / 2 - this.height / 2);
        this.upLadder = null;
        this.name = "";
        switch (this.type) {
            case RoomType.DUNGEON:
                this.generateDungeon();
                break;
            case RoomType.BIGDUNGEON:
                this.generateBigDungeon();
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
            case RoomType.CHESSBOARD: // TODO
                this.generateChessboard();
                break;
            case RoomType.KEYROOM:
                this.generateKeyRoom();
                break;
            case RoomType.GRASS:
                this.generateDungeon();
                break;
            case RoomType.CAVE:
                this.generateCave();
                break;
            case RoomType.UPLADDER:
                this.generateUpLadder();
                this.name = "FLOOR " + -this.depth;
                break;
            case RoomType.DOWNLADDER:
                this.generateDownLadder();
                this.name = "FLOOR " + -this.depth;
                break;
            case RoomType.SHOP:
                /* shop rates:
                 * 10 coal for an gold coin
                 * 1 gold for 10 coins
                 * 1 emerald for 100 coins
                 *
                 * shop items:
                 * 1 empty heart   4 ^ (maxHealth + maxHealth ^ 1.05 ^ maxHealth - 2.05) coins
                 * fill all hearts  1 coin
                 * better torch    5 ^ (torchLevel + 1.05 ^ torchLevel - 2.05) coins
                 * weapons
                 */
                this.generateShop();
                break;
            case RoomType.SPAWNER:
                this.generateSpawner();
        }
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
    Level.prototype.addChasms = function () {
        // add chasms
        var w = game_1.Game.rand(2, 4);
        var h = game_1.Game.rand(2, 4);
        var xmin = this.roomX + 1;
        var xmax = this.roomX + this.width - w - 1;
        var ymin = this.roomY + 2;
        var ymax = this.roomY + this.height - h - 1;
        if (xmax < xmin || ymax < ymin)
            return;
        var x = game_1.Game.rand(xmin, xmax);
        var y = game_1.Game.rand(ymin, ymax);
        for (var xx = x - 1; xx < x + w + 1; xx++) {
            for (var yy = y - 1; yy < y + h + 1; yy++) {
                // add a floor border
                if (xx === x - 1 || xx === x + w || yy === y - 1 || yy === y + h)
                    this.levelArray[xx][yy] = new floor_1.Floor(this, xx, yy);
                else
                    this.levelArray[xx][yy] = new chasm_1.Chasm(this, xx, yy, xx === x, xx === x + w - 1, yy === y, yy === y + h - 1);
            }
        }
    };
    Level.prototype.addChests = function (numChests) {
        // add chests
        var tiles = this.getEmptyMiddleTiles();
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
        var tiles = this.getEmptyMiddleTiles();
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
        var tiles = this.getEmptyMiddleTiles();
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
        var tiles = this.getEmptyMiddleTiles();
        for (var i = 0; i < numEnemies; i++) {
            var t = tiles.splice(game_1.Game.rand(0, tiles.length - 1), 1)[0];
            if (tiles.length == 0)
                return;
            var x = t.x;
            var y = t.y;
            if (this.depth !== 0) {
                var d = game_1.Game.rand(1, Math.min(3, this.depth));
                switch (d) {
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
        var tiles = this.getEmptyMiddleTiles();
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
        var tiles = this.getEmptyMiddleTiles();
        for (var i = 0; i < numPlants; i++) {
            var t = tiles.splice(game_1.Game.rand(0, tiles.length - 1), 1)[0];
            if (tiles.length == 0)
                return;
            var x = t.x;
            var y = t.y;
            this.enemies.push(new pottedPlant_1.PottedPlant(this, this.game, x, y));
        }
    };
    Level.prototype.addResources = function (numResources) {
        var tiles = this.getEmptyMiddleTiles();
        for (var i = 0; i < numResources; i++) {
            var t = tiles.splice(game_1.Game.rand(0, tiles.length - 1), 1)[0];
            if (tiles.length == 0)
                return;
            var x = t.x;
            var y = t.y;
            var r = game_1.Game.rand(0, 150);
            if (r <= 150 - Math.pow(this.depth, 3))
                this.enemies.push(new coalResource_1.CoalResource(this, this.game, x, y));
            else if (r <= 150 - Math.pow(Math.max(0, this.depth - 5), 3))
                this.enemies.push(new goldResource_1.GoldResource(this, this.game, x, y));
            else
                this.enemies.push(new emeraldResource_1.EmeraldResource(this, this.game, x, y));
        }
    };
    return Level;
}());
exports.Level = Level;


/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var Wall = /** @class */ (function (_super) {
    __extends(Wall, _super);
    function Wall(level, x, y, type) {
        var _this = _super.call(this, level, x, y) || this;
        _this.isSolid = function () {
            return true;
        };
        _this.canCrushEnemy = function () {
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
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var WallSide = /** @class */ (function (_super) {
    __extends(WallSide, _super);
    function WallSide() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.isSolid = function () {
            return true;
        };
        _this.canCrushEnemy = function () {
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
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var enemy_1 = __webpack_require__(4);
var game_1 = __webpack_require__(0);
var astarclass_1 = __webpack_require__(49);
var hitWarning_1 = __webpack_require__(17);
var spiketrap_1 = __webpack_require__(27);
var coin_1 = __webpack_require__(13);
var KnightEnemy = /** @class */ (function (_super) {
    __extends(KnightEnemy, _super);
    function KnightEnemy(level, game, x, y) {
        var _this = _super.call(this, level, game, x, y) || this;
        _this.hit = function () {
            return 0.5;
        };
        _this.tick = function () {
            if (!_this.dead) {
                if (_this.skipNextTurns > 0) {
                    _this.skipNextTurns--;
                    return;
                }
                _this.ticks++;
                _this.tileX = 9;
                _this.tileY = 8;
                if (_this.seenPlayer || _this.level.softVisibilityArray[_this.x][_this.y] > 0) {
                    if (_this.ticks % 2 === 0) {
                        _this.tileX = 4;
                        _this.tileY = 0;
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
                                _this.drawX = 0.5 * (_this.x - _this.game.player.x);
                                _this.drawY = 0.5 * (_this.y - _this.game.player.y);
                                _this.game.shakeScreen(10 * _this.drawX, 10 * _this.drawY);
                            }
                            else {
                                _this.tryMove(_this.moves[0].pos.x, _this.moves[0].pos.y);
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
                        }
                    }
                    else {
                        _this.level.projectiles.push(new hitWarning_1.HitWarning(_this.game, _this.x - 1, _this.y));
                        _this.level.projectiles.push(new hitWarning_1.HitWarning(_this.game, _this.x + 1, _this.y));
                        _this.level.projectiles.push(new hitWarning_1.HitWarning(_this.game, _this.x, _this.y - 1));
                        _this.level.projectiles.push(new hitWarning_1.HitWarning(_this.game, _this.x, _this.y + 1));
                    }
                }
            }
        };
        _this.draw = function () {
            if (!_this.dead) {
                _this.drawX += -0.5 * _this.drawX;
                _this.drawY += -0.5 * _this.drawY;
                _this.frame += 0.1;
                if (_this.frame >= 4)
                    _this.frame = 0;
                if (_this.doneMoving() && _this.game.player.doneMoving())
                    _this.facePlayer();
                if (_this.hasShadow)
                    game_1.Game.drawMob(0, 0, 1, 1, _this.x - _this.drawX, _this.y - _this.drawY, 1, 1, _this.isShaded());
                game_1.Game.drawMob(_this.tileX + (_this.tileX === 4 ? 0 : Math.floor(_this.frame)), _this.tileY + _this.direction * 2, 1, 2, _this.x - _this.drawX, _this.y - 1.5 - _this.drawY + (_this.tileX === 4 ? 0.1875 : 0), 1, 2, _this.isShaded());
            }
        };
        _this.dropLoot = function () {
            _this.game.level.items.push(new coin_1.Coin(_this.level, _this.x, _this.y));
        };
        _this.moves = new Array(); // empty move list
        _this.ticks = 0;
        _this.frame = 0;
        _this.health = 2;
        _this.maxHealth = 2;
        _this.tileX = 9;
        _this.tileY = 8;
        _this.seenPlayer = true;
        _this.deathParticleColor = "#ffffff";
        return _this;
    }
    return KnightEnemy;
}(enemy_1.Enemy));
exports.KnightEnemy = KnightEnemy;


/***/ }),
/* 49 */
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
    var Graph = /** @class */ (function () {
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
    var GraphNode = /** @class */ (function () {
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
    var BinaryHeap = /** @class */ (function () {
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
    var AStar = /** @class */ (function () {
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
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var equippable_1 = __webpack_require__(12);
var GoldenKey = /** @class */ (function (_super) {
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
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var SpawnFloor = /** @class */ (function (_super) {
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
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var Spike = /** @class */ (function (_super) {
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


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var enemy_1 = __webpack_require__(4);
var game_1 = __webpack_require__(0);
var floor_1 = __webpack_require__(14);
var bones_1 = __webpack_require__(22);
var deathParticle_1 = __webpack_require__(23);
var wizardTeleportParticle_1 = __webpack_require__(54);
var wizardFireball_1 = __webpack_require__(55);
var gem_1 = __webpack_require__(9);
var WizardState;
(function (WizardState) {
    WizardState[WizardState["idle"] = 0] = "idle";
    WizardState[WizardState["attack"] = 1] = "attack";
    WizardState[WizardState["justAttacked"] = 2] = "justAttacked";
    WizardState[WizardState["teleport"] = 3] = "teleport";
})(WizardState || (WizardState = {}));
var WizardEnemy = /** @class */ (function (_super) {
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
        _this.shuffle = function (a) {
            var j, x, i;
            for (i = a.length - 1; i > 0; i--) {
                j = Math.floor(Math.random() * (i + 1));
                x = a[i];
                a[i] = a[j];
                a[j] = x;
            }
            return a;
        };
        _this.tick = function () {
            if (!_this.dead) {
                //  && this.level.visibilityArray[this.x][this.y] > 0
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
                        var min = 100000;
                        var bestPos = void 0;
                        var emptyTiles = _this.shuffle(_this.level.getEmptyTiles());
                        for (var _i = 0, emptyTiles_1 = emptyTiles; _i < emptyTiles_1.length; _i++) {
                            var t = emptyTiles_1[_i];
                            var newPos = t;
                            var dist = Math.abs(newPos.x - _this.game.player.x) + Math.abs(newPos.y - _this.game.player.y);
                            if (Math.abs(dist - 4) < Math.abs(min - 4)) {
                                min = dist;
                                bestPos = newPos;
                            }
                        }
                        _this.tryMove(bestPos.x, bestPos.y);
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
        _this.deathParticleColor = "#ffffff";
        return _this;
    }
    return WizardEnemy;
}(enemy_1.Enemy));
exports.WizardEnemy = WizardEnemy;


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var particle_1 = __webpack_require__(8);
var game_1 = __webpack_require__(0);
var WizardTeleportParticle = /** @class */ (function (_super) {
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
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var projectile_1 = __webpack_require__(18);
var game_1 = __webpack_require__(0);
var WizardFireball = /** @class */ (function (_super) {
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
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var FountainTile = /** @class */ (function (_super) {
    __extends(FountainTile, _super);
    function FountainTile(level, x, y, subTileX, subTileY) {
        var _this = _super.call(this, level, x, y) || this;
        _this.isSolid = function () {
            return true;
        };
        _this.canCrushEnemy = function () {
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
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var CoffinTile = /** @class */ (function (_super) {
    __extends(CoffinTile, _super);
    function CoffinTile(level, x, y, subTileY) {
        var _this = _super.call(this, level, x, y) || this;
        _this.isSolid = function () {
            return true;
        };
        _this.canCrushEnemy = function () {
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
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var enemy_1 = __webpack_require__(4);
var game_1 = __webpack_require__(0);
var genericParticle_1 = __webpack_require__(3);
var PottedPlant = /** @class */ (function (_super) {
    __extends(PottedPlant, _super);
    function PottedPlant(level, game, x, y) {
        var _this = _super.call(this, level, game, x, y) || this;
        _this.kill = function () {
            _this.dead = true;
            genericParticle_1.GenericParticle.spawnCluster(_this.level, _this.x + 0.5, _this.y + 0.5, "#ce736a");
        };
        _this.killNoBones = function () {
            _this.kill();
        };
        _this.draw = function () {
            // not inherited because it doesn't have the 0.5 offset
            if (!_this.dead) {
                _this.drawX += -0.5 * _this.drawX;
                _this.drawY += -0.5 * _this.drawY;
                game_1.Game.drawObj(_this.tileX, _this.tileY, 1, 2, _this.x - _this.drawX, _this.y - 1 - _this.drawY, 1, 2, _this.isShaded());
            }
        };
        _this.drawTopLayer = function () { };
        _this.level = level;
        _this.health = 1;
        _this.tileX = 3;
        _this.tileY = 0;
        _this.hasShadow = false;
        _this.chainPushable = false;
        return _this;
    }
    return PottedPlant;
}(enemy_1.Enemy));
exports.PottedPlant = PottedPlant;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var InsideLevelDoor = /** @class */ (function (_super) {
    __extends(InsideLevelDoor, _super);
    function InsideLevelDoor(level, game, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.isSolid = function () {
            return !_this.opened;
        };
        _this.canCrushEnemy = function () {
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
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var Button = /** @class */ (function (_super) {
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
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var UpLadder = /** @class */ (function (_super) {
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
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var DownLadder = /** @class */ (function (_super) {
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
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var resource_1 = __webpack_require__(19);
var genericParticle_1 = __webpack_require__(3);
var coal_1 = __webpack_require__(25);
var sound_1 = __webpack_require__(6);
var CoalResource = /** @class */ (function (_super) {
    __extends(CoalResource, _super);
    function CoalResource(level, game, x, y) {
        var _this = _super.call(this, level, game, x, y) || this;
        _this.hurtCallback = function () {
            genericParticle_1.GenericParticle.spawnCluster(_this.level, _this.x + 0.5, _this.y + 0.5, "#ffffff");
            sound_1.Sound.mine();
        };
        _this.kill = function () {
            sound_1.Sound.breakRock();
            _this.dead = true;
            _this.game.level.items.push(new coal_1.Coal(_this.level, _this.x, _this.y));
        };
        _this.killNoBones = function () {
            _this.kill();
        };
        _this.draw = function () {
            if (!_this.dead) {
                game_1.Game.drawObj(_this.tileX, _this.tileY, 1, 2, _this.x - _this.drawX, _this.y - 1 - _this.drawY, 1, 2, _this.isShaded());
            }
        };
        _this.drawTopLayer = function () { };
        _this.tileX = 12;
        _this.tileY = 0;
        _this.health = 3;
        return _this;
    }
    return CoalResource;
}(resource_1.Resource));
exports.CoalResource = CoalResource;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var resource_1 = __webpack_require__(19);
var genericParticle_1 = __webpack_require__(3);
var gold_1 = __webpack_require__(26);
var sound_1 = __webpack_require__(6);
var GoldResource = /** @class */ (function (_super) {
    __extends(GoldResource, _super);
    function GoldResource(level, game, x, y) {
        var _this = _super.call(this, level, game, x, y) || this;
        _this.hurtCallback = function () {
            sound_1.Sound.mine();
        };
        _this.kill = function () {
            sound_1.Sound.breakRock();
            _this.dead = true;
            _this.game.level.items.push(new gold_1.Gold(_this.level, _this.x, _this.y));
            genericParticle_1.GenericParticle.spawnCluster(_this.level, _this.x + 0.5, _this.y + 0.5, "#fbf236");
        };
        _this.killNoBones = function () {
            _this.kill();
        };
        _this.draw = function () {
            if (!_this.dead) {
                game_1.Game.drawObj(_this.tileX, _this.tileY, 1, 2, _this.x - _this.drawX, _this.y - 1 - _this.drawY, 1, 2, _this.isShaded());
            }
        };
        _this.drawTopLayer = function () { };
        _this.tileX = 13;
        _this.tileY = 0;
        _this.health = 10;
        return _this;
    }
    return GoldResource;
}(resource_1.Resource));
exports.GoldResource = GoldResource;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var gem_1 = __webpack_require__(9);
var resource_1 = __webpack_require__(19);
var genericParticle_1 = __webpack_require__(3);
var sound_1 = __webpack_require__(6);
var EmeraldResource = /** @class */ (function (_super) {
    __extends(EmeraldResource, _super);
    function EmeraldResource(level, game, x, y) {
        var _this = _super.call(this, level, game, x, y) || this;
        _this.hurtCallback = function () {
            genericParticle_1.GenericParticle.spawnCluster(_this.level, _this.x + 0.5, _this.y + 0.5, "#fbf236");
            sound_1.Sound.mine();
        };
        _this.kill = function () {
            sound_1.Sound.breakRock();
            _this.dead = true;
            _this.game.level.items.push(new gem_1.Gem(_this.level, _this.x, _this.y));
        };
        _this.killNoBones = function () {
            _this.kill();
        };
        _this.draw = function () {
            if (!_this.dead) {
                game_1.Game.drawObj(_this.tileX, _this.tileY, 1, 2, _this.x - _this.drawX, _this.y - 1 - _this.drawY, 1, 2, _this.isShaded());
            }
        };
        _this.drawTopLayer = function () { };
        _this.tileX = 14;
        _this.tileY = 0;
        _this.health = 30;
        return _this;
    }
    return EmeraldResource;
}(resource_1.Resource));
exports.EmeraldResource = EmeraldResource;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(1);
var Chasm = /** @class */ (function (_super) {
    __extends(Chasm, _super);
    function Chasm(level, x, y, leftEdge, rightEdge, topEdge, bottomEdge) {
        var _this = _super.call(this, level, x, y) || this;
        _this.isSolid = function () {
            return true;
        };
        _this.canCrushEnemy = function () {
            return true;
        };
        _this.draw = function () {
            if (_this.topEdge)
                game_1.Game.drawTile(22, 0, 1, 2, _this.x, _this.y, 1, 2, _this.isShaded());
        };
        _this.drawUnderPlayer = function () {
            game_1.Game.drawTile(_this.tileX, _this.tileY, 1, 1, _this.x, _this.y, 1, 1, _this.isShaded());
        };
        _this.tileX = _this.skin === 1 ? 24 : 20;
        _this.tileY = 1;
        if (leftEdge)
            _this.tileX--;
        else if (rightEdge)
            _this.tileX++;
        if (topEdge)
            _this.tileY--;
        else if (bottomEdge)
            _this.tileY++;
        _this.topEdge = topEdge;
        return _this;
    }
    return Chasm;
}(tile_1.Tile));
exports.Chasm = Chasm;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var enemy_1 = __webpack_require__(4);
var game_1 = __webpack_require__(0);
var gem_1 = __webpack_require__(9);
var skullEnemy_1 = __webpack_require__(30);
var enemySpawnAnimation_1 = __webpack_require__(68);
var Spawner = /** @class */ (function (_super) {
    __extends(Spawner, _super);
    function Spawner(level, game, x, y) {
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
                _this.tileX = 6;
                if (_this.seenPlayer || _this.level.softVisibilityArray[_this.x][_this.y] > 0) {
                    if (_this.ticks % 4 === 0) {
                        _this.tileX = 7;
                        _this.seenPlayer = true;
                        var positions = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
                        var position = game_1.Game.randTable(positions);
                        var spawnX = _this.x + position[0];
                        var spawnY = _this.y + position[1];
                        var knockbackX = _this.x + position[0] * 2;
                        var knockbackY = _this.y + position[1] * 2;
                        var skeleton = new skullEnemy_1.SkullEnemy(_this.level, _this.game, spawnX, spawnY);
                        _this.level.projectiles.push(new enemySpawnAnimation_1.EnemySpawnAnimation(_this.level, skeleton, spawnX, spawnY, knockbackX, knockbackY));
                    }
                }
                _this.ticks++;
            }
        };
        _this.dropLoot = function () {
            _this.game.level.items.push(new gem_1.Gem(_this.level, _this.x, _this.y));
        };
        _this.ticks = 0;
        _this.health = 6;
        _this.maxHealth = 6;
        _this.tileX = 6;
        _this.tileY = 4;
        _this.seenPlayer = true;
        _this.deathParticleColor = "#ffffff";
        return _this;
    }
    return Spawner;
}(enemy_1.Enemy));
exports.Spawner = Spawner;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var projectile_1 = __webpack_require__(18);
var game_1 = __webpack_require__(0);
var genericParticle_1 = __webpack_require__(3);
var sound_1 = __webpack_require__(6);
var EnemySpawnAnimation = /** @class */ (function (_super) {
    __extends(EnemySpawnAnimation, _super);
    function EnemySpawnAnimation(level, enemy, x, y, knockbackX, knockbackY) {
        var _this = _super.call(this, x, y) || this;
        _this.ANIM_COUNT = 3;
        _this.tick = function () {
            sound_1.Sound.enemySpawn();
            _this.dead = true;
            _this.enemy.skipNextTurns = 1;
            _this.level.enemies.push(_this.enemy);
            if (_this.level.game.player.x === _this.x && _this.level.game.player.y === _this.y) {
                _this.level.game.player.hurt(0.5);
                _this.level.game.player.move(_this.knockbackX, _this.knockbackY);
            }
            genericParticle_1.GenericParticle.spawnCluster(_this.level, _this.x + 0.5, _this.y + 0.5, "#ffffff");
            genericParticle_1.GenericParticle.spawnCluster(_this.level, _this.x + 0.5, _this.y + 0.5, "#ffffff");
        };
        _this.draw = function () {
            _this.frame += 0.25;
            if (_this.frame >= 8)
                _this.frame = 0;
            for (var i = 0; i < _this.ANIM_COUNT; i++) {
                var offsetX = 4 * Math.sin(_this.frame + _this.xx[i]);
                game_1.Game.drawFX(Math.floor(_this.frame), 26, 1, 2, _this.x + Math.round(offsetX) / 16.0, _this.y - 1 + Math.round(_this.yy[i]) / 16.0, 1, 2);
            }
            _this.level.particles.push(new genericParticle_1.GenericParticle(_this.level, _this.x + 0.5 + Math.random() * 0.05 - 0.025, _this.y + 0.5 + Math.random() * 0.05 - 0.025, Math.random() * 0.5, Math.random() * 0.5, 0.025 * (Math.random() * 2 - 1), 0.025 * (Math.random() * 2 - 1), 0.2 * (Math.random() - 1), "#ffffff", 0));
            //Game.drawFX(18 + Math.floor(HitWarning.frame), 6, 1, 1, this.x, this.y, 1, 1);
        };
        _this.level = level;
        _this.enemy = enemy;
        _this.frame = 0;
        _this.f = [];
        _this.xx = [];
        _this.yy = [];
        for (var i = 0; i < _this.ANIM_COUNT; i++) {
            _this.f[i] = _this.xx[i] = Math.random() * 6.28;
            _this.yy[i] = Math.random() * 8 - 8;
        }
        _this.knockbackX = knockbackX;
        _this.knockbackY = knockbackY;
        return _this;
    }
    return EnemySpawnAnimation;
}(projectile_1.Projectile));
exports.EnemySpawnAnimation = EnemySpawnAnimation;


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var enemy_1 = __webpack_require__(4);
var ShopTable = /** @class */ (function (_super) {
    __extends(ShopTable, _super);
    function ShopTable(level, game, x, y) {
        var _this = _super.call(this, level, game, x, y) || this;
        _this.interact = function () {
            _this.game.player.shopScreen.open();
        };
        _this.draw = function () {
            game_1.Game.drawTile(26, 0, 2, 2, _this.x, _this.y - 1, 2, 2, _this.isShaded());
        };
        _this.w = 2;
        _this.destroyable = false;
        _this.pushable = false;
        _this.chainPushable = false;
        _this.interactable = true;
        return _this;
    }
    return ShopTable;
}(enemy_1.Enemy));
exports.ShopTable = ShopTable;


/***/ })
/******/ ]);