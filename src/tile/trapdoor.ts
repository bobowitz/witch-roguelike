import { Game } from "../game";
import { Level } from "../level";
import { Player } from "../player";
import { LevelConstants } from "../levelConstants";
import { Tile } from "./tile";

export class Trapdoor extends Tile {
  game: Game;

  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, x, y);
    this.game = game;
  }

  draw = () => {
    Game.drawTile(13, this.skin, 1, 1, this.x, this.y, 1, 1, "black", this.shadeAmount());
  };

  onCollide = (player: Player) => {
    // TODO
  };
}
