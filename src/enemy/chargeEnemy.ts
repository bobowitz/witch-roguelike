import { Enemy, EnemyDirection } from "./enemy";
import { Game } from "../game";
import { Level } from "../level";
import { HitWarning } from "../hitWarning";
import { Coin } from "../item/coin";
import { Door } from "../tile/door";
import { BottomDoor } from "../tile/bottomDoor";
import { GenericParticle } from "../particle/genericParticle";

export enum ChargeEnemyState {
  IDLE,
  ALERTED,
  CHARGING,
}

export class ChargeEnemy extends Enemy {
  targetX: number;
  targetY: number;
  ticks: number;
  frame: number;
  seenPlayer: boolean;
  state: ChargeEnemyState;

  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, game, x, y);
    this.ticks = 0;
    this.frame = 0;
    this.health = 1;
    this.maxHealth = 1;
    this.tileX = 17;
    this.tileY = 8;
    this.seenPlayer = true;
    this.deathParticleColor = "#ffffff";

    this.state = ChargeEnemyState.IDLE;
  }

  hit = (): number => {
    return 0.5;
  };

  canMoveOver = (x: number, y: number): boolean => {
    for (const e of this.level.enemies) {
      if (e !== this && x === e.x && y === e.y) return false;
    }
    let t = this.level.levelArray[x][y];
    return !(t.isSolid() || (t instanceof Door || t instanceof BottomDoor));
  };

  tick = () => {
    if (!this.dead) {
      if (this.skipNextTurns > 0) {
        this.skipNextTurns--;
        return;
      }
      this.ticks++;
      if (this.seenPlayer || this.level.softVis[this.x][this.y] < 1) {
        this.seenPlayer = true;
        if (this.state === ChargeEnemyState.IDLE) {
          let blocked = false;
          let dx = 0;
          let dy = 0;
          if (this.x === this.game.players[this.game.localPlayerID].x) {
            if (this.y < this.game.players[this.game.localPlayerID].y) dy = 1;
            else dy = -1;
            for (let yy = this.y; yy !== this.game.players[this.game.localPlayerID].y; yy += dy) {
              if (!this.canMoveOver(this.x, yy)) blocked = true;
            }
          } else if (this.y === this.game.players[this.game.localPlayerID].y) {
            if (this.x < this.game.players[this.game.localPlayerID].x) dx = 1;
            else dx = -1;
            for (let xx = this.x; xx !== this.game.players[this.game.localPlayerID].x; xx += dx) {
              if (!this.canMoveOver(xx, this.y)) blocked = true;
            }
          }
          if ((dx !== 0 || dy !== 0) && !blocked) {
            this.state = ChargeEnemyState.ALERTED;
            this.targetX = this.x;
            this.targetY = this.y;
            while (this.canMoveOver(this.targetX + dx, this.targetY + dy)) {
              this.targetX += dx;
              this.targetY += dy;
              if (
                (this.targetX === this.game.players[this.game.localPlayerID].x && this.targetY === this.game.players[this.game.localPlayerID].y) ||
                (this.targetX === this.game.players[this.game.localPlayerID].x - 1 && this.targetY === this.game.players[this.game.localPlayerID].y) ||
                (this.targetX === this.game.players[this.game.localPlayerID].x + 1 && this.targetY === this.game.players[this.game.localPlayerID].y) ||
                (this.targetX === this.game.players[this.game.localPlayerID].x && this.targetY === this.game.players[this.game.localPlayerID].y - 1) ||
                (this.targetX === this.game.players[this.game.localPlayerID].x && this.targetY === this.game.players[this.game.localPlayerID].y + 1)
              )
                this.level.hitwarnings.push(new HitWarning(this.game, this.targetX, this.targetY));
            }
          }
        } else if (this.state === ChargeEnemyState.ALERTED) {
          this.state = ChargeEnemyState.CHARGING;

          if (
            (this.y === this.game.players[this.game.localPlayerID].y &&
              ((this.x < this.game.players[this.game.localPlayerID].x && this.game.players[this.game.localPlayerID].x <= this.targetX) ||
                (this.targetX <= this.game.players[this.game.localPlayerID].x && this.game.players[this.game.localPlayerID].x < this.x))) ||
            (this.x === this.game.players[this.game.localPlayerID].x &&
              ((this.y < this.game.players[this.game.localPlayerID].y && this.game.players[this.game.localPlayerID].y <= this.targetY) ||
                (this.targetY <= this.game.players[this.game.localPlayerID].y && this.game.players[this.game.localPlayerID].y < this.y)))
          ) {
            this.game.players[this.game.localPlayerID].hurt(0.5);
          }

          this.drawX = this.targetX - this.x;
          this.drawY = this.targetY - this.y;
          this.x = this.targetX;
          this.y = this.targetY;
        } else if (this.state === ChargeEnemyState.CHARGING) {
          this.state = ChargeEnemyState.IDLE;
        }
      }
    }
  };

  draw = () => {
    if (!this.dead) {
      this.frame += 0.1;
      if (this.frame >= 4) this.frame = 0;

      if (
        (this.state === ChargeEnemyState.CHARGING && Math.abs(this.drawX) > 0.1) ||
        Math.abs(this.drawY) > 0.1
      ) {
        GenericParticle.spawnCluster(
          this.level,
          this.x - this.drawX + 0.5,
          this.y - this.drawY + 0.5,
          "black"
        );
        GenericParticle.spawnCluster(
          this.level,
          this.x - this.drawX + 0.5,
          this.y - this.drawY + 0.5,
          "white"
        );
      }

      //if (this.doneMoving() && this.game.players[this.game.localPlayerID].doneMoving()) this.facePlayer();
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
        this.tileX,
        this.tileY,
        1,
        2,
        this.x - this.drawX,
        this.y - 1.5 - this.drawY + (this.tileX === 4 ? 0.1875 : 0),
        1,
        2,
        this.level.shadeColor,
        this.shadeAmount()
      );
    }
  };

  dropLoot = () => {
    this.level.items.push(new Coin(this.level, this.x, this.y));
  };
}
