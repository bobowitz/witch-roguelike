import { Item } from "./item";
import { Game } from "../game";

export class Key extends Item {
  constructor(x: number, y: number) {
    super(x, y);

    this.tileX = 0;
    this.tileY = 0;
  }

  // don't need to override stuff since base case behavior
}
