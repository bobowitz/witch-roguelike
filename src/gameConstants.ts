import { LevelConstants } from "./levelConstants";

export class GameConstants {
  static readonly FPS = 60;

  static readonly TILESIZE = 16;

  static readonly WIDTH = LevelConstants.SCREEN_W * GameConstants.TILESIZE;
  static readonly HEIGHT = LevelConstants.SCREEN_H * GameConstants.TILESIZE;

  static readonly RED = "#ac3232";
  static readonly GREEN = "#6abe30";
  static readonly OUTLINE = "#222034";
}
