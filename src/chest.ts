import { Collidable } from "./collidable";
import { Item } from "./item/item";
import { Game } from "./game";
import { Key } from "./item/key";
import { Level } from "./level";
import { Potion } from "./item/potion";
import { Armor } from "./item/armor";

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
    // DROP TABLES!

    if (Game.rand(1, 5) === 1) this.game.level.items.push(new Key(this.x, this.y));
    else if (Game.rand(1, 3) === 1) this.game.level.items.push(new Armor(10, this.x, this.y));
    else this.game.level.items.push(new Potion(this.x, this.y));
  };
}
