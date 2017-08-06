import { Game } from "../game";

export class Item {
  x: number;
  y: number;
  w: number;
  h: number;
  tileX: number;
  tileY: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.w = 1;
    this.h = 1;
    this.tileX = 0;
    this.tileY = 0;
  }

  draw = () => {
    Game.drawItem(this.tileX, this.tileY, 1, 1, this.x, this.y, this.w, this.h);
  };
  drawIcon = (x: number, y: number) => {
    Game.drawItem(this.tileX, this.tileY, 1, 1, x, y, this.w, this.h);
  };
}
