import { Collidable } from "./collidable";
import { Player } from "./player";
import { Game } from "./game";
import { Level } from "./level";

export class Door extends Collidable {
  linkedLevel: Level;
  inLevel: Level;
  game: Game;

  constructor(game: Game, inLevel: Level, x: number, y: number) {
    super(x, y);
    this.game = game;
    this.inLevel = inLevel;
    this.linkedLevel = null;
  }

  onCollide = (player: Player) => {
    if (this.linkedLevel === null) this.linkedLevel = new Level(this.game, this);
    this.game.changeLevel(this.linkedLevel);
  };

  draw = () => {
    Game.drawTile(3, 0, 1, 1, this.x, this.y, this.w, this.h);
  };
}
