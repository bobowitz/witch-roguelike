import { Level } from "../level";
import { Game } from "../game";
import { Tile } from "./tile";

export class FountainTile extends Tile {
  subTileX: number; // each fountain is 3x3, this is the sub-tile coordinate
  subTileY: number;

  constructor(level: Level, x: number, y: number, subTileX: number, subTileY: number) {
    super(level, x, y);
    this.subTileX = subTileX;
    this.subTileY = subTileY;
  }

  isSolid = (): boolean => {
    return true;
  };
  canCrushEnemy = (): boolean => {
    return true;
  };

  draw = () => {
    Game.drawTile(
      1,
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
    Game.drawTile(
      this.subTileX,
      2 + this.subTileY,
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
