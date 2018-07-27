"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var levelConstants_1 = require("./levelConstants");
var GameConstants = (function () {
    function GameConstants() {
    }
    return GameConstants;
}());
GameConstants.VERSION = "v0.0.20";
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
exports.GameConstants = GameConstants;
//# sourceMappingURL=gameConstants.js.map