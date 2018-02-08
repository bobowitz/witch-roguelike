import { Enemy } from "./enemy";
import { LevelConstants } from "../levelConstants";
import { Game } from "../game";
import { Level } from "../level";
import { astar } from "../astarclass";
import { Heart } from "../item/heart";
import { Floor } from "../tile/floor";
import { Bones } from "../tile/bones";
import { DeathParticle } from "../particle/deathParticle";
import { WizardTeleportParticle } from "../particle/wizardTeleportParticle";
import { GameConstants } from "../gameConstants";
import { WizardFireball } from "../projectile/wizardFireball";

enum WizardState {
  idle,
  idle2,
  attack,
  justAttacked,
  teleport,
}

export class WizardEnemy extends Enemy {
  ticks: number;
  state: WizardState;
  frame: number;
  startX: number;
  startY: number;
  readonly ATTACK_RADIUS = 5;

  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, game, x, y);
    this.startX = this.x;
    this.startY = this.y;
    this.ticks = 0;
    this.health = 1;
    this.tileX = 6;
    this.tileY = 0;
    this.frame = 0;
    this.state = WizardState.attack;
  }

  hit = (): number => {
    return 1;
  };

  withinAttackingRangeOfPlayer = (): boolean => {
    return (
      (this.x - this.game.player.x) ** 2 + (this.y - this.game.player.y) ** 2 <=
      this.ATTACK_RADIUS ** 2
    );
  };

  tick = () => {
    if (!this.dead && this.level.visibilityArray[this.x][this.y] > 0) {
      if (this.skipNextTurns > 0) {
        this.skipNextTurns--;
        return;
      }
      switch (this.state) {
        case WizardState.attack:
          this.tileX = 7;
          for (let xx = -2; xx <= 2; xx++) {
            for (let yy = -2; yy <= 2; yy++) {
              if (xx === 0 && yy === 0) continue;
              if (this.level.getCollidable(this.x + xx, this.y + yy) === null) {
                this.level.projectiles.push(new WizardFireball(this, this.x + xx, this.y + yy));
              }
            }
          }
          this.state = WizardState.justAttacked;
          break;
        case WizardState.justAttacked:
          this.tileX = 6;
          this.state = WizardState.teleport;
          break;
        case WizardState.teleport:
          let oldX = this.x;
          let oldY = this.y;
          while (this.x === oldX && this.y === oldY) {
            let newX = this.startX + Game.rand(-3, 3);
            let newY = this.startY + Game.rand(-3, 3);
            this.tryMove(newX, newY);
          }
          this.drawX = this.x - oldX;
          this.drawY = this.y - oldY;
          this.frame = 0; // trigger teleport animation
          this.level.particles.push(new WizardTeleportParticle(oldX, oldY));
          if (this.withinAttackingRangeOfPlayer()) {
            this.state = WizardState.attack;
          } else {
            this.state = WizardState.idle;
          }
          break;
        case WizardState.idle:
          this.state = WizardState.idle2;
          break;
        case WizardState.idle2:
          this.state = WizardState.teleport;
          break;
      }
    }
  };

  draw = () => {
    if (!this.dead) {
      let darkOffset =
        this.level.visibilityArray[this.x][this.y] <= LevelConstants.VISIBILITY_CUTOFF &&
        this.hasDarkVersion
          ? 2
          : 0;
      this.drawX += -0.5 * this.drawX;
      this.drawY += -0.5 * this.drawY;
      if (this.hasShadow) Game.drawMob(0, 0, 1, 1, this.x - this.drawX, this.y - this.drawY, 1, 1);
      if (this.frame >= 0) {
        Game.drawFX(Math.floor(this.frame), 10 + darkOffset, 1, 2, this.x, this.y - 1.5, 1, 2);
        this.frame += 0.4;
        if (this.frame > 11) this.frame = -1;
      } else {
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
    }
  };
}
