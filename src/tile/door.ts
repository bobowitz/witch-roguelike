import { Collidable } from "./collidable";
import { Level } from "../level";
import { LayeredTile } from "./layeredTile";
import { Game } from "../game";
import { DoorLeft } from "./doorLeft";
import { DoorRight } from "./doorRight";
import { GameConstants } from "../gameConstants";

export class Door extends LayeredTile {
  opened: boolean;
  frame: number;

  constructor(level: Level, x: number, y: number) {
    super(level, x, y);
    this.opened = false;
    this.frame = 0;
  }

  open = () => {
    this.opened = true;
    if (this.level.levelArray[this.x - 1][this.y] instanceof DoorLeft)
      (this.level.levelArray[this.x - 1][this.y] as DoorLeft).open();
    if (this.level.levelArray[this.x + 1][this.y] instanceof DoorRight)
      (this.level.levelArray[this.x + 1][this.y] as DoorRight).open();
  };

  draw = () => {
    if (this.opened) {
      this.frame += 0.5;
      if (this.frame > 3) this.frame = 3;
    }
    Game.drawTile(1, this.level.env, 1, 1, this.x, this.y, 1, 1);
    Game.drawTile(21 + Math.floor(this.frame) * 3, 1, 1, 1, this.x, this.y, 1, 1);
  };

  drawCeiling = () => {
    if (this.level.visibilityArray[this.x][this.y] > 0) {
      Game.drawTile(21 + Math.floor(this.frame) * 3, 0, 1, 1, this.x, this.y - 1, 1, 1);
    } else {
      Game.ctx.fillStyle = "black";
      Game.ctx.fillRect(
        this.x * GameConstants.TILESIZE,
        (this.y - 1) * GameConstants.TILESIZE,
        GameConstants.TILESIZE,
        GameConstants.TILESIZE
      );
    }
  };
}
