import { Enemy } from "./enemy";
import { Level } from "../level";
import { Game } from "../game";
import { HealthBar } from "../healthbar";

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
  };

  draw = () => {
    if (!this.dead) {
      Game.drawMob(
        this.tileX,
        this.tileY,
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
