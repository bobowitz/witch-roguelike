import { Projectile } from "./projectile";
import { Game } from "../game";
import { WizardEnemy } from "../enemy/wizardEnemy";
import { Player } from "../player";

export class WizardFireball extends Projectile {
  state: number;
  frame: number;
  parent: WizardEnemy;
  delay: number;

  constructor(parent: WizardEnemy, x: number, y: number) {
    super(x, y);
    this.parent = parent;
    this.state = 0;
    this.frame = 0;
  }

  tick = () => {
    if (this.parent.dead) this.dead = true;
    this.state++;
    if (this.state === 2) {
      this.frame = 0;
      this.delay = Game.rand(0, 10);
    }
  };

  hitPlayer = (player: Player) => {
    if (this.state === 2 && !this.dead) {
      player.hurt(1);
    }
  };

  draw = () => {
    if (this.state === 0) {
      this.frame += 0.25;
      if (this.frame >= 4) this.frame = 0;
      Game.drawFX(22 + Math.floor(this.frame), 7, 1, 1, this.x, this.y, 1, 1);
    } else if (this.state === 1) {
      this.frame += 0.25;
      if (this.frame >= 4) this.frame = 0;
      Game.drawFX(18 + Math.floor(this.frame), 7, 1, 1, this.x, this.y, 1, 1);
    } else {
      if (this.delay > 0) {
        this.delay--;
        return;
      }
      this.frame += 0.3;
      if (this.frame > 17) this.dead = true;
      Game.drawFX(Math.floor(this.frame), 6, 1, 2, this.x, this.y - 1, 1, 2);
    }
  };
}
