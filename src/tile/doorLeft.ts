import { Collidable } from "./collidable";
import { Level } from "../level";
import { Game } from "../game";

export class DoorLeft extends Collidable {
  constructor(level: Level, x: number, y: number, type: number) {
    super(level, x, y);
  }

  draw = () => {
    Game.drawTile(0, this.level.env, 1, 1, this.x, this.y, this.w, this.h);
  };

  drawCeiling = () => {
    Game.drawTile(20, 0, 1, 1, this.x, this.y - 1, this.w, this.h);
  };
}
