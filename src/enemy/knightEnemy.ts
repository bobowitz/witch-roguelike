import { Enemy } from "./enemy";
import { LevelConstants } from "../levelConstants";
import { Game } from "../game";
import { Level } from "../level";
import { astar } from "../astarclass";
import { Heart } from "../item/heart";
import { Floor } from "../tile/floor";
import { Bones } from "../tile/bones";
import { DeathParticle } from "../particle/deathParticle";
import { GameConstants } from "../gameConstants";

export class KnightEnemy extends Enemy {
  moves: Array<astar.AStarData>;
  ticks: number;
  seenPlayer: boolean;

  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, game, x, y);
    this.moves = new Array<astar.AStarData>(); // empty move list
    this.ticks = 0;
    this.health = 1;
    this.tileX = 4;
    this.tileY = 0;
    this.seenPlayer = false;
  }

  hit = (): number => {
    return 1;
  };

  tick = () => {
    if (!this.dead) {
      this.ticks++;
      this.tileX = 5;
      if (this.ticks % 2 === 0) {
        this.tileX = 4;
        if (this.seenPlayer || this.level.visibilityArray[this.x][this.y] > 0) {
          // visible to player, chase them

          // now that we've seen the player, we can keep chasing them even if we lose line of sight
          this.seenPlayer = true;
          let oldX = this.x;
          let oldY = this.y;
          let enemyPositions = Array<astar.Position>();
          for (const e of this.level.enemies) {
            if (e !== this) {
              enemyPositions.push({ x: e.x, y: e.y });
            }
          }
          this.moves = astar.AStar.search(
            this.level.levelArray,
            this,
            this.game.player,
            enemyPositions
          );
          if (this.moves.length > 0) {
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
    }
  };

  dropXP = () => {
    return Game.randTable([4, 5, 5, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 10]);
  };
}
