import { Enemy } from "./enemy";
import { LevelConstants } from "./levelConstants";
import { Game } from "./game";
import { Level } from "./level";
import { astar } from "./astarclass";
import { HealthBar } from "./healthbar";

export class KnightEnemy extends Enemy {
  game: Game;
  level: Level;
  moves: Array<astar.AStarData>;
  ticks: number;
  healthBar: HealthBar;

  constructor(game: Game, level: Level, x: number, y: number) {
    super(x, y);
    this.game = game;
    this.level = level;
    this.moves = new Array<astar.AStarData>();
    this.ticks = 0;
    this.healthBar = new HealthBar(2);
  }

  tick = () => {
    if (!this.dead) {
      this.ticks++;
      if (this.ticks % 2 === 0) {
        let oldX = this.x;
        let oldY = this.y;
        this.moves = astar.AStar.search(this.level.levelArray, this, this.game.player);
        if (this.moves.length > 0) {
          if (
            this.game.player.x === this.moves[0].pos.x &&
            this.game.player.y === this.moves[0].pos.y
          ) {
            this.game.player.hurt(1);
          } else {
            this.x = this.moves[0].pos.x;
            this.y = this.moves[0].pos.y;
          }
        }
        this.drawX = this.x - oldX;
        this.drawY = this.y - oldY;
      }
    }

    if (this.healthBar.health <= 0) {
      this.dead = true;
      this.x = -10;
      this.y = -10;
    }
  };

  hurt = (damage: number) => {
    this.healthBar.hurt(damage);
  };

  draw = () => {
    if (!this.dead) {
      this.drawX += -0.5 * this.drawX;
      this.drawY += -0.5 * this.drawY;
      Game.drawTile(3, 1, 1, 2, this.x - this.drawX, this.y - 1.5 - this.drawY, 1, 2);
    }
    this.healthBar.drawAboveTile(this.x - this.drawX, this.y - 0.75 - this.drawY);
  };
}
