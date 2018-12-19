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
  delay: number;

  static spawnCluster = (level: Level, cx: number, cy: number, color: string) => {
    for (let i = 0; i < 4; i++) {
      level.particles.push(
        new GenericParticle(
          level,
          cx + Math.random() * 0.05 - 0.025,
          cy + Math.random() * 0.05 - 0.025,
          Math.random() * 0.5,
          0.05 * (Math.random() * 2 - 1),
          0.05 * (Math.random() * 2 - 1),
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
    this.s = Game.rand(8, 16) / 16.0;
    this.dx = dx;
    this.dy = dy;
    this.dz = dz;
    this.color = color;
    if (delay !== undefined) this.delay = delay;
  }

  draw = () => {
    this.x += this.dx;
    this.y += this.dy;
    this.z += this.dz;

    this.dx *= 0.93;
    this.dy *= 0.93;
    if (this.z <= 0) {
      this.z = 0;
      this.dz *= -0.6;
      if (this.dz < 0.01) this.dead = true;
    }

    // apply gravity
    this.dz -= 0.01;

    if (this.y >= this.level.game.player.y) {
      let scale = GameConstants.TILESIZE;
      let halfS = 0.5 * this.s;
      let oldFillStyle = Game.ctx.fillStyle;
      Game.ctx.fillStyle = this.color;
      Game.ctx.fillRect(
        Math.floor((this.x - halfS) * scale),
        Math.floor((this.y - this.z - halfS) * scale),
        halfS * scale,
        halfS * scale
      );
      Game.ctx.fillStyle = oldFillStyle;
    }
  };

  drawBehind = () => {
    if (this.y < this.level.game.player.y) {
      let scale = GameConstants.TILESIZE;
      let halfS = 0.5 * this.s;
      let oldFillStyle = Game.ctx.fillStyle;
      Game.ctx.fillStyle = this.color;
      Game.ctx.fillRect(
        Math.floor((this.x - halfS) * scale),
        Math.floor((this.y - this.z - halfS) * scale),
        halfS * scale,
        halfS * scale
      );
      Game.ctx.fillStyle = oldFillStyle;
    }
  };
}
