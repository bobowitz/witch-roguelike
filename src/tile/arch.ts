import { Collidable } from "./collidable";
import { Player } from "../player";
import { Game } from "../game";
import { Level } from "../level";
import { Tile } from "./tile";
import { Floor } from "./floor";

export class Arch extends Floor {
  draw = () => {
    Game.drawTile(1, this.level.env, 1, 1, this.x, this.y, 1, 1);
  };
  drawTopLayer = () => {
    Game.drawTile(17, this.level.env, 1, 1, this.x, this.y - 1, 1, 1);
  };
}
