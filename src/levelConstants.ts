import { GameConstants } from "./gameConstants";

export class LevelConstants {
  static readonly MIN_LEVEL_W = 5;
  static readonly MIN_LEVEL_H = 5;

  static readonly MAX_LEVEL_W = 13;
  static readonly MAX_LEVEL_H = 13;

  static readonly SCREEN_W = 17; // screen size in tiles
  static readonly SCREEN_H = 17; // screen size in tiles

  static readonly ENVIRONMENTS = 5;

  static readonly MIN_VISIBILITY = 0.2;
  static readonly VISIBILITY_STEP = 0.1;

  static LEVEL_TEXT_COLOR = "white"; // not actually a constant
}
