import { Level } from "../level";
import { LevelConstants } from "../levelConstants";
import { Player } from "../player";
import { Enemy } from "../enemy/enemy";

export enum SkinType {
  DUNGEON = 0,
  CAVE = 1,
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
    return this.level.softVisibilityArray[this.x][this.y] <= LevelConstants.SHADED_TILE_CUTOFF;
  };

  isSolid = (): boolean => {
    return false;
  };
  canCrushEnemy = (): boolean => {
    return false;
  };
  isOpaque = (): boolean => {
    return false;
  };
  onCollide = (player: Player) => {};
  onCollideEnemy = (enemy: Enemy) => {};
  tick = () => {};
  tickEnd = () => {};

  draw = () => {};
  drawUnderPlayer = () => {};
  drawAbovePlayer = () => {};
  drawAboveShading = () => {};
}
