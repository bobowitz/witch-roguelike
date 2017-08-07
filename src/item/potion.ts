import { Item } from "./item";

export class Potion extends Item {
  constructor(x: number, y: number) {
    super(x, y);

    this.tileX = 2;
    this.tileY = 0;
  }
}
