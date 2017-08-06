import { Game } from "./game";
import { Tile } from "./tile";

export class Floor extends Tile {
  // all are in grid units
  w: number;
  h: number;
  variation: number;

  constructor(x: number, y: number) {
    super(x, y);
    this.w = 1;
    this.h = 1;
    this.variation = 1;
    if (Game.rand(1, 20) == 1) this.variation = Game.randTable([7, 8, 9, 10, 12]);
  }

  draw = () => {
    Game.drawTile(this.variation, 0, 1, 1, this.x, this.y, this.w, this.h);
  };
}
