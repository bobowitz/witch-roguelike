import { Item } from "../item/item";
import { Game } from "../game";
import { Key } from "../item/key";
import { Level } from "../level";
import { Heart } from "../item/heart";
import { Armor } from "../item/armor";
import { Enemy } from "./enemy";
import { LevelConstants } from "../levelConstants";
import { Resource } from "./resource";
import { GenericParticle } from "../particle/genericParticle";
import { Gold } from "../item/gold";
import { Sound } from "../sound";

export class GoldResource extends Resource {
  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, game, x, y);

    this.tileX = 13;
    this.tileY = 0;
    this.health = 2;
  }

  hurtCallback = () => {
    Sound.mine();
  };

  kill = () => {
    Sound.breakRock();

    this.dead = true;

    this.game.level.items.push(new Gold(this.level, this.x, this.y));

    GenericParticle.spawnCluster(this.level, this.x + 0.5, this.y + 0.5, "#fbf236");
  };
  killNoBones = () => {
    this.kill();
  };

  drawTopLayer = () => {
    this.drawableY = this.y;
  };
}
