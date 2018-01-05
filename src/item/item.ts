import { Game } from "../game";
import { GameConstants } from "../gameConstants";
import { Camera } from "../camera";

export class Item {
  x: number;
  y: number;
  w: number;
  h: number;
  tileX: number;
  tileY: number;
  frame: number;
  dead: boolean; // for inventory, just a removal flag

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.w = 1;
    this.h = 2;
    this.tileX = 0;
    this.tileY = 0;
    this.frame = 0;
    this.dead = false;
  }

  draw = () => {
    Game.drawItem(0, 0, 1, 1, this.x, this.y, 1, 1);
    this.frame += Math.PI * 2 / 60;
    Game.drawItem(
      this.tileX,
      this.tileY,
      1,
      2,
      this.x,
      this.y + Math.sin(this.frame) * 0.0625 - 1,
      this.w,
      this.h
    );
  };
  drawIcon = (x: number, y: number) => {
    Game.drawItemNoCull(this.tileX, this.tileY, 1, 2, x, y - 1, this.w, this.h);
  };
}
