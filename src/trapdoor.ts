import { Collidable } from "./collidable";
import { Game } from "./game";
import { Level } from "./level";

export class Trapdoor extends Collidable {
  game: Game;

  constructor(game: Game, x: number, y: number) {
    super(x, y);
    this.game = game;
  }

  draw = () => {
    Game.drawTile(13, 0, 1, 1, this.x, this.y, this.w, this.h);
  };

  onCollide = () => {
    this.game.changeLevel(new Level(this.game, null));
  };
}
