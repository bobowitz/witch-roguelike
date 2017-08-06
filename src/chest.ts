import { Collidable } from "./collidable";
import { Item } from "./item/item";
import { Game } from "./game";
import { Key } from "./item/key";
import { Level } from "./level";

export class Chest extends Collidable {
  game: Game;

  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, x, y);
    this.level = level;
    this.game = game;
  }

  draw = () => {
    Game.drawTile(4, this.level.env, 1, 1, this.x, this.y, this.w, this.h);
  };

  open = () => {
    this.game.level.items.push(new Key(this.x, this.y));
  };
}
