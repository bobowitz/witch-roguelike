import { Projectile } from "./projectile";
import { Game } from "../game";
import { WizardEnemy } from "../enemy/wizardEnemy";
import { Player } from "../player";

export class HitWarning extends Projectile {
  static frame = 0;
  game: Game;

  constructor(game: Game, x: number, y: number) {
    super(x, y);
    this.game = game;
  }

  tick = () => {
    this.dead = true;
  };

  static updateFrame = () => {
    HitWarning.frame += 0.125;
    if (HitWarning.frame >= 4) HitWarning.frame = 0;
  };

  draw = () => {
    if (
      (this.x === this.game.player.x && Math.abs(this.y - this.game.player.y) <= 1) ||
      (this.y === this.game.player.y && Math.abs(this.x - this.game.player.x) <= 1)
    )
      Game.drawFX(18 + Math.floor(HitWarning.frame), 6, 1, 1, this.x, this.y, 1, 1);
  };

  drawTopLayer = () => {
    if (
      (this.x === this.game.player.x && Math.abs(this.y - this.game.player.y) <= 1) ||
      (this.y === this.game.player.y && Math.abs(this.x - this.game.player.x) <= 1)
    )
      Game.drawFX(18 + Math.floor(HitWarning.frame), 5, 1, 1, this.x, this.y, 1, 1);
  };
}
