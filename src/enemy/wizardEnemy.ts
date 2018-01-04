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

export class WizardEnemy extends Enemy {
  ticks: number;
  frame: number;

  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, game, x, y);
    this.ticks = 0;
    this.health = 1;
    this.tileX = 6;
    this.tileY = 0;
    this.frame = 0;
  }

  hit = (): number => {
    return 1;
  };

  tick = () => {
    if (!this.dead && this.level.visibilityArray[this.x][this.y] > 0) {
      this.ticks++;
      switch (this.ticks % 3) {
        case 0:
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
          break;
        case 1:
          this.tileX = 6;
          break;
        case 2:
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

  dropXP = () => {
    return Game.randTable([4, 5, 5, 6, 6, 7, 7, 7, 8, 8, 8, 9, 9, 10]);
  };

  kill = () => {
    this.level.levelArray[this.x][this.y] = new Bones(this.level, this.x, this.y);
    this.dead = true;
    this.level.particles.push(new DeathParticle(this.x, this.y));
  };
}
