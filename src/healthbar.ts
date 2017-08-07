import { Game } from "./game";
import { GameConstants } from "./gameConstants";

export class HealthBar {
  health: number;
  fullHealth: number;
  drawTicks: number;
  readonly DRAW_TICKS = GameConstants.FPS * 3; // 3 seconds of ticks

  constructor(health: number) {
    this.health = health;
    this.fullHealth = health;
    this.drawTicks = 0;
  }

  heal = (amount: number) => {
    this.health += amount;
    if (this.health > this.fullHealth) this.health = this.fullHealth;
    if (this.drawTicks > 0) this.drawTicks = this.DRAW_TICKS / 2;
    else this.drawTicks = this.DRAW_TICKS;
  };

  hurt = (damage: number) => {
    this.health -= damage;
    if (this.drawTicks > 0) this.drawTicks = this.DRAW_TICKS / 2;
    else this.drawTicks = this.DRAW_TICKS;
  };

  // here x is the center of the bar
  draw = (x: number, y: number) => {
    if (this.drawTicks > 0) {
      this.drawTicks--;

      let healthPct = this.health / this.fullHealth;

      let WIDTH = Math.min(14, Math.min(this.DRAW_TICKS - this.drawTicks, this.drawTicks));
      let HEIGHT = 1;
      let BORDER_W = 1;
      let BORDER_H = 1;

      Game.ctx.fillStyle = GameConstants.OUTLINE;
      Game.ctx.fillRect(
        x - WIDTH / 2 - BORDER_W,
        y - HEIGHT - BORDER_H * 2,
        WIDTH + BORDER_W * 2,
        HEIGHT + BORDER_H * 2
      );
      Game.ctx.fillStyle = GameConstants.RED;
      Game.ctx.fillRect(x - WIDTH / 2, y - HEIGHT - BORDER_H, WIDTH, HEIGHT);

      Game.ctx.fillStyle = GameConstants.GREEN;
      Game.ctx.fillRect(
        x - WIDTH / 2,
        y - HEIGHT - BORDER_H,
        Math.floor(healthPct * WIDTH),
        HEIGHT
      );
    }
  };

  drawAboveTile = (x: number, y: number) => {
    this.draw(x * GameConstants.TILESIZE, y * GameConstants.TILESIZE);
  };
}
