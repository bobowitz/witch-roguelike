import { Collidable } from "./collidable";
import { Item } from "../item/item";
import { Game } from "../game";
import { Key } from "../item/key";
import { Level } from "../level";
import { Potion } from "../item/potion";
import { Armor } from "../item/armor";
import { Helmet } from "../item/helmet";
import { HealthBuff } from "../item/healthbuff";

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

    let drop = Game.randTable([1, 1, 1, 1, 2, 2, 3, 4]);

    switch (drop) {
      case 1:
        this.game.level.items.push(new HealthBuff(this.x, this.y));
        break;
      case 2:
        this.game.level.items.push(new Key(this.x, this.y));
        break;
      case 3:
        this.game.level.items.push(
          new Armor(Game.randTable([25, 50, 50, 50, 50, 50, 50, 75]), this.x, this.y)
        );
        break;
      case 4:
        this.game.level.items.push(
          new Helmet(Game.randTable([20, 30, 30, 30, 30, 30, 45]), this.x, this.y)
        );
        break;
    }
  };
}
