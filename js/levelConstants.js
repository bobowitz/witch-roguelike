"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LevelConstants = (function () {
    function LevelConstants() {
    }
    return LevelConstants;
}());
LevelConstants.MIN_LEVEL_W = 5;
LevelConstants.MIN_LEVEL_H = 5;
LevelConstants.MAX_LEVEL_W = 13;
LevelConstants.MAX_LEVEL_H = 13;
LevelConstants.SCREEN_W = 17; // screen size in tiles
LevelConstants.SCREEN_H = 17; // screen size in tiles
LevelConstants.ENVIRONMENTS = 5;
LevelConstants.VISIBILITY_CUTOFF = 1;
LevelConstants.SMOOTH_LIGHTING = false;
LevelConstants.MIN_VISIBILITY = 1; // visibility level of places you've already seen
LevelConstants.LIGHTING_ANGLE_STEP = 1; // how many degrees between each ray
LevelConstants.VISIBILITY_STEP = 0.4;
LevelConstants.LEVEL_TEXT_COLOR = "white"; // not actually a constant
exports.LevelConstants = LevelConstants;
//# sourceMappingURL=levelConstants.js.map