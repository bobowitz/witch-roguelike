import { Item } from "./item";

export class GoldenKey extends Item {
  constructor(x: number, y: number) {
    super(x, y);

    this.tileX = 6;
    this.tileY = 0;
  }

  // don't need to override stuff since base case behavior
}
