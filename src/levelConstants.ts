import { GameConstants } from "./gameConstants";

export class LevelConstants {
  static readonly MIN_LEVEL_W = 5;
  static readonly MIN_LEVEL_H = 5;

  static readonly MAX_LEVEL_W = 13;
  static readonly MAX_LEVEL_H = 13;

  static SCREEN_W = 17; // screen size in tiles
  static SCREEN_H = 17; // screen size in tiles

  static readonly TURN_TIME = 1000; // milliseconds
  static readonly LEVEL_TRANSITION_TIME = 300; // milliseconds
  static readonly LEVEL_TRANSITION_TIME_LADDER = 1000; // milliseconds
  static readonly ROOM_COUNT = 15;

  static readonly SHADED_TILE_CUTOFF = 1;
  static SMOOTH_LIGHTING = false;
  static readonly MIN_VISIBILITY = 2.0; // visibility level of places you've already seen
  static readonly LIGHTING_ANGLE_STEP = 5; // how many degrees between each ray

  static LEVEL_TEXT_COLOR = "white"; // not actually a constant
}
