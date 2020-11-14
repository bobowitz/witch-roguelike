import { Game } from "../game";
import { Weapon } from "./weapon";
import { Level } from "../level";
import { Sound } from "../sound";
import { SlashParticle } from "../particle/slashParticle";
import { Crate } from "../enemy/crate";
import { Barrel } from "../enemy/barrel";

export class Dagger extends Weapon {
  constructor(level: Level, x: number, y: number) {
    super(level, x, y);

    this.tileX = 22;
    this.tileY = 0;
  }

  weaponMove = (newX: number, newY: number): boolean => {
    let flag = false;
    for (let e of this.game.level.enemies) {
      if (
        e.destroyable &&
        !(e instanceof Crate || e instanceof Barrel) &&
        e.x === newX &&
        e.y === newY
      ) {
        e.hurt(1);
        flag = true;
      }
    }
    if (flag) {
      Sound.hit();
      //this.game.player.drawX = 0.5 * (this.game.player.x - newX);
      //this.game.player.drawY = 0.5 * (this.game.player.y - newY);
      this.game.level.particles.push(new SlashParticle(newX, newY));
      //this.game.level.tick();
      //this.game.shakeScreen(10 * this.game.player.drawX, 10 * this.game.player.drawY);
    }
    return !flag;
  };

  getDescription = (): string => {
    return "DAGGER\nDamage 1";
  };
}
