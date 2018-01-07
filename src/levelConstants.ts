import { GameConstants } from "./gameConstants";

export class LevelConstants {
  static readonly SCREEN_W = 17; // screen size in tiles
  static readonly SCREEN_H = 17; // screen size in tiles

  static readonly ENVIRONMENTS = 6;

  static readonly VISIBILITY_CUTOFF = 1;
  static readonly MIN_VISIBILITY = 1; // visibility level of places you've already seen
  static readonly LIGHTING_ANGLE_STEP = 1; // how many degrees between each ray
  static readonly VISIBILITY_STEP = 0.4;

  static LEVEL_TEXT_COLOR = "white"; // not actually a constant
}
