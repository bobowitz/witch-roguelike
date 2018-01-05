import { GameConstants } from "./gameConstants";

export class LevelConstants {
  static readonly MIN_LEVEL_W = 5;
  static readonly MIN_LEVEL_H = 5;

  static readonly MAX_LEVEL_W = 13;
  static readonly MAX_LEVEL_H = 13;

  static readonly SCREEN_W = 17; // screen size in tiles
  static readonly SCREEN_H = 17; // screen size in tiles

  static readonly ENVIRONMENTS = 6;

  static readonly VISIBILITY_CUTOFF = 1;
  static readonly MIN_VISIBILITY = 1; // visibility level of places you've already seen
  static readonly LIGHTING_ANGLE_STEP = 8; // how many degrees between each ray
  static readonly VISIBILITY_STEP = 2;

  static LEVEL_TEXT_COLOR = "white"; // not actually a constant
}
