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
import { Coin } from "../item/coin";
import { RedGem } from "../item/redgem";

export class SkullEnemy extends Enemy {
  frame: number;
  ticks: number;
  seenPlayer: boolean;
  ticksSinceFirstHit: number;
  flashingFrame: number;
  dx: number;
  dy: number;
  readonly REGEN_TICKS = 5;

  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, game, x, y);
    this.ticks = 0;
    this.frame = 0;
    this.health = 2;
    this.maxHealth = 2;
    this.tileX = 5;
    this.tileY = 8;
    this.seenPlayer = false;
    this.ticksSinceFirstHit = 0;
    this.flashingFrame = 0;
    this.dx = 0;
    this.dy = 0;
    this.deathParticleColor = "#ffffff";
  }

  hit = (): number => {
    return 1;
  };

  hurt = (damage: number) => {
    this.ticksSinceFirstHit = 0;
    this.health -= damage;
    this.healthBar.hurt();
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
      if (this.health <= 1) {
        this.ticksSinceFirstHit++;
        if (this.ticksSinceFirstHit >= this.REGEN_TICKS) {
          this.health = 2;
        }
      } else {
        if (this.seenPlayer || this.seesPlayer()) {
          this.seenPlayer = true;
          let oldX = this.x;
          let oldY = this.y;
          if (this.game.player.x > this.x) this.dx++;
          if (this.game.player.x < this.x) this.dx--;
          if (this.game.player.y > this.y) this.dy++;
          if (this.game.player.y < this.y) this.dy--;
          let moveX = this.x;
          let moveY = this.y;
          if (
            Math.abs(this.dx) > Math.abs(this.dy) ||
            (this.dx === this.dy &&
              Math.abs(this.game.player.x - this.x) >= Math.abs(this.game.player.y - this.y))
          ) {
            if (this.dx > 0) {
              moveX++;
              this.dx--;
            } else if (this.dx < 0) {
              moveX--;
              this.dx++;
            }
          } else {
            if (this.dy > 0) {
              moveY++;
              this.dy--;
            } else if (this.dy < 0) {
              moveY--;
              this.dy++;
            }
          }

          if (this.game.player.x === moveX && this.game.player.y === moveY) {
            this.game.player.hurt(this.hit());
            this.dx = 0;
            this.dy = 0;
            this.drawX = 0.5 * (this.x - this.game.player.x);
            this.drawY = 0.5 * (this.y - this.game.player.y);
            this.game.shakeScreen(10 * this.drawX, 10 * this.drawY);
          } else {
            this.tryMove(moveX, moveY);
            if (this.x === oldX && this.y === oldY) {
              // didn't move
              this.dx = 0;
              this.dy = 0;
            }
            this.drawX = this.x - oldX;
            this.drawY = this.y - oldY;
            if (this.x > oldX) this.direction = EnemyDirection.RIGHT;
            else if (this.x < oldX) this.direction = EnemyDirection.LEFT;
            else if (this.y > oldY) this.direction = EnemyDirection.DOWN;
            else if (this.y < oldY) this.direction = EnemyDirection.UP;
          }

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
      this.tileX = 5;
      this.tileY = 8;
      if (this.health <= 1) {
        this.tileX = 3;
        this.tileY = 0;
        if (this.ticksSinceFirstHit >= 3) {
          this.flashingFrame += 0.1;
          if (Math.floor(this.flashingFrame) % 2 === 0) {
            this.tileX = 2;
          }
        }
      }

      this.frame += 0.1;
      if (this.frame >= 4) this.frame = 0;

      if (this.health > 1 && this.doneMoving() && this.game.player.doneMoving()) this.facePlayer();
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
          this.level.shadeColor,
          this.shadeAmount()
        );
      Game.drawMob(
        this.tileX + (this.tileX === 5 ? Math.floor(this.frame) : 0),
        this.tileY + this.direction * 2,
        1,
        2,
        this.x - this.drawX,
        this.y - 1.5 - this.drawY,
        1,
        2,
        this.level.shadeColor,
        this.shadeAmount()
      );
    }
  };

  dropLoot = () => {
    if (Math.random() < 0.02) this.level.items.push(new RedGem(this.level, this.x, this.y));
    else this.level.items.push(new Coin(this.level, this.x, this.y));
  };
}
