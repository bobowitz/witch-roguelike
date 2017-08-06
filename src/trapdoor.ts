import { Collidable } from "./collidable";
import { Game } from "./game";
import { Level } from "./level";

export class Trapdoor extends Collidable {
  game: Game;

  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, x, y);
    this.game = game;
  }

  draw = () => {
    Game.drawTile(13, this.level.env, 1, 1, this.x, this.y, this.w, this.h);
  };

  onCollide = () => {
    this.game.changeLevel(new Level(this.game, null));
  };
}
