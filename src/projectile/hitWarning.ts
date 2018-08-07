import { Projectile } from "./projectile";
import { Game } from "../game";
import { WizardEnemy } from "../enemy/wizardEnemy";
import { Player } from "../player";

export class HitWarning extends Projectile {
  static frame = 0;

  constructor(x: number, y: number) {
    super(x, y);
  }

  tick = () => {
    this.dead = true;
  };

  static updateFrame = () => {
    HitWarning.frame += 0.25;
    if (HitWarning.frame >= 4) HitWarning.frame = 0;
  };

  draw = () => {
    Game.drawFX(18 + Math.floor(HitWarning.frame), 6, 1, 1, this.x, this.y, 1, 1);
  };
}
