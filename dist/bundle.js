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
var level_1 = __webpack_require__(16);
var player_1 = __webpack_require__(25);
var sound_1 = __webpack_require__(7);
var levelConstants_1 = __webpack_require__(1);
var camera_1 = __webpack_require__(10);
var Game = (function () {
    function Game() {
        var _this = this;
        this.finishInit = function () {
            _this.player = new player_1.Player(_this, 0, 0);
            _this.level = new level_1.Level(_this, _this.levelData, 0);
            _this.level.enterLevel();
            setInterval(_this.run, 1000.0 / gameConstants_1.GameConstants.FPS);
        };
        this.changeLevel = function (newLevel) {
            _this.level.exitLevel();
            _this.level = newLevel;
            _this.level.enterLevel();
        };
        this.changeLevelThroughDoor = function (door) {
            _this.level.exitLevel();
            _this.level = door.level;
            _this.level.enterLevelThroughDoor(door);
        };
        this.run = function () {
            _this.update();
            _this.draw();
        };
        this.update = function () {
            _this.player.update();
            _this.level.update();
        };
        this.draw = function () {
            Game.ctx.fillStyle = "black";
            Game.ctx.fillRect(0, 0, gameConstants_1.GameConstants.WIDTH, gameConstants_1.GameConstants.HEIGHT);
            camera_1.Camera.targetX = _this.player.x - levelConstants_1.LevelConstants.SCREEN_W * 0.5 + 0.5;
            camera_1.Camera.targetY = _this.player.y - levelConstants_1.LevelConstants.SCREEN_H * 0.5 + 0.5;
            camera_1.Camera.update();
            _this.level.draw();
            _this.level.drawEntitiesBehindPlayer();
            _this.player.draw();
            _this.level.drawEntitiesInFrontOfPlayer();
            _this.level.drawTopLayer();
            _this.player.drawTopLayer();
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
            Game.tileset.src = "res/castleset.png";
            Game.mobset = new Image();
            Game.mobset.src = "res/mobset.png";
            Game.itemset = new Image();
            Game.itemset.src = "res/itemset.png";
            Game.fxset = new Image();
            Game.fxset.src = "res/fxset.png";
            Game.inventory = new Image();
            Game.inventory.src = "res/inv.png";
            sound_1.Sound.loadSounds();
            sound_1.Sound.playMusic(); // loops forever
            var request = new XMLHttpRequest();
            request.onload = function () {
                _this.levelData = JSON.parse(request.responseText);
                _this.finishInit();
            };
            request.open("GET", "res/castleLevel.json", true);
            request.send();
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
    Game.drawTile = function (sX, sY, sW, sH, dX, dY, dW, dH) {
        if (camera_1.Camera.cull(dX, dY, dW, dH))
            return;
        Game.ctx.drawImage(Game.tileset, sX * gameConstants_1.GameConstants.TILESIZE, sY * gameConstants_1.GameConstants.TILESIZE, sW * gameConstants_1.GameConstants.TILESIZE, sH * gameConstants_1.GameConstants.TILESIZE, dX * gameConstants_1.GameConstants.TILESIZE, dY * gameConstants_1.GameConstants.TILESIZE, dW * gameConstants_1.GameConstants.TILESIZE, dH * gameConstants_1.GameConstants.TILESIZE);
    };
    Game.drawTileNoCull = function (sX, sY, sW, sH, dX, dY, dW, dH) {
        Game.ctx.drawImage(Game.tileset, sX * gameConstants_1.GameConstants.TILESIZE, sY * gameConstants_1.GameConstants.TILESIZE, sW * gameConstants_1.GameConstants.TILESIZE, sH * gameConstants_1.GameConstants.TILESIZE, dX * gameConstants_1.GameConstants.TILESIZE, dY * gameConstants_1.GameConstants.TILESIZE, dW * gameConstants_1.GameConstants.TILESIZE, dH * gameConstants_1.GameConstants.TILESIZE);
    };
    Game.drawMob = function (sX, sY, sW, sH, dX, dY, dW, dH) {
        if (camera_1.Camera.cull(dX, dY, dW, dH))
            return;
        Game.ctx.drawImage(Game.mobset, sX * gameConstants_1.GameConstants.TILESIZE, sY * gameConstants_1.GameConstants.TILESIZE, sW * gameConstants_1.GameConstants.TILESIZE, sH * gameConstants_1.GameConstants.TILESIZE, dX * gameConstants_1.GameConstants.TILESIZE, dY * gameConstants_1.GameConstants.TILESIZE, dW * gameConstants_1.GameConstants.TILESIZE, dH * gameConstants_1.GameConstants.TILESIZE);
    };
    Game.drawMobNoCull = function (sX, sY, sW, sH, dX, dY, dW, dH) {
        Game.ctx.drawImage(Game.mobset, sX * gameConstants_1.GameConstants.TILESIZE, sY * gameConstants_1.GameConstants.TILESIZE, sW * gameConstants_1.GameConstants.TILESIZE, sH * gameConstants_1.GameConstants.TILESIZE, dX * gameConstants_1.GameConstants.TILESIZE, dY * gameConstants_1.GameConstants.TILESIZE, dW * gameConstants_1.GameConstants.TILESIZE, dH * gameConstants_1.GameConstants.TILESIZE);
    };
    Game.drawItem = function (sX, sY, sW, sH, dX, dY, dW, dH) {
        if (camera_1.Camera.cull(dX, dY, dW, dH))
            return;
        Game.ctx.drawImage(Game.itemset, sX * gameConstants_1.GameConstants.TILESIZE, sY * gameConstants_1.GameConstants.TILESIZE, sW * gameConstants_1.GameConstants.TILESIZE, sH * gameConstants_1.GameConstants.TILESIZE, dX * gameConstants_1.GameConstants.TILESIZE, dY * gameConstants_1.GameConstants.TILESIZE, dW * gameConstants_1.GameConstants.TILESIZE, dH * gameConstants_1.GameConstants.TILESIZE);
    };
    Game.drawItemNoCull = function (sX, sY, sW, sH, dX, dY, dW, dH) {
        Game.ctx.drawImage(Game.itemset, sX * gameConstants_1.GameConstants.TILESIZE, sY * gameConstants_1.GameConstants.TILESIZE, sW * gameConstants_1.GameConstants.TILESIZE, sH * gameConstants_1.GameConstants.TILESIZE, dX * gameConstants_1.GameConstants.TILESIZE, dY * gameConstants_1.GameConstants.TILESIZE, dW * gameConstants_1.GameConstants.TILESIZE, dH * gameConstants_1.GameConstants.TILESIZE);
    };
    Game.drawFX = function (sX, sY, sW, sH, dX, dY, dW, dH) {
        if (camera_1.Camera.cull(dX, dY, dW, dH))
            return;
        Game.ctx.drawImage(Game.fxset, sX * gameConstants_1.GameConstants.TILESIZE, sY * gameConstants_1.GameConstants.TILESIZE, sW * gameConstants_1.GameConstants.TILESIZE, sH * gameConstants_1.GameConstants.TILESIZE, dX * gameConstants_1.GameConstants.TILESIZE, dY * gameConstants_1.GameConstants.TILESIZE, dW * gameConstants_1.GameConstants.TILESIZE, dH * gameConstants_1.GameConstants.TILESIZE);
    };
    Game.drawFXNoCull = function (sX, sY, sW, sH, dX, dY, dW, dH) {
        Game.ctx.drawImage(Game.fxset, sX * gameConstants_1.GameConstants.TILESIZE, sY * gameConstants_1.GameConstants.TILESIZE, sW * gameConstants_1.GameConstants.TILESIZE, sH * gameConstants_1.GameConstants.TILESIZE, dX * gameConstants_1.GameConstants.TILESIZE, dY * gameConstants_1.GameConstants.TILESIZE, dW * gameConstants_1.GameConstants.TILESIZE, dH * gameConstants_1.GameConstants.TILESIZE);
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
var LevelConstants = (function () {
    function LevelConstants() {
    }
    LevelConstants.MIN_LEVEL_W = 5;
    LevelConstants.MIN_LEVEL_H = 5;
    LevelConstants.MAX_LEVEL_W = 13;
    LevelConstants.MAX_LEVEL_H = 13;
    LevelConstants.SCREEN_W = 17; // screen size in tiles
    LevelConstants.SCREEN_H = 17; // screen size in tiles
    LevelConstants.ENVIRONMENTS = 6;
    LevelConstants.VISIBILITY_CUTOFF = 1;
    LevelConstants.MIN_VISIBILITY = 1; // visibility level of places you've already seen
    LevelConstants.LIGHTING_ANGLE_STEP = 8; // how many degrees between each ray
    LevelConstants.VISIBILITY_STEP = 2;
    LevelConstants.LEVEL_TEXT_COLOR = "white"; // not actually a constant
    return LevelConstants;
}());
exports.LevelConstants = LevelConstants;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var levelConstants_1 = __webpack_require__(1);
var GameConstants = (function () {
    function GameConstants() {
    }
    GameConstants.VERSION = "v0.0.23";
    GameConstants.FPS = 60;
    GameConstants.TILESIZE = 16;
    GameConstants.SCALE = 2;
    GameConstants.WIDTH = levelConstants_1.LevelConstants.SCREEN_W * GameConstants.TILESIZE;
    GameConstants.HEIGHT = levelConstants_1.LevelConstants.SCREEN_H * GameConstants.TILESIZE;
    GameConstants.FONT_SIZE = 12;
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
var tile_1 = __webpack_require__(11);
var Collidable = (function (_super) {
    __extends(Collidable, _super);
    function Collidable(level, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.onCollide = function (player) { };
        return _this;
    }
    return Collidable;
}(tile_1.Tile));
exports.Collidable = Collidable;


/***/ }),
/* 4 */
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
var tile_1 = __webpack_require__(11);
var Floor = (function (_super) {
    __extends(Floor, _super);
    function Floor(level, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.draw = function () {
            game_1.Game.drawTile(_this.variation, _this.level.env, 1, 1, _this.x, _this.y, 1, 1);
        };
        _this.variation = 1;
        if (game_1.Game.rand(1, 20) == 1)
            _this.variation = game_1.Game.randTable([8, 9, 10, 12]);
        return _this;
    }
    return Floor;
}(tile_1.Tile));
exports.Floor = Floor;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var Item = (function () {
    function Item(x, y) {
        var _this = this;
        this.draw = function () {
            game_1.Game.drawItem(0, 0, 1, 1, _this.x, _this.y, 1, 1);
            _this.frame += Math.PI * 2 / 60;
            game_1.Game.drawItem(_this.tileX, _this.tileY, 1, 2, _this.x, _this.y + Math.sin(_this.frame) * 0.0625 - 1, _this.w, _this.h);
        };
        this.drawIcon = function (x, y) {
            game_1.Game.drawItemNoCull(_this.tileX, _this.tileY, 1, 2, x, y - 1, _this.w, _this.h);
        };
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 2;
        this.tileX = 0;
        this.tileY = 0;
        this.frame = 0;
        this.dead = false;
    }
    return Item;
}());
exports.Item = Item;


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
var item_1 = __webpack_require__(5);
var Pickup = (function (_super) {
    __extends(Pickup, _super);
    function Pickup() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onPickup = function (player) { };
        return _this;
    }
    return Pickup;
}(item_1.Item));
exports.Pickup = Pickup;


/***/ }),
/* 7 */
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
            f.volume = 0.1;
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
        Sound.music.play();
    };
    return Sound;
}());
exports.Sound = Sound;


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
var collidable_1 = __webpack_require__(3);
var game_1 = __webpack_require__(0);
var levelConstants_1 = __webpack_require__(1);
var deathParticle_1 = __webpack_require__(21);
var door_1 = __webpack_require__(43);
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(level, game, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.tryMove = function (x, y) {
            if (x < 0 || x >= _this.level.width || y < 0 || y >= _this.level.height)
                return;
            for (var _i = 0, _a = _this.level.enemies; _i < _a.length; _i++) {
                var e = _a[_i];
                if (e !== _this && e.x === x && e.y === y) {
                    return;
                }
            }
            if (_this.game.player.x === x && _this.game.player.y === y) {
                return;
            }
            if (_this.game.level.levelArray[x][y] instanceof door_1.Door &&
                !_this.game.level.levelArray[x][y].opened)
                return;
            if (_this.game.level.getCollidable(x, y) === null) {
                _this.x = x;
                _this.y = y;
            }
        };
        _this.hit = function () {
            return 0;
        };
        _this.dropXP = function () {
            return 0;
        };
        _this.hurt = function (player, damage) {
            _this.health -= damage;
            if (_this.health <= 0) {
                player.stats.getXP(_this.dropXP());
                _this.kill();
            }
        };
        _this.kill = function () {
            _this.level.dropBonesAt(_this.x, _this.y);
            _this.dead = true;
            _this.level.particles.push(new deathParticle_1.DeathParticle(_this.x, _this.y));
        };
        _this.killNoBones = function () {
            _this.dead = true;
            _this.level.particles.push(new deathParticle_1.DeathParticle(_this.x, _this.y));
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
                game_1.Game.drawMob(_this.tileX, _this.tileY + darkOffset, 1, 2, _this.x - _this.drawX, _this.y - 1.5 - _this.drawY, 1, 2);
            }
        };
        _this.tick = function () { };
        _this.drawTopLayer = function () { };
        _this.game = game;
        _this.drawX = 0;
        _this.drawY = 0;
        _this.health = 1;
        _this.tileX = 0;
        _this.tileY = 0;
        _this.hasShadow = true;
        _this.hasDarkVersion = true;
        _this.skipNextTurns = 0;
        return _this;
    }
    return Enemy;
}(collidable_1.Collidable));
exports.Enemy = Enemy;


/***/ }),
/* 9 */
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
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var gameConstants_1 = __webpack_require__(2);
var Camera = (function () {
    function Camera() {
    }
    Camera.x = 0;
    Camera.y = 0;
    Camera.targetX = 0;
    Camera.targetY = 0;
    Camera.update = function () {
        Camera.x += 0.05 * (Camera.targetX - Camera.x);
        Camera.y += 0.05 * (Camera.targetY - Camera.y);
    };
    Camera.cull = function (x, y, w, h) {
        // give a tile coord, returns true if off-screen
        return ((x + w) * gameConstants_1.GameConstants.TILESIZE + Math.floor(-Camera.x * gameConstants_1.GameConstants.TILESIZE) < 0 ||
            x * gameConstants_1.GameConstants.TILESIZE + Math.floor(-Camera.x * gameConstants_1.GameConstants.TILESIZE) >
                gameConstants_1.GameConstants.WIDTH ||
            (y + h) * gameConstants_1.GameConstants.TILESIZE + Math.floor(-Camera.y * gameConstants_1.GameConstants.TILESIZE) < 0 ||
            y * gameConstants_1.GameConstants.TILESIZE + Math.floor(-Camera.y * gameConstants_1.GameConstants.TILESIZE) >
                gameConstants_1.GameConstants.HEIGHT);
    };
    Camera.translate = function () {
        game_1.Game.ctx.translate(Math.floor(-Camera.x * gameConstants_1.GameConstants.TILESIZE), Math.floor(-Camera.y * gameConstants_1.GameConstants.TILESIZE));
    };
    Camera.translateBack = function () {
        game_1.Game.ctx.translate(Math.ceil(Camera.x * gameConstants_1.GameConstants.TILESIZE), Math.ceil(Camera.y * gameConstants_1.GameConstants.TILESIZE));
    };
    return Camera;
}());
exports.Camera = Camera;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Tile = (function () {
    function Tile(level, x, y) {
        this.draw = function () { };
        this.drawTopLayer = function () { };
        this.level = level;
        this.x = x;
        this.y = y;
    }
    return Tile;
}());
exports.Tile = Tile;


/***/ }),
/* 12 */
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
var key_1 = __webpack_require__(18);
var heart_1 = __webpack_require__(19);
var armor_1 = __webpack_require__(20);
var enemy_1 = __webpack_require__(8);
var levelConstants_1 = __webpack_require__(1);
var Chest = (function (_super) {
    __extends(Chest, _super);
    function Chest(level, game, x, y, item) {
        var _this = _super.call(this, level, game, x, y) || this;
        _this.kill = function () {
            _this.dead = true;
            if (_this.dropItem)
                _this.game.level.items.push(_this.dropItem);
            else {
                // DROP TABLES!
                var drop = game_1.Game.randTable([1, 2, 3, 3, 3]);
                switch (drop) {
                    case 1:
                        _this.game.level.items.push(new heart_1.Heart(_this.x, _this.y));
                        break;
                    case 2:
                        _this.game.level.items.push(new key_1.Key(_this.x, _this.y));
                        break;
                    case 3:
                        _this.game.level.items.push(new armor_1.Armor(_this.x, _this.y));
                        break;
                }
            }
        };
        _this.draw = function () {
            if (!_this.dead) {
                var darkOffset = _this.level.visibilityArray[_this.x][_this.y] <= levelConstants_1.LevelConstants.VISIBILITY_CUTOFF ? 2 : 0;
                game_1.Game.drawMob(_this.tileX, _this.tileY + darkOffset, 1, 2, _this.x - _this.drawX, _this.y - 1 - _this.drawY, 1, 2);
            }
        };
        _this.tileX = 17;
        _this.tileY = 0;
        _this.health = 1;
        _this.dropItem = item;
        console.log(_this.dropItem);
        return _this;
    }
    return Chest;
}(enemy_1.Enemy));
exports.Chest = Chest;


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
var collidable_1 = __webpack_require__(3);
var game_1 = __webpack_require__(0);
var Spike = (function (_super) {
    __extends(Spike, _super);
    function Spike() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onCollide = function (player) {
            player.hurt(1);
        };
        _this.draw = function () {
            game_1.Game.drawTile(11, _this.level.env, 1, 1, _this.x, _this.y, 1, 1);
        };
        return _this;
    }
    return Spike;
}(collidable_1.Collidable));
exports.Spike = Spike;


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
var enemy_1 = __webpack_require__(8);
var game_1 = __webpack_require__(0);
var levelConstants_1 = __webpack_require__(1);
var Crate = (function (_super) {
    __extends(Crate, _super);
    function Crate(level, game, x, y) {
        var _this = _super.call(this, level, game, x, y) || this;
        _this.kill = function () {
            _this.dead = true;
        };
        _this.draw = function () {
            // not inherited because it doesn't have the 0.5 offset
            if (!_this.dead) {
                var darkOffset = _this.level.visibilityArray[_this.x][_this.y] <= levelConstants_1.LevelConstants.VISIBILITY_CUTOFF ? 2 : 0;
                _this.drawX += -0.5 * _this.drawX;
                _this.drawY += -0.5 * _this.drawY;
                game_1.Game.drawMob(_this.tileX, _this.tileY + darkOffset, 1, 2, _this.x - _this.drawX, _this.y - 1 - _this.drawY, 1, 2);
            }
        };
        _this.level = level;
        _this.health = 1;
        _this.tileX = 13;
        _this.tileY = 0;
        _this.hasShadow = false;
        return _this;
    }
    return Crate;
}(enemy_1.Enemy));
exports.Crate = Crate;


/***/ }),
/* 15 */
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
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    isDown: function (keyCode) {
        return this._pressed[keyCode];
    },
    onKeydown: function (event) {
        exports.Input._pressed[event.keyCode] = true;
        switch (event.keyCode) {
            case exports.Input.LEFT:
                exports.Input.leftListener();
                break;
            case exports.Input.RIGHT:
                exports.Input.rightListener();
                break;
            case exports.Input.UP:
                exports.Input.upListener();
                break;
            case exports.Input.DOWN:
                exports.Input.downListener();
                break;
            case 77:
                exports.Input.mListener();
                break;
            case 73:
                exports.Input.iListener();
                break;
        }
    },
    onKeyup: function (event) {
        delete this._pressed[event.keyCode];
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


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var wall_1 = __webpack_require__(17);
var levelConstants_1 = __webpack_require__(1);
var floor_1 = __webpack_require__(4);
var game_1 = __webpack_require__(0);
var collidable_1 = __webpack_require__(3);
var knightEnemy_1 = __webpack_require__(37);
var chest_1 = __webpack_require__(12);
var goldenKey_1 = __webpack_require__(45);
var spike_1 = __webpack_require__(13);
var gameConstants_1 = __webpack_require__(2);
var wizardEnemy_1 = __webpack_require__(38);
var skullEnemy_1 = __webpack_require__(35);
var barrel_1 = __webpack_require__(34);
var crate_1 = __webpack_require__(14);
var arch_1 = __webpack_require__(22);
var sideArch_1 = __webpack_require__(23);
var camera_1 = __webpack_require__(10);
var bones_1 = __webpack_require__(24);
var doorLeft_1 = __webpack_require__(40);
var doorRight_1 = __webpack_require__(41);
var door_1 = __webpack_require__(43);
var layeredTile_1 = __webpack_require__(42);
var collidableLayeredTile_1 = __webpack_require__(44);
var Level = (function () {
    function Level(game, levelData, env) {
        var _this = this;
        this.tilegidToTileset = function (levelData, gid) {
            for (var i = 0; i < levelData.tilesets.length; i++) {
                if (gid >= levelData.tilesets[i].firstgid &&
                    (i === levelData.tilesets.length - 1 || gid < levelData.tilesets[i + 1].firstgid)) {
                    // if the tile is in the GID range of the ith tileset
                    return levelData.tilesets[i];
                }
            }
            return null;
        };
        this.exitLevel = function () {
            _this.particles.splice(0, _this.particles.length);
        };
        this.updateLevelTextColor = function () {
            levelConstants_1.LevelConstants.LEVEL_TEXT_COLOR = "white";
            // no more color backgrounds:
            // if (this.env === 3) LevelConstants.LEVEL_TEXT_COLOR = "black";
        };
        this.dropBonesAt = function (x, y) {
            if (_this.levelArray[x][y] instanceof floor_1.Floor &&
                !(_this.levelArray[x][y] instanceof arch_1.Arch || _this.levelArray[x][y] instanceof sideArch_1.SideArch)) {
                _this.levelArray[x][y] = new bones_1.Bones(_this, x, y);
            }
        };
        this.enterLevel = function () {
            _this.updateLevelTextColor();
            _this.updateLighting();
            camera_1.Camera.x = _this.game.player.x - levelConstants_1.LevelConstants.SCREEN_W * 0.5 + 0.5;
            camera_1.Camera.y = _this.game.player.y - levelConstants_1.LevelConstants.SCREEN_H * 0.5 + 0.5;
        };
        //TODO: stairs n stuff (w/r/t entering level)
        this.enterLevelThroughDoor = function (door) {
            _this.updateLevelTextColor();
            _this.game.player.moveNoSmooth(door.x, door.y + 1);
            _this.updateLighting();
        };
        this.getEmptyTiles = function () {
            var returnVal = [];
            for (var x = 0; x < _this.width; x++) {
                for (var y = 0; y < _this.height; y++) {
                    if (_this.getCollidable(x, y) === null) {
                        returnVal.push(_this.levelArray[x][y]);
                    }
                }
            }
            return returnVal;
        };
        this.getCollidable = function (x, y) {
            for (var _i = 0, _a = _this.levelArray; _i < _a.length; _i++) {
                var col = _a[_i];
                for (var _b = 0, col_1 = col; _b < col_1.length; _b++) {
                    var tile = col_1[_b];
                    if (tile instanceof collidable_1.Collidable && tile.x === x && tile.y === y)
                        return tile;
                }
            }
            return null;
        };
        this.getTile = function (x, y) {
            for (var _i = 0, _a = _this.levelArray; _i < _a.length; _i++) {
                var col = _a[_i];
                for (var _b = 0, col_2 = col; _b < col_2.length; _b++) {
                    var tile = col_2[_b];
                    if (tile !== null && tile.x === x && tile.y === y)
                        return tile;
                }
            }
            return null;
        };
        this.updateLighting = function () {
            var oldVisibilityArray = [];
            for (var x = 0; x < _this.levelArray.length; x++) {
                oldVisibilityArray[x] = [];
                for (var y = 0; y < _this.levelArray[0].length; y++) {
                    oldVisibilityArray[x][y] = _this.visibilityArray[x][y] !== 0;
                    _this.visibilityArray[x][y] = 0;
                }
            }
            for (var i = 0; i < 360; i += levelConstants_1.LevelConstants.LIGHTING_ANGLE_STEP) {
                _this.castShadowsAtAngle(i, _this.game.player.sightRadius);
            }
            for (var x = 0; x < _this.visibilityArray.length; x++) {
                for (var y = 0; y < _this.visibilityArray[0].length; y++) {
                    _this.visibilityArray[x][y] = Math.floor(_this.visibilityArray[x][y]);
                    if (_this.visibilityArray[x][y] === 0 && oldVisibilityArray[x][y]) {
                        _this.visibilityArray[x][y] = levelConstants_1.LevelConstants.MIN_VISIBILITY; // once a tile has been viewed, it won't go below MIN_VISIBILITY
                    }
                }
            }
        };
        this.castShadowsAtAngle = function (angle, radius) {
            var dx = Math.cos(angle * Math.PI / 180);
            var dy = Math.sin(angle * Math.PI / 180);
            var px = _this.game.player.x + 0.5;
            var py = _this.game.player.y + 0.5;
            var returnVal = 0;
            var i = 0;
            _this.visibilityArray[Math.floor(px)][Math.floor(py)] += levelConstants_1.LevelConstants.VISIBILITY_STEP;
            _this.visibilityArray[Math.floor(px)][Math.floor(py)] = Math.min(_this.visibilityArray[Math.floor(px)][Math.floor(py)], 2);
            for (; i < radius; i++) {
                px += dx;
                py += dy;
                var tile = _this.levelArray[Math.floor(px)][Math.floor(py)];
                _this.visibilityArray[Math.floor(px)][Math.floor(py)] += levelConstants_1.LevelConstants.VISIBILITY_STEP;
                _this.visibilityArray[Math.floor(px)][Math.floor(py)] = Math.min(_this.visibilityArray[Math.floor(px)][Math.floor(py)], 2);
                if (tile instanceof wall_1.Wall ||
                    tile instanceof doorLeft_1.DoorLeft ||
                    tile instanceof doorRight_1.DoorRight ||
                    tile instanceof door_1.Door) {
                    return returnVal;
                }
                // crates and chests can block visibility too!
                for (var _i = 0, _a = _this.enemies; _i < _a.length; _i++) {
                    var e = _a[_i];
                    if ((e instanceof crate_1.Crate || e instanceof chest_1.Chest) &&
                        e.x === Math.floor(px) &&
                        e.y === Math.floor(py)) {
                        return i;
                    }
                }
            }
            return returnVal;
        };
        this.tick = function () {
            _this.game.player.startTick();
            if (_this.game.player.armor)
                _this.game.player.armor.tick();
            for (var _i = 0, _a = _this.projectiles; _i < _a.length; _i++) {
                var p = _a[_i];
                p.tick();
            }
            for (var _b = 0, _c = _this.enemies; _b < _c.length; _b++) {
                var e = _c[_b];
                e.tick();
            }
            _this.enemies = _this.enemies.filter(function (e) { return !e.dead; });
            _this.game.player.finishTick();
            _this.updateLighting();
        };
        this.update = function () {
            //
        };
        this.draw = function () {
            camera_1.Camera.translate();
            for (var x = 0; x < _this.levelArray.length; x++) {
                for (var y = 0; y < _this.levelArray[0].length; y++) {
                    if (_this.levelArray[x][y] !== null) {
                        _this.levelArray[x][y].draw();
                    }
                    if (camera_1.Camera.cull(x, y, 1, 1))
                        continue;
                    // fill in shadows too
                    switch (_this.visibilityArray[x][y]) {
                        case 0:
                            game_1.Game.ctx.globalAlpha = 1;
                            break;
                        case 1:
                            game_1.Game.ctx.globalAlpha = 0.6;
                            break;
                        case 2:
                            game_1.Game.ctx.globalAlpha = 0;
                            break;
                    }
                    game_1.Game.ctx.fillStyle = "black";
                    game_1.Game.ctx.fillRect(x * gameConstants_1.GameConstants.TILESIZE, y * gameConstants_1.GameConstants.TILESIZE, gameConstants_1.GameConstants.TILESIZE, gameConstants_1.GameConstants.TILESIZE);
                    game_1.Game.ctx.globalAlpha = 1;
                }
            }
            camera_1.Camera.translateBack();
        };
        this.drawEntitiesBehindPlayer = function () {
            _this.enemies.sort(function (a, b) { return a.y - b.y; });
            _this.items.sort(function (a, b) { return a.y - b.y; });
            camera_1.Camera.translate();
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
            camera_1.Camera.translateBack();
        };
        this.drawEntitiesInFrontOfPlayer = function () {
            camera_1.Camera.translate();
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
            for (var x = 0; x < _this.levelArray.length; x++) {
                for (var y = 0; y < _this.levelArray[0].length; y++) {
                    if (_this.levelArray[x][y] !== null) {
                        if (_this.levelArray[x][y] instanceof layeredTile_1.LayeredTile) {
                            _this.levelArray[x][y].drawCeiling();
                        }
                        else if (_this.levelArray[x][y] instanceof collidableLayeredTile_1.CollidableLayeredTile) {
                            _this.levelArray[x][y].drawCeiling();
                        }
                        else {
                            continue;
                        }
                    }
                    if (camera_1.Camera.cull(x, y, 1, 1))
                        continue;
                    // fill in shadows too
                    switch (_this.visibilityArray[x][y]) {
                        case 0:
                            game_1.Game.ctx.globalAlpha = 1;
                            break;
                        case 1:
                            game_1.Game.ctx.globalAlpha = 0.6;
                            break;
                        case 2:
                            game_1.Game.ctx.globalAlpha = 0;
                            break;
                    }
                    game_1.Game.ctx.fillStyle = "black";
                    game_1.Game.ctx.fillRect(x * gameConstants_1.GameConstants.TILESIZE, y * gameConstants_1.GameConstants.TILESIZE, gameConstants_1.GameConstants.TILESIZE, gameConstants_1.GameConstants.TILESIZE);
                    game_1.Game.ctx.globalAlpha = 1;
                }
            }
            camera_1.Camera.translateBack();
        };
        // for stuff rendered on top of the player
        this.drawTopLayer = function () {
            camera_1.Camera.translate();
            for (var _i = 0, _a = _this.enemies; _i < _a.length; _i++) {
                var e = _a[_i];
                e.drawTopLayer(); // health bars
            }
            for (var x = 0; x < _this.levelArray.length; x++) {
                for (var y = 0; y < _this.levelArray[0].length; y++) {
                    if (_this.levelArray[x][y] !== null)
                        _this.levelArray[x][y].drawTopLayer();
                }
            }
            _this.particles = _this.particles.filter(function (x) { return !x.dead; });
            for (var _b = 0, _c = _this.particles; _b < _c.length; _b++) {
                var p = _c[_b];
                p.draw();
            }
            camera_1.Camera.translateBack();
            // gui stuff
        };
        this.game = game;
        this.env = env;
        this.items = Array();
        this.projectiles = Array();
        this.particles = Array();
        this.enemies = Array();
        this.width = levelData.width;
        this.height = levelData.height;
        this.levelArray = [];
        for (var x = 0; x < this.width; x++) {
            this.levelArray[x] = [];
        }
        this.visibilityArray = [];
        for (var x = 0; x < this.width; x++) {
            this.visibilityArray[x] = [];
            for (var y = 0; y < this.height; y++) {
                this.visibilityArray[x][y] = 0;
            }
        }
        var baseLayer = levelData.layers[0].data;
        var enemyLayer = levelData.layers[1].data;
        for (var y = 0; y < levelData.height; y++) {
            for (var x = 0; x < levelData.width; x++) {
                /*
                chest
                chest w golden key
                knight
                skull
                wizard
                crate
                player
                */
                // tileID = tile index on tileset + firstGID offset
                // figure out what tileset it's on based on ID range, then subtract out firstGID
                // then run through a case statement to create proper tile
                var tilegid = baseLayer[y * levelData.width + x];
                var tileSourceSet = this.tilegidToTileset(levelData, tilegid);
                if (tileSourceSet !== null) {
                    switch (tilegid - tileSourceSet.firstgid) {
                        case 1:
                            this.levelArray[x][y] = new floor_1.Floor(this, x, y);
                            break;
                        case 2:
                            this.levelArray[x][y + 1] = new wall_1.Wall(this, x, y + 1, 0);
                            break;
                        case 5:
                            this.levelArray[x][y + 1] = new wall_1.Wall(this, x, y + 1, 1);
                            break;
                        case 11:
                            this.levelArray[x][y] = new spike_1.Spike(this, x, y);
                            break;
                        case 14:
                            //this.levelArray[x][y] = new StairUp(this, x, y);
                            break;
                        case 16:
                            this.levelArray[x][y] = new sideArch_1.SideArch(this, x, y);
                            break;
                        case 17:
                            this.levelArray[x][y] = new arch_1.Arch(this, x, y);
                            break;
                        case 20:
                            this.levelArray[x][y + 1] = new doorLeft_1.DoorLeft(this, x, y + 1);
                            break;
                        case 53:
                            this.levelArray[x][y] = new door_1.Door(this, x, y);
                            break;
                        case 22:
                            this.levelArray[x][y + 1] = new doorRight_1.DoorRight(this, x, y + 1);
                            break;
                    }
                }
                if (!this.levelArray[x][y]) {
                    this.levelArray[x][y] = new floor_1.Floor(this, x, y);
                }
                var mobgid = enemyLayer[y * levelData.width + x];
                var mobSourceSet = this.tilegidToTileset(levelData, mobgid);
                if (mobSourceSet !== null) {
                    switch (mobgid - mobSourceSet.firstgid) {
                        case 33:
                            this.game.player.moveNoSmooth(x, y);
                            console.log("moving player to (" + x + ", " + y + ")");
                            break;
                        case 34:
                            this.enemies.push(new skullEnemy_1.SkullEnemy(this, this.game, x, y));
                            break;
                        case 36:
                            this.enemies.push(new knightEnemy_1.KnightEnemy(this, this.game, x, y));
                            break;
                        case 38:
                            this.enemies.push(new wizardEnemy_1.WizardEnemy(this, this.game, x, y));
                            break;
                        case 45:
                            this.enemies.push(new crate_1.Crate(this, this.game, x, y));
                            break;
                        case 46:
                            this.enemies.push(new barrel_1.Barrel(this, this.game, x, y));
                            break;
                        case 49:
                            if (x === 8 && y === 13) {
                                this.enemies.push(new chest_1.Chest(this, this.game, x, y, new goldenKey_1.GoldenKey(x, y)));
                            }
                            else {
                                this.enemies.push(new chest_1.Chest(this, this.game, x, y));
                            }
                            break;
                    }
                }
            }
        }
    }
    Level.prototype.pointInside = function (x, y, rX, rY, rW, rH) {
        if (x < rX || x >= rX + rW)
            return false;
        if (y < rY || y >= rY + rH)
            return false;
        return true;
    };
    Level.randEnv = function () {
        return game_1.Game.rand(0, levelConstants_1.LevelConstants.ENVIRONMENTS - 1);
    };
    return Level;
}());
exports.Level = Level;


/***/ }),
/* 17 */
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
var collidableLayeredTile_1 = __webpack_require__(44);
var gameConstants_1 = __webpack_require__(2);
var Wall = (function (_super) {
    __extends(Wall, _super);
    function Wall(level, x, y, type) {
        var _this = _super.call(this, level, x, y) || this;
        _this.draw = function () {
            if (_this.type === 0)
                game_1.Game.drawTile(0, _this.level.env, 1, 1, _this.x, _this.y, 1, 1);
        };
        _this.drawCeiling = function () {
            if (_this.level.visibilityArray[_this.x][_this.y] > 0) {
                if (_this.type === 0) {
                    game_1.Game.drawTile(2, _this.level.env, 1, 1, _this.x, _this.y - 1, 1, 1);
                }
                else if (_this.type === 1) {
                    game_1.Game.drawTile(5, _this.level.env, 1, 1, _this.x, _this.y - 1, 1, 1);
                }
            }
            else {
                game_1.Game.ctx.fillStyle = "black";
                game_1.Game.ctx.fillRect(_this.x * gameConstants_1.GameConstants.TILESIZE, (_this.y - 1) * gameConstants_1.GameConstants.TILESIZE, gameConstants_1.GameConstants.TILESIZE, gameConstants_1.GameConstants.TILESIZE);
            }
        };
        _this.type = type;
        return _this;
    }
    return Wall;
}(collidableLayeredTile_1.CollidableLayeredTile));
exports.Wall = Wall;


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
var item_1 = __webpack_require__(5);
var Key = (function (_super) {
    __extends(Key, _super);
    function Key(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.tileX = 1;
        _this.tileY = 0;
        return _this;
    }
    return Key;
}(item_1.Item));
exports.Key = Key;


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
var pickup_1 = __webpack_require__(6);
var sound_1 = __webpack_require__(7);
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


/***/ }),
/* 20 */
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
var levelConstants_1 = __webpack_require__(1);
var pickup_1 = __webpack_require__(6);
var Armor = (function (_super) {
    __extends(Armor, _super);
    function Armor(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.RECHARGE_TURNS = 18;
        _this.tick = function () {
            if (_this.rechargeTurnCounter > 0) {
                _this.rechargeTurnCounter--;
                if (_this.rechargeTurnCounter === 0) {
                    _this.rechargeTurnCounter = -1;
                    _this.health = 1;
                }
            }
        };
        _this.hurt = function (damage) {
            _this.health -= damage;
            if (_this.health <= 0) {
                _this.health = 0;
                _this.rechargeTurnCounter = _this.RECHARGE_TURNS;
            }
        };
        _this.drawGUI = function (playerHealth) {
            if (_this.rechargeTurnCounter === -1)
                game_1.Game.drawItemNoCull(5, 0, 1, 2, playerHealth, levelConstants_1.LevelConstants.SCREEN_H - 2, 1, 2);
            else {
                var rechargeProportion = 1 - _this.rechargeTurnCounter / _this.RECHARGE_TURNS;
                if (rechargeProportion < 0.33) {
                    game_1.Game.drawItemNoCull(2, 0, 1, 2, playerHealth, levelConstants_1.LevelConstants.SCREEN_H - 2, 1, 2);
                }
                else if (rechargeProportion < 0.67) {
                    game_1.Game.drawItemNoCull(3, 0, 1, 2, playerHealth, levelConstants_1.LevelConstants.SCREEN_H - 2, 1, 2);
                }
                else {
                    game_1.Game.drawItemNoCull(4, 0, 1, 2, playerHealth, levelConstants_1.LevelConstants.SCREEN_H - 2, 1, 2);
                }
            }
        };
        _this.onPickup = function (player) {
            if (player.armor === null)
                player.armor = _this;
            else {
                player.armor.health = 1;
                player.armor.rechargeTurnCounter = -1;
            }
        };
        _this.health = 1;
        _this.rechargeTurnCounter = -1;
        _this.tileX = 5;
        _this.tileY = 0;
        return _this;
    }
    return Armor;
}(pickup_1.Pickup));
exports.Armor = Armor;


/***/ }),
/* 21 */
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
var particle_1 = __webpack_require__(9);
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
var game_1 = __webpack_require__(0);
var floor_1 = __webpack_require__(4);
var Arch = (function (_super) {
    __extends(Arch, _super);
    function Arch() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.draw = function () {
            game_1.Game.drawTile(1, _this.level.env, 1, 1, _this.x, _this.y, 1, 1);
        };
        _this.drawTopLayer = function () {
            game_1.Game.drawTile(17, _this.level.env, 1, 1, _this.x, _this.y - 1, 1, 1);
        };
        return _this;
    }
    return Arch;
}(floor_1.Floor));
exports.Arch = Arch;


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
var game_1 = __webpack_require__(0);
var floor_1 = __webpack_require__(4);
var SideArch = (function (_super) {
    __extends(SideArch, _super);
    function SideArch() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.drawTopLayer = function () {
            game_1.Game.drawTile(15, _this.level.env, 1, 1, _this.x, _this.y - 1, 1, 1);
            game_1.Game.drawTile(16, _this.level.env, 1, 1, _this.x, _this.y - 2, 1, 1);
        };
        return _this;
    }
    return SideArch;
}(floor_1.Floor));
exports.SideArch = SideArch;


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
var floor_1 = __webpack_require__(4);
var Bones = (function (_super) {
    __extends(Bones, _super);
    function Bones() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.draw = function () {
            game_1.Game.drawTile(7, _this.level.env, 1, 1, _this.x, _this.y, 1, 1);
        };
        return _this;
    }
    return Bones;
}(floor_1.Floor));
exports.Bones = Bones;


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var input_1 = __webpack_require__(15);
var gameConstants_1 = __webpack_require__(2);
var game_1 = __webpack_require__(0);
var inventory_1 = __webpack_require__(26);
var sound_1 = __webpack_require__(7);
var spike_1 = __webpack_require__(13);
var textParticle_1 = __webpack_require__(28);
var dashParticle_1 = __webpack_require__(29);
var levelConstants_1 = __webpack_require__(1);
var pickup_1 = __webpack_require__(6);
var crate_1 = __webpack_require__(14);
var stats_1 = __webpack_require__(30);
var chest_1 = __webpack_require__(12);
var wizardFireball_1 = __webpack_require__(32);
var barrel_1 = __webpack_require__(34);
var camera_1 = __webpack_require__(10);
var door_1 = __webpack_require__(43);
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
                    if (_this.game.level.levelArray[x][y] instanceof door_1.Door) {
                        _this.game.level.levelArray[x][y].open();
                    }
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
            if (_this.game.level.getCollidable(x, y) === null) {
                if (_this.game.level.levelArray[x][y] instanceof door_1.Door) {
                    _this.game.level.levelArray[x][y].open();
                }
                _this.move(x, y);
                _this.game.level.tick();
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
            camera_1.Camera.translate();
            _this.flashingFrame += 12 / gameConstants_1.GameConstants.FPS;
            if (!_this.dead) {
                game_1.Game.drawMob(0, 0, 1, 1, _this.x - _this.drawX, _this.y - _this.drawY, 1, 1);
                if (!_this.flashing || Math.floor(_this.flashingFrame) % 2 === 0) {
                    _this.drawX += -0.5 * _this.drawX;
                    _this.drawY += -0.5 * _this.drawY;
                    game_1.Game.drawMob(1, 0, 1, 2, _this.x - _this.drawX, _this.y - 1.5 - _this.drawY, 1, 2);
                }
            }
            camera_1.Camera.translateBack();
        };
        this.drawTopLayer = function () {
            if (!_this.dead) {
                _this.guiHeartFrame += 1;
                var FREQ = gameConstants_1.GameConstants.FPS * 1.5;
                _this.guiHeartFrame %= FREQ;
                for (var i = 0; i < _this.health; i++) {
                    var frame = (_this.guiHeartFrame + FREQ) % FREQ >= FREQ - 4 ? 1 : 0;
                    game_1.Game.drawFXNoCull(frame, 2, 1, 1, i, levelConstants_1.LevelConstants.SCREEN_H - 1, 1, 1);
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
        };
        this.game = game;
        this.x = x;
        this.y = y;
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
        this.equipped = Array();
        this.inventory = new inventory_1.Inventory(game);
        this.missProb = 0.1;
        this.armor = null;
        this.sightRadius = 5; // maybe can be manipulated by items? e.g. better torch
    }
    return Player;
}());
exports.Player = Player;


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var levelConstants_1 = __webpack_require__(1);
var game_1 = __webpack_require__(0);
var input_1 = __webpack_require__(15);
var gameConstants_1 = __webpack_require__(2);
var equippable_1 = __webpack_require__(27);
var Inventory = (function () {
    function Inventory(game) {
        var _this = this;
        this.tileX = 0;
        this.tileY = 0;
        this.open = function () {
            _this.isOpen = true;
        };
        this.close = function () {
            _this.isOpen = false;
        };
        this.mouseLeftClickListener = function (x, y) {
            var tileX = Math.floor(x / gameConstants_1.GameConstants.TILESIZE);
            var tileY = Math.floor(y / gameConstants_1.GameConstants.TILESIZE);
            var i = tileX + tileY * levelConstants_1.LevelConstants.SCREEN_W;
            if (i < _this.items.length && _this.items[i] instanceof equippable_1.Equippable) {
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
            _this.game.player.equipped = _this.items.filter(function (x) { return x instanceof equippable_1.Equippable && x.equipped; });
        };
        this.draw = function () {
            if (_this.isOpen) {
                game_1.Game.ctx.fillStyle = "rgb(0, 0, 0, 0.9)";
                game_1.Game.ctx.fillRect(0, 0, gameConstants_1.GameConstants.WIDTH, gameConstants_1.GameConstants.HEIGHT);
                game_1.Game.ctx.drawImage(game_1.Game.inventory, gameConstants_1.GameConstants.WIDTH / 2 - 48, gameConstants_1.GameConstants.HEIGHT / 2 - 48);
                // check equips too
                _this.items = _this.items.filter(function (x) { return !x.dead; });
                _this.game.player.equipped = _this.items.filter(function (x) { return x instanceof equippable_1.Equippable && x.equipped; });
                for (var i = 0; i < _this.items.length; i++) {
                    var s = 4;
                    var x = i % s;
                    var y = Math.floor(i / s);
                    _this.items[i].drawIcon(x + levelConstants_1.LevelConstants.SCREEN_W / 2 - s / 2, y + levelConstants_1.LevelConstants.SCREEN_H / 2 - s / 2);
                    if (_this.items[i] instanceof equippable_1.Equippable && _this.items[i].equipped) {
                        game_1.Game.drawItem(0, 1, 1, 1, x, y, 1, 1);
                    }
                }
            }
        };
        this.game = game;
        this.items = new Array();
        input_1.Input.mouseLeftClickListener = this.mouseLeftClickListener;
        this.items.push();
    }
    Inventory.prototype.hasItem = function (itemType) {
        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
            var i = _a[_i];
            if (i instanceof itemType)
                return i;
        }
        return null;
    };
    Inventory.prototype.addItem = function (item) {
        this.items.push(item);
    };
    return Inventory;
}());
exports.Inventory = Inventory;


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
var item_1 = __webpack_require__(5);
var game_1 = __webpack_require__(0);
var Equippable = (function (_super) {
    __extends(Equippable, _super);
    function Equippable(x, y) {
        var _this = _super.call(this, x, y) || this;
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
var gameConstants_1 = __webpack_require__(2);
var particle_1 = __webpack_require__(9);
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
            _this.delay = game_1.Game.rand(0, 10); // up to a 10 tick delay
        else
            _this.delay = delay;
        return _this;
    }
    return TextParticle;
}(particle_1.Particle));
exports.TextParticle = TextParticle;


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
var game_1 = __webpack_require__(0);
var particle_1 = __webpack_require__(9);
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
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var statconstants_1 = __webpack_require__(31);
var game_1 = __webpack_require__(0);
var gameConstants_1 = __webpack_require__(2);
var levelConstants_1 = __webpack_require__(1);
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
/* 31 */
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
var projectile_1 = __webpack_require__(33);
var game_1 = __webpack_require__(0);
var WizardFireball = (function (_super) {
    __extends(WizardFireball, _super);
    function WizardFireball(parent, x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.tick = function () {
            if (_this.parent.dead)
                _this.dead = true;
            _this.state++;
            if (_this.state === 1) {
                _this.frame = 0;
                _this.delay = game_1.Game.rand(0, 10);
            }
        };
        _this.hit = function (player) {
            if (_this.state === 1 && !_this.dead) {
                player.hurt(1);
            }
        };
        _this.draw = function () {
            if (_this.state === 0) {
                _this.frame += 0.25;
                if (_this.frame >= 4)
                    _this.frame = 0;
                game_1.Game.drawFX(18 + Math.floor(_this.frame), 6, 1, 2, _this.x, _this.y - 1, 1, 2);
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
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Projectile = (function () {
    function Projectile(x, y) {
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
var enemy_1 = __webpack_require__(8);
var game_1 = __webpack_require__(0);
var levelConstants_1 = __webpack_require__(1);
var Barrel = (function (_super) {
    __extends(Barrel, _super);
    function Barrel(level, game, x, y) {
        var _this = _super.call(this, level, game, x, y) || this;
        _this.kill = function () {
            _this.dead = true;
        };
        _this.draw = function () {
            // not inherited because it doesn't have the 0.5 offset
            if (!_this.dead) {
                var darkOffset = _this.level.visibilityArray[_this.x][_this.y] <= levelConstants_1.LevelConstants.VISIBILITY_CUTOFF ? 2 : 0;
                _this.drawX += -0.5 * _this.drawX;
                _this.drawY += -0.5 * _this.drawY;
                game_1.Game.drawMob(_this.tileX, _this.tileY + darkOffset, 1, 2, _this.x - _this.drawX, _this.y - 1 - _this.drawY, 1, 2);
            }
        };
        _this.level = level;
        _this.health = 1;
        _this.tileX = 14;
        _this.tileY = 0;
        _this.hasShadow = false;
        return _this;
    }
    return Barrel;
}(enemy_1.Enemy));
exports.Barrel = Barrel;


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
var enemy_1 = __webpack_require__(8);
var levelConstants_1 = __webpack_require__(1);
var game_1 = __webpack_require__(0);
var astarclass_1 = __webpack_require__(36);
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


/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var floor_1 = __webpack_require__(4);
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
                    var cost = grid[x][y] instanceof floor_1.Floor ? 1 : 99999999;
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
var enemy_1 = __webpack_require__(8);
var game_1 = __webpack_require__(0);
var astarclass_1 = __webpack_require__(36);
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
var enemy_1 = __webpack_require__(8);
var levelConstants_1 = __webpack_require__(1);
var game_1 = __webpack_require__(0);
var wizardTeleportParticle_1 = __webpack_require__(39);
var wizardFireball_1 = __webpack_require__(32);
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
                            var newX = _this.x + game_1.Game.rand(-10, 10);
                            var newY = _this.y + game_1.Game.rand(-10, 10);
                            _this.tryMove(newX, newY);
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
var particle_1 = __webpack_require__(9);
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
var collidableLayeredTile_1 = __webpack_require__(44);
var gameConstants_1 = __webpack_require__(2);
var DoorLeft = (function (_super) {
    __extends(DoorLeft, _super);
    function DoorLeft(level, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.open = function () {
            _this.opened = true;
        };
        _this.draw = function () {
            game_1.Game.drawTile(0, _this.level.env, 1, 1, _this.x, _this.y, 1, 1);
        };
        _this.drawCeiling = function () {
            if (_this.opened) {
                _this.frame += 0.5;
                if (_this.frame > 3)
                    _this.frame = 3;
            }
            if (_this.level.visibilityArray[_this.x][_this.y] > 0) {
                game_1.Game.drawTile(20 + Math.floor(_this.frame) * 3, 0, 1, 1, _this.x, _this.y - 1, 1, 1);
            }
            else {
                game_1.Game.ctx.fillStyle = "black";
                game_1.Game.ctx.fillRect(_this.x * gameConstants_1.GameConstants.TILESIZE, (_this.y - 1) * gameConstants_1.GameConstants.TILESIZE, gameConstants_1.GameConstants.TILESIZE, gameConstants_1.GameConstants.TILESIZE);
            }
        };
        _this.opened = false;
        _this.frame = 0;
        return _this;
    }
    return DoorLeft;
}(collidableLayeredTile_1.CollidableLayeredTile));
exports.DoorLeft = DoorLeft;


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
var collidableLayeredTile_1 = __webpack_require__(44);
var gameConstants_1 = __webpack_require__(2);
var DoorRight = (function (_super) {
    __extends(DoorRight, _super);
    function DoorRight(level, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.open = function () {
            _this.opened = true;
        };
        _this.draw = function () {
            game_1.Game.drawTile(0, _this.level.env, 1, 1, _this.x, _this.y, 1, 1);
        };
        _this.drawCeiling = function () {
            if (_this.opened) {
                _this.frame += 0.5;
                if (_this.frame > 3)
                    _this.frame = 3;
            }
            if (_this.level.visibilityArray[_this.x][_this.y] > 0) {
                game_1.Game.drawTile(22 + Math.floor(_this.frame) * 3, 0, 1, 1, _this.x, _this.y - 1, 1, 1);
            }
            else {
                game_1.Game.ctx.fillStyle = "black";
                game_1.Game.ctx.fillRect(_this.x * gameConstants_1.GameConstants.TILESIZE, (_this.y - 1) * gameConstants_1.GameConstants.TILESIZE, gameConstants_1.GameConstants.TILESIZE, gameConstants_1.GameConstants.TILESIZE);
            }
        };
        _this.opened = false;
        _this.frame = 0;
        return _this;
    }
    return DoorRight;
}(collidableLayeredTile_1.CollidableLayeredTile));
exports.DoorRight = DoorRight;


/***/ }),
/* 42 */
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
var tile_1 = __webpack_require__(11);
var LayeredTile = (function (_super) {
    __extends(LayeredTile, _super);
    function LayeredTile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.draw = function () { };
        _this.drawCeiling = function () { };
        return _this;
    }
    return LayeredTile;
}(tile_1.Tile));
exports.LayeredTile = LayeredTile;


/***/ }),
/* 43 */
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
var layeredTile_1 = __webpack_require__(42);
var game_1 = __webpack_require__(0);
var doorLeft_1 = __webpack_require__(40);
var doorRight_1 = __webpack_require__(41);
var gameConstants_1 = __webpack_require__(2);
var Door = (function (_super) {
    __extends(Door, _super);
    function Door(level, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.open = function () {
            _this.opened = true;
            if (_this.level.levelArray[_this.x - 1][_this.y] instanceof doorLeft_1.DoorLeft)
                _this.level.levelArray[_this.x - 1][_this.y].open();
            if (_this.level.levelArray[_this.x + 1][_this.y] instanceof doorRight_1.DoorRight)
                _this.level.levelArray[_this.x + 1][_this.y].open();
        };
        _this.draw = function () {
            if (_this.opened) {
                _this.frame += 0.5;
                if (_this.frame > 3)
                    _this.frame = 3;
            }
            game_1.Game.drawTile(1, _this.level.env, 1, 1, _this.x, _this.y, 1, 1);
            game_1.Game.drawTile(21 + Math.floor(_this.frame) * 3, 1, 1, 1, _this.x, _this.y, 1, 1);
        };
        _this.drawCeiling = function () {
            if (_this.level.visibilityArray[_this.x][_this.y] > 0) {
                game_1.Game.drawTile(21 + Math.floor(_this.frame) * 3, 0, 1, 1, _this.x, _this.y - 1, 1, 1);
            }
            else {
                game_1.Game.ctx.fillStyle = "black";
                game_1.Game.ctx.fillRect(_this.x * gameConstants_1.GameConstants.TILESIZE, (_this.y - 1) * gameConstants_1.GameConstants.TILESIZE, gameConstants_1.GameConstants.TILESIZE, gameConstants_1.GameConstants.TILESIZE);
            }
        };
        _this.opened = false;
        _this.frame = 0;
        return _this;
    }
    return Door;
}(layeredTile_1.LayeredTile));
exports.Door = Door;


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
var collidable_1 = __webpack_require__(3);
var CollidableLayeredTile = (function (_super) {
    __extends(CollidableLayeredTile, _super);
    function CollidableLayeredTile() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.draw = function () { };
        _this.drawCeiling = function () { };
        return _this;
    }
    return CollidableLayeredTile;
}(collidable_1.Collidable));
exports.CollidableLayeredTile = CollidableLayeredTile;


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
var item_1 = __webpack_require__(5);
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


/***/ })
/******/ ]);