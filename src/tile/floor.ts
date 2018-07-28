import { Game } from "../game";
import { Tile } from "./tile";
import { Level } from "../level";

export class Floor extends Tile {
  // all are in grid units
  w: number;
  h: number;
  variation: number;
  highlight: boolean;

  constructor(level: Level, x: number, y: number) {
    super(level, x, y);
    this.w = 1;
    this.h = 1;
    this.highlight = false;
    this.variation = 1;
    if (Game.rand(1, 20) == 1) this.variation = Game.randTable([8, 9, 10, 12]);
  }

  draw = () => {
    Game.drawTile(
      this.variation,
      this.level.env + (this.highlight ? 3 : 0),
      1,
      1,
      this.x,
      this.y,
      this.w,
      this.h
    );
  };
}
