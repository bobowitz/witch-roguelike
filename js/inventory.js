"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var levelConstants_1 = require("./levelConstants");
var game_1 = require("./game");
var input_1 = require("./input");
var gameConstants_1 = require("./gameConstants");
var equippable_1 = require("./item/equippable");
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
//# sourceMappingURL=inventory.js.map