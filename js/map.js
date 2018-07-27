"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = require("./game");
var gameConstants_1 = require("./gameConstants");
var TreeNode = (function () {
    function TreeNode() {
        this.parent = null;
        this.children = Array();
        this.width = 0;
        this.isCurrent = false;
        this.unopened = false;
    }
    return TreeNode;
}());
exports.TreeNode = TreeNode;
var Map = (function () {
    function Map(game) {
        var _this = this;
        this.SCROLL = 1;
        this.open = function () {
            _this.isOpen = true;
            _this.generateTree();
        };
        this.close = function () {
            _this.isOpen = false;
        };
        this.leftListener = function () {
            _this.scrollX += _this.SCROLL;
        };
        this.rightListener = function () {
            _this.scrollX -= _this.SCROLL;
        };
        this.upListener = function () {
            _this.scrollY += _this.SCROLL;
        };
        this.downListener = function () {
            _this.scrollY -= _this.SCROLL;
        };
        this.generateTree = function () {
            var currentLevel = _this.game.level;
            while (currentLevel.hasBottomDoor) {
                // search to the top of the tree
                currentLevel = currentLevel.levelArray[currentLevel.bottomDoorX][currentLevel.bottomDoorY].linkedTopDoor.level;
            }
            _this.treeRoot = new TreeNode();
            _this.copyTree(currentLevel, _this.treeRoot);
            _this.getWidth(_this.treeRoot);
            _this.depth = _this.getDepth(_this.treeRoot);
        };
        this.copyTree = function (levelRoot, parent) {
            if (levelRoot === _this.game.level) {
                parent.isCurrent = true;
            }
            if (levelRoot.doors.length === 0) {
                return;
            }
            for (var _i = 0, _a = levelRoot.doors; _i < _a.length; _i++) {
                var d = _a[_i];
                // if the door has already been opened, add the connected room to the tree
                var child = new TreeNode();
                child.parent = parent;
                parent.children.push(child);
                if (d.linkedLevel !== null) {
                    _this.copyTree(d.linkedLevel, child);
                }
                else {
                    child.unopened = true;
                }
            }
        };
        this.getWidth = function (parent) {
            parent.width = 0;
            for (var _i = 0, _a = parent.children; _i < _a.length; _i++) {
                var c = _a[_i];
                parent.width += _this.getWidth(c);
            }
            if (parent.width === 0)
                parent.width = 1;
            return parent.width;
        };
        this.getDepth = function (parent) {
            var max = 0;
            for (var _i = 0, _a = parent.children; _i < _a.length; _i++) {
                var c = _a[_i];
                var d = _this.getDepth(c);
                if (d > max)
                    max = d;
            }
            return max + 1;
        };
        this.drawLeaf = function (x, y) {
            game_1.Game.ctx.fillRect(Math.floor(x * _this.gridSize + _this.border), Math.floor(y * _this.gridSize + _this.border), Math.floor(_this.gridSize - _this.border * 2), Math.floor(_this.gridSize - _this.border * 2));
        };
        this.drawLine = function (x1, y1, x2, y2) {
            game_1.Game.ctx.strokeStyle = "white";
            game_1.Game.ctx.lineWidth = 1;
            game_1.Game.ctx.beginPath();
            game_1.Game.ctx.translate(-0.5, -0.5);
            game_1.Game.ctx.moveTo(Math.floor(x1 * _this.gridSize + _this.gridSize / 2), Math.floor(y1 * _this.gridSize + _this.gridSize / 2));
            game_1.Game.ctx.lineTo(Math.floor(x2 * _this.gridSize + _this.gridSize / 2), Math.floor(y2 * _this.gridSize + _this.gridSize / 2));
            game_1.Game.ctx.stroke();
            game_1.Game.ctx.setTransform(1, 0, 0, 1, 0, 0);
        };
        this.drawTree = function (parent, x, y) {
            var childX = x;
            for (var _i = 0, _a = parent.children; _i < _a.length; _i++) {
                var c = _a[_i];
                _this.drawLine(x + parent.width / 2, y, childX + c.width / 2, y - 1);
                _this.drawTree(c, childX, y - 1);
                childX += c.width;
            }
            game_1.Game.ctx.fillStyle = "white";
            if (parent.unopened)
                game_1.Game.ctx.fillStyle = "#404040";
            if (parent.isCurrent)
                game_1.Game.ctx.fillStyle = "red";
            _this.drawLeaf(x + parent.width / 2, y);
        };
        this.draw = function () {
            if (_this.isOpen) {
                game_1.Game.ctx.fillStyle = "rgb(0, 0, 0, 0.9)";
                game_1.Game.ctx.fillRect(0, 0, gameConstants_1.GameConstants.WIDTH, gameConstants_1.GameConstants.HEIGHT);
                _this.drawTree(_this.treeRoot, gameConstants_1.GameConstants.WIDTH / _this.gridSize / 2 - _this.treeRoot.width / 2 - 0.5 + _this.scrollX, gameConstants_1.GameConstants.HEIGHT / _this.gridSize / 2 + _this.depth / 2 - 1 + _this.scrollY);
            }
        };
        this.game = game;
        this.gridSize = 8;
        this.border = 1;
        this.depth = 0;
        this.scrollX = 0;
        this.scrollY = 0;
        this.isOpen = false;
    }
    return Map;
}());
exports.Map = Map;
//# sourceMappingURL=map.js.map