import { Collidable } from "./collidable";
import { Game } from "./game";
import { Level } from "./level";
import { Door } from "./door";
import { Player } from "./player";

export class BottomDoor extends Collidable {
  linkedTopDoor: Door;
  game: Game;

  constructor(level: Level, game: Game, linkedTopDoor: Door, x: number, y: number) {
    super(level, x, y);
    this.game = game;
    this.linkedTopDoor = linkedTopDoor;
  }

  onCollide = (player: Player) => {
    this.game.changeLevelThroughDoor(this.linkedTopDoor);
  };

  draw = () => {
    Game.drawTile(1, this.level.env, 1, 1, this.x, this.y, this.w, this.h);
  };
}
