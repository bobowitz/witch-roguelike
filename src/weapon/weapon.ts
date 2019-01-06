import { Level } from "../level";
import { Game } from "../game";
import { Equippable } from "../item/equippable";

export class Weapon extends Equippable {
  game: Game;

  constructor(level: Level, x: number, y: number) {
    super(level, x, y);

    if (level) this.game = level.game;
  }

  coEquippable = (other: Equippable): boolean => {
    if (other instanceof Weapon) return false;
    return true;
  };

  weaponMove = (newX: number, newY: number): boolean => {
    return true;
  };
}
