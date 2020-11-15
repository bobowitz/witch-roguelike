import { Item } from "../item/item";
import { Game } from "../game";
import { Key } from "../item/key";
import { Level } from "../level";
import { Heart } from "../item/heart";
import { Armor } from "../item/armor";
import { Enemy } from "./enemy";
import { LevelConstants } from "../levelConstants";
import { GreenGem } from "../item/greengem";
import { GenericParticle } from "../particle/genericParticle";
import { Coin } from "../item/coin";
import { Sound } from "../sound";

export class Chest extends Enemy {
  rand: () => number;

  constructor(level: Level, game: Game, x: number, y: number, rand: () => number) {
    super(level, game, x, y);

    this.tileX = 4;
    this.tileY = 0;
    this.health = 1;

    this.rand = rand;
  }

  kill = () => {
    if (this.level === this.game.level) Sound.chest();

    this.dead = true;
    // DROP TABLES!

    GenericParticle.spawnCluster(this.level, this.x + 0.5, this.y + 0.5, "#fbf236");

    let drop = Game.randTable([1, 1, 1, 2, 2, 3], this.rand);

    switch (drop) {
      case 1:
        this.level.items.push(new Coin(this.level, this.x, this.y));
        break;
      case 2:
        this.level.items.push(new Heart(this.level, this.x, this.y));
        break;
      case 3:
        this.level.items.push(new GreenGem(this.level, this.x, this.y));
        break;
      case 3:
        this.level.items.push(new Key(this.level, this.x, this.y));
        break;
      case 4:
        this.level.items.push(new Armor(this.level, this.x, this.y));
        break;
    }
  };
  killNoBones = () => {
    this.kill();
  };

  draw = () => {
    if (!this.dead) {
      Game.drawObj(
        this.tileX,
        this.tileY,
        1,
        2,
        this.x - this.drawX,
        this.y - 1 - this.drawY,
        1,
        2,
        this.level.shadeColor,
        this.shadeAmount()
      );
    }
  };

  drawTopLayer = () => {
    this.drawableY = this.y;
  };
}
