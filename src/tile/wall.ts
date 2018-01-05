import { Game } from "../game";
import { Collidable } from "./collidable";
import { Level } from "../level";

export class Wall extends Collidable {
  type: number;

  constructor(level: Level, x: number, y: number, type: number) {
    super(level, x, y);
    this.type = type;
  }

  draw = () => {
    Game.drawTile(0, this.level.env, 1, 1, this.x, this.y, this.w, this.h);
  };

  drawCeiling = () => {
    if (this.type === 0) {
      Game.drawTile(2, this.level.env, 1, 1, this.x, this.y - 1, this.w, this.h);
    } else if (this.type === 1) {
      Game.drawTile(5, this.level.env, 1, 1, this.x, this.y - 1, this.w, this.h);
    }
  };
}
