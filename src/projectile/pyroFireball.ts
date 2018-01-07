import { Projectile } from "./projectile";
import { Game } from "../game";
import { WizardEnemy } from "../enemy/wizardEnemy";
import { Player } from "../player";
import { Enemy } from "../enemy/enemy";

export class PyroFireball extends Projectile {
  dx: number;
  dy: number;
  drawX: number;
  drawY: number;
  frame: number;

  constructor(x: number, y: number, dx: number, dy: number) {
    super(x, y);
    this.dx = dx;
    this.dy = dy;
    this.drawX = 0;
    this.drawY = 0;
    this.frame = 0;
  }

  tick = () => {
    this.x += this.dx;
    this.y += this.dy;
    this.drawX = this.dx;
    this.drawY = this.dy;
  };

  hitPlayer = (player: Player) => {
    if (!this.dead) {
      player.hurt(1);
    }
  };

  hitEnemy = (enemy: Enemy) => {
    if (!this.dead) {
      enemy.hurt(1);
    }
  };

  drawOver = () => {
    this.drawX += -0.5 * this.drawX;
    this.drawY += -0.5 * this.drawY;

    this.frame += 0.5;
    if (this.frame > 7) this.frame = 0;
    Game.drawFX(
      Math.floor(this.frame),
      14,
      1,
      2,
      this.x - this.drawX,
      this.y - 1.5 - this.drawY,
      1,
      2
    );
  };
}
