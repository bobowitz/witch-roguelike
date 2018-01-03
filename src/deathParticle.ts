import { Game } from "./game";
import { GameConstants } from "./gameConstants";
import { Particle } from "./particle";

export class DeathParticle extends Particle {
  x: number;
  y: number;
  frame: number;
  dead: boolean;

  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y - 1.5;
    this.dead = false;
    this.frame = 0;
  }

  draw = () => {
    let yOffset = Math.max(0, (this.frame - 3) * 3 / GameConstants.TILESIZE);
    Game.drawFX(Math.round(this.frame), 4, 1, 2, this.x, this.y - yOffset, 1, 2);

    this.frame += 0.3;
    if (this.frame > 10) this.dead = true;
  };
}
