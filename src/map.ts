import { Level } from "./level";
import { BottomDoor } from "./tile/bottomDoor";
import { Game } from "./game";
import { GameConstants } from "./gameConstants";
import { LevelConstants } from "./levelConstants";

export class TreeNode {
  parent: TreeNode;
  children: Array<TreeNode>;
  width: number;
  isCurrent: boolean;
  unopened: boolean;

  constructor() {
    this.parent = null;
    this.children = Array<TreeNode>();
    this.width = 0;
    this.isCurrent = false;
    this.unopened = false;
  }
}

export class Map {
  game: Game;
  treeRoot: TreeNode;
  gridSize: number;
  border: number;
  depth: number;
  scrollX: number;
  scrollY: number;
  isOpen: boolean;
  SCROLL = 1;

  constructor(game: Game) {
    this.game = game;
    this.gridSize = 8;
    this.border = 1;
    this.depth = 0;
    this.scrollX = 0;
    this.scrollY = 0;
    this.isOpen = false;
  }

  open = () => {
    this.isOpen = true;
    this.generateTree();
  };

  close = () => {
    this.isOpen = false;
  };

  leftListener = () => {
    this.scrollX += this.SCROLL;
  };
  rightListener = () => {
    this.scrollX -= this.SCROLL;
  };
  upListener = () => {
    this.scrollY += this.SCROLL;
  };
  downListener = () => {
    this.scrollY -= this.SCROLL;
  };

  generateTree = () => {
    let currentLevel = this.game.level;
    while (currentLevel.hasBottomDoor) {
      // search to the top of the tree
      currentLevel = (currentLevel.levelArray[currentLevel.bottomDoorX][
        currentLevel.bottomDoorY
      ] as BottomDoor).linkedTopDoor.level;
    }

    this.treeRoot = new TreeNode();
    this.copyTree(currentLevel, this.treeRoot);

    this.getWidth(this.treeRoot);
    this.depth = this.getDepth(this.treeRoot);
  };

  copyTree = (levelRoot: Level, parent: TreeNode) => {
    if (levelRoot === this.game.level) {
      parent.isCurrent = true;
    }

    if (levelRoot.doors.length === 0) {
      return;
    }

    for (const d of levelRoot.doors) {
      // if the door has already been opened, add the connected room to the tree
      let child = new TreeNode();
      child.parent = parent;
      parent.children.push(child);
      if (d.linkedLevel !== null) {
        this.copyTree(d.linkedLevel, child);
      } else {
        child.unopened = true;
      }
    }
  };

  getWidth = (parent: TreeNode): number => {
    parent.width = 0;
    for (const c of parent.children) {
      parent.width += this.getWidth(c);
    }
    if (parent.width === 0) parent.width = 1;

    return parent.width;
  };

  getDepth = (parent: TreeNode): number => {
    let max = 0;
    for (const c of parent.children) {
      let d = this.getDepth(c);
      if (d > max) max = d;
    }

    return max + 1;
  };

  drawLeaf = (x: number, y: number) => {
    Game.ctx.fillRect(
      Math.floor(x * this.gridSize + this.border),
      Math.floor(y * this.gridSize + this.border),
      Math.floor(this.gridSize - this.border * 2),
      Math.floor(this.gridSize - this.border * 2)
    );
  };

  drawLine = (x1: number, y1: number, x2: number, y2: number) => {
    Game.ctx.strokeStyle = "white";
    Game.ctx.lineWidth = 1;
    Game.ctx.beginPath();
    Game.ctx.translate(-0.5, -0.5);
    Game.ctx.moveTo(
      Math.floor(x1 * this.gridSize + this.gridSize / 2),
      Math.floor(y1 * this.gridSize + this.gridSize / 2)
    );
    Game.ctx.lineTo(
      Math.floor(x2 * this.gridSize + this.gridSize / 2),
      Math.floor(y2 * this.gridSize + this.gridSize / 2)
    );
    Game.ctx.stroke();
    Game.ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  drawTree = (parent: TreeNode, x: number, y: number) => {
    let childX = x;
    for (const c of parent.children) {
      this.drawLine(x + parent.width / 2, y, childX + c.width / 2, y - 1);
      this.drawTree(c, childX, y - 1);
      childX += c.width;
    }

    Game.ctx.fillStyle = "white";
    if (parent.unopened) Game.ctx.fillStyle = "#404040";
    if (parent.isCurrent) Game.ctx.fillStyle = "red";
    this.drawLeaf(x + parent.width / 2, y);
  };

  draw = () => {
    if (this.isOpen) {
      Game.ctx.fillStyle = "rgb(0, 0, 0, 0.9)";
      Game.ctx.fillRect(0, 0, GameConstants.WIDTH, GameConstants.HEIGHT);

      this.drawTree(
        this.treeRoot,
        GameConstants.WIDTH / this.gridSize / 2 - this.treeRoot.width / 2 - 0.5 + this.scrollX,
        GameConstants.HEIGHT / this.gridSize / 2 + this.depth / 2 - 1 + this.scrollY
      );
    }
  };
}
