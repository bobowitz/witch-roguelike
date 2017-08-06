import { Game } from "./game";
import { Collidable } from "./collidable";

export class WallSide extends Collidable {
  draw = () => {
    Game.drawTile(0, 0, 1, 1, this.x, this.y, this.w, this.h);
  };
}
