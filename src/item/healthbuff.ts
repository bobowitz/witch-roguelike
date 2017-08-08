import { Pickup } from "./pickup";
import { Player } from "../player";
import { Game } from "../game";

export class HealthBuff extends Pickup {
  constructor(x: number, y: number) {
    super(x, y);

    this.tileX = 7;
    this.tileY = 0;
  }

  onPickup = (player: Player) => {
    player.buffHealth(Game.randTable([10, 10, 10, 10, 10, 50]));
  };
}
