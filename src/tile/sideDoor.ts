import { Collidable } from "./collidable";
import { Level } from "../level";
import { LayeredTile } from "./layeredTile";
import { Game } from "../game";
import { DoorLeft } from "./doorLeft";
import { DoorRight } from "./doorRight";
import { GameConstants } from "../gameConstants";
import { Door } from "./door";

export class SideDoor extends Door {
  opened: boolean;
  frame: number;

  constructor(level: Level, x: number, y: number) {
    super(level, x, y);
    this.opened = false;
    this.frame = 0;
  }

  draw = () => {
    if (this.level.visibilityArray[this.x][this.y] > 0) {
      if (this.opened) {
        this.frame += 0.5;
        if (this.frame > 4) this.frame = 4;
      }
      Game.drawTile(0, this.level.env, 1, 1, this.x, this.y - 1, 1, 1);
      Game.drawTile(25 + Math.floor(this.frame), 0, 1, 1, this.x, this.y - 1, 1, 1);
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

  drawCeiling = () => {};
}
