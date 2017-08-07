import { Collidable } from "./collidable";
import { Game } from "./game";
import { Level } from "./level";

export class Enemy extends Collidable {
  drawX: number;
  drawY: number;
  dead: boolean;

  constructor(level: Level, x: number, y: number) {
    super(level, x, y);
    this.drawX = 0;
    this.drawY = 0;
  }

  hurt = (damage: number) => {};

  draw = () => {
    Game.drawMob(0, 0, 1, 1, this.x - this.drawX, this.y - this.drawY, 1, 1);
  };
  tick = () => {};
  drawTopLayer = () => {};
}
