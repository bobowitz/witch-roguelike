import { LevelConstants } from "./levelConstants";

export class GameConstants {
  static readonly VERSION = "v0.0.23";

  static readonly FPS = 60;

  static readonly TILESIZE = 16;
  static readonly SCALE = 2;

  static readonly WIDTH = LevelConstants.SCREEN_W * GameConstants.TILESIZE;
  static readonly HEIGHT = LevelConstants.SCREEN_H * GameConstants.TILESIZE;

  static readonly FONT_SIZE = 12;

  static readonly RED = "#ac3232";
  static readonly GREEN = "#6abe30";
  static readonly ARMOR_GREY = "#9badb7";
  static readonly OUTLINE = "#222034";
  static readonly HIT_ENEMY_TEXT_COLOR = "#76428a";
  static readonly HEALTH_BUFF_COLOR = "#d77bba";
  static readonly MISS_COLOR = "#639bff";
}
