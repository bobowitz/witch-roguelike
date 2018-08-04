import { Projectile } from "./projectile";
import { Game } from "../game";
import { WizardEnemy } from "../enemy/wizardEnemy";
import { Player } from "../player";

export class HitWarning extends Projectile {
  frame: number;

  constructor(x: number, y: number) {
    super(x, y);
    this.frame = 0;
  }

  tick = () => {
    this.dead = true;
  };

  draw = () => {
    this.frame += 0.25;
    if (this.frame >= 4) this.frame = 0;
    Game.drawFX(18 + Math.floor(this.frame), 6, 1, 1, this.x, this.y, 1, 1);
  };
}
