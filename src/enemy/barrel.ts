import { Enemy } from "./enemy";
import { Level } from "../level";
import { Game } from "../game";
import { HealthBar } from "../healthbar";
import { Potion } from "../item/potion";
import { LevelConstants } from "../levelConstants";

export class Barrel extends Enemy {
  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, game, x, y);
    this.level = level;
    this.healthBar = new HealthBar(8);
    this.tileX = 14;
    this.tileY = 0;
    this.hasShadow = false;
  }

  kill = () => {
    this.dead = true;
    if (Game.rand(1, 8) === 1) this.game.level.items.push(new Potion(this.x, this.y));
  };

  draw = () => {
    if (!this.dead) {
      let darkOffset =
        this.level.visibilityArray[this.x][this.y] <= LevelConstants.VISIBILITY_CUTOFF ? 2 : 0;
      Game.drawMob(
        this.tileX,
        this.tileY + darkOffset,
        1,
        2,
        this.x - this.drawX,
        this.y - 1 - this.drawY,
        1,
        2
      );
    }
  };
}
