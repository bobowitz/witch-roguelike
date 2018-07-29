import { Game } from "../game";
import { Particle } from "./particle";

export class DashParticle extends Particle {
  x: number;
  y: number;
  frame: number;
  armored: boolean;

  constructor(x: number, y: number, armored: boolean, frameOffset: number) {
    super();
    this.x = x;
    this.y = y - 1;
    this.armored = armored;
    this.dead = false;
    this.frame = frameOffset;
  }

  drawBehind = () => {
    let armoredOffset = 0;
    if (this.armored) armoredOffset = 8;
    Game.drawFX(armoredOffset + Math.round(this.frame), 0, 1, 2, this.x, this.y, 1, 2);

    this.frame += 0.4;
    if (this.frame > 7) this.dead = true;
  };
}
