import { Game } from "./game";
import { Collidable } from "./collidable";

export class Wall extends Collidable {
  type: number;

  constructor(x: number, y: number, type: number) {
    super(x, y);
    this.h = 2;
    this.type = type;
  }

  draw = () => {
    if (this.type === 0) {
      Game.drawTile(2, 0, 1, 1, this.x, this.y, this.w, this.h);
    } else if (this.type === 1) {
      Game.drawTile(5, 0, 1, 1, this.x, this.y, this.w, this.h);
    }
  };
}
