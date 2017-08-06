import { Player } from "./player";
import { Tile } from "./tile";
import { Level } from "./level";

export class Collidable extends Tile {
  w: number;
  h: number;
  removeFlag: boolean;

  constructor(level: Level, x: number, y: number) {
    super(level, x, y);
    this.w = 1;
    this.h = 1;
  }

  onCollide = (player: Player) => {};
}
