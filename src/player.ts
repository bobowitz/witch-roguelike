import { Key } from "./key";
import { GameConstants } from "./gameConstants";
import { Game } from "./game";
import { Door } from "./door";
import { BottomDoor } from "./bottomDoor";
import { Trapdoor } from "./trapdoor";
import { HealthBar } from "./healthbar";

export class Player {
  x: number;
  y: number;
  w: number;
  h: number;
  drawX: number;
  drawY: number;
  game: Game;
  healthBar: HealthBar;
  dead: boolean;

  constructor(game: Game, x: number, y: number) {
    this.game = game;

    this.x = x;
    this.y = y;

    Key.leftListener = this.leftListener;
    Key.rightListener = this.rightListener;
    Key.upListener = this.upListener;
    Key.downListener = this.downListener;

    this.healthBar = new HealthBar(10);
    this.dead = false;
  }

  leftListener = () => {
    if (!this.dead) this.tryMove(this.x - 1, this.y);
  };
  rightListener = () => {
    if (!this.dead) this.tryMove(this.x + 1, this.y);
  };
  upListener = () => {
    if (!this.dead) this.tryMove(this.x, this.y - 1);
  };
  downListener = () => {
    if (!this.dead) this.tryMove(this.x, this.y + 1);
  };

  tryMove = (x: number, y: number) => {
    let hitEnemy = false;
    for (let e of this.game.level.enemies) {
      if (e.x === x && e.y === y) {
        e.hurt(1);
        hitEnemy = true;
        this.game.level.tick();
        this.drawX = (this.x - x) * 0.5;
        this.drawY = (this.y - y) * 0.5;
      }
    }
    if (!hitEnemy) {
      let other = this.game.level.getCollidable(x, y);
      if (other === null) {
        this.move(x, y);
        this.game.level.tick();
      } else {
        if (other instanceof Door || other instanceof BottomDoor || other instanceof Trapdoor) {
          this.move(x, y);
        }
        other.onCollide(this);
      }
    }
  };

  hurt = (damage: number) => {
    this.healthBar.hurt(damage);
    if (this.healthBar.health <= 0) {
      this.healthBar.health = 0;

      this.dead = true;
    }
  };

  move = (x: number, y: number) => {
    this.drawX = x - this.x;
    this.drawY = y - this.y;
    this.x = x;
    this.y = y;
  };

  moveNoSmooth = (x: number, y: number) => {
    this.x = x;
    this.y = y;
    this.drawX = 0;
    this.drawY = 0;
  };

  update = () => {};

  draw = () => {
    if (!this.dead) {
      this.drawX += -0.5 * this.drawX;
      this.drawY += -0.5 * this.drawY;
      Game.drawTile(0, 1, 1, 2, this.x - this.drawX, this.y - 1.5 - this.drawY, 1, 2);
      this.healthBar.drawAboveTile(this.x - this.drawX, this.y - 0.75 - this.drawY);
    } else {
      Game.ctx.fillStyle = "white";
      let gameOverString = "Game Over. Refresh the page";
      Game.ctx.font = "14px courier";
      Game.ctx.fillText(
        gameOverString,
        GameConstants.WIDTH / 2 - Game.ctx.measureText(gameOverString).width / 2,
        GameConstants.HEIGHT / 2
      );
    }
  };
}
