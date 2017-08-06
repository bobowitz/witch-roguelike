import { Enemy } from "./enemy";
import { LevelConstants } from "./levelConstants";
import { Game } from "./game";
import { Level } from "./level";
import { astar } from "./astarclass";

export class KnightEnemy extends Enemy {
  game: Game;
  level: Level;
  moves: Array<astar.AStarData>;
  ticks: number;

  constructor(game: Game, level: Level, x: number, y: number) {
    super(x, y);
    this.game = game;
    this.level = level;
    this.moves = new Array<astar.AStarData>();
    this.ticks = 0;
  }

  tick = () => {
    this.ticks++;
    if (this.ticks % 2 === 0) {
      let oldX = this.x;
      let oldY = this.y;
      this.moves = astar.AStar.search(this.level.levelArray, this, this.game.player);
      if (
        this.moves.length > 0 &&
        !(this.game.player.x === this.moves[0].pos.x && this.game.player.y === this.moves[0].pos.y)
      ) {
        this.x = this.moves[0].pos.x;
        this.y = this.moves[0].pos.y;
      }
      this.drawX = this.x - oldX;
      this.drawY = this.y - oldY;
    }
  };

  draw = () => {
    this.drawX += -0.5 * this.drawX;
    this.drawY += -0.5 * this.drawY;
    Game.drawTile(1, 1, 1, 2, this.x - this.drawX, this.y - 1.5 - this.drawY, 1, 2);
  };
}
