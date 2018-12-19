import { Player } from "../player";
import { Game } from "../game";
import { Level } from "../level";
import { BottomDoor } from "./bottomDoor";
import { GameConstants } from "../gameConstants";
import { SkinType, Tile } from "./tile";
import { DownLadder } from "./downLadder";

export class UpLadder extends Tile {
  linkedLadder: DownLadder;
  game: Game;

  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, x, y);
    this.game = game;
  }

  onCollide = (player: Player) => {
    this.game.changeLevelThroughLadder(this.linkedLadder);
  };

  draw = () => {
    Game.drawTile(29, 0, 1, 1, this.x, this.y - 1, 1, 1, this.isShaded());
    Game.drawTile(29, 1, 1, 1, this.x, this.y, 1, 1, this.isShaded());
  };

  drawAbovePlayer = () => {};
}
