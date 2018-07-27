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
var game_1 = require("../game");
var gameConstants_1 = require("../gameConstants");
var particle_1 = require("./particle");
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
//# sourceMappingURL=deathParticle.js.map