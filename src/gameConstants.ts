import { LevelConstants } from "./levelConstants";

export class GameConstants {
  static readonly VERSION = "v0.6.1";

  static readonly FPS = 60;
  static readonly ALPHA_ENABLED = true;
  static readonly SHADE_LEVELS = 10;

  static readonly TILESIZE = 16;
  static readonly SCALE = 2;

  static readonly SWIPE_THRESH = 50 ** 2; // (size of swipe threshold circle)^2

  static readonly KEY_REPEAT_TIME = 300; // millseconds

  static readonly CHAT_APPEAR_TIME = 10000;
  static readonly CHAT_FADE_TIME = 1000;

  static readonly DEFAULTWIDTH = 8.5 * GameConstants.TILESIZE;
  static readonly DEFAULTHEIGHT = 8.5 * GameConstants.TILESIZE;
  static WIDTH = LevelConstants.SCREEN_W * GameConstants.TILESIZE;
  static HEIGHT = LevelConstants.SCREEN_H * GameConstants.TILESIZE;
  static scrolling = true;

  static readonly SCRIPT_FONT_SIZE = 16;
  static readonly FONT_SIZE = 10;
  static readonly BIG_FONT_SIZE = 20;

  static readonly RED = "#ac3232";
  static readonly WARNING_RED = "#ff0000";
  static readonly GREEN = "#6abe30";
  static readonly ARMOR_GREY = "#9badb7";
  static readonly OUTLINE = "#222034";
  static readonly HIT_ENEMY_TEXT_COLOR = "#76428a";
  static readonly HEALTH_BUFF_COLOR = "#d77bba";
  static readonly MISS_COLOR = "#639bff";
}
