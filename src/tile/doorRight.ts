import { Collidable } from "./collidable";
import { Level } from "../level";
import { Game } from "../game";
import { Wall } from "./wall";
import { CollidableLayeredTile } from "./collidableLayeredTile";
import { GameConstants } from "../gameConstants";

export class DoorRight extends CollidableLayeredTile {
  opened: boolean;
  frame: number;

  constructor(level: Level, x: number, y: number) {
    super(level, x, y);
    this.opened = false;
    this.frame = 0;
  }

  open = () => {
    this.opened = true;
  };

  draw = () => {
    Game.drawTile(0, this.level.env, 1, 1, this.x, this.y, 1, 1);
  };

  drawCeiling = () => {
    if (this.opened) {
      this.frame += 0.5;
      if (this.frame > 3) this.frame = 3;
    }
    if (this.level.visibilityArray[this.x][this.y] > 0) {
      Game.drawTile(22 + Math.floor(this.frame) * 3, 0, 1, 1, this.x, this.y - 1, 1, 1);
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
