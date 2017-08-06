import { Game } from "./game";
import { GameConstants } from "./gameConstants";

export class HealthBar {
  health: number;
  fullHealth: number;

  constructor(health: number) {
    this.health = health;
    this.fullHealth = health;
  }

  hurt = (damage: number) => {
    this.health -= damage;
  };

  draw = (x: number, y: number) => {
    let healthPct = this.health / this.fullHealth;

    let WIDTH = 14;
    let HEIGHT = 1;
    let BORDER_W = 1;
    let BORDER_H = 1;

    let redColor = "#ac3232";
    let greenColor = "#6abe30";
    let borderColor = "#222034";

    Game.ctx.fillStyle = borderColor;
    Game.ctx.fillRect(x, y - HEIGHT - BORDER_H * 2, WIDTH + BORDER_W * 2, HEIGHT + BORDER_H * 2);
    Game.ctx.fillStyle = redColor;
    Game.ctx.fillRect(x + BORDER_W, y - HEIGHT - BORDER_H, WIDTH, HEIGHT);

    Game.ctx.fillStyle = greenColor;
    Game.ctx.fillRect(x + BORDER_W, y - HEIGHT - BORDER_H, Math.floor(healthPct * WIDTH), HEIGHT);
  };

  drawAboveTile = (x: number, y: number) => {
    this.draw(x * GameConstants.TILESIZE, y * GameConstants.TILESIZE);
  };
}
