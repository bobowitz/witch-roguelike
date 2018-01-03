import { Collidable } from "./collidable";
import { Player } from "../player";
import { Level } from "../level";
import { Game } from "../game";
import { Door } from "./door";
import { Key } from "../item/key";
import { GoldenKey } from "../item/goldenKey";

export class UnlockedGoldenDoor extends Collidable {
  game: Game;

  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, x, y);
    this.game = game;
  }

  draw = () => {
    Game.drawTile(6, this.level.env, 1, 1, this.x, this.y, this.w, this.h);
  };

  onCollide = (player: Player) => {
    this.game.changeLevel(new Level(this.game, null, false, true, 0, this.level.env + 1, this.level.difficulty + 1));
  };
}
