import { Item } from "./item";
import { Player } from "../player";
import { Game } from "../game";
import { Level } from "../level";
import { TextParticle } from "../particle/textParticle";
import { GameConstants } from "../gameConstants";

export class BlueGem extends Item {
  constructor(level: Level, x: number, y: number) {
    super(level, x, y);

    this.tileX = 13;
    this.tileY = 0;

    this.stackable = true;
  }

  getDescription = (): string => {
    return "SAPPHIRE";
  };
}
