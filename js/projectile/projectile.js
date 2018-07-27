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
//# sourceMappingURL=projectile.js.map