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
var level_1 = __webpack_require__(4);
var player_1 = __webpack_require__(28);
var sound_1 = __webpack_require__(22);
var Game = (function () {
    function Game() {
        var _this = this;
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
            _this.level.draw();
            _this.level.drawEntitiesBehindPlayer();
            _this.player.draw();
            _this.level.drawEntitiesInFrontOfPlayer();
            _this.level.drawTopLayer();
            _this.player.drawTopLayer();
        };
        window.addEventListener("load", function () {
            Game.ctx = document.getElementById("gameCanvas").getContext("2d");
            Game.ctx.font = "20px PixelFont";
            Game.ctx.textBaseline = "top";
            Game.tileset = new Image();
            Game.tileset.src = "res/tileset.png";
            Game.mobset = new Image();
            Game.mobset.src = "res/mobset.png";
            Game.itemset = new Image();
            Game.itemset.src = "res/itemset.png";
            sound_1.Sound.loadSounds();
            _this.player = new player_1.Player(_this, 0, 0);
            _this.level = new level_1.Level(_this, null, false, level_1.Level.randEnv());
            _this.level.enterLevel();
            setInterval(_this.run, 1000.0 / gameConstants_1.GameConstants.FPS);
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
        Game.ctx.drawImage(Game.tileset, sX * gameConstants_1.GameConstants.TILESIZE, sY * gameConstants_1.GameConstants.TILESIZE, sW * gameConstants_1.GameConstants.TILESIZE, sH * gameConstants_1.GameConstants.TILESIZE, dX * gameConstants_1.GameConstants.TILESIZE, dY * gameConstants_1.GameConstants.TILESIZE, dW * gameConstants_1.GameConstants.TILESIZE, dH * gameConstants_1.GameConstants.TILESIZE);
    };
    Game.drawMob = function (sX, sY, sW, sH, dX, dY, dW, dH) {
        Game.ctx.drawImage(Game.mobset, sX * gameConstants_1.GameConstants.TILESIZE, sY * gameConstants_1.GameConstants.TILESIZE, sW * gameConstants_1.GameConstants.TILESIZE, sH * gameConstants_1.GameConstants.TILESIZE, dX * gameConstants_1.GameConstants.TILESIZE, dY * gameConstants_1.GameConstants.TILESIZE, dW * gameConstants_1.GameConstants.TILESIZE, dH * gameConstants_1.GameConstants.TILESIZE);
    };
    Game.drawItem = function (sX, sY, sW, sH, dX, dY, dW, dH) {
        Game.ctx.drawImage(Game.itemset, sX * gameConstants_1.GameConstants.TILESIZE, sY * gameConstants_1.GameConstants.TILESIZE, sW * gameConstants_1.GameConstants.TILESIZE, sH * gameConstants_1.GameConstants.TILESIZE, dX * gameConstants_1.GameConstants.TILESIZE, dY * gameConstants_1.GameConstants.TILESIZE, dW * gameConstants_1.GameConstants.TILESIZE, dH * gameConstants_1.GameConstants.TILESIZE);
    };
    return Game;
}());
exports.Game = Game;
var game = new Game();


/***/ }),
/* 1 */
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
var tile_1 = __webpack_require__(5);
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


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var levelConstants_1 = __webpack_require__(3);
var GameConstants = (function () {
    function GameConstants() {
    }
    GameConstants.FPS = 60;
    GameConstants.TILESIZE = 16;
    GameConstants.SCALE = 2;
    GameConstants.WIDTH = levelConstants_1.LevelConstants.SCREEN_W * GameConstants.TILESIZE;
    GameConstants.HEIGHT = levelConstants_1.LevelConstants.SCREEN_H * GameConstants.TILESIZE;
    GameConstants.RED = "#ac3232";
    GameConstants.GREEN = "#6abe30";
    GameConstants.ARMOR_GREY = "#9badb7";
    GameConstants.OUTLINE = "#222034";
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
    LevelConstants.ENVIRONMENTS = 4;
    return LevelConstants;
}());
exports.LevelConstants = LevelConstants;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var wall_1 = __webpack_require__(23);
var levelConstants_1 = __webpack_require__(3);
var floor_1 = __webpack_require__(6);
var game_1 = __webpack_require__(0);
var collidable_1 = __webpack_require__(1);
var door_1 = __webpack_require__(7);
var bottomDoor_1 = __webpack_require__(11);
var wallSide_1 = __webpack_require__(24);
var trapdoor_1 = __webpack_require__(12);
var knightEnemy_1 = __webpack_require__(25);
var chest_1 = __webpack_require__(15);
var spawnfloor_1 = __webpack_require__(13);
var lockedDoor_1 = __webpack_require__(19);
var spike_1 = __webpack_require__(20);
var gameConstants_1 = __webpack_require__(2);
var Level = (function () {
    function Level(game, previousDoor, deadEnd, env) {
        var _this = this;
        // name this level
        this.classify = function (width, height, numEnemies) {
            var numDoors = 0;
            var numTrapdoors = 0;
            var numChests = 0;
            for (var _i = 0, _a = _this.levelArray; _i < _a.length; _i++) {
                var col = _a[_i];
                for (var _b = 0, col_1 = col; _b < col_1.length; _b++) {
                    var t = col_1[_b];
                    if (t instanceof door_1.Door)
                        numDoors++;
                    if (t instanceof trapdoor_1.Trapdoor)
                        numTrapdoors++;
                    if (t instanceof chest_1.Chest)
                        numChests++;
                }
            }
            _this.name = "";
            if (numChests >= 2)
                _this.name = "Treasure";
            else if (numDoors >= 3)
                _this.name = "Passageway";
            else if (numTrapdoors > 0)
                _this.name = "Trick Room";
            else if (game_1.Game.rand(1, 10) === 1) {
                if (_this.env === 0) {
                    var names = ["Dungeon", "Prison", "Sewer"];
                    _this.name = names[game_1.Game.rand(0, names.length - 1)];
                }
                if (_this.env === 1) {
                    var names = ["Forest", "Grass", "Hills"];
                    _this.name = names[game_1.Game.rand(0, names.length - 1)];
                }
                if (_this.env === 2) {
                    var names = ["House", "Mansion", "Inn"];
                    _this.name = names[game_1.Game.rand(0, names.length - 1)];
                }
                if (_this.env === 3) {
                    var names = ["Snow Palace", "Ice Palace", "Freeze", "Ice Kingdom", "Glacier", "Mountain"];
                    _this.name = names[game_1.Game.rand(0, names.length - 1)];
                }
            }
            var adjectiveList = [
                "Abandoned",
                "Deserted",
                "Haunted",
                "Cursed",
                "Ancient",
                "Lonely",
                "Spooky",
            ];
            if (_this.name !== "")
                _this.name = adjectiveList[game_1.Game.rand(0, adjectiveList.length - 1)] + " " + _this.name;
        };
        this.exitLevel = function () {
            _this.textParticles.splice(0, _this.textParticles.length);
        };
        this.enterLevel = function () {
            if (_this.hasBottomDoor) {
                _this.game.player.moveNoSmooth(_this.bottomDoorX, _this.bottomDoorY);
            }
            else
                _this.game.player.moveNoSmooth(_this.bottomDoorX, _this.bottomDoorY - 1);
        };
        this.enterLevelThroughDoor = function (door) {
            _this.game.player.moveNoSmooth(door.x, door.y + 1);
        };
        this.getCollidable = function (x, y) {
            for (var _i = 0, _a = _this.levelArray; _i < _a.length; _i++) {
                var col = _a[_i];
                for (var _b = 0, col_2 = col; _b < col_2.length; _b++) {
                    var tile = col_2[_b];
                    if (tile instanceof collidable_1.Collidable && tile.x === x && tile.y === y)
                        return tile;
                }
            }
            return null;
        };
        this.getTile = function (x, y) {
            for (var _i = 0, _a = _this.levelArray; _i < _a.length; _i++) {
                var col = _a[_i];
                for (var _b = 0, col_3 = col; _b < col_3.length; _b++) {
                    var tile = col_3[_b];
                    if (tile !== null && tile.x === x && tile.y === y)
                        return tile;
                }
            }
            return null;
        };
        this.tick = function () {
            _this.game.player.startTick();
            for (var _i = 0, _a = _this.enemies; _i < _a.length; _i++) {
                var e = _a[_i];
                e.tick();
            }
            _this.game.player.finishTick();
        };
        this.update = function () {
            // update, animations maybe?
        };
        this.draw = function () {
            for (var _i = 0, _a = _this.levelArray; _i < _a.length; _i++) {
                var col = _a[_i];
                for (var _b = 0, col_4 = col; _b < col_4.length; _b++) {
                    var tile = col_4[_b];
                    if (tile !== null)
                        tile.draw();
                }
            }
        };
        this.drawEntitiesBehindPlayer = function () {
            _this.enemies.sort(function (a, b) { return a.y - b.y; });
            _this.items.sort(function (a, b) { return a.y - b.y; });
            for (var _i = 0, _a = _this.enemies; _i < _a.length; _i++) {
                var e = _a[_i];
                if (e.y <= _this.game.player.y)
                    e.draw();
            }
            for (var _b = 0, _c = _this.items; _b < _c.length; _b++) {
                var i = _c[_b];
                if (i.y <= _this.game.player.y)
                    i.draw();
            }
        };
        this.drawEntitiesInFrontOfPlayer = function () {
            for (var _i = 0, _a = _this.enemies; _i < _a.length; _i++) {
                var e = _a[_i];
                if (e.y > _this.game.player.y)
                    e.draw();
            }
            for (var _b = 0, _c = _this.items; _b < _c.length; _b++) {
                var i = _c[_b];
                if (i.y > _this.game.player.y)
                    i.draw();
            }
        };
        // for stuff rendered on top of the player
        this.drawTopLayer = function () {
            for (var _i = 0, _a = _this.enemies; _i < _a.length; _i++) {
                var e = _a[_i];
                e.drawTopLayer(); // health bars
            }
            _this.textParticles = _this.textParticles.filter(function (x) { return !x.dead; });
            for (var _b = 0, _c = _this.textParticles; _b < _c.length; _b++) {
                var p = _c[_b];
                p.draw();
            }
            // gui stuff
            // room name
            game_1.Game.ctx.fillStyle = "white";
            if (_this.env === 3)
                game_1.Game.ctx.fillStyle = "black";
            game_1.Game.ctx.fillText(_this.name, gameConstants_1.GameConstants.WIDTH / 2 - game_1.Game.ctx.measureText(_this.name).width / 2, (_this.roomY - 2) * gameConstants_1.GameConstants.TILESIZE);
        };
        this.env = env;
        this.items = Array();
        this.textParticles = Array();
        // if previousDoor is null, no bottom door
        this.hasBottomDoor = true;
        if (previousDoor === null) {
            this.hasBottomDoor = false;
            this.parentLevel = null;
        }
        this.game = game;
        var width = game_1.Game.randTable([5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 9, 11, 13]);
        var height = width + game_1.Game.rand(-2, 2);
        height = Math.min(height, levelConstants_1.LevelConstants.MAX_LEVEL_H);
        height = Math.max(height, levelConstants_1.LevelConstants.MIN_LEVEL_H);
        this.levelArray = [];
        for (var x = 0; x < levelConstants_1.LevelConstants.SCREEN_W; x++) {
            this.levelArray[x] = [];
        }
        this.roomX = Math.floor(levelConstants_1.LevelConstants.SCREEN_W / 2 - width / 2);
        this.roomY = Math.floor(levelConstants_1.LevelConstants.SCREEN_H / 2 - height / 2);
        this.bottomDoorX = Math.floor(this.roomX + width / 2);
        this.bottomDoorY = this.roomY + height;
        // fill in outside walls
        for (var x = 0; x < levelConstants_1.LevelConstants.SCREEN_W; x++) {
            for (var y = 0; y < levelConstants_1.LevelConstants.SCREEN_H; y++) {
                this.levelArray[x][y] = new wall_1.Wall(this, x, y, 1);
            }
        }
        // put in floors
        for (var x = 0; x < levelConstants_1.LevelConstants.SCREEN_W; x++) {
            for (var y = 0; y < levelConstants_1.LevelConstants.SCREEN_H; y++) {
                if (this.pointInside(x, y, this.roomX, this.roomY, width, height)) {
                    this.levelArray[x][y] = new floor_1.Floor(this, x, y);
                }
            }
        }
        // outer ring walls
        for (var x = 0; x < levelConstants_1.LevelConstants.SCREEN_W; x++) {
            for (var y = 0; y < levelConstants_1.LevelConstants.SCREEN_H; y++) {
                if (this.pointInside(x, y, this.roomX - 1, this.roomY - 1, width + 2, height + 2)) {
                    if (!this.pointInside(x, y, this.roomX, this.roomY, width, height)) {
                        this.levelArray[x][y] = new wall_1.Wall(this, x, y, 0);
                    }
                }
            }
        }
        // put some random wall blocks in the room
        var numBlocks = game_1.Game.randTable([0, 1, 1, 2, 2, 2, 2, 3, 3]);
        for (var i = 0; i < numBlocks; i++) {
            var blockW = Math.min(game_1.Game.randTable([2, 2, 2, 5, 7, 9]), width - 2);
            var blockH = Math.min(blockW + game_1.Game.rand(-1, 1), height - 3);
            var x = game_1.Game.rand(this.roomX + 1, this.roomX + width - blockW - 1);
            var y = game_1.Game.rand(this.roomY + 2, this.roomY + height - blockH - 2);
            for (var xx = x; xx < x + blockW; xx++) {
                for (var yy = y; yy < y + blockH; yy++) {
                    this.levelArray[xx][yy] = new wall_1.Wall(this, xx, yy, 0);
                }
            }
        }
        // add "finger" blocks extending from ring walls inward
        var numFingers = game_1.Game.randTable([0, 1, 1, 2, 2, 3, 4, 5]);
        if (game_1.Game.rand(1, 13) > width)
            numFingers += width * 0.3;
        var FINGER_LENGTH = height - 3;
        for (var i = 0; i < numFingers; i++) {
            var x = 0;
            var y = 0;
            var blockW = 0;
            var blockH = 0;
            if (game_1.Game.rand(0, 1) === 0) {
                // horizontal
                blockW = game_1.Game.rand(1, FINGER_LENGTH);
                blockH = 1;
                if (game_1.Game.rand(0, 1) === 0) {
                    // left
                    x = this.roomX;
                    y = game_1.Game.rand(this.roomY + 2, this.roomY + height - 3);
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
                    x = this.roomX + width - blockW;
                    y = game_1.Game.rand(this.roomY + 2, this.roomY + height - 3);
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
                blockH = game_1.Game.rand(1, FINGER_LENGTH);
                if (game_1.Game.rand(0, 1) === 0) {
                    // top
                    y = this.roomY;
                    x = game_1.Game.rand(this.roomX + 2, this.roomX + width - 3);
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
                    y = this.roomY + height - blockH;
                    x = game_1.Game.rand(this.roomX + 2, this.roomX + width - 3);
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
        this.levelArray[this.bottomDoorX][this.bottomDoorY - 1] = new spawnfloor_1.SpawnFloor(this, this.bottomDoorX, this.bottomDoorY - 1);
        if (previousDoor !== null) {
            this.levelArray[this.bottomDoorX][this.bottomDoorY] = new bottomDoor_1.BottomDoor(this, this.game, previousDoor, this.bottomDoorX, this.bottomDoorY);
        }
        this.fixWalls();
        // add trapdoors
        var numTrapdoors = game_1.Game.rand(1, 10);
        if (numTrapdoors === 1) {
            numTrapdoors = game_1.Game.randTable([1, 1, 1, 1, 1, 1, 2]);
        }
        else
            numTrapdoors = 0;
        for (var i = 0; i < numTrapdoors; i++) {
            var x = 0;
            var y = 0;
            while (!(this.getTile(x, y) instanceof floor_1.Floor)) {
                x = game_1.Game.rand(this.roomX, this.roomX + width - 1);
                y = game_1.Game.rand(this.roomY, this.roomY + height - 1);
            }
            this.levelArray[x][y] = new trapdoor_1.Trapdoor(this, this.game, x, y);
        }
        // add doors
        var numDoors = game_1.Game.randTable([1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3]);
        if (deadEnd && game_1.Game.rand(1, 3) === 1)
            numDoors = 0;
        for (var i = 0; i < numDoors; i++) {
            var x = 0;
            var y = 0;
            do {
                x = game_1.Game.rand(0, levelConstants_1.LevelConstants.SCREEN_W - 1);
                y = game_1.Game.rand(0, levelConstants_1.LevelConstants.SCREEN_H - 1);
            } while (!(this.levelArray[x][y] instanceof wallSide_1.WallSide) ||
                this.getTile(x, y) instanceof door_1.Door ||
                this.getTile(x - 1, y) instanceof door_1.Door ||
                this.getTile(x + 1, y) instanceof door_1.Door);
            // if there are multiple doors, roll to see if the first one should be a dead end
            if (i === 0 && numDoors > 1) {
                if (game_1.Game.rand(1, 5) === 1) {
                    // locked (90% dead-end as well) door
                    this.levelArray[x][y] = new lockedDoor_1.LockedDoor(this, x, y);
                }
                else if (game_1.Game.rand(1, 4) >= 3) {
                    // regular dead-end door
                    this.levelArray[x][y] = new door_1.Door(this, this.game, x, y, true);
                }
                else {
                    this.levelArray[x][y] = new door_1.Door(this, this.game, x, y, deadEnd);
                }
            }
            else {
                // otherwise, generate a non-dead end
                this.levelArray[x][y] = new door_1.Door(this, this.game, x, y, deadEnd);
            }
        }
        // add chests
        var numChests = game_1.Game.rand(1, 3);
        if (numChests === 1 || numDoors === 0) {
            // if it's a dead end, at least give them a chest
            numChests = game_1.Game.randTable([0, 1, 1, 1, 2, 3, 4]);
            // (but not guaranteed   ---^)
        }
        else
            numChests = 0;
        for (var i = 0; i < numChests; i++) {
            var x = 0;
            var y = 0;
            while (!(this.getTile(x, y) instanceof floor_1.Floor)) {
                x = game_1.Game.rand(this.roomX, this.roomX + width - 1);
                y = game_1.Game.rand(this.roomY, this.roomY + height - 1);
            }
            this.levelArray[x][y] = new chest_1.Chest(this, this.game, x, y);
        }
        // add spikes
        var numSpikes = game_1.Game.rand(1, 10);
        if (numSpikes === 1) {
            numSpikes = game_1.Game.randTable([1, 1, 1, 1, 2, 3]);
        }
        else
            numSpikes = 0;
        for (var i = 0; i < numSpikes; i++) {
            var x = 0;
            var y = 0;
            while (!(this.getTile(x, y) instanceof floor_1.Floor)) {
                x = game_1.Game.rand(this.roomX, this.roomX + width - 1);
                y = game_1.Game.rand(this.roomY, this.roomY + height - 1);
            }
            this.levelArray[x][y] = new spike_1.Spike(this, x, y);
        }
        this.enemies = Array();
        // add enemies
        var numEnemies = game_1.Game.rand(1, 2);
        if (numEnemies === 1 || width * height > 8 * 8) {
            numEnemies = game_1.Game.randTable([1, 2, 2, 3, 3, 4, 4, 4, 4, 5, 5, 5]);
        }
        else
            numEnemies = 0;
        for (var i = 0; i < numEnemies; i++) {
            var x = 0;
            var y = 0;
            while (!(this.getTile(x, y) instanceof floor_1.Floor) ||
                (x === this.bottomDoorX && y === this.bottomDoorY) ||
                (x === this.bottomDoorX && y === this.bottomDoorY - 1)) {
                x = game_1.Game.rand(this.roomX, this.roomX + width - 1);
                y = game_1.Game.rand(this.roomY, this.roomY + height - 1);
            }
            this.enemies.push(new knightEnemy_1.KnightEnemy(this, this.game, x, y));
        }
        if (this.hasBottomDoor) {
            var b = this.levelArray[this.bottomDoorX][this.bottomDoorY];
            this.parentLevel = b.linkedTopDoor.level;
        }
        this.classify(width, height, numEnemies);
    }
    Level.prototype.pointInside = function (x, y, rX, rY, rW, rH) {
        if (x < rX || x >= rX + rW)
            return false;
        if (y < rY || y >= rY + rH)
            return false;
        return true;
    };
    Level.prototype.fixWalls = function () {
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
    Level.randEnv = function () {
        return game_1.Game.rand(0, levelConstants_1.LevelConstants.ENVIRONMENTS - 1);
    };
    return Level;
}());
exports.Level = Level;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Tile = (function () {
    function Tile(level, x, y) {
        this.draw = function () { };
        this.level = level;
        this.x = x;
        this.y = y;
    }
    return Tile;
}());
exports.Tile = Tile;


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
var game_1 = __webpack_require__(0);
var tile_1 = __webpack_require__(5);
var Floor = (function (_super) {
    __extends(Floor, _super);
    function Floor(level, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.draw = function () {
            game_1.Game.drawTile(_this.variation, _this.level.env, 1, 1, _this.x, _this.y, _this.w, _this.h);
        };
        _this.w = 1;
        _this.h = 1;
        _this.variation = 1;
        if (game_1.Game.rand(1, 20) == 1)
            _this.variation = game_1.Game.randTable([7, 8, 9, 10, 12]);
        return _this;
    }
    return Floor;
}(tile_1.Tile));
exports.Floor = Floor;


/***/ }),
/* 7 */
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
var collidable_1 = __webpack_require__(1);
var game_1 = __webpack_require__(0);
var level_1 = __webpack_require__(4);
var Door = (function (_super) {
    __extends(Door, _super);
    function Door(level, game, x, y, deadEnd) {
        var _this = _super.call(this, level, x, y) || this;
        _this.onCollide = function (player) {
            _this.opened = true;
            if (_this.linkedLevel === null)
                _this.linkedLevel = new level_1.Level(_this.game, _this, _this.deadEnd, _this.level.env);
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
        _this.opened = false;
        return _this;
    }
    return Door;
}(collidable_1.Collidable));
exports.Door = Door;


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
var item_1 = __webpack_require__(9);
var Potion = (function (_super) {
    __extends(Potion, _super);
    function Potion(x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.tileX = 2;
        _this.tileY = 0;
        return _this;
    }
    return Potion;
}(item_1.Item));
exports.Potion = Potion;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var Item = (function () {
    function Item(x, y) {
        var _this = this;
        this.draw = function () {
            game_1.Game.drawItem(0, 0, 1, 1, _this.x, _this.y, 1, 1);
            _this.tick += Math.PI * 2 / 60;
            game_1.Game.drawItem(_this.tileX, _this.tileY, 1, 2, _this.x, _this.y + Math.sin(_this.tick) * 0.0625 - 1, _this.w, _this.h);
        };
        this.drawIcon = function (x, y) {
            game_1.Game.drawItem(_this.tileX, _this.tileY, 1, 2, x, y - 1, _this.w, _this.h);
        };
        this.x = x;
        this.y = y;
        this.w = 1;
        this.h = 2;
        this.tileX = 0;
        this.tileY = 0;
        this.tick = 0;
        this.dead = false;
    }
    return Item;
}());
exports.Item = Item;


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
var equippable_1 = __webpack_require__(17);
var Armor = (function (_super) {
    __extends(Armor, _super);
    function Armor(health, x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.hurt = function (damage) {
            _this.health -= damage;
            if (_this.health <= 0) {
                _this.health = 0;
                _this.dead = true;
            }
        };
        _this.coEquippable = function (other) {
            return !(other instanceof Armor);
        };
        _this.drawEquipped = function (x, y) {
            game_1.Game.drawMob(0, 2, 1, 2, x, y - 1.5, 1, 2);
        };
        _this.health = health;
        _this.lastTickHealth = health;
        _this.tileX = 4;
        _this.tileY = 0;
        return _this;
    }
    return Armor;
}(equippable_1.Equippable));
exports.Armor = Armor;


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
var collidable_1 = __webpack_require__(1);
var game_1 = __webpack_require__(0);
var BottomDoor = (function (_super) {
    __extends(BottomDoor, _super);
    function BottomDoor(level, game, linkedTopDoor, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.onCollide = function (player) {
            _this.game.changeLevelThroughDoor(_this.linkedTopDoor);
        };
        _this.draw = function () {
            game_1.Game.drawTile(1, _this.level.env, 1, 1, _this.x, _this.y, _this.w, _this.h);
        };
        _this.game = game;
        _this.linkedTopDoor = linkedTopDoor;
        return _this;
    }
    return BottomDoor;
}(collidable_1.Collidable));
exports.BottomDoor = BottomDoor;


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
var collidable_1 = __webpack_require__(1);
var game_1 = __webpack_require__(0);
var level_1 = __webpack_require__(4);
var Trapdoor = (function (_super) {
    __extends(Trapdoor, _super);
    function Trapdoor(level, game, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.draw = function () {
            game_1.Game.drawTile(13, _this.level.env, 1, 1, _this.x, _this.y, _this.w, _this.h);
        };
        _this.onCollide = function (player) {
            _this.game.changeLevel(new level_1.Level(_this.game, null, false, level_1.Level.randEnv()));
        };
        _this.game = game;
        return _this;
    }
    return Trapdoor;
}(collidable_1.Collidable));
exports.Trapdoor = Trapdoor;


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
var tile_1 = __webpack_require__(5);
var SpawnFloor = (function (_super) {
    __extends(SpawnFloor, _super);
    function SpawnFloor(level, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.draw = function () {
            game_1.Game.drawTile(_this.variation, _this.level.env, 1, 1, _this.x, _this.y, _this.w, _this.h);
        };
        _this.w = 1;
        _this.h = 1;
        _this.variation = 1;
        if (game_1.Game.rand(1, 20) == 1)
            _this.variation = game_1.Game.randTable([7, 8, 9, 10, 12]);
        return _this;
    }
    return SpawnFloor;
}(tile_1.Tile));
exports.SpawnFloor = SpawnFloor;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var gameConstants_1 = __webpack_require__(2);
var HealthBar = (function () {
    function HealthBar(health) {
        var _this = this;
        this.DRAW_TICKS = gameConstants_1.GameConstants.FPS * 3; // 3 seconds of ticks
        this.heal = function (amount) {
            _this.health += amount;
            if (_this.health > _this.fullHealth)
                _this.health = _this.fullHealth;
            if (_this.drawTicks > 0)
                _this.drawTicks = _this.DRAW_TICKS / 2;
            else
                _this.drawTicks = _this.DRAW_TICKS;
        };
        this.hurt = function (damage) {
            _this.health -= damage;
            if (_this.drawTicks > 0)
                _this.drawTicks = _this.DRAW_TICKS / 2;
            else
                _this.drawTicks = _this.DRAW_TICKS;
        };
        // here x is the center of the bar
        this.draw = function (x, y) {
            if (_this.drawTicks > 0) {
                _this.drawTicks--;
                var healthPct = _this.health / _this.fullHealth;
                var WIDTH = Math.min(14, Math.min(_this.DRAW_TICKS - _this.drawTicks, _this.drawTicks));
                var HEIGHT = 1;
                var BORDER_W = 1;
                var BORDER_H = 1;
                game_1.Game.ctx.fillStyle = gameConstants_1.GameConstants.OUTLINE;
                game_1.Game.ctx.fillRect(x - WIDTH / 2 - BORDER_W, y - HEIGHT - BORDER_H * 2, WIDTH + BORDER_W * 2, HEIGHT + BORDER_H * 2);
                game_1.Game.ctx.fillStyle = gameConstants_1.GameConstants.RED;
                game_1.Game.ctx.fillRect(x - WIDTH / 2, y - HEIGHT - BORDER_H, WIDTH, HEIGHT);
                game_1.Game.ctx.fillStyle = gameConstants_1.GameConstants.GREEN;
                game_1.Game.ctx.fillRect(x - WIDTH / 2, y - HEIGHT - BORDER_H, Math.floor(healthPct * WIDTH), HEIGHT);
            }
        };
        this.drawAboveTile = function (x, y) {
            _this.draw(x * gameConstants_1.GameConstants.TILESIZE, y * gameConstants_1.GameConstants.TILESIZE);
        };
        this.health = health;
        this.fullHealth = health;
        this.drawTicks = 0;
    }
    return HealthBar;
}());
exports.HealthBar = HealthBar;


/***/ }),
/* 15 */
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
var collidable_1 = __webpack_require__(1);
var game_1 = __webpack_require__(0);
var key_1 = __webpack_require__(16);
var potion_1 = __webpack_require__(8);
var armor_1 = __webpack_require__(10);
var helmet_1 = __webpack_require__(18);
var Chest = (function (_super) {
    __extends(Chest, _super);
    function Chest(level, game, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.draw = function () {
            game_1.Game.drawTile(4, _this.level.env, 1, 1, _this.x, _this.y, _this.w, _this.h);
        };
        _this.open = function () {
            // DROP TABLES!
            var drop = game_1.Game.randTable([1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 3, 3, 4, 4]);
            switch (drop) {
                case 1:
                    _this.game.level.items.push(new potion_1.Potion(_this.x, _this.y));
                    break;
                case 2:
                    _this.game.level.items.push(new key_1.Key(_this.x, _this.y));
                    break;
                case 3:
                    _this.game.level.items.push(new armor_1.Armor(game_1.Game.randTable([3, 5, 5, 5, 10, 15]), _this.x, _this.y));
                    break;
                case 4:
                    _this.game.level.items.push(new helmet_1.Helmet(game_1.Game.randTable([3, 3, 5, 5, 10]), _this.x, _this.y));
                    break;
            }
        };
        _this.level = level;
        _this.game = game;
        return _this;
    }
    return Chest;
}(collidable_1.Collidable));
exports.Chest = Chest;


/***/ }),
/* 16 */
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
var item_1 = __webpack_require__(9);
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
var item_1 = __webpack_require__(9);
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
var equippable_1 = __webpack_require__(17);
var Helmet = (function (_super) {
    __extends(Helmet, _super);
    function Helmet(health, x, y) {
        var _this = _super.call(this, x, y) || this;
        _this.hurt = function (damage) {
            _this.health -= damage;
            if (_this.health <= 0) {
                _this.health = 0;
                _this.dead = true;
            }
        };
        _this.coEquippable = function (other) {
            return !(other instanceof Helmet);
        };
        _this.drawEquipped = function (x, y) {
            game_1.Game.drawMob(1, 2, 1, 2, x, y - 1.5, 1, 2);
        };
        _this.health = health;
        _this.lastTickHealth = health;
        _this.tileX = 5;
        _this.tileY = 0;
        return _this;
    }
    return Helmet;
}(equippable_1.Equippable));
exports.Helmet = Helmet;


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
var collidable_1 = __webpack_require__(1);
var game_1 = __webpack_require__(0);
var door_1 = __webpack_require__(7);
var key_1 = __webpack_require__(16);
var LockedDoor = (function (_super) {
    __extends(LockedDoor, _super);
    function LockedDoor() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.unlock = function (player) {
            var k = player.inventory.hasItem(key_1.Key);
            if (k !== null) {
                // remove key
                player.inventory.items = player.inventory.items.filter(function (x) { return x !== k; });
                var d = new door_1.Door(_this.level, _this.level.game, _this.x, _this.y, game_1.Game.rand(1, 10) !== 1);
                _this.level.levelArray[_this.x][_this.y] = d; // replace this door in level
            }
        };
        _this.draw = function () {
            game_1.Game.drawTile(16, _this.level.env, 1, 1, _this.x, _this.y, _this.w, _this.h);
        };
        return _this;
    }
    return LockedDoor;
}(collidable_1.Collidable));
exports.LockedDoor = LockedDoor;


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
var collidable_1 = __webpack_require__(1);
var game_1 = __webpack_require__(0);
var Spike = (function (_super) {
    __extends(Spike, _super);
    function Spike() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.onCollide = function (player) {
            player.hurt(1);
        };
        _this.draw = function () {
            game_1.Game.drawTile(11, _this.level.env, 1, 1, _this.x, _this.y, _this.w, _this.h);
        };
        return _this;
    }
    return Spike;
}(collidable_1.Collidable));
exports.Spike = Spike;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var gameConstants_1 = __webpack_require__(2);
exports.Input = {
    _pressed: {},
    spaceListener: function () { },
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
            case exports.Input.SPACE:
                exports.Input.spaceListener();
                break;
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
        }
    },
    onKeyup: function (event) {
        delete this._pressed[event.keyCode];
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
/* 22 */
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
    };
    Sound.footstep = function () {
        var i = game_1.Game.rand(0, Sound.footsteps.length - 1);
        Sound.footsteps[i].play();
        Sound.footsteps[i].currentTime = 0;
    };
    return Sound;
}());
exports.Sound = Sound;


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
var collidable_1 = __webpack_require__(1);
var Wall = (function (_super) {
    __extends(Wall, _super);
    function Wall(level, x, y, type) {
        var _this = _super.call(this, level, x, y) || this;
        _this.draw = function () {
            if (_this.type === 0) {
                game_1.Game.drawTile(2, _this.level.env, 1, 1, _this.x, _this.y, _this.w, _this.h);
            }
            else if (_this.type === 1) {
                game_1.Game.drawTile(5, _this.level.env, 1, 1, _this.x, _this.y, _this.w, _this.h);
            }
        };
        _this.type = type;
        return _this;
    }
    return Wall;
}(collidable_1.Collidable));
exports.Wall = Wall;


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
var collidable_1 = __webpack_require__(1);
var WallSide = (function (_super) {
    __extends(WallSide, _super);
    function WallSide() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.draw = function () {
            game_1.Game.drawTile(0, _this.level.env, 1, 1, _this.x, _this.y, _this.w, _this.h);
        };
        return _this;
    }
    return WallSide;
}(collidable_1.Collidable));
exports.WallSide = WallSide;


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
var enemy_1 = __webpack_require__(26);
var game_1 = __webpack_require__(0);
var astarclass_1 = __webpack_require__(27);
var healthbar_1 = __webpack_require__(14);
var potion_1 = __webpack_require__(8);
var KnightEnemy = (function (_super) {
    __extends(KnightEnemy, _super);
    function KnightEnemy(level, game, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.tick = function () {
            if (!_this.dead) {
                _this.ticks++;
                if (_this.ticks % 2 === 0) {
                    var oldX = _this.x;
                    var oldY = _this.y;
                    _this.moves = astarclass_1.astar.AStar.search(_this.level.levelArray, _this, _this.game.player);
                    if (_this.moves.length > 0) {
                        if (_this.game.player.x === _this.moves[0].pos.x &&
                            _this.game.player.y === _this.moves[0].pos.y) {
                            _this.game.player.hurt(1);
                        }
                        else {
                            if (_this.game.level.getCollidable(_this.moves[0].pos.x, _this.moves[0].pos.y) === null) {
                                _this.x = _this.moves[0].pos.x;
                                _this.y = _this.moves[0].pos.y;
                            }
                        }
                    }
                    _this.drawX = _this.x - oldX;
                    _this.drawY = _this.y - oldY;
                }
            }
            if (_this.healthBar.health <= 0) {
                _this.kill();
            }
        };
        _this.hurt = function (damage) {
            _this.healthBar.hurt(damage);
        };
        _this.kill = function () {
            _this.dead = true;
            if (game_1.Game.rand(1, 5) === 1)
                _this.level.items.push(new potion_1.Potion(_this.x, _this.y));
            _this.x = -10;
            _this.y = -10;
        };
        _this.draw = function () {
            if (!_this.dead) {
                _this.drawX += -0.5 * _this.drawX;
                _this.drawY += -0.5 * _this.drawY;
                game_1.Game.drawMob(0, 0, 1, 1, _this.x - _this.drawX, _this.y - _this.drawY, 1, 1);
                game_1.Game.drawMob(4, 0, 1, 2, _this.x - _this.drawX, _this.y - 1.5 - _this.drawY, 1, 2);
            }
        };
        _this.drawTopLayer = function () {
            _this.healthBar.drawAboveTile(_this.x - _this.drawX + 0.5, _this.y - 0.75 - _this.drawY);
        };
        _this.game = game;
        _this.level = level;
        _this.moves = new Array();
        _this.ticks = 0;
        _this.healthBar = new healthbar_1.HealthBar(2);
        return _this;
    }
    return KnightEnemy;
}(enemy_1.Enemy));
exports.KnightEnemy = KnightEnemy;


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
var collidable_1 = __webpack_require__(1);
var game_1 = __webpack_require__(0);
var Enemy = (function (_super) {
    __extends(Enemy, _super);
    function Enemy(level, x, y) {
        var _this = _super.call(this, level, x, y) || this;
        _this.hurt = function (damage) { };
        _this.draw = function () {
            game_1.Game.drawMob(0, 0, 1, 1, _this.x - _this.drawX, _this.y - _this.drawY, 1, 1);
        };
        _this.tick = function () { };
        _this.drawTopLayer = function () { };
        _this.drawX = 0;
        _this.drawY = 0;
        return _this;
    }
    return Enemy;
}(collidable_1.Collidable));
exports.Enemy = Enemy;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var floor_1 = __webpack_require__(6);
var spawnfloor_1 = __webpack_require__(13);
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
                    var cost = grid[x][y] instanceof floor_1.Floor || grid[x][y] instanceof spawnfloor_1.SpawnFloor ? 1 : 10000;
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
                    this.grid[disablePoints[i].x][disablePoints[i].y].cost = 0;
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
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var input_1 = __webpack_require__(21);
var gameConstants_1 = __webpack_require__(2);
var game_1 = __webpack_require__(0);
var door_1 = __webpack_require__(7);
var bottomDoor_1 = __webpack_require__(11);
var trapdoor_1 = __webpack_require__(12);
var healthbar_1 = __webpack_require__(14);
var chest_1 = __webpack_require__(15);
var floor_1 = __webpack_require__(6);
var inventory_1 = __webpack_require__(29);
var lockedDoor_1 = __webpack_require__(19);
var sound_1 = __webpack_require__(22);
var potion_1 = __webpack_require__(8);
var spike_1 = __webpack_require__(20);
var textParticle_1 = __webpack_require__(30);
var armor_1 = __webpack_require__(10);
var helmet_1 = __webpack_require__(18);
var Player = (function () {
    function Player(game, x, y) {
        var _this = this;
        this.spaceListener = function () {
            // dev tools: chest spawning
            // this.game.level.levelArray[this.x][this.y] = new Chest(
            //   this.game.level,
            //   this.game,
            //   this.x,
            //   this.y
            // );
        };
        this.leftListener = function () {
            if (!_this.dead)
                _this.tryMove(_this.x - 1, _this.y);
        };
        this.rightListener = function () {
            if (!_this.dead)
                _this.tryMove(_this.x + 1, _this.y);
        };
        this.upListener = function () {
            if (!_this.dead)
                _this.tryMove(_this.x, _this.y - 1);
        };
        this.downListener = function () {
            if (!_this.dead)
                _this.tryMove(_this.x, _this.y + 1);
        };
        this.tryMove = function (x, y) {
            var hitEnemy = false;
            for (var _i = 0, _a = _this.game.level.enemies; _i < _a.length; _i++) {
                var e = _a[_i];
                if (e.x === x && e.y === y) {
                    e.hurt(1);
                    hitEnemy = true;
                }
            }
            if (hitEnemy) {
                _this.drawX = (_this.x - x) * 0.5;
                _this.drawY = (_this.y - y) * 0.5;
                _this.game.level.tick();
            }
            else {
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
                    else if (other instanceof lockedDoor_1.LockedDoor) {
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
                    else if (other instanceof chest_1.Chest) {
                        other.open();
                        _this.game.level.levelArray[x][y] = new floor_1.Floor(_this.game.level, x, y);
                        _this.drawX = (_this.x - x) * 0.5;
                        _this.drawY = (_this.y - y) * 0.5;
                        _this.game.level.tick();
                    }
                    else if (other instanceof spike_1.Spike) {
                        _this.move(x, y);
                        other.onCollide(_this);
                        _this.game.level.tick();
                    }
                }
            }
        };
        this.heal = function (amount) {
            _this.healthBar.heal(amount);
        };
        this.hurt = function (damage) {
            var allArmor = Array();
            for (var _i = 0, _a = _this.equipped; _i < _a.length; _i++) {
                var e = _a[_i];
                if (e instanceof armor_1.Armor || e instanceof helmet_1.Helmet) {
                    allArmor.push(e);
                }
            }
            if (allArmor.length > 0) {
                var totalDamage = 0;
                var avgDamage = damage / allArmor.length;
                for (var i = 0; i < allArmor.length; i++) {
                    allArmor[i].hurt(Math.round((i + 1) * avgDamage - totalDamage));
                    totalDamage += Math.round(avgDamage - totalDamage);
                }
            }
            else {
                _this.flashing = true;
                _this.healthBar.hurt(damage);
                if (_this.healthBar.health <= 0) {
                    _this.healthBar.health = 0;
                    _this.dead = true;
                }
            }
        };
        this.move = function (x, y) {
            sound_1.Sound.footstep();
            _this.drawX = x - _this.x;
            _this.drawY = y - _this.y;
            _this.x = x;
            _this.y = y;
            var _loop_1 = function (i) {
                if (i.x === x && i.y === y) {
                    if (i instanceof potion_1.Potion) {
                        _this.heal(3);
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
            _this.flashing = false;
            var totalHealthDiff = _this.healthBar.health - _this.lastTickHealth;
            _this.lastTickHealth = _this.healthBar.health; // update last tick health
            if (totalHealthDiff < 0) {
                _this.game.level.textParticles.push(new textParticle_1.TextParticle("" + totalHealthDiff, _this.x + 0.5, _this.y - 0.5, gameConstants_1.GameConstants.RED));
            }
            else if (totalHealthDiff > 0) {
                _this.game.level.textParticles.push(new textParticle_1.TextParticle("+" + totalHealthDiff, _this.x + 0.5, _this.y - 0.5, gameConstants_1.GameConstants.GREEN));
            }
            else {
                // if no health changes, check for health changes (we don't want them to overlap, health changes have priority)
                var totalArmorDiff = 0;
                for (var _i = 0, _a = _this.equipped; _i < _a.length; _i++) {
                    var e = _a[_i];
                    if (e instanceof armor_1.Armor || e instanceof helmet_1.Helmet) {
                        totalArmorDiff += e.health - e.lastTickHealth;
                        e.lastTickHealth = e.health;
                    }
                }
                if (totalArmorDiff < 0) {
                    _this.game.level.textParticles.push(new textParticle_1.TextParticle("" + totalArmorDiff, _this.x + 0.5, _this.y - 0.5, gameConstants_1.GameConstants.ARMOR_GREY));
                }
                else if (totalArmorDiff > 0) {
                    _this.game.level.textParticles.push(new textParticle_1.TextParticle("+" + totalArmorDiff, _this.x + 0.5, _this.y - 0.5, gameConstants_1.GameConstants.ARMOR_GREY));
                }
            }
        };
        this.draw = function () {
            _this.flashingFrame += 4 / gameConstants_1.GameConstants.FPS;
            if (!_this.dead) {
                if (!_this.flashing || Math.floor(_this.flashingFrame) % 2 === 0) {
                    _this.drawX += -0.5 * _this.drawX;
                    _this.drawY += -0.5 * _this.drawY;
                    game_1.Game.drawMob(0, 0, 1, 1, _this.x - _this.drawX, _this.y - _this.drawY, 1, 1);
                    game_1.Game.drawMob(1, 0, 1, 2, _this.x - _this.drawX, _this.y - 1.5 - _this.drawY, 1, 2);
                    for (var _i = 0, _a = _this.equipped; _i < _a.length; _i++) {
                        var e = _a[_i];
                        if (e instanceof armor_1.Armor || e instanceof helmet_1.Helmet)
                            e.drawEquipped(_this.x - _this.drawX, _this.y - _this.drawY);
                    }
                }
            }
        };
        this.drawTopLayer = function () {
            if (!_this.dead) {
                _this.healthBar.drawAboveTile(_this.x - _this.drawX + 0.5, _this.y - 0.75 - _this.drawY);
                game_1.Game.ctx.fillStyle = "white";
                if (_this.game.level.env === 3)
                    game_1.Game.ctx.fillStyle = "black";
                var healthArmorString = _this.healthBar.health + "/" + _this.healthBar.fullHealth;
                var totalArmor = 0;
                for (var _i = 0, _a = _this.equipped; _i < _a.length; _i++) {
                    var e = _a[_i];
                    if (e instanceof armor_1.Armor || e instanceof helmet_1.Helmet) {
                        totalArmor += e.health;
                    }
                }
                healthArmorString += totalArmor === 0 ? "" : "+" + totalArmor + " armor";
                game_1.Game.ctx.fillText(healthArmorString, 3, gameConstants_1.GameConstants.HEIGHT - 20);
            }
            else {
                game_1.Game.ctx.fillStyle = "white";
                var gameOverString = "Game Over.";
                game_1.Game.ctx.fillText(gameOverString, gameConstants_1.GameConstants.WIDTH / 2 - game_1.Game.ctx.measureText(gameOverString).width / 2, gameConstants_1.GameConstants.HEIGHT / 2 - 10);
                var refreshString = "[refresh to restart]";
                game_1.Game.ctx.fillText(refreshString, gameConstants_1.GameConstants.WIDTH / 2 - game_1.Game.ctx.measureText(refreshString).width / 2, gameConstants_1.GameConstants.HEIGHT / 2 + 10);
            }
            _this.inventory.draw();
        };
        this.game = game;
        this.x = x;
        this.y = y;
        input_1.Input.spaceListener = this.spaceListener;
        input_1.Input.leftListener = this.leftListener;
        input_1.Input.rightListener = this.rightListener;
        input_1.Input.upListener = this.upListener;
        input_1.Input.downListener = this.downListener;
        this.healthBar = new healthbar_1.HealthBar(10);
        this.dead = false;
        this.flashing = false;
        this.flashingFrame = 0;
        this.lastTickHealth = this.healthBar.health;
        this.equipped = Array();
        this.inventory = new inventory_1.Inventory(game);
    }
    return Player;
}());
exports.Player = Player;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var levelConstants_1 = __webpack_require__(3);
var game_1 = __webpack_require__(0);
var input_1 = __webpack_require__(21);
var gameConstants_1 = __webpack_require__(2);
var equippable_1 = __webpack_require__(17);
var Inventory = (function () {
    function Inventory(game) {
        var _this = this;
        this.tileX = 0;
        this.tileY = 0;
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
            // check equips too
            _this.items = _this.items.filter(function (x) { return !x.dead; });
            _this.game.player.equipped = _this.items.filter(function (x) { return x instanceof equippable_1.Equippable && x.equipped; });
            for (var i = 0; i < _this.items.length; i++) {
                var x = i % levelConstants_1.LevelConstants.SCREEN_W;
                var y = Math.floor(i / levelConstants_1.LevelConstants.SCREEN_W);
                _this.items[i].drawIcon(x, y);
                if (_this.items[i] instanceof equippable_1.Equippable && _this.items[i].equipped) {
                    game_1.Game.drawItem(0, 1, 1, 1, x, y, 1, 1);
                }
            }
        };
        this.game = game;
        this.items = new Array();
        input_1.Input.mouseLeftClickListener = this.mouseLeftClickListener;
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
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = __webpack_require__(0);
var gameConstants_1 = __webpack_require__(2);
var TextParticle = (function () {
    function TextParticle(text, x, y, color) {
        var _this = this;
        this.draw = function () {
            var GRAVITY = 0.2;
            var TIMEOUT = 2; // lasts for 2 seconds
            _this.z += _this.dz;
            if (_this.z < 0) {
                _this.z = 0;
                _this.dz *= -0.7;
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
        };
        this.text = text;
        this.x = x * gameConstants_1.GameConstants.TILESIZE;
        this.y = y * gameConstants_1.GameConstants.TILESIZE;
        this.z = gameConstants_1.GameConstants.TILESIZE;
        this.dz = 2;
        this.color = color;
        this.dead = false;
        this.time = 0;
    }
    return TextParticle;
}());
exports.TextParticle = TextParticle;


/***/ })
/******/ ]);