import { Game } from "./game";
import { GameConstants } from "./gameConstants";
import { Particle } from "./particle";

export class DashParticle extends Particle {
  x: number;
  y: number;
  frame: number;
  dead: boolean;
  delay: number;

  constructor(x: number, y: number, delay: number) {
    super();
    this.x = x;
    this.y = y - 1;
    this.dead = false;
    this.frame = 0;
    this.delay = delay;
  }

  draw = () => {
    if (this.delay > 0) {
      this.delay--;
    } else {
      Game.drawFX(Math.round(this.frame), 0, 1, 2, this.x, this.y, 1, 2);

      this.frame += 0.5;
      if (this.frame > 10) this.dead = true;
    }
  };
}
