import { Item } from "./item/item";
import { LevelConstants } from "./levelConstants";
import { Game } from "./game";
import { Key } from "./item/key";
import { Input } from "./input";
import { GameConstants } from "./gameConstants";
import { Equippable } from "./item/equippable";
import { Armor } from "./item/armor";
import { GoldenKey } from "./item/goldenKey";

export class Inventory {
  items: Array<Item>;
  tileX = 0;
  tileY = 0;
  game: Game;
  isOpen: boolean;

  constructor(game: Game) {
    this.game = game;
    this.items = new Array<Item>();
    Input.mouseLeftClickListener = this.mouseLeftClickListener;
    this.items.push();
  }

  open = () => {
    this.isOpen = true;
  };

  close = () => {
    this.isOpen = false;
  };

  hasItem(itemType) {
    for (const i of this.items) {
      if (i instanceof itemType) return i;
    }
    return null;
  }

  addItem(item: Item) {
    this.items.push(item);
  }

  mouseLeftClickListener = (x: number, y: number) => {
    let tileX = Math.floor(x / GameConstants.TILESIZE);
    let tileY = Math.floor(y / GameConstants.TILESIZE);
    let i = tileX + tileY * LevelConstants.SCREEN_W;
    if (i < this.items.length && this.items[i] instanceof Equippable) {
      let e = this.items[i] as Equippable;
      e.equipped = !e.equipped; // toggle
      if (e.equipped) {
        for (const i of this.items) {
          if (i instanceof Equippable && i !== e && !e.coEquippable(i)) {
            i.equipped = false; // prevent user from equipping two notCoEquippable items
          }
        }
      }
    }

    this.game.player.equipped = this.items.filter(
      x => x instanceof Equippable && x.equipped
    ) as Array<Equippable>;
  };

  draw = () => {
    if (this.isOpen) {
      Game.ctx.drawImage(
        Game.inventory,
        GameConstants.WIDTH / 2 - 48,
        GameConstants.HEIGHT / 2 - 48
      );
      // check equips too
      this.items = this.items.filter(x => !x.dead);
      this.game.player.equipped = this.items.filter(
        x => x instanceof Equippable && x.equipped
      ) as Array<Equippable>;

      for (let i = 0; i < this.items.length; i++) {
        let s = 4;

        let x = i % s;
        let y = Math.floor(i / s);

        this.items[i].drawIcon(
          x + LevelConstants.SCREEN_W / 2 - s / 2,
          y + LevelConstants.SCREEN_H / 2 - s / 2
        );

        if (this.items[i] instanceof Equippable && (this.items[i] as Equippable).equipped) {
          Game.drawItem(0, 1, 1, 1, x, y, 1, 1);
        }
      }
    }
  };
}
