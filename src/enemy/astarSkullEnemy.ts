import { Enemy, EnemyDirection } from "./enemy";
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
import { HitWarning } from "../projectile/hitWarning";
import { GreenGem } from "../item/greengem";
import { SpikeTrap } from "../tile/spiketrap";
import { GenericParticle } from "../particle/genericParticle";

export class AStarSkullEnemy extends Enemy {
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
    this.seenPlayer = true;
    this.ticksSinceFirstHit = 0;
    this.flashingFrame = 0;
    this.deathParticleColor = "#ffffff";
  }

  hit = (): number => {
    return 1;
  };

  hurt = (damage: number) => {
    this.ticksSinceFirstHit = 0;
    this.health -= damage;
    if (this.health <= 0) {
      this.kill();
    } else {
      GenericParticle.spawnCluster(this.level, this.x + 0.5, this.y + 0.5, this.deathParticleColor);
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
        if (this.seenPlayer || this.level.softVis[this.x][this.y] < 1) {
          this.seenPlayer = true;
          let oldX = this.x;
          let oldY = this.y;
          let disablePositions = new Array<astar.Position>();
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
            this.game.players[this.game.localPlayerID],
            disablePositions
          );
          if (this.moves.length > 0) {
            if (
              this.game.players[this.game.localPlayerID].x === this.moves[0].pos.x &&
              this.game.players[this.game.localPlayerID].y === this.moves[0].pos.y
            ) {
              this.game.players[this.game.localPlayerID].hurt(this.hit());
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

          this.level.projectiles.push(new HitWarning(this.game, this.x - 1, this.y));
          this.level.projectiles.push(new HitWarning(this.game, this.x + 1, this.y));
          this.level.projectiles.push(new HitWarning(this.game, this.x, this.y - 1));
          this.level.projectiles.push(new HitWarning(this.game, this.x, this.y + 1));
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

      this.drawX += -0.5 * this.drawX;
      this.drawY += -0.5 * this.drawY;
      if (this.health === 2 && this.doneMoving() && this.game.players[this.game.localPlayerID].doneMoving())
        this.facePlayer();
      if (this.hasShadow)
        Game.drawMob(
          0,
          0,
          1,
          1,
          this.x - this.drawX,
          this.y - this.drawY,
          1,
          1,
          "black",
          this.shadeAmount()
        );
      Game.drawMob(
        this.tileX,
        this.tileY + this.direction * 2,
        1,
        2,
        this.x - this.drawX,
        this.y - 1.5 - this.drawY,
        1,
        2,
        "black",
        this.shadeAmount()
      );
    }
  };

  dropLoot = () => {
    this.level.items.push(new GreenGem(this.level, this.x, this.y));
  };
}
