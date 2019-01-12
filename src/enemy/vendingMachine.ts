import { Player } from "../player";
import { Game } from "../game";
import { Level } from "../level";
import { Enemy } from "./enemy";
import { Item } from "../item/item";
import { Key } from "../item/key";
import { Coin } from "../item/coin";
import { Coal } from "../item/coal";
import { GreenGem } from "../item/greengem";
import { GameConstants } from "../gameConstants";
import { Shotgun } from "../weapon/shotgun";
import { Dagger } from "../weapon/dagger";
import { Armor } from "../item/armor";
import { Heart } from "../item/heart";
import { Spear } from "../weapon/spear";
import { Gold } from "../item/gold";

let OPEN_TIME = 150;
let FILL_COLOR = "#5a595b";
let OUTLINE_COLOR = "#292c36";
let FULL_OUTLINE = "white";

export class VendingMachine extends Enemy {
  open = false;
  openTime = 0;
  costItems: Array<Item>;
  item: Item;
  isInf = false;
  quantity = 1;
  buyAnimAmount = 0;

  constructor(level: Level, game: Game, x: number, y: number, item: Item) {
    super(level, game, x, y);

    this.destroyable = false;
    this.pushable = false;
    this.chainPushable = false;
    this.interactable = true;

    this.item = item;
    if (this.item instanceof Shotgun) {
      let g = new GreenGem(level, 0, 0);
      g.stackCount = Game.randTable([5, 5, 6, 7]);
      this.costItems = [g];
    } else if (this.item instanceof Heart) {
      let c = new Coin(level, 0, 0);
      c.stackCount = 10;
      this.costItems = [c];
      this.isInf = true;
    } else if (this.item instanceof Spear) {
      let g = new GreenGem(level, 0, 0);
      g.stackCount = Game.randTable([5, 5, 6, 7]);
      this.costItems = [g];
    } else if (this.item instanceof Armor) {
      let g = new Gold(level, 0, 0);
      g.stackCount = Game.randTable([5, 5, 6, 7]);
      this.costItems = [g];
    }
  }

  interact = () => {
    if (this.isInf || this.quantity > 0) {
      this.open = true;
      this.openTime = Date.now();
      if (this.game.player.openVendingMachine && this.game.player.openVendingMachine !== this)
        this.game.player.openVendingMachine.close();
      this.game.player.openVendingMachine = this;
    }
  };

  close = () => {
    this.open = false;
    this.game.player.openVendingMachine = null;
  };

  space = () => {
    if (this.open) {
      // check if player can pay
      for (const i of this.costItems) {
        if (!this.game.player.inventory.hasItemCount(i)) return;
      }

      for (const i of this.costItems) {
        this.game.player.inventory.subtractItemCount(i);
      }

      let xs = [this.x - 1, this.x + 1, this.x];
      let ys = [this.y, this.y, this.y + 1];
      let i = 0;
      do {
        i = Game.rand(0, xs.length - 1);
      } while (xs[i] === this.game.player.x && ys[i] === this.game.player.y);

      let newItem = new (this.item.constructor as { new (): Item })();
      newItem = newItem.constructor(this.level, xs[i], ys[i]);
      this.level.items.push(newItem);

      console.log(newItem);

      if (!this.isInf) {
        this.quantity--;
        if (this.quantity <= 0) this.close();
      }

      this.buyAnimAmount = 0.99;
      this.game.shakeScreen(0, 4);
    }
  };

  draw = () => {
    let tileX = 19;
    if (!this.isInf && this.quantity === 0) tileX = 20;
    Game.drawObj(
      tileX,
      0,
      1,
      2,
      this.x,
      this.y - 1,
      1,
      2,
      this.level.shadeColor,
      this.shadeAmount()
    );
  };

  drawTopLayer = () => {
    this.drawableY = this.y - this.drawY;

    if (this.open) {
      let s = Math.min(18, (18 * (Date.now() - this.openTime)) / OPEN_TIME); // size of box
      let b = 2; // border
      let g = -2; // gap
      let hg = 3; // highlighted growth
      let ob = 1; // outer border
      let width = (this.costItems.length + 2) * (s + 2 * b + g) - g;
      let height = s + 2 * b + g - g;

      let cx = (this.x + 0.5) * GameConstants.TILESIZE;
      let cy = (this.y - 1.5) * GameConstants.TILESIZE;

      Game.ctx.fillStyle = FULL_OUTLINE;
      Game.ctx.fillRect(
        Math.round(cx - 0.5 * width) - ob,
        Math.round(cy - 0.5 * height) - ob,
        Math.round(width + 2 * ob),
        Math.round(height + 2 * ob)
      );
      for (let x = 0; x < this.costItems.length + 2; x++) {
        Game.ctx.fillStyle = OUTLINE_COLOR;
        Game.ctx.fillRect(
          Math.round(cx - 0.5 * width + x * (s + 2 * b + g)),
          Math.round(cy - 0.5 * height),
          Math.round(s + 2 * b),
          Math.round(s + 2 * b)
        );
        if (x !== this.costItems.length) {
          Game.ctx.fillStyle = FILL_COLOR;
          Game.ctx.fillRect(
            Math.round(cx - 0.5 * width + x * (s + 2 * b + g) + b),
            Math.round(cy - 0.5 * height + b),
            Math.round(s),
            Math.round(s)
          );
        }
      }

      if (Date.now() - this.openTime >= OPEN_TIME) {
        for (let i = 0; i < this.costItems.length + 2; i++) {
          let drawX = Math.round(
            cx -
              0.5 * width +
              i * (s + 2 * b + g) +
              b +
              Math.floor(0.5 * s) -
              0.5 * GameConstants.TILESIZE
          );
          let drawY = Math.round(
            cy - 0.5 * height + b + Math.floor(0.5 * s) - 0.5 * GameConstants.TILESIZE
          );

          let drawXScaled = drawX / GameConstants.TILESIZE;
          let drawYScaled = drawY / GameConstants.TILESIZE;

          if (i < this.costItems.length) {
            let a = 1;
            if (!this.game.player.inventory.hasItemCount(this.costItems[i])) a = 0.15;
            this.costItems[i].drawIcon(drawXScaled, drawYScaled, a);
          } else if (i === this.costItems.length) {
            Game.drawFX(0, 1, 1, 1, drawXScaled, drawYScaled, 1, 1);
          } else if (i === this.costItems.length + 1) {
            this.item.drawIcon(drawXScaled, drawYScaled);
          }
        }
      }
      this.buyAnimAmount *= this.buyAnimAmount;
      Game.ctx.globalAlpha = this.buyAnimAmount;
      Game.ctx.fillStyle = FULL_OUTLINE;
      Game.ctx.fillRect(
        Math.round(cx - 0.5 * width) - ob,
        Math.round(cy - 0.5 * height) - ob,
        Math.round(width + 2 * ob),
        Math.round(height + 2 * ob)
      );
      Game.ctx.globalAlpha = 1.0;
    }
  };
}
