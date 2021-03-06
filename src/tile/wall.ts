import { Game } from "../game";
import { Level } from "../level";
import { Tile } from "./tile";

export class Wall extends Tile {
  type: number;

  constructor(level: Level, x: number, y: number, type: number) {
    super(level, x, y);
    this.type = type;
  }

  isSolid = (): boolean => {
    return true;
  };
  canCrushEnemy = (): boolean => {
    return true;
  };
  isOpaque = (): boolean => {
    return true;
  };

  draw = () => {
    if (this.type === 1) {
      Game.drawTile(
        5,
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
    }
  };
}
