import { Collidable } from "./collidable";
import { Player } from "../player";
import { Game } from "../game";
import { Level } from "../level";
import { Tile } from "./tile";
import { Floor } from "./floor";

export class SideArch extends Floor {
  drawTopLayer = () => {
    Game.drawTile(15, this.level.env, 1, 1, this.x, this.y - 1, 1, 1);
    Game.drawTile(16, this.level.env, 1, 1, this.x, this.y - 2, 1, 1);
  };
}
