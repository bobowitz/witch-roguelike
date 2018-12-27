import { Level } from "../level";
import { Particle } from "./particle";
import { Game } from "../game";
import { GameConstants } from "../gameConstants";

export class GenericParticle extends Particle {
  level: Level;
  x: number;
  y: number;
  z: number;
  s: number;
  dx: number;
  dy: number;
  dz: number;
  color: string;
  alpha: number;
  delay: number;

  static spawnCluster = (level: Level, cx: number, cy: number, color: string) => {
    for (let i = 0; i < 7; i++) {
      level.particles.push(
        new GenericParticle(
          level,
          cx + Math.random() * 0.05 - 0.025,
          cy + Math.random() * 0.05 - 0.025,
          Math.random() * 0.5,
          0.0625 * (i + 8),
          0.025 * (Math.random() * 2 - 1),
          0.025 * (Math.random() * 2 - 1),
          0.2 * (Math.random() - 1),
          color,
          0
        )
      );
    }
  };

  constructor(
    level: Level,
    x: number,
    y: number,
    z: number,
    s: number,
    dx: number,
    dy: number,
    dz: number,
    color: string,
    delay?: number
  ) {
    super();
    this.level = level;
    this.x = x;
    this.y = y;
    this.z = z;
    this.s = s;
    this.dx = dx;
    this.dy = dy;
    this.dz = dz;
    this.color = color;
    this.alpha = 1.0;
    if (delay !== undefined) this.delay = delay;
  }

  render = () => {
    let scale = GameConstants.TILESIZE;
    let scaledS = this.s * this.alpha; // using alpha for scaling, not alpha
    let halfS = 0.5 * scaledS;
    let oldFillStyle = Game.ctx.fillStyle;
    Game.ctx.fillStyle = this.color;
    /* Game.ctx.fillRect(
      Math.round((this.x - halfS) * scale),
      Math.round((this.y - this.z - halfS) * scale),
      Math.round(scaledS * scale),
      Math.round(scaledS * scale)
    ); */

    Game.ctx.beginPath();
    Game.ctx.arc(this.x * scale, (this.y - this.z) * scale, halfS * scale, 0, 2 * Math.PI, false);
    Game.ctx.fill();

    Game.ctx.fillStyle = oldFillStyle;
  };

  draw = () => {
    this.x += this.dx;
    this.y += this.dy;
    this.z += this.dz;

    this.dx *= 0.97;
    this.dy *= 0.97;
    if (this.z <= 0) {
      this.z = 0;
      this.dz *= -0.8;
    }

    // apply gravity
    this.dz -= 0.01;

    if (this.alpha < 0.2) this.alpha -= 0.007;
    else this.alpha -= 0.02;
    if (this.alpha <= 0.1) this.dead = true;

    if (this.dead) return;

    if (this.y >= this.level.game.player.y) {
      this.render();
    }
  };

  drawBehind = () => {
    if (this.dead) return;

    if (this.y < this.level.game.player.y) {
      this.render();
    }
  };
}
