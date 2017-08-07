import { Item } from "./item";
import { Game } from "../game";

export class Equippable extends Item {
  equipped: boolean;

  constructor(x: number, y: number) {
    super(x, y);
    this.equipped = false;
  }

  coEquippable = (other: Equippable): boolean => {
    return true;
  };

  drawEquipped = (x: number, y: number) => {
    Game.drawItem(this.tileX, this.tileY, 1, 2, x, y - 1, this.w, this.h);
  };
}
