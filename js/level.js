"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var wall_1 = require("./tile/wall");
var levelConstants_1 = require("./levelConstants");
var floor_1 = require("./tile/floor");
var game_1 = require("./game");
var collidable_1 = require("./tile/collidable");
var door_1 = require("./tile/door");
var bottomDoor_1 = require("./tile/bottomDoor");
var wallSide_1 = require("./tile/wallSide");
var trapdoor_1 = require("./tile/trapdoor");
var knightEnemy_1 = require("./enemy/knightEnemy");
var chest_1 = require("./enemy/chest");
var goldenKey_1 = require("./item/goldenKey");
var spawnfloor_1 = require("./tile/spawnfloor");
var lockedDoor_1 = require("./tile/lockedDoor");
var goldenDoor_1 = require("./tile/goldenDoor");
var spike_1 = require("./tile/spike");
var gameConstants_1 = require("./gameConstants");
var wizardEnemy_1 = require("./enemy/wizardEnemy");
var skullEnemy_1 = require("./enemy/skullEnemy");
var barrel_1 = require("./enemy/barrel");
var crate_1 = require("./enemy/crate");
var Level = (function () {
    function Level(game, previousDoor, deadEnd, goldenKey, distFromStart, env, difficulty) {
        var _this = this;
        // name this level
        this.classify = function (numDoors, numTrapdoors, numChests, numEnemies, goldenKeyRoom) {
            _this.name = "";
            if (goldenKeyRoom)
                _this.name = "Key Room";
            else if (numChests >= 2)
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
            if (_this.name !== "" && !goldenKeyRoom)
                _this.name = adjectiveList[game_1.Game.rand(0, adjectiveList.length - 1)] + " " + _this.name;
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
            _this.game.player.moveNoSmooth(_this.bottomDoorX, _this.bottomDoorY - 1);
            _this.updateLighting();
        };
        this.enterLevelThroughDoor = function (door) {
            _this.updateLevelTextColor();
            _this.game.player.moveNoSmooth(door.x, door.y + 1);
            _this.updateLighting();
        };
        this.getEmptyTiles = function () {
            var returnVal = [];
            for (var x = 0; x < levelConstants_1.LevelConstants.SCREEN_W; x++) {
                for (var y = 0; y < levelConstants_1.LevelConstants.SCREEN_H; y++) {
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
            if (levelConstants_1.LevelConstants.SMOOTH_LIGHTING)
                _this.visibilityArray = _this.blur3x3(_this.visibilityArray, [[1, 2, 1], [2, 8, 2], [1, 2, 1]]);
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
            var hitWall = false; // flag for if we already hit a wall. we'll keep scanning and see if there's more walls. if so, light them up!
            for (; i < radius; i++) {
                var tile = _this.levelArray[Math.floor(px)][Math.floor(py)];
                if (tile instanceof wall_1.Wall && tile.type === 1) {
                    return returnVal;
                }
                if (!(tile instanceof wall_1.Wall) && hitWall) {
                    // fun's over, we hit something that wasn't a wall
                    return returnVal;
                }
                if (tile instanceof wall_1.Wall || tile instanceof wallSide_1.WallSide) {
                    if (!hitWall)
                        returnVal = i;
                    hitWall = true;
                }
                _this.visibilityArray[Math.floor(px)][Math.floor(py)] += levelConstants_1.LevelConstants.VISIBILITY_STEP;
                _this.visibilityArray[Math.floor(px)][Math.floor(py)] = Math.min(_this.visibilityArray[Math.floor(px)][Math.floor(py)], 2);
                // crates and chests can block visibility too!
                for (var _i = 0, _a = _this.enemies; _i < _a.length; _i++) {
                    var e = _a[_i];
                    if ((e instanceof crate_1.Crate || e instanceof chest_1.Chest) &&
                        e.x === Math.floor(px) &&
                        e.y === Math.floor(py)) {
                        if (!hitWall)
                            returnVal = i;
                        hitWall = true;
                    }
                }
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
            for (var x = 0; x < _this.levelArray.length; x++) {
                for (var y = 0; y < _this.levelArray[0].length; y++) {
                    _this.levelArray[x][y].draw();
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
        };
        this.drawEntitiesBehindPlayer = function () {
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
        };
        // for stuff rendered on top of the player
        this.drawTopLayer = function () {
            for (var _i = 0, _a = _this.enemies; _i < _a.length; _i++) {
                var e = _a[_i];
                e.drawTopLayer(); // health bars
            }
            _this.particles = _this.particles.filter(function (x) { return !x.dead; });
            for (var _b = 0, _c = _this.particles; _b < _c.length; _b++) {
                var p = _c[_b];
                p.draw();
            }
            // gui stuff
            // room name
            game_1.Game.ctx.fillStyle = levelConstants_1.LevelConstants.LEVEL_TEXT_COLOR;
            game_1.Game.ctx.fillText(_this.name, gameConstants_1.GameConstants.WIDTH / 2 - game_1.Game.ctx.measureText(_this.name).width / 2, (_this.roomY - 1) * gameConstants_1.GameConstants.TILESIZE - (gameConstants_1.GameConstants.FONT_SIZE - 1));
        };
        this.difficulty = difficulty;
        this.distFromStart = distFromStart;
        this.env = env;
        this.items = Array();
        this.projectiles = Array();
        this.particles = Array();
        this.doors = Array();
        this.enemies = Array();
        // if previousDoor is null, no bottom door
        this.hasBottomDoor = true;
        if (previousDoor === null) {
            this.hasBottomDoor = false;
            this.parentLevel = null;
        }
        this.game = game;
        this.width = game_1.Game.randTable([5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 9, 11, 13]);
        this.height = this.width + game_1.Game.rand(-2, 2);
        this.height = Math.min(this.height, levelConstants_1.LevelConstants.MAX_LEVEL_H);
        this.height = Math.max(this.height, levelConstants_1.LevelConstants.MIN_LEVEL_H);
        this.levelArray = [];
        for (var x = 0; x < levelConstants_1.LevelConstants.SCREEN_W; x++) {
            this.levelArray[x] = [];
        }
        this.visibilityArray = [];
        for (var x = 0; x < levelConstants_1.LevelConstants.SCREEN_W; x++) {
            this.visibilityArray[x] = [];
            for (var y = 0; y < levelConstants_1.LevelConstants.SCREEN_H; y++) {
                this.visibilityArray[x][y] = 0;
            }
        }
        this.roomX = Math.floor(levelConstants_1.LevelConstants.SCREEN_W / 2 - this.width / 2);
        this.roomY = Math.floor(levelConstants_1.LevelConstants.SCREEN_H / 2 - this.height / 2);
        this.bottomDoorX = Math.floor(this.roomX + this.width / 2);
        this.bottomDoorY = this.roomY + this.height;
        this.buildEmptyRoom();
        this.goldenKeyRoom = false;
        if (goldenKey && distFromStart > 4 && game_1.Game.rand(1, 5) === 1) {
            // if it's a golden key room
            this.items.push(new goldenKey_1.GoldenKey(Math.floor(this.roomX + this.width / 2), Math.floor(this.roomY + this.height / 2)));
            this.goldenKeyRoom = true;
        }
        else {
            // otherwise, generate a normal room
            this.addWallBlocks();
            this.addFingers();
        }
        this.levelArray[this.bottomDoorX][this.bottomDoorY - 1] = new spawnfloor_1.SpawnFloor(this, this.bottomDoorX, this.bottomDoorY - 1);
        if (previousDoor !== null) {
            this.levelArray[this.bottomDoorX][this.bottomDoorY] = new bottomDoor_1.BottomDoor(this, this.game, previousDoor, this.bottomDoorX, this.bottomDoorY);
        }
        this.fixWalls();
        var numTrapdoors = 0, numDoors = 0, numChests = 0, numSpikes = 0, numEnemies = 0, numObstacles = 0;
        if (!this.goldenKeyRoom) {
            /* add trapdoors back in after we figure out how they're gonna work */
            numTrapdoors = 0; // this.addTrapdoors();
            numDoors = this.addDoors(deadEnd, goldenKey);
            numChests = this.addChests(numDoors);
            numSpikes = this.addSpikes();
            numEnemies = this.addEnemies();
            numObstacles = this.addObstacles();
        }
        this.classify(numDoors, numTrapdoors, numChests, numEnemies, this.goldenKeyRoom);
        if (this.hasBottomDoor) {
            var b = this.levelArray[this.bottomDoorX][this.bottomDoorY];
            this.parentLevel = b.linkedTopDoor.level;
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
            var blockW = Math.min(game_1.Game.randTable([2, 2, 2, 5, 7, 9]), this.width - 2);
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
        var FINGER_LENGTH = this.height - 3;
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
                    y = game_1.Game.rand(this.roomY + 2, this.roomY + this.height - 3);
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
                    y = game_1.Game.rand(this.roomY + 2, this.roomY + this.height - 3);
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
                    y = this.roomY + this.height - blockH;
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
    Level.prototype.addTrapdoors = function () {
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
                x = game_1.Game.rand(this.roomX, this.roomX + this.width - 1);
                y = game_1.Game.rand(this.roomY, this.roomY + this.height - 1);
            }
            this.levelArray[x][y] = new trapdoor_1.Trapdoor(this, this.game, x, y);
        }
        return numTrapdoors;
    };
    Level.prototype.addDoors = function (deadEnd, goldenKey) {
        // add doors
        var numDoors = game_1.Game.randTable([1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3]);
        if (deadEnd) {
            numDoors = game_1.Game.randTable([1, 1, 1, 2, 2]);
            if (game_1.Game.rand(1, 2) === 1)
                numDoors = 0;
        }
        if (!this.hasBottomDoor) {
            // first level has a regular door and a golden door
            numDoors = 2;
        }
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
            // if there are multiple doors, make all but one a dead end
            var d = void 0;
            if (!this.hasBottomDoor && i == 1) {
                d = new goldenDoor_1.GoldenDoor(this, x, y);
            }
            else if (numDoors > 0 && i !== 0) {
                if (game_1.Game.rand(1, 5) === 1) {
                    // locked (90% dead-end as well) door
                    d = new lockedDoor_1.LockedDoor(this, x, y);
                }
                else {
                    // regular dead-end door
                    d = new door_1.Door(this, this.game, x, y, true, false, this.distFromStart + 1); // make a new dead end
                }
            }
            else {
                // otherwise, generate a non-dead end (will eventually end with golden key)
                d = new door_1.Door(this, this.game, x, y, deadEnd, goldenKey, this.distFromStart + 1); // deadEnd
            }
            this.levelArray[x][y] = d;
            if (!(d instanceof lockedDoor_1.LockedDoor) && !(d instanceof goldenDoor_1.GoldenDoor))
                this.doors.push(d);
        }
        this.doors.sort(function (a, b) { return a.x - b.x; }); // sort by x, ascending, so the map makes sense
        return numDoors;
    };
    Level.prototype.addChests = function (numDoors) {
        // add chests
        var numChests = game_1.Game.rand(1, 8);
        if (numChests === 1 || numDoors === 0) {
            // if it's a dead end, at least give them a chest
            numChests = game_1.Game.randTable([0, 1, 1, 2, 3, 4, 5, 6]);
            // (but not guaranteed   ---^)
        }
        else
            numChests = 0;
        var _loop_1 = function (i) {
            var x = 0;
            var y = 0;
            while (!(this_1.getTile(x, y) instanceof floor_1.Floor) ||
                this_1.enemies.filter(function (e) { return e.x === x && e.y === y; }).length > 0 // don't overlap other enemies!
            ) {
                x = game_1.Game.rand(this_1.roomX, this_1.roomX + this_1.width - 1);
                y = game_1.Game.rand(this_1.roomY, this_1.roomY + this_1.height - 1);
            }
            this_1.enemies.push(new chest_1.Chest(this_1, this_1.game, x, y));
        };
        var this_1 = this;
        for (var i = 0; i < numChests; i++) {
            _loop_1(i);
        }
        return numChests;
    };
    Level.prototype.addSpikes = function () {
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
                x = game_1.Game.rand(this.roomX, this.roomX + this.width - 1);
                y = game_1.Game.rand(this.roomY, this.roomY + this.height - 1);
            }
            this.levelArray[x][y] = new spike_1.Spike(this, x, y);
        }
        return numSpikes;
    };
    Level.prototype.addEnemies = function () {
        var numEnemies = this.getEmptyTiles().length / 5;
        var _loop_2 = function (i) {
            var x = 0;
            var y = 0;
            while (!(this_2.getTile(x, y) instanceof floor_1.Floor) ||
                this_2.enemies.some(function (e) { return e.x === x && e.y === y; }) ||
                (x === this_2.bottomDoorX && y === this_2.bottomDoorY) ||
                (x === this_2.bottomDoorX && y === this_2.bottomDoorY - 1)) {
                x = game_1.Game.rand(this_2.roomX, this_2.roomX + this_2.width - 1);
                y = game_1.Game.rand(this_2.roomY, this_2.roomY + this_2.height - 1);
            }
            switch (game_1.Game.rand(1, 3)) {
                case 1:
                    this_2.enemies.push(new knightEnemy_1.KnightEnemy(this_2, this_2.game, x, y));
                    break;
                case 2:
                    this_2.enemies.push(new skullEnemy_1.SkullEnemy(this_2, this_2.game, x, y));
                    break;
                case 3:
                    this_2.enemies.push(new wizardEnemy_1.WizardEnemy(this_2, this_2.game, x, y));
                    break;
            }
        };
        var this_2 = this;
        for (var i = 0; i < numEnemies; i++) {
            _loop_2(i);
        }
        return numEnemies;
    };
    Level.prototype.addObstacles = function () {
        // add crates/barrels
        var numObstacles = game_1.Game.rand(1, 2);
        if (numObstacles === 1 || this.width * this.height > 8 * 8) {
            numObstacles = game_1.Game.randTable([1, 1, 1, 2, 2, 3, 3]);
        }
        else
            numObstacles = 0;
        var _loop_3 = function (i) {
            var x = 0;
            var y = 0;
            while (!(this_3.getTile(x, y) instanceof floor_1.Floor) ||
                this_3.enemies.filter(function (e) { return e.x === x && e.y === y; }).length > 0 ||
                (x === this_3.bottomDoorX && y === this_3.bottomDoorY) ||
                (x === this_3.bottomDoorX && y === this_3.bottomDoorY - 1)) {
                x = game_1.Game.rand(this_3.roomX, this_3.roomX + this_3.width - 1);
                y = game_1.Game.rand(this_3.roomY, this_3.roomY + this_3.height - 1);
            }
            switch (game_1.Game.rand(1, 2)) {
                case 1:
                    this_3.enemies.push(new crate_1.Crate(this_3, this_3.game, x, y));
                    break;
                case 2:
                    this_3.enemies.push(new barrel_1.Barrel(this_3, this_3.game, x, y));
                    break;
            }
        };
        var this_3 = this;
        for (var i = 0; i < numObstacles; i++) {
            _loop_3(i);
        }
        return numObstacles;
    };
    return Level;
}());
Level.randEnv = function () {
    return game_1.Game.rand(0, levelConstants_1.LevelConstants.ENVIRONMENTS - 1);
};
exports.Level = Level;
//# sourceMappingURL=level.js.map