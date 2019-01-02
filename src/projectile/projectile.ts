import { Player } from "../player";
import { Enemy } from "../enemy/enemy";

export class Projectile {
  x: number;
  y: number;
  dead: boolean;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.dead = false;
  }

  hitPlayer = (player: Player) => {};
  hitEnemy = (enemy: Enemy) => {};

  tick = () => {};
  draw = () => {};
  drawTopLayer = () => {};
}
