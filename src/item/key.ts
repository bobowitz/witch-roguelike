import { Item } from "./item";
import { Equippable } from "./equippable";
import { Level } from "../level";

export class Key extends Equippable {
  constructor(level: Level, x: number, y: number) {
    super(level, x, y);

    this.tileX = 1;
    this.tileY = 0;
  }

  getDescription = (): string => {
    return "KEY\nAn iron key.";
  };
}
