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
  }

  tick = () => {};
  tickInInventory = () => {}; // different tick behavior for when we have the item in our inventory

  getDescription = (): string => {
    return "";
  };

  onPickup = (player: Player) => {
    player.inventory.addItem(this);
    this.level.items = this.level.items.filter(x => x !== this); // removes itself from the level
  };

  draw = () => {
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
  };
  drawIcon = (x: number, y: number) => {
    Game.drawItem(this.tileX, this.tileY, 1, 2, x, y - 1, this.w, this.h);
  };
}
