import { Enemy } from "./enemy";
import { LevelConstants } from "../levelConstants";
import { Game } from "../game";
import { Level } from "../level";
import { astar } from "../astarclass";
import { Heart } from "../item/heart";
import { Floor } from "../tile/floor";
import { Bones } from "../tile/bones";
import { GameConstants } from "../gameConstants";
import { Player } from "../player";
import { DeathParticle } from "../particle/deathParticle";

export class SkullEnemy extends Enemy {
  moves: Array<astar.AStarData>;
  ticks: number;
  seenPlayer: boolean;
  ticksSinceFirstHit: number;
  flashingFrame: number;
  readonly REGEN_TICKS = 5;

  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, game, x, y);
    this.moves = new Array<astar.AStarData>(); // empty move list
    this.ticks = 0;
    this.health = 2;
    this.tileX = 2;
    this.tileY = 0;
    this.seenPlayer = false;
    this.ticksSinceFirstHit = 0;
    this.flashingFrame = 0;
  }

  hit = (): number => {
    return 1;
  };

  hurt = (damage: number) => {
    this.ticksSinceFirstHit = 0;
    this.health -= damage;
    if (this.health <= 0) {
      this.kill();
    }
  };

  tick = () => {
    if (!this.dead) {
      if (this.skipNextTurns > 0) {
        this.skipNextTurns--;
        return;
      }
      if (this.health === 1) {
        this.ticksSinceFirstHit++;
        if (this.ticksSinceFirstHit >= this.REGEN_TICKS) {
          this.health = 2;
        }
      } else {
        if (this.seenPlayer || this.level.visibilityArray[this.x][this.y] > 0) {
          this.seenPlayer = true;
          let oldX = this.x;
          let oldY = this.y;
          let enemyPositions = new Array<astar.Position>();
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

  draw = () => {
    if (!this.dead) {
      this.tileX = 2;
      if (this.health === 1) {
        this.tileX = 3;
        if (this.ticksSinceFirstHit >= 3) {
          this.flashingFrame += 0.1;
          if (Math.floor(this.flashingFrame) % 2 === 0) {
            this.tileX = 2;
          } else {
            this.tileX = 3;
          }
        }
      }

      let darkOffset =
        this.level.visibilityArray[this.x][this.y] <= LevelConstants.VISIBILITY_CUTOFF &&
        this.hasDarkVersion
          ? 2
          : 0;
      this.drawX += -0.5 * this.drawX;
      this.drawY += -0.5 * this.drawY;
      if (this.hasShadow) Game.drawMob(0, 0, 1, 1, this.x - this.drawX, this.y - this.drawY, 1, 1);
      Game.drawMob(
        this.tileX,
        this.tileY + darkOffset,
        1,
        2,
        this.x - this.drawX,
        this.y - 1.5 - this.drawY,
        1,
        2
      );
    }
  };
}
