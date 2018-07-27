import { Collidable } from "./collidable";
import { Player } from "../player";
import { Game } from "../game";
import { OnCollideTile } from "./onCollideTile";

export class Spike extends OnCollideTile {
  onCollide = (player: Player) => {
    player.hurt(1);
  };

  draw = () => {
    Game.drawTile(11, this.level.env, 1, 1, this.x, this.y, 1, 1);
  };
}
