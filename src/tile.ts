import { Level } from "./level";

export class Tile {
  x: number;
  y: number;
  level: Level;

  constructor(level: Level, x: number, y: number) {
    this.level = level;
    this.x = x;
    this.y = y;
  }

  draw = () => {};
}
