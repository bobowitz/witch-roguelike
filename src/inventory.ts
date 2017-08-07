import { Item } from "./item/item";
import { LevelConstants } from "./levelConstants";
import { Game } from "./game";
import { Key } from "./item/key";

export class Inventory {
  items: Array<Item>;

  constructor() {
    this.items = new Array<Item>();
  }

  hasItem(itemType) {
    for (const i of this.items) {
      if (i instanceof itemType) return i;
    }
    return null;
  }

  addItem(item: Item) {
    this.items.push(item);
  }

  draw = () => {
    for (let i = 0; i < this.items.length; i++) {
      let x = i % LevelConstants.SCREEN_W;
      let y = Math.floor(i / LevelConstants.SCREEN_W);

      this.items[i].drawIcon(x, y);
    }
  };
}
