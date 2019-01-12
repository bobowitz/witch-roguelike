import { GameConstants } from "./gameConstants";

export class LevelConstants {
  static SCREEN_W = 1;
  static SCREEN_H = 1;

  static readonly COMPUTER_TURN_DELAY = 250; // milliseconds
  static readonly TURN_TIME = 1000; // milliseconds
  static readonly LEVEL_TRANSITION_TIME = 300; // milliseconds
  static readonly LEVEL_TRANSITION_TIME_LADDER = 1000; // milliseconds
  static readonly ROOM_COUNT = 15;

  static readonly HEALTH_BAR_FADEIN = 100;
  static readonly HEALTH_BAR_FADEOUT = 100;
  static readonly HEALTH_BAR_TOTALTIME = 2500;

  static readonly SHADED_TILE_CUTOFF = 1;
  static SMOOTH_LIGHTING = false;
  static readonly MIN_VISIBILITY = 2.0; // visibility level of places you've already seen
  static readonly LIGHTING_ANGLE_STEP = 5; // how many degrees between each ray

  static LEVEL_TEXT_COLOR = "white"; // not actually a constant
}
