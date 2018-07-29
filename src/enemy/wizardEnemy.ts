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
  attack,
  justAttacked,
  teleport,
}

export class WizardEnemy extends Enemy {
  ticks: number;
  state: WizardState;
  frame: number;
  readonly ATTACK_RADIUS = 5;

  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, game, x, y);
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
          if (this.level.getCollidable(this.x - 1, this.y) === null) {
            this.level.projectiles.push(new WizardFireball(this, this.x - 1, this.y));
            if (this.level.getCollidable(this.x - 2, this.y) === null) {
              this.level.projectiles.push(new WizardFireball(this, this.x - 2, this.y));
            }
          }
          if (this.level.getCollidable(this.x + 1, this.y) === null) {
            this.level.projectiles.push(new WizardFireball(this, this.x + 1, this.y));
            if (this.level.getCollidable(this.x + 2, this.y) === null) {
              this.level.projectiles.push(new WizardFireball(this, this.x + 2, this.y));
            }
          }
          if (this.level.getCollidable(this.x, this.y - 1) === null) {
            this.level.projectiles.push(new WizardFireball(this, this.x, this.y - 1));
            if (this.level.getCollidable(this.x, this.y - 2) === null) {
              this.level.projectiles.push(new WizardFireball(this, this.x, this.y - 2));
            }
          }
          if (this.level.getCollidable(this.x, this.y + 1) === null) {
            this.level.projectiles.push(new WizardFireball(this, this.x, this.y + 1));
            if (this.level.getCollidable(this.x, this.y + 2) === null) {
              this.level.projectiles.push(new WizardFireball(this, this.x, this.y + 2));
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
            let newPos = Game.randTable(this.level.getEmptyTiles());
            this.tryMove(newPos.x, newPos.y);
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
          this.state = WizardState.teleport;
          break;
      }
    }
  };

  draw = () => {
    if (!this.dead) {
      this.drawX += -0.5 * this.drawX;
      this.drawY += -0.5 * this.drawY;
      if (this.hasShadow)
        Game.drawMob(0, 0, 1, 1, this.x - this.drawX, this.y - this.drawY, 1, 1, this.isShaded());
      if (this.frame >= 0) {
        Game.drawMob(
          Math.floor(this.frame) + 6,
          2,
          1,
          2,
          this.x,
          this.y - 1.5,
          1,
          2,
          this.isShaded()
        );
        this.frame += 0.4;
        if (this.frame > 11) this.frame = -1;
      } else {
        Game.drawMob(
          this.tileX,
          this.tileY,
          1,
          2,
          this.x - this.drawX,
          this.y - 1.5 - this.drawY,
          1,
          2,
          this.isShaded()
        );
      }
    }
  };

  kill = () => {
    this.level.levelArray[this.x][this.y] = new Bones(this.level, this.x, this.y);
    this.dead = true;
    this.level.particles.push(new DeathParticle(this.x, this.y));
  };
}
