import { Game } from "../game";
import { GameConstants } from "../gameConstants";
import { LevelConstants } from "../levelConstants";
import { Player } from "../player";
import { Level } from "../level";

export class Item {
  x: number;
  y: number;
  w: number;
  h: number;
  tileX: number;
  tileY: number;
  frame: number;
  dead: boolean; // for inventory, just a removal flag
  level: Level;
  stackable: boolean;
  stackCount: number;
  pickedUp: boolean;
  alpha: number;

  constructor(level: Level, x: number, y: number) {
    this.level = level;
    this.x = x;
    this.y = y;
    this.w = 1;
    this.h = 2;
    this.tileX = 0;
    this.tileY = 0;
    this.frame = 0;
    this.dead = false;
    this.stackable = false;
    this.stackCount = 1;
    this.pickedUp = false;
    this.alpha = 1;
  }

  tick = () => {};
  tickInInventory = () => {}; // different tick behavior for when we have the item in our inventory

  getDescription = (): string => {
    return "";
  };

  onPickup = (player: Player) => {
    if (!this.pickedUp) {
      this.pickedUp = true;
      player.inventory.addItem(this);
    }
  };

  draw = () => {
    if (!this.pickedUp) {
      Game.drawItem(0, 0, 1, 1, this.x, this.y, 1, 1);
      this.frame += (Math.PI * 2) / 60;
      Game.drawItem(
        this.tileX,
        this.tileY,
        1,
        2,
        this.x,
        this.y + Math.sin(this.frame) * 0.07 - 1,
        this.w,
        this.h
      );
    }
  };
  drawTopLayer = () => {
    if (this.pickedUp) {
      this.y -= 0.125;
      this.alpha -= 0.03;
      if (this.y < -1) this.level.items = this.level.items.filter(x => x !== this); // removes itself from the level

      Game.ctx.globalAlpha = Math.max(0, this.alpha);

      Game.drawItem(this.tileX, this.tileY, 1, 2, this.x, this.y - 1, this.w, this.h);

      Game.ctx.globalAlpha = 1.0;
    }
  };
  drawIcon = (x: number, y: number) => {
    Game.drawItem(this.tileX, this.tileY, 1, 2, x, y - 1, this.w, this.h);
  };
}
