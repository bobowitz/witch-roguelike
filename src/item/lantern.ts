import { Item } from "./item";
import { Game } from "../game";
import { Level } from "../level";
import { Equippable } from "./equippable";
import { Candle } from "./candle";
import { Torch } from "./torch";

export class Lantern extends Equippable {
  constructor(level: Level, x: number, y: number) {
    super(level, x, y);

    this.tileX = 29;
    this.tileY = 0;
  }

  coEquippable = (other: Equippable): boolean => {
    return !(other instanceof Candle || other instanceof Torch || other instanceof Lantern);
  };

  toggleEquip = () => {
    this.equipped = !this.equipped;
    if (this.equipped) {
      this.level.game.player.sightRadius = 20;
    } else this.level.game.player.sightRadius = this.level.game.player.defaultSightRadius;
  };

  getDescription = () => {
    return "LANTERN";
  };
}
