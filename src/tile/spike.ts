import { Player } from "../player";
import { Game } from "../game";
import { Tile } from "./tile";

export class Spike extends Tile {
  onCollide = (player: Player) => {
    player.hurt(1);
  };

  draw = () => {
    Game.drawTile(11, 0, 1, 1, this.x, this.y, 1, 1, this.level.shadeColor, this.shadeAmount());
  };
}
