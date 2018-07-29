import { Collidable } from "./collidable";
import { Game } from "../game";
import { Level } from "../level";
import { Player } from "../player";
import { LevelConstants } from "../levelConstants";
import { SkinType } from "./tile";

export class Trapdoor extends Collidable {
  game: Game;
  skin: SkinType;

  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, x, y);
    this.game = game;
  }

  draw = () => {
    Game.drawTile(13, this.skin, 1, 1, this.x, this.y, this.w, this.h, this.isShaded());
  };

  onCollide = (player: Player) => {
    // TODO
  };
}
