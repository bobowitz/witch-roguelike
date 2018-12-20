import { Game } from "../game";
import { Level } from "../level";
import { Door } from "./door";
import { Player } from "../player";
import { GameConstants } from "../gameConstants";
import { Tile } from "./tile";

export class BottomDoor extends Tile {
  linkedDoor: Door;
  game: Game;

  constructor(level: Level, game: Game, x: number, y: number, linkedDoor: Door) {
    super(level, x, y);
    this.game = game;
    this.linkedDoor = linkedDoor;
  }

  canCrushEnemy = (): boolean => {
    return true;
  };

  onCollide = (player: Player) => {
    this.game.changeLevelThroughDoor(this.linkedDoor);
  };

  drawAboveShading = () => {
    Game.drawFX(2, 2, 1, 1, this.x, this.y - 1.25 + 0.125 * Math.sin(0.006 * Date.now()), 1, 1);
  };
}
