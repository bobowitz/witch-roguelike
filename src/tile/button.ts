import { Game } from "../game";
import { Tile, SkinType } from "./tile";
import { Level } from "../level";
import { Player } from "../player";
import { InsideLevelDoor } from "./insideLevelDoor";
import { Enemy } from "../enemy/enemy";

export class Button extends Tile {
  // all are in grid units
  w: number;
  h: number;
  pressed: boolean;
  turnsSincePressed: number;
  linkedDoor: InsideLevelDoor;

  constructor(level: Level, x: number, y: number, linkedDoor: InsideLevelDoor) {
    super(level, x, y);
    this.w = 1;
    this.h = 1;

    this.pressed = false;
    this.turnsSincePressed = 1;

    this.linkedDoor = linkedDoor;
  }

  press = () => {
    this.pressed = true;
    this.linkedDoor.opened = true;
  };

  unpress = () => {
    this.pressed = false;
    this.linkedDoor.opened = false;
  };

  /*onCollide = (player: Player) => {
    this.press();
  };

  onCollideEnemy = (enemy: Enemy) => {
    this.press();
  };*/

  tickEnd = () => {
    this.unpress();
    if (this.level.game.player.x === this.x && this.level.game.player.y === this.y) this.press();
    for (const e of this.level.enemies) {
      if (e.x === this.x && e.y === this.y) this.press();
    }
  };

  draw = () => {
    Game.drawTile(1, 0, 1, 1, this.x, this.y, 1, 1, "black", this.shadeAmount());
    if (this.pressed) Game.drawTile(18, 0, 1, 1, this.x, this.y, this.w, this.h, "black", this.shadeAmount());
    else Game.drawTile(17, 0, 1, 1, this.x, this.y, this.w, this.h, "black", this.shadeAmount());
  };
}
