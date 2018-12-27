import { Item } from "./item";
import { Player } from "../player";
import { Game } from "../game";
import { Sound } from "../sound";
import { Level } from "../level";

export class Heart extends Item {
  constructor(level: Level, x: number, y: number) {
    super(level, x, y);

    this.tileX = 8;
    this.tileY = 0;
  }

  onPickup = (player: Player) => {
    player.health = Math.min(player.maxHealth, player.health + 1);
    Sound.heal();
    this.level.items = this.level.items.filter(x => x !== this); // removes itself from the level
  };
}
