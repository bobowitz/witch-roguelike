import { Collidable } from "./collidable";
import { Game } from "./game";

export class Enemy extends Collidable {
  constructor(x: number, y: number) {
    super(x, y);
  }

  tick = () => {};
}
