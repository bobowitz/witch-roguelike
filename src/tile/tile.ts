import { Level } from "../level";
import { LevelConstants } from "../levelConstants";

export class Tile {
  x: number;
  y: number;
  level: Level;

  constructor(level: Level, x: number, y: number) {
    this.level = level;
    this.x = x;
    this.y = y;
  }

  isShaded = () => {
    return this.level.visibilityArray[this.x][this.y] <= LevelConstants.VISIBILITY_CUTOFF;
  };

  draw = () => {};
  drawUnderPlayer = () => {};
  drawAbovePlayer = () => {};
}
