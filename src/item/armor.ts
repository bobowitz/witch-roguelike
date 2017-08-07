import { Item } from "./item";

export class Armor extends Item {
  health: number;
  lastTickHealth: number;

  constructor(health: number, x: number, y: number) {
    super(x, y);
    this.health = health;
    this.lastTickHealth = health;
    this.tileX = 3;
    this.tileY = 0;
  }

  hurt = (damage: number) => {
    this.health -= damage;
  };
}
