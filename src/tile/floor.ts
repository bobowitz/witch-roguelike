import { Game } from "../game";
import { Tile, SkinType } from "./tile";
import { Level } from "../level";

export class Floor extends Tile {
  // all are in grid units
  variation: number;

  constructor(level: Level, x: number, y: number) {
    super(level, x, y);
    this.variation = 1;
    if (this.skin == SkinType.DUNGEON)
      this.variation = Game.randTable([1, 1, 1, 1, 1, 1, 8, 8, 8, 9, 10, 10, 10, 10, 10, 12]);
    if (this.skin == SkinType.CAVE)
      //this.variation = Game.randTable([1, 1, 1, 1, 8, 9, 10, 12]);
      this.variation = Game.randTable([1, 1, 1, 1, 1, 1, 8, 8, 8, 9, 10, 10, 10, 10, 10, 12]);
  }

  draw = () => {
    Game.drawTile(
      this.variation,
      this.skin,
      1,
      1,
      this.x,
      this.y,
      1,
      1,
      this.level.shadeColor,
      this.shadeAmount()
    );
  };
}
