import { Game } from "../game";
import { Weapon } from "./weapon";
import { Level } from "../level";
import { Sound } from "../sound";
import { SlashParticle } from "../particle/slashParticle";
import { Crate } from "../enemy/crate";
import { Barrel } from "../enemy/barrel";

export class DualDagger extends Weapon {
  firstAttack: boolean;

  constructor(level: Level, x: number, y: number) {
    super(level, x, y);

    this.tileX = 23;
    this.tileY = 0;
    this.firstAttack = true;
  }

  tickInInventory = () => {
    this.firstAttack = true;
  };

  weaponMove = (newX: number, newY: number): boolean => {
    let flag = false;
    for (let e of this.game.levels[this.wielder.levelID].enemies) {
      if (
        e.destroyable &&
        !(e instanceof Crate || e instanceof Barrel) &&
        e.pointIn(newX, newY)
      ) {
        e.hurt(this.wielder, 1);
        flag = true;
      }
    }
    if (flag) {
      if (this.wielder.game.levels[this.wielder.levelID] === this.wielder.game.level) Sound.hit();
      this.wielder.drawX = 0.5 * (this.wielder.x - newX);
      this.wielder.drawY = 0.5 * (this.wielder.y - newY);
      this.game.levels[this.wielder.levelID].particles.push(new SlashParticle(newX, newY));
      if (this.firstAttack) this.game.levels[this.wielder.levelID].enemies = this.game.levels[this.wielder.levelID].enemies.filter(e => !e.dead);
      else this.game.levels[this.wielder.levelID].tick(this.wielder);
      if (this.wielder === this.game.players[this.game.localPlayerID])
        this.game.shakeScreen(10 * this.wielder.drawX, 10 * this.wielder.drawY);

      if (this.firstAttack) this.firstAttack = false;
    }
    return !flag;
  };

  getDescription = (): string => {
    return "DUAL DAGGERS\nOne extra attack per turn";
  };
}
