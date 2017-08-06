import { Keyboard } from "./keyboard";
import { GameConstants } from "./gameConstants";
import { Game } from "./game";
import { Door } from "./door";
import { BottomDoor } from "./bottomDoor";
import { Trapdoor } from "./trapdoor";
import { HealthBar } from "./healthbar";
import { Chest } from "./chest";
import { Floor } from "./floor";
import { Inventory } from "./inventory";

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
  inventory: Inventory;

  constructor(game: Game, x: number, y: number) {
    this.game = game;

    this.x = x;
    this.y = y;

    Keyboard.leftListener = this.leftListener;
    Keyboard.rightListener = this.rightListener;
    Keyboard.upListener = this.upListener;
    Keyboard.downListener = this.downListener;

    this.healthBar = new HealthBar(10);
    this.dead = false;

    this.inventory = new Inventory();
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
        if (other instanceof Chest) {
          other.open();
          this.game.level.levelArray[x][y] = new Floor(this.game.level, x, y);
          this.drawX = (this.x - x) * 0.5;
          this.drawY = (this.y - y) * 0.5;
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

    for (let i of this.game.level.items) {
      if (i.x === x && i.y === y) {
        this.inventory.items.push(i);

        this.game.level.items = this.game.level.items.filter(x => x !== i); // remove item from item list
      }
    }
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
      Game.drawMob(0, 0, 1, 2, this.x - this.drawX, this.y - 1.5 - this.drawY, 1, 2);
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

  drawTopLayer = () => {
    if (!this.dead) {
      this.healthBar.drawAboveTile(this.x - this.drawX + 0.5, this.y - 0.75 - this.drawY);
    }
    this.inventory.draw();
  };
}
