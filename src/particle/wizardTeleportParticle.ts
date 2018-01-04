import { Particle } from "./particle";
import { Game } from "../game";

export class WizardTeleportParticle extends Particle {
  x: number;
  y: number;
  frame: number;
  dead: boolean;

  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
    this.dead = false;
    this.frame = 0;
  }

  draw = () => {
    Game.drawFX(Math.floor(this.frame), 3, 1, 1, this.x, this.y, 1, 1);
    this.frame += 0.5;
    if (this.frame > 6) this.dead = true;
  };
}
