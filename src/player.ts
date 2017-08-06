import { Key } from "./key";
import { GameConstants } from "./gameConstants";
import { Game } from "./game";
import { Door } from "./door";
import { BottomDoor } from "./bottomDoor";
import { Trapdoor } from "./trapdoor";

export class Player {
  x: number;
  y: number;
  w: number;
  h: number;
  drawX: number;
  drawY: number;
  game: Game;

  constructor(game: Game, x: number, y: number) {
    this.game = game;

    this.x = x;
    this.y = y;

    Key.leftListener = this.leftListener;
    Key.rightListener = this.rightListener;
    Key.upListener = this.upListener;
    Key.downListener = this.downListener;
  }

  leftListener = () => {
    this.tryMove(this.x - 1, this.y);
  };
  rightListener = () => {
    this.tryMove(this.x + 1, this.y);
  };
  upListener = () => {
    this.tryMove(this.x, this.y - 1);
  };
  downListener = () => {
    this.tryMove(this.x, this.y + 1);
  };

  tryMove = (x: number, y: number) => {
    let other = this.game.level.getCollidable(x, y);
    if (other === null) {
      this.move(x, y);
      this.game.level.tick();
    } else {
      if (other instanceof Door || other instanceof BottomDoor || other instanceof Trapdoor) {
        this.move(x, y);
        this.game.level.tick();
      }
      other.onCollide(this);
    }
  };

  move = (x: number, y: number) => {
    this.drawX = x - this.x;
    this.drawY = y - this.y;
    this.x = x;
    this.y = y;
  };

  moveNoSmooth = (x: number, y: number) => {
    this.x = x;
    this.y = y;
    this.drawX = 0;
    this.drawY = 0;
  };

  update = () => {};

  draw = () => {
    this.drawX += -0.5 * this.drawX;
    this.drawY += -0.5 * this.drawY;
    Game.drawTile(0, 1, 1, 2, this.x - this.drawX, this.y - 1.5 - this.drawY, 1, 2);
  };
}
