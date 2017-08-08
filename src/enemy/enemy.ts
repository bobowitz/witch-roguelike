import { Collidable } from "../tile/collidable";
import { Game } from "../game";
import { Level } from "../level";

export class Enemy extends Collidable {
  drawX: number;
  drawY: number;
  dead: boolean;
  game: Game;

  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, x, y);
    this.game = game;
    this.drawX = 0;
    this.drawY = 0;
  }

  tryMove = (x: number, y: number) => {
    for (const e of this.level.enemies) {
      if (e !== this && e.x === x && e.y === y) {
        return;
      }
    }
    if (this.game.level.getCollidable(x, y) === null) {
      this.x = x;
      this.y = y;
    }
  };

  hurt = (damage: number) => {};

  draw = () => {
    Game.drawMob(0, 0, 1, 1, this.x - this.drawX, this.y - this.drawY, 1, 1);
  };
  tick = () => {};
  drawTopLayer = () => {};
}
