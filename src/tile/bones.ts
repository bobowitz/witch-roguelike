import { Game } from "../game";
import { Floor } from "./floor";
import { SkinType } from "./tile";

export class Bones extends Floor {
  skin: SkinType;

  draw = () => {
    Game.drawTile(7, this.skin, 1, 1, this.x, this.y, this.w, this.h, this.isShaded());
  };
}
