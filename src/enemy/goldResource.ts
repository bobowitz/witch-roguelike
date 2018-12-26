import { Item } from "../item/item";
import { Game } from "../game";
import { Key } from "../item/key";
import { Level } from "../level";
import { Heart } from "../item/heart";
import { Armor } from "../item/armor";
import { Enemy } from "./enemy";
import { LevelConstants } from "../levelConstants";
import { Gem } from "../item/gem";
import { Resource } from "./resource";
import { GenericParticle } from "../particle/genericParticle";
import { Gold } from "../item/gold";

export class GoldResource extends Resource {
  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, game, x, y);

    this.tileX = 13;
    this.tileY = 0;
    this.health = 10;
  }

  kill = () => {
    this.dead = true;

    this.game.level.items.push(new Gold(this.level, this.x, this.y));

    GenericParticle.spawnCluster(this.level, this.x + 0.5, this.y + 0.5, "#fbf236");
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
        this.isShaded()
      );
    }
  };

  drawTopLayer = () => {};
}
