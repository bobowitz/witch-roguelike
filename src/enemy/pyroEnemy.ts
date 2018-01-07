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
import { PyroFireball } from "../projectile/pyroFireball";

enum PyroState {
  idle,
  attackReady,
  attack,
  run,
}

export class PyroEnemy extends Enemy {
  ticks: number;
  seenPlayer: boolean;
  state: PyroState;
  readonly SCARED_RADIUS = 4;

  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, game, x, y);
    this.ticks = 0;
    this.health = 1;
    this.tileX = 8;
    this.tileY = 0;
    this.seenPlayer = false;
    this.state = PyroState.idle;
  }

  hit = (): number => {
    return 1;
  };

  scaredOfPlayer = (): boolean => {
    if (
      (this.x - this.game.player.x) ** 2 + (this.y - this.game.player.y) ** 2 <=
      this.SCARED_RADIUS ** 2
    ) {
      return true;
    }
    return false;
  };

  private sign = (x: number): number => {
    if (x > 0) return 1;
    if (x < 0) return -1;
    return 0;
  };

  tick = () => {
    if (!this.dead) {
      if (this.skipNextTurns > 0) {
        this.skipNextTurns--;
        return;
      }
      this.ticks++;
      if (this.seenPlayer || this.level.visibilityArray[this.x][this.y] > 0) {
        // visible to player, chase them

        // now that we've seen the player, we can keep chasing them even if we lose line of sight
        this.seenPlayer = true;

        switch (this.state) {
          case PyroState.idle:
            if (this.scaredOfPlayer()) this.state = PyroState.run;
            else this.state = PyroState.attackReady;
            break;
          case PyroState.attackReady:
            this.state = PyroState.attack;
            break;
          case PyroState.attack:
            let attackX = this.sign(this.game.player.x - this.x);
            let attackY = this.sign(this.game.player.y - this.y);
            if (attackX !== 0 && attackY !== 0) {
              if (Game.rand(1, 2) === 1) {
                attackX = 0;
              } else {
                attackY = 0;
              }
            }
            this.level.projectiles.push(
              new PyroFireball(this.x + attackX, this.y + attackY, attackX, attackY)
            );
            this.state = PyroState.idle;
            break;
          case PyroState.run:
            let oldX = this.x;
            let oldY = this.y;
            let moveX = this.sign(this.x - this.game.player.x);
            let moveY = this.sign(this.y - this.game.player.y);
            if (moveX !== 0 && moveY !== 0) {
              if (Game.rand(1, 2) === 1) {
                moveX = 0;
              } else {
                moveY = 0;
              }
            }
            this.tryMove(this.x + moveX, this.y + moveY);
            this.drawX = this.x - oldX;
            this.drawY = this.y - oldY;
            if (this.x === oldX && this.y === oldY) this.state = PyroState.attackReady;
            if (!this.scaredOfPlayer()) this.state = PyroState.attackReady;
            break;
        }
      }
    }
  };
}
