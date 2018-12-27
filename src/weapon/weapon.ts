import { Level } from "../level";
import { Game } from "../game";

export class Weapon {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  weaponMove = (newX: number, newY: number): boolean => {
    return true;
  };
}
