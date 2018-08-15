import { Item } from "./item";
import { Equippable } from "./equippable";
import { Level } from "../level";

export class GoldenKey extends Equippable {
  constructor(level: Level, x: number, y: number) {
    super(level, x, y);

    this.tileX = 6;
    this.tileY = 0;
  }

  getDescription = (): string => {
    return "GOLD KEY\nA heavy gold key.";
  };
}
