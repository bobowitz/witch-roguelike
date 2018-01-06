import { Player } from "../player";
import { Tile } from "./tile";
import { Level } from "../level";

export class Collidable extends Tile {
  removeFlag: boolean;

  constructor(level: Level, x: number, y: number) {
    super(level, x, y);
  }

  onCollide = (player: Player) => {};
}
