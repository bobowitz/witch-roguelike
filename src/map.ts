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

  constructor() {
    this.parent = null;
    this.children = Array<TreeNode>();
    this.width = 0;
    this.isCurrent = false;
  }
}

export class Map {
  game: Game;
  treeRoot: TreeNode;
  gridSize: number;
  depth: number;

  constructor(game: Game) {
    this.game = game;
    this.gridSize = 16;
    this.depth = 0;
  }

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

    if (levelRoot.doors.length === 0) return;

    for (const d of levelRoot.doors) {
      // if the door has already been opened, add the connected room to the tree
      if (d.linkedLevel !== null) {
        let child = new TreeNode();
        child.parent = parent;
        parent.children.push(child);

        this.copyTree(d.linkedLevel, child);
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
      x * this.gridSize + 4,
      y * this.gridSize + 4,
      this.gridSize - 8,
      this.gridSize - 8
    );
  };

  drawLine = (x1: number, y1: number, x2: number, y2: number) => {
    Game.ctx.strokeStyle = "white";
    Game.ctx.beginPath();
    Game.ctx.moveTo(x1 * this.gridSize + this.gridSize / 2, y1 * this.gridSize + this.gridSize / 2);
    Game.ctx.lineTo(x2 * this.gridSize + this.gridSize / 2, y2 * this.gridSize + this.gridSize / 2);
    Game.ctx.stroke();
  };

  drawTree = (parent: TreeNode, x: number, y: number) => {
    let childX = x;
    for (const c of parent.children) {
      this.drawLine(x + parent.width / 2, y, childX + c.width / 2, y - 1);
      this.drawTree(c, childX, y - 1);
      childX += c.width;
    }

    Game.ctx.fillStyle = "white";
    if (parent.isCurrent) Game.ctx.fillStyle = "red";
    this.drawLeaf(x + parent.width / 2, y);
  };

  draw = () => {
    Game.ctx.fillStyle = "black";
    Game.ctx.fillRect(0, 0, GameConstants.WIDTH, GameConstants.HEIGHT);

    this.drawTree(
      this.treeRoot,
      GameConstants.WIDTH / this.gridSize / 2 - this.treeRoot.width / 2 - 0.5,
      GameConstants.HEIGHT / this.gridSize / 2 + this.depth / 2 - 1
    );
  };
}
