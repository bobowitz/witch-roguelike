import { Collidable } from "./collidable";
import { Level } from "../level";
import { Game } from "../game";

export class FountainTile extends Collidable {
  subTileX: number; // each fountain is 3x3, this is the sub-tile coordinate
  subTileY: number;

  constructor(level: Level, x: number, y: number, subTileX: number, subTileY: number) {
    super(level, x, y);
    this.subTileX = subTileX;
    this.subTileY = subTileY;
  }

  draw = () => {
    Game.drawTile(1, 0, 1, 1, this.x, this.y, this.w, this.h);
    Game.drawTile(this.subTileX, 2 + this.subTileY, 1, 1, this.x, this.y, this.w, this.h);
  };
}
