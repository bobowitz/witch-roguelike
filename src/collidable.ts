import { Player } from "./player";
import { Tile } from "./tile";

export class Collidable extends Tile {
  w: number;
  h: number;

  constructor(x: number, y: number) {
    super(x, y);
    this.w = 1;
    this.h = 1;
  }

  onCollide = (player: Player) => {};
}
