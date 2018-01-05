import { Game } from "../game";
import { Floor } from "./floor";

export class Bones extends Floor {
  draw = () => {
    Game.drawTile(7, this.level.env, 1, 1, this.x, this.y, 1, 1);
  };
}
