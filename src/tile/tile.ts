import { Level } from "../level";
import { LevelConstants } from "../levelConstants";

export enum SkinType {
  DUNGEON = 0,
  GRASS = 1,
}

export class Tile {
  x: number;
  y: number;
  level: Level;
  skin: SkinType;

  constructor(level: Level, x: number, y: number) {
    this.skin = level.skin;
    this.level = level;
    this.x = x;
    this.y = y;
  }

  isShaded = () => {
    return this.level.visibilityArray[this.x][this.y] <= LevelConstants.SHADED_TILE_CUTOFF;
  };

  draw = () => {};
  drawUnderPlayer = () => {};
  drawAbovePlayer = () => {};
}
