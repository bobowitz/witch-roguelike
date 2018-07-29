import { Collidable } from "./collidable";
import { Game } from "../game";
import { Level } from "../level";
import { Door } from "./door";
import { Player } from "../player";

export class BottomDoor extends Collidable {
  linkedDoor: Door;
  game: Game;

  constructor(level: Level, game: Game, x: number, y: number, linkedDoor: Door) {
    super(level, x, y);
    this.game = game;
    this.linkedDoor = linkedDoor;
  }

  onCollide = (player: Player) => {
    this.game.changeLevelThroughDoor(this.linkedDoor);
  };

  draw = () => {
    Game.drawTile(1, this.level.env, 1, 1, this.x, this.y, this.w, this.h, this.isShaded());
  };
}
