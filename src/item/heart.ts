import { Item } from "./item";
import { Player } from "../player";
import { Game } from "../game";
import { Pickup } from "./pickup";
import { Sound } from "../sound";

export class Heart extends Pickup {
  constructor(x: number, y: number) {
    super(x, y);

    this.tileX = 8;
    this.tileY = 0;
  }

  onPickup = (player: Player) => {
    player.health += 1;
    Sound.heal();
  };
}
