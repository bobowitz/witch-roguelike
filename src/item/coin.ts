import { Item } from "./item";
import { Player } from "../player";
import { Game } from "../game";
import { Level } from "../level";
import { TextParticle } from "../particle/textParticle";
import { GameConstants } from "../gameConstants";
import { Sound } from "../sound";

export class Coin extends Item {
  constructor(level: Level, x: number, y: number) {
    super(level, x, y);

    this.tileX = 19;
    this.tileY = 0;

    this.stackable = true;
  }

  pickupSound = () => {
    Sound.pickupCoin();
  };
}
