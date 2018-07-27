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
//# sourceMappingURL=textParticle.js.map