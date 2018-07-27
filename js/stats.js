"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var statconstants_1 = require("./statconstants");
var game_1 = require("./game");
var gameConstants_1 = require("./gameConstants");
var levelConstants_1 = require("./levelConstants");
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
//# sourceMappingURL=stats.js.map