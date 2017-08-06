import { Collidable } from "./collidable";
import { Game } from "./game";
import { Level } from "./level";
import { Door } from "./door";

export class BottomDoor extends Collidable {
  linkedTopDoor: Door;
  game: Game;

  constructor(game: Game, linkedTopDoor: Door, x: number, y: number) {
    super(x, y);
    this.game = game;
    this.linkedTopDoor = linkedTopDoor;
  }

  onCollide = () => {
    this.game.changeLevelThroughDoor(this.linkedTopDoor);
  };

  draw = () => {
    Game.drawTile(1, 0, 1, 1, this.x, this.y, this.w, this.h);
  };
}
