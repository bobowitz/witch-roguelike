import { Item } from "./item/item";
import { LevelConstants } from "./levelConstants";
import { Game } from "./game";
import { Key } from "./item/key";
import { Input } from "./input";
import { GameConstants } from "./gameConstants";
import { Equippable } from "./item/equippable";
import { Armor } from "./item/armor";
import { GoldenKey } from "./item/goldenKey";
import { ShopData, BuyItem, SellItem, ShopItems } from "./shopData";
import { Coal } from "./item/coal";
import { Player } from "./player";
import { Gem } from "./item/gem";
import { Gold } from "./item/gold";

export enum ShopState {
  MAINSCREEN,
  BUYING,
  SELLING,
}

let BACK_BUTTON_X = 3;
let BACK_BUTTON_Y = 3;
let LEFT_BUTTON_X = 0.5 * (17 - 11);
let LEFT_BUTTON_Y = 0.5 * (17 - 5);
let RIGHT_BUTTON_X = 0.5 * (17 - 11) + 0.5 * 11;
let RIGHT_BUTTON_Y = 0.5 * (17 - 5);

export class ShopScreen {
  shopState: ShopState;
  shopData: ShopData;
  tileX = 0;
  tileY = 0;
  game: Game;
  isOpen: boolean;

  constructor(game: Game) {
    this.game = game;

    this.shopData = new ShopData();
    let i = new BuyItem();
    i.item = null;
    i.shopItem = ShopItems.EMPTYHEART;
    i.price = 1;
    i.unlimited = true;
    this.shopData.buyItems.push(i);
    i = new BuyItem();
    i.item = null;
    i.shopItem = ShopItems.FILLHEARTS;
    i.price = 1;
    i.unlimited = true;
    this.shopData.buyItems.push(i);
    i = new BuyItem();
    i.item = null;
    i.shopItem = ShopItems.TORCH;
    i.price = 1;
    i.unlimited = true;
    this.shopData.buyItems.push(i);
    i = new BuyItem();
    i.item = new Armor(this.game.level, 0, 0);
    i.price = 1;
    i.unlimited = false;
    this.shopData.buyItems.push(i);
    let s = new SellItem();
    s.item = new Coal(this.game.level, 0, 0);
    s.description = s.item.getDescription();
    s.price = 1;
    this.shopData.sellItems.push(s);
    s = new SellItem();
    s.item = new Gold(this.game.level, 0, 0);
    s.description = s.item.getDescription();
    s.price = 10;
    this.shopData.sellItems.push(s);
    s = new SellItem();
    s.item = new Gem(this.game.level, 0, 0);
    s.description = s.item.getDescription();
    s.price = 100;
    this.shopData.sellItems.push(s);

    this.shopState = ShopState.MAINSCREEN;

    Input.mouseLeftClickListeners.push(this.mouseLeftClickListener);
  }

  open = () => {
    this.isOpen = true;
    this.game.player.inventory.close();
  };

  close = () => {
    this.isOpen = false;
  };

  mouseLeftClickListener = (x: number, y: number) => {
    if (!this.isOpen) return;

    let tileX = Math.floor(x / GameConstants.TILESIZE);
    let tileY = Math.floor(y / GameConstants.TILESIZE);

    let slotX = Math.floor((x - 51) / 19);
    let slotY = Math.floor((y - 70) / 19);
    let i = slotX + slotY * 9;

    let backButtonLit =
      tileX >= BACK_BUTTON_X &&
      tileY >= BACK_BUTTON_Y &&
      tileX < BACK_BUTTON_X + 3 &&
      tileY < BACK_BUTTON_Y + 1;

    switch (this.shopState) {
      case ShopState.MAINSCREEN:
        let leftButtonLit =
          tileX >= LEFT_BUTTON_X &&
          tileY >= LEFT_BUTTON_Y &&
          tileX < LEFT_BUTTON_X + 5 &&
          tileY < LEFT_BUTTON_Y + 5;
        if (leftButtonLit) this.shopState = ShopState.BUYING;

        let rightButtonLit =
          tileX >= RIGHT_BUTTON_X &&
          tileY >= RIGHT_BUTTON_Y &&
          tileX < RIGHT_BUTTON_X + 5 &&
          tileY < RIGHT_BUTTON_Y + 5;
        if (rightButtonLit) this.shopState = ShopState.SELLING;
        if (backButtonLit) this.close();
        break;
      case ShopState.BUYING:
        if (i >= 0 && i < this.shopData.buyItems.length) {
          if (this.game.player.inventory.coinCount() >= this.shopData.buyItems[i].price) {
            if (this.shopData.buyItems[i].item === null) {
              switch (this.shopData.buyItems[i].shopItem) {
                case ShopItems.TORCH:
                  this.game.player.sightRadius += 2;
                  this.game.player.inventory.subtractCoins(this.shopData.buyItems[i].price);
                  let t = Math.floor(0.5 * this.game.player.sightRadius);
                  this.shopData.buyItems[i].price = Math.round(
                    Math.pow(5, t + Math.pow(1.05, t) - 2.05)
                  );
                  break;
                case ShopItems.EMPTYHEART:
                  this.game.player.maxHealth += 1;
                  this.game.player.inventory.subtractCoins(this.shopData.buyItems[i].price);
                  let h = this.game.player.maxHealth;
                  this.shopData.buyItems[i].price = Math.round(
                    Math.pow(4, h + Math.pow(1.05, h) - 2.05)
                  );
                  break;
                case ShopItems.FILLHEARTS:
                  this.game.player.health = this.game.player.maxHealth;
                  this.game.player.inventory.subtractCoins(this.shopData.buyItems[i].price);
                  break;
              }
            } else {
              this.game.player.inventory.addItem(this.shopData.buyItems[i].item);
              this.game.player.inventory.subtractCoins(this.shopData.buyItems[i].price);
            }
            if (!this.shopData.buyItems[i].unlimited) {
              this.shopData.buyItems.splice(i, 1);
            }
          }
        }
        if (backButtonLit) this.shopState = ShopState.MAINSCREEN;
        break;
      case ShopState.SELLING:
        if (i >= 0 && i < this.game.player.inventory.items.length) {
          for (const sellItem of this.shopData.sellItems) {
            if (sellItem.item.constructor === this.game.player.inventory.items[i].constructor) {
              this.game.player.inventory.addCoins(
                sellItem.price * this.game.player.inventory.items[i].stackCount
              );
              this.game.player.inventory.removeItem(this.game.player.inventory.items[i]);
            }
          }
        }
        if (backButtonLit) this.shopState = ShopState.MAINSCREEN;
        break;
    }
  };

  textWrap = (text: string, x: number, y: number, maxWidth: number): number => {
    // returns y value for next line
    let words = text.split(" ");
    let line = "";

    while (words.length > 0) {
      if (Game.ctx.measureText(line + words[0]).width > maxWidth) {
        Game.ctx.fillText(line, x, y);
        line = "";
        y += 10;
      } else {
        if (line !== "") line += " ";
        line += words[0];
        words.splice(0, 1);
      }
    }
    if (line !== " ") {
      Game.ctx.fillText(line, x, y);
      y += 10;
    }
    return y;
  };

  drawItemSlots = () => {
    Game.drawShop(17, 5, 10.625, 9.4375, 0.5 * (17 - 10.625), 4.375, 10.625, 9.4375);

    if (Input.mouseX >= 51 && Input.mouseX <= 221 && Input.mouseY >= 70 && Input.mouseY <= 145) {
      let highlightedSlotX = Math.floor((Input.mouseX - 51) / 19) * 19 + 51;
      let highlightedSlotY = Math.floor((Input.mouseY - 70) / 19) * 19 + 70;
      Game.ctx.fillStyle = "#9babd7";
      Game.ctx.fillRect(highlightedSlotX, highlightedSlotY, 18, 18);
    }
  };

  drawBackButton = (tileX: number, tileY: number) => {
    let backButtonLit =
      tileX >= BACK_BUTTON_X &&
      tileY >= BACK_BUTTON_Y &&
      tileX < BACK_BUTTON_X + 3 &&
      tileY < BACK_BUTTON_Y + 1;
    Game.drawShop(37, backButtonLit ? 1 : 0, 3, 1, BACK_BUTTON_X, BACK_BUTTON_Y, 3, 1);
  };

  draw = () => {
    if (this.isOpen) {
      Game.ctx.fillStyle = "rgb(0, 0, 0, 0.9)";
      Game.ctx.fillRect(0, 0, GameConstants.WIDTH, GameConstants.HEIGHT);

      Game.drawShop(0, 0, 17, 17, 0, 0, 17, 17);

      let tileX = Math.floor(Input.mouseX / GameConstants.TILESIZE);
      let tileY = Math.floor(Input.mouseY / GameConstants.TILESIZE);

      let slotX = Math.floor((Input.mouseX - 51) / 19);
      let slotY = Math.floor((Input.mouseY - 70) / 19);
      let i = slotX + slotY * 9;

      switch (this.shopState) {
        case ShopState.MAINSCREEN:
          this.drawBackButton(tileX, tileY);

          let leftButtonLit =
            tileX >= LEFT_BUTTON_X &&
            tileY >= LEFT_BUTTON_Y &&
            tileX < LEFT_BUTTON_X + 5 &&
            tileY < LEFT_BUTTON_Y + 5;
          Game.drawShop(17 + (leftButtonLit ? 10 : 0), 0, 5, 5, LEFT_BUTTON_X, LEFT_BUTTON_Y, 5, 5);
          let rightButtonLit =
            tileX >= RIGHT_BUTTON_X &&
            tileY >= RIGHT_BUTTON_Y &&
            tileX < RIGHT_BUTTON_X + 5 &&
            tileY < RIGHT_BUTTON_Y + 5;
          Game.drawShop(
            22 + (rightButtonLit ? 10 : 0),
            0,
            5,
            5,
            RIGHT_BUTTON_X,
            RIGHT_BUTTON_Y,
            5,
            5
          );
          break;
        case ShopState.BUYING:
          this.drawItemSlots();
          this.drawBackButton(tileX, tileY);

          for (let i = 0; i < this.shopData.buyItems.length; i++) {
            let s = 9;

            let x = (52 + 19 * (i % s)) / GameConstants.TILESIZE;
            let y = (71 + 19 * Math.floor(i / s)) / GameConstants.TILESIZE;

            if (this.shopData.buyItems[i].item) this.shopData.buyItems[i].item.drawIcon(x, y);
            else {
              let xx = 0;
              let yy = 0;
              switch (this.shopData.buyItems[i].shopItem) {
                case ShopItems.TORCH:
                  xx = 21;
                  break;
                case ShopItems.EMPTYHEART:
                  xx = 7;
                  break;
                case ShopItems.FILLHEARTS:
                  xx = 8;
                  break;
              }
              Game.drawItem(xx, yy, 1, 2, x, y - 1, 1, 2);
            }
          }

          if (i >= 0 && i < this.shopData.buyItems.length) {
            Game.ctx.font = GameConstants.SCRIPT_FONT_SIZE + "px Script";
            Game.ctx.fillStyle = "white";

            let desc = "";
            if (this.shopData.buyItems[i].item === null) {
              switch (this.shopData.buyItems[i].shopItem) {
                case ShopItems.TORCH:
                  desc = "TORCH UPGRADE\n+2 sight radius";
                  break;
                case ShopItems.EMPTYHEART:
                  desc = "EXTRA LIFE\n+1 total hearts";
                  break;
                case ShopItems.FILLHEARTS:
                  desc = "RESTORE HEALTH\nFill all hearts";
                  break;
              }
            } else {
              desc = this.shopData.buyItems[i].item.getDescription();
            }
            let lines = desc.split("\n");
            if (this.game.player.inventory.coinCount() >= this.shopData.buyItems[i].price)
              lines.push(
                "CLICK TO BUY FOR " +
                  this.shopData.buyItems[i].price +
                  (this.shopData.buyItems[i].price === 1 ? " COIN" : " COINS")
              );
            else
              lines.push(
                "COSTS " +
                  this.shopData.buyItems[i].price +
                  (this.shopData.buyItems[i].price === 1 ? " COIN" : " COINS")
              );
            let nextY = 147;
            for (let j = 0; j < lines.length; j++) {
              nextY = this.textWrap(lines[j], 55, nextY, 162);
            }
            Game.ctx.font = GameConstants.FONT_SIZE + "px PixelFont";
          }
          break;
        case ShopState.SELLING:
          this.drawItemSlots();
          this.drawBackButton(tileX, tileY);

          for (let i = 0; i < this.game.player.inventory.items.length; i++) {
            let s = 9;

            let x = (52 + 19 * (i % s)) / GameConstants.TILESIZE;
            let y = (71 + 19 * Math.floor(i / s)) / GameConstants.TILESIZE;

            this.game.player.inventory.items[i].drawIcon(x, y);
          }

          if (i >= 0 && i < this.game.player.inventory.items.length) {
            Game.ctx.font = GameConstants.SCRIPT_FONT_SIZE + "px Script";
            Game.ctx.fillStyle = "white";
            let desc = "";
            let price = -1;
            for (const sellItem of this.shopData.sellItems) {
              if (sellItem.item.constructor === this.game.player.inventory.items[i].constructor) {
                desc = sellItem.description;
                price = sellItem.price;
              }
            }
            let lines = desc.split("\n");
            if (price !== -1)
              lines.push(
                "CLICK TO SELL FOR " +
                  price +
                  (price === 1 ? " COIN" : " COINS") +
                  (this.game.player.inventory.items[i].stackCount > 1 ? " EACH" : "")
              );
            let nextY = 147;
            for (let j = 0; j < lines.length; j++) {
              nextY = this.textWrap(lines[j], 55, nextY, 162);
            }
            Game.ctx.font = GameConstants.FONT_SIZE + "px PixelFont";
          }
          break;
      }
    }
  };
}
