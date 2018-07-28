import { Collidable } from "./collidable";
import { Player } from "../player";
import { Game } from "../game";
import { Level } from "../level";
import { BottomDoor } from "./bottomDoor";

export class Door extends Collidable {
  linkedDoor: BottomDoor;
  game: Game;
  opened: boolean;

  constructor(level: Level, game: Game, x: number, y: number, linkedDoor: BottomDoor) {
    super(level, x, y);
    this.game = game;
    this.linkedDoor = linkedDoor;
    this.opened = false;
  }

  onCollide = (player: Player) => {
    this.opened = true;
    this.game.changeLevelThroughDoor(this.linkedDoor);
  };

  draw = () => {
    if (this.opened) Game.drawTile(6, this.level.env, 1, 1, this.x, this.y, this.w, this.h);
    else Game.drawTile(3, this.level.env, 1, 1, this.x, this.y, this.w, this.h);
  };
}
