import { Enemy } from "./enemy";
import { LevelConstants } from "../levelConstants";
import { Game } from "../game";
import { Level } from "../level";
import { astar } from "../astarclass";
import { HealthBar } from "../healthbar";
import { Potion } from "../item/potion";
import { Floor } from "../tile/floor";
import { Bones } from "../tile/bones";

export class SkullEnemy extends Enemy {
  level: Level;
  moves: Array<astar.AStarData>;
  ticks: number;
  healthBar: HealthBar;

  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, game, x, y);
    this.level = level;
    this.moves = new Array<astar.AStarData>();
    this.ticks = 0;
    this.healthBar = new HealthBar(20);
  }

  hit = (): number => {
    return Game.randTable([4, 5, 5, 5, 5, 5, 5, 6, 7, 8]);
  };

  tick = () => {
    this.ticks++;
    if (this.ticks % 2 === 0) {
      if (!this.dead) {
        let oldX = this.x;
        let oldY = this.y;
        this.moves = astar.AStar.search(this.level.levelArray, this, this.game.player);
        if (this.moves.length > 1) {
          if (
            this.game.player.x === this.moves[1].pos.x &&
            this.game.player.y === this.moves[1].pos.y
          ) {
            if (this.game.level.getCollidable(this.moves[0].pos.x, this.moves[0].pos.y) === null) {
              this.x = this.moves[0].pos.x;
              this.y = this.moves[0].pos.y;
            }
            this.game.player.hurt(this.hit());
          } else {
            this.tryTwoMoves(
              this.moves[0].pos.x,
              this.moves[0].pos.y,
              this.moves[1].pos.x,
              this.moves[1].pos.y
            );
          }
        } else if (this.moves.length > 0) {
          if (
            this.game.player.x === this.moves[0].pos.x &&
            this.game.player.y === this.moves[0].pos.y
          ) {
            this.game.player.hurt(this.hit());
          } else {
            this.tryMove(this.moves[0].pos.x, this.moves[0].pos.y);
          }
        }
        this.drawX = this.x - oldX;
        this.drawY = this.y - oldY;
      }
    }

    if (this.healthBar.health <= 0) {
      this.kill();
    }
  };

  tryTwoMoves = (x1: number, y1: number, x2: number, y2: number) => {
    for (const e of this.level.enemies) {
      if (e !== this && ((e.x === x1 && e.y === y1) || (e.x === x2 && e.y === y2))) {
        return;
      }
    }
    if (
      this.game.level.getCollidable(x1, y1) === null &&
      this.game.level.getCollidable(x2, y2) === null
    ) {
      this.x = x2;
      this.y = y2;
    }
  };

  hurt = (damage: number) => {
    this.healthBar.hurt(damage);
  };

  kill = () => {
    this.level.levelArray[this.x][this.y] = new Bones(this.level, this.x, this.y);
    this.dead = true;
    if (Game.rand(1, 2) === 1) this.level.items.push(new Potion(this.x, this.y));
    this.x = -10;
    this.y = -10;
  };

  draw = () => {
    if (!this.dead) {
      this.drawX += -0.5 * this.drawX;
      this.drawY += -0.5 * this.drawY;
      Game.drawMob(0, 0, 1, 1, this.x - this.drawX, this.y - this.drawY, 1, 1);
      Game.drawMob(2, 0, 1, 2, this.x - this.drawX, this.y - 1.5 - this.drawY, 1, 2);
    }
  };

  drawTopLayer = () => {
    this.healthBar.drawAboveTile(this.x - this.drawX + 0.5, this.y - 0.75 - this.drawY);
  };
}
