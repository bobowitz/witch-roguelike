import { Item } from "./item/item";
import { LevelConstants } from "./levelConstants";
import { Game } from "./game";

export class Inventory {
  items: Array<Item>;

  constructor() {
    this.items = new Array<Item>();
  }

  draw = () => {
    for (let i = 0; i < this.items.length; i++) {
      let x = i % LevelConstants.SCREEN_W;
      let y = Math.floor(i / LevelConstants.SCREEN_W);

      Game.drawItem(this.items[i].tileX, this.items[i].tileY, 1, 1, x, y, 1, 1);
    }
  };
}
