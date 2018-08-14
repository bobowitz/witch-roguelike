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
  equipped: Array<Equippable>;
  tileX = 0;
  tileY = 0;
  game: Game;
  isOpen: boolean;

  constructor(game: Game) {
    this.game = game;
    this.items = new Array<Item>();
    this.equipped = new Array<Equippable>();
    Input.mouseLeftClickListener = this.mouseLeftClickListener;
  }

  open = () => {
    this.isOpen = !this.isOpen;
  };

  close = () => {
    //this.isOpen = false;
  };

  hasItem = (itemType: any): Item => {
    // itemType is class of Item we're looking for
    for (const i of this.items) {
      if (i instanceof itemType) return i;
    }
    return null;
  };

  addItem = (item: Item) => {
    if (item.stackable) {
      for (let i of this.items) {
        if (i.constructor === item.constructor) {
          // we already have an item of the same type
          i.stackCount++;
          return;
        }
      }
    }
    // item is either not stackable, or its stackable but we don't have one yet
    this.items.push(item);
  };

  getArmor = (): Armor => {
    for (const e of this.equipped) {
      if (e instanceof Armor) return e;
    }
    return null;
  };

  mouseLeftClickListener = (x: number, y: number) => {
    let tileX = Math.floor((x - 51) / 19);
    let tileY = Math.floor((y - 70) / 19);
    let i = tileX + tileY * 9;
    if (i >= 0 && i < this.items.length && this.items[i] instanceof Equippable) {
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

    this.equipped = this.items.filter(x => x instanceof Equippable && x.equipped) as Array<
      Equippable
    >;
  };

  tick = () => {
    for (const i of this.items) {
      i.tickInInventory();
    }
  };

  draw = () => {
    if (this.isOpen) {
      Game.ctx.fillStyle = "rgb(0, 0, 0, 0.9)";
      Game.ctx.fillRect(0, 0, GameConstants.WIDTH, GameConstants.HEIGHT);

      Game.ctx.drawImage(Game.inventory, 0, 0);
      // check equips too
      this.items = this.items.filter(x => !x.dead);

      if (Input.mouseX >= 51 && Input.mouseX <= 221 && Input.mouseY >= 70 && Input.mouseY <= 145) {
        let highlightedSlotX = Math.floor((Input.mouseX - 51) / 19) * 19 + 51;
        let highlightedSlotY = Math.floor((Input.mouseY - 70) / 19) * 19 + 70;
        Game.ctx.fillStyle = "#9babd7";
        Game.ctx.fillRect(highlightedSlotX, highlightedSlotY, 18, 18);
      }

      for (let i = 0; i < this.items.length; i++) {
        let s = 9;

        let x = (52 + 19 * (i % s)) / GameConstants.TILESIZE;
        let y = (71 + 19 * Math.floor(i / s)) / GameConstants.TILESIZE;

        this.items[i].drawIcon(x, y);

        if (this.items[i] instanceof Equippable && (this.items[i] as Equippable).equipped) {
          Game.drawItem(0, 4, 2, 2, x - 0.5, y - 0.5, 2, 2);
        }
      }

      let tileX = Math.floor((Input.mouseX - 51) / 19);
      let tileY = Math.floor((Input.mouseY - 70) / 19);
      let i = tileX + tileY * 9;
      if (i >= 0 && i < this.items.length) {
        Game.ctx.font = GameConstants.SCRIPT_FONT_SIZE + "px Script";
        Game.ctx.fillStyle = "white";
        let lines = this.items[i].getDescription().split("\n");
        if (this.items[i].stackable && this.items[i].stackCount > 1) {
          lines.push("x" + this.items[i].stackCount);
        }
        for (let j = 0; j < lines.length; j++) {
          Game.ctx.fillText(lines[j], 55, 147 + j * 10);
        }
        Game.ctx.font = GameConstants.FONT_SIZE + "px PixelFont";
      }
    }
  };
}
