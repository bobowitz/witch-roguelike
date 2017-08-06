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
    this.x = x;
    this.y = y;
  };

  update = () => {};

  draw = () => {
    Game.drawTile(0, 1, 1, 2, this.x, this.y - 1.5, 1, 2);
  };
}
