import { Collidable } from "../tile/collidable";
import { Item } from "../item/item";
import { Game } from "../game";
import { Key } from "../item/key";
import { Level } from "../level";
import { Heart } from "../item/heart";
import { Armor } from "../item/armor";
import { Enemy } from "./enemy";
import { LevelConstants } from "../levelConstants";

export class Chest extends Enemy {
  dropItem: Item;

  constructor(level: Level, game: Game, x: number, y: number, item?: Item) {
    super(level, game, x, y);

    this.tileX = 17;
    this.tileY = 0;
    this.health = 1;

    this.dropItem = item;
    console.log(this.dropItem);
  }

  kill = () => {
    this.dead = true;

    if (this.dropItem) this.game.level.items.push(this.dropItem);
    else {
      // DROP TABLES!
      let drop = Game.randTable([1, 2, 3, 3, 3]);

      switch (drop) {
        case 1:
          this.game.level.items.push(new Heart(this.x, this.y));
          break;
        case 2:
          this.game.level.items.push(new Key(this.x, this.y));
          break;
        case 3:
          this.game.level.items.push(new Armor(this.x, this.y));
          break;
      }
    }
  };

  draw = () => {
    if (!this.dead) {
      let darkOffset =
        this.level.visibilityArray[this.x][this.y] <= LevelConstants.VISIBILITY_CUTOFF ? 2 : 0;
      Game.drawMob(
        this.tileX,
        this.tileY + darkOffset,
        1,
        2,
        this.x - this.drawX,
        this.y - 1 - this.drawY,
        1,
        2
      );
    }
  };
}
