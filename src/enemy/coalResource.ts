import { Item } from "../item/item";
import { Game } from "../game";
import { Key } from "../item/key";
import { Level } from "../level";
import { Heart } from "../item/heart";
import { Armor } from "../item/armor";
import { Enemy } from "./enemy";
import { LevelConstants } from "../levelConstants";
import { GreenGem } from "../item/greengem";
import { Resource } from "./resource";
import { GenericParticle } from "../particle/genericParticle";
import { Coal } from "../item/coal";
import { Sound } from "../sound";

export class CoalResource extends Resource {
  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, game, x, y);

    this.tileX = 12;
    this.tileY = 0;
    this.health = 1;
  }

  hurtCallback = () => {
    GenericParticle.spawnCluster(this.level, this.x + 0.5, this.y + 0.5, "#ffffff");

    Sound.mine();
  };

  kill = () => {
    Sound.breakRock();

    this.dead = true;

    this.game.level.items.push(new Coal(this.level, this.x, this.y));
  };
  killNoBones = () => {
    this.kill();
  };

  drawTopLayer = () => {};
}
