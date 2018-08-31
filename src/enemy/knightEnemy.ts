import { Enemy, EnemyDirection } from "./enemy";
import { LevelConstants } from "../levelConstants";
import { Game } from "../game";
import { Level } from "../level";
import { astar } from "../astarclass";
import { Heart } from "../item/heart";
import { Floor } from "../tile/floor";
import { Bones } from "../tile/bones";
import { DeathParticle } from "../particle/deathParticle";
import { GameConstants } from "../gameConstants";
import { HitWarning } from "../projectile/hitWarning";
import { Gem } from "../item/gem";
import { SpikeTrap } from "../tile/spiketrap";

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
      if (this.skipNextTurns > 0) {
        this.skipNextTurns--;
        return;
      }
      this.ticks++;
      this.tileX = 5;
      if (this.seenPlayer || this.level.visibilityArray[this.x][this.y] > 0) {
        if (this.ticks % 2 === 0) {
          this.tileX = 4;
          // visible to player, chase them

          // now that we've seen the player, we can keep chasing them even if we lose line of sight
          this.seenPlayer = true;
          let oldX = this.x;
          let oldY = this.y;
          let disablePositions = Array<astar.Position>();
          for (const e of this.level.enemies) {
            if (e !== this) {
              disablePositions.push({ x: e.x, y: e.y } as astar.Position);
            }
          }
          for (let xx = this.x - 1; xx <= this.x + 1; xx++) {
            for (let yy = this.y - 1; yy <= this.y + 1; yy++) {
              if (
                this.level.levelArray[xx][yy] instanceof SpikeTrap &&
                (this.level.levelArray[xx][yy] as SpikeTrap).on
              ) {
                // don't walk on active spiketraps
                disablePositions.push({ x: xx, y: yy } as astar.Position);
              }
            }
          }
          this.moves = astar.AStar.search(
            this.level.levelArray,
            this,
            this.game.player,
            disablePositions
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
          if (this.x > oldX) this.direction = EnemyDirection.RIGHT;
          else if (this.x < oldX) this.direction = EnemyDirection.LEFT;
          else if (this.y > oldY) this.direction = EnemyDirection.DOWN;
          else if (this.y < oldY) this.direction = EnemyDirection.UP;
        } else {
          this.level.projectiles.push(new HitWarning(this.x - 1, this.y));
          this.level.projectiles.push(new HitWarning(this.x + 1, this.y));
          this.level.projectiles.push(new HitWarning(this.x, this.y - 1));
          this.level.projectiles.push(new HitWarning(this.x, this.y + 1));
        }
      }
    }
  };

  draw = () => {
    if (!this.dead) {
      this.drawX += -0.5 * this.drawX;
      this.drawY += -0.5 * this.drawY;
      if (this.doneMoving() && this.game.player.doneMoving()) this.facePlayer();
      if (this.hasShadow)
        Game.drawMob(0, 0, 1, 1, this.x - this.drawX, this.y - this.drawY, 1, 1, this.isShaded());
      Game.drawMob(
        this.tileX,
        this.tileY + this.direction * 2,
        1,
        2,
        this.x - this.drawX,
        this.y - 1.5 - this.drawY,
        1,
        2,
        this.isShaded()
      );
    }
  };

  dropLoot = () => {
    this.game.level.items.push(new Gem(this.level, this.x, this.y));
  };
}
