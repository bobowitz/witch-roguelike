import { Collidable } from "./collidable";
import { Game } from "./game";

export class Enemy extends Collidable {
  drawX: number;
  drawY: number;

  constructor(x: number, y: number) {
    super(x, y);
    this.drawX = 0;
    this.drawY = 0;
  }

  tick = () => {};
}
