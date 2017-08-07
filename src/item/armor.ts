import { Item } from "./item";
import { Game } from "../game";
import { Equippable } from "./equippable";
import { Helmet } from "./helmet";

export class Armor extends Equippable {
  health: number;
  lastTickHealth: number;

  constructor(health: number, x: number, y: number) {
    super(x, y);
    this.health = health;
    this.lastTickHealth = health;
    this.tileX = 4;
    this.tileY = 0;
  }

  hurt = (damage: number) => {
    this.health -= damage;
    if (this.health <= 0) {
      this.health = 0;
      this.dead = true;
    }
  };

  coEquippable = (other: Equippable): boolean => {
    return !(other instanceof Armor);
  };

  drawEquipped = (x: number, y: number) => {
    Game.drawMob(0, 2, 1, 2, x, y - 1.5, 1, 2);
  };
}
