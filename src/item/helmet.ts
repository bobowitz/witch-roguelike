import { Item } from "./item";
import { Armor } from "./armor";
import { Game } from "../game";
import { Equippable } from "./equippable";

export class Helmet extends Equippable {
  health: number;
  lastTickHealth: number;

  constructor(health: number, x: number, y: number) {
    super(x, y);
    this.health = health;
    this.lastTickHealth = health;
    this.tileX = 5;
    this.tileY = 0;
  }

  hurt = (damage: number) => {
    this.health -= damage;
  };

  coEquippable = (other: Equippable): boolean => {
    return !(other instanceof Helmet);
  };

  drawEquipped = (x: number, y: number) => {
    Game.drawMob(1, 2, 1, 2, x, y - 1.5, 1, 2);
  };
}
