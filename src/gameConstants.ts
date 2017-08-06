import { LevelConstants } from "./levelConstants";

export class GameConstants {
  static readonly FPS = 60;

  static readonly TILESIZE = 16;

  static readonly WIDTH = LevelConstants.SCREEN_W * GameConstants.TILESIZE;
  static readonly HEIGHT = LevelConstants.SCREEN_H * GameConstants.TILESIZE;
}
