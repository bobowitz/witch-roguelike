import { Collidable } from "./collidable";
import { Game } from "./game";

export class Enemy extends Collidable {
  drawX: number;
  drawY: number;
  dead: boolean;

  constructor(x: number, y: number) {
    super(x, y);
    this.drawX = 0;
    this.drawY = 0;
  }

  hurt = (damage: number) => {};

  tick = () => {};
}
