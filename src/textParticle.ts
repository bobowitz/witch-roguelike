import { Game } from "./game";
import { GameConstants } from "./gameConstants";

export class TextParticle {
  text: string;
  x: number;
  y: number;
  z: number;
  dz: number;
  time: number;
  color: string;
  dead: boolean;
  delay: number;

  constructor(text: string, x: number, y: number, color: string, delay?: number) {
    this.text = text;
    this.x = x * GameConstants.TILESIZE;
    this.y = y * GameConstants.TILESIZE;
    this.z = GameConstants.TILESIZE;
    this.dz = 2;
    this.color = color;
    this.dead = false;
    this.time = 0;
    if (delay === undefined)
      this.delay = Game.rand(0, 10); // up to a 10 tick delay
    else this.delay = delay;
  }

  draw = () => {
    if (this.delay > 0) {
      this.delay--;
    } else {
      let GRAVITY = 0.2;
      let TIMEOUT = 2; // lasts for 2 seconds

      this.z += this.dz;
      if (this.z < 0) {
        this.z = 0;
        this.dz *= -0.7;
      }
      this.dz -= GRAVITY;

      this.time++;
      if (this.time > GameConstants.FPS * TIMEOUT) this.dead = true;

      let width = Game.ctx.measureText(this.text).width;

      for (let xx = -1; xx <= 1; xx++) {
        for (let yy = -1; yy <= 1; yy++) {
          Game.ctx.fillStyle = GameConstants.OUTLINE;
          Game.ctx.fillText(this.text, this.x - width / 2 + xx, this.y - this.z + yy);
        }
      }

      Game.ctx.fillStyle = this.color;
      Game.ctx.fillText(this.text, this.x - width / 2, this.y - this.z);
    }
  };
}
