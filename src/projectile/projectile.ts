import { Player } from "../player";
import { Enemy } from "../enemy/enemy";
import { Drawable } from "../drawable";

export class Projectile extends Drawable {
  x: number;
  y: number;
  dead: boolean;

  constructor(x: number, y: number) {
    super();

    this.x = x;
    this.y = y;
    this.dead = false;

    this.drawableY = y;
  }

  hitPlayer = (player: Player) => { };
  hitEnemy = (enemy: Enemy) => { };

  tick = () => { };
  draw = (delta: number) => { };
  drawTopLayer = (delta: number) => { };
}
