import { Game } from "../game";
import { Tile } from "./tile";
import { Level } from "../level";

export class SpawnFloor extends Tile {
  // all are in grid units
  w: number;
  h: number;
  variation: number;

  constructor(level: Level, x: number, y: number) {
    super(level, x, y);
    this.w = 1;
    this.h = 1;
    this.variation = 1;
    if (Game.rand(1, 20) == 1) this.variation = Game.randTable([8, 9, 10, 12]);
  }

  draw = () => {
    Game.drawTile(this.variation, this.level.env, 1, 1, this.x, this.y, this.w, this.h);
  };
}
