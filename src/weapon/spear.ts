import { Game } from "../game";
import { Weapon } from "./weapon";
import { Level } from "../level";
import { Sound } from "../sound";
import { SlashParticle } from "../particle/slashParticle";
import { Crate } from "../enemy/crate";
import { Barrel } from "../enemy/barrel";

export class Spear extends Weapon {
  constructor(game: Game) {
    super(game);
  }

  weaponMove = (newX: number, newY: number): boolean => {
    let newX2 = 2 * newX - this.game.player.x;
    let newY2 = 2 * newY - this.game.player.y;
    let flag = false;
    for (let e of this.game.level.enemies) {
      if (
        !(e instanceof Crate || e instanceof Barrel) &&
        ((e.x === newX && e.y === newY) || (e.x === newX2 && e.y === newY2))
      ) {
        e.hurt(1);
        flag = true;
      }
    }
    if (flag) {
      Sound.hit();
      this.game.player.drawX = 0.5 * (this.game.player.x - newX);
      this.game.player.drawY = 0.5 * (this.game.player.y - newY);
      this.game.level.particles.push(new SlashParticle(newX, newY));
      this.game.level.particles.push(new SlashParticle(newX2, newY2));
      this.game.level.tick();
      this.game.shakeScreen(10 * this.game.player.drawX, 10 * this.game.player.drawY);
    }
    return !flag;
  };
}
