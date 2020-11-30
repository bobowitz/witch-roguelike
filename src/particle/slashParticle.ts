import { Game } from "../game";
import { GameConstants } from "../gameConstants";
import { Particle } from "./particle";

export class SlashParticle extends Particle {
  x: number;
  y: number;
  frame: number;

  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y - 0.25;
    this.dead = false;
    this.frame = 0;
  }

  draw = (delta: number) => {
    if (this.dead) return;

    Game.drawFX(Math.round(this.frame), 13, 1, 1, this.x, this.y, 1, 1);

    this.frame += 0.5 * delta;
    if (this.frame > 9) this.dead = true;
  };
}
