import { Enemy } from "./enemy";
import { LevelConstants } from "../levelConstants";
import { Game } from "../game";
import { Level } from "../level";
import { astar } from "../astarclass";
import { Heart } from "../item/heart";
import { Floor } from "../tile/floor";
import { Bones } from "../tile/bones";
import { DeathParticle } from "../deathParticle";
import { GameConstants } from "../gameConstants";
import { WizardFireball } from "../projectile/wizardFireball";

export class WizardEnemy extends Enemy {
  ticks: number;

  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, game, x, y);
    this.ticks = 0;
    this.health = 1;
    this.tileX = 6;
    this.tileY = 0;
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
        default:
          let oldX = this.x;
          let oldY = this.y;
          let moveXY = Game.randTable([[0, 1], [0, -1], [1, 0], [-1, 0]]);
          this.tryMove(this.x + moveXY[0], this.y + moveXY[1]);
          this.drawX = this.x - oldX;
          this.drawY = this.y - oldY;
          break;
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
