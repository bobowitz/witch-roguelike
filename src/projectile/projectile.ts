export class Projectile {
  x: number;
  y: number;
  dead: boolean;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.dead = false;
  }

  tick = () => {};
  draw = () => {};
}
