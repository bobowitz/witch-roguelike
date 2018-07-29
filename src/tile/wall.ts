import { Game } from "../game";
import { Collidable } from "./collidable";
import { Level } from "../level";
import { SkinType } from "./tile";

export class Wall extends Collidable {
  type: number;

  constructor(level: Level, x: number, y: number, type: number) {
    super(level, x, y);
    this.type = type;
  }

  draw = () => {
    if (this.type === 0) {
      Game.drawTile(2, this.skin, 1, 1, this.x, this.y, this.w, this.h, this.isShaded());
    } else if (this.type === 1) {
      Game.drawTile(5, this.skin, 1, 1, this.x, this.y, this.w, this.h, this.isShaded());
    }
  };
}
