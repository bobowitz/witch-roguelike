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
import { LockedDoor } from "./lockedDoor";
import { Sound } from "./sound";
import { Potion } from "./item/potion";
import { Spike } from "./spike";
import { TextParticle } from "./textParticle";

export class Player {
  x: number;
  y: number;
  w: number;
  h: number;
  drawX: number;
  drawY: number;
  game: Game;
  flashing: boolean;
  flashingFrame: number;
  healthBar: HealthBar;
  dead: boolean;
  lastTickHealth: number;
  inventory: Inventory;

  constructor(game: Game, x: number, y: number) {
    this.game = game;

    this.x = x;
    this.y = y;

    Keyboard.spaceListener = this.spaceListener;
    Keyboard.leftListener = this.leftListener;
    Keyboard.rightListener = this.rightListener;
    Keyboard.upListener = this.upListener;
    Keyboard.downListener = this.downListener;

    this.healthBar = new HealthBar(10);
    this.dead = false;
    this.flashing = false;
    this.flashingFrame = 0;
    this.lastTickHealth = this.healthBar.health;

    this.inventory = new Inventory();
  }

  spaceListener = () => {
    // dev tools: chest spawning
    // this.game.level.levelArray[this.x][this.y] = new Chest(
    //   this.game.level,
    //   this.game,
    //   this.x,
    //   this.y
    // );
  };
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
      }
    }
    if (hitEnemy) {
      this.drawX = (this.x - x) * 0.5;
      this.drawY = (this.y - y) * 0.5;
      this.game.level.tick();
    } else {
      let other = this.game.level.getCollidable(x, y);
      if (other === null) {
        this.move(x, y);
        this.game.level.tick();
      } else {
        if (other instanceof Door) {
          if (x - this.x === 0) {
            this.move(x, y);
            other.onCollide(this);
          }
        } else if (other instanceof LockedDoor) {
          if (x - this.x === 0) {
            this.drawX = (this.x - x) * 0.5;
            this.drawY = (this.y - y) * 0.5;
            other.unlock(this);
            this.game.level.tick();
          }
        } else if (other instanceof BottomDoor || other instanceof Trapdoor) {
          this.move(x, y);
          other.onCollide(this);
        } else if (other instanceof Chest) {
          other.open();
          this.game.level.levelArray[x][y] = new Floor(this.game.level, x, y);
          this.drawX = (this.x - x) * 0.5;
          this.drawY = (this.y - y) * 0.5;
        } else if (other instanceof Spike) {
          this.move(x, y);
          other.onCollide(this);
        }
      }
    }
  };

  heal = (amount: number) => {
    this.healthBar.heal(amount);
  };

  hurt = (damage: number) => {
    this.flashing = true;
    this.healthBar.hurt(damage);
    if (this.healthBar.health <= 0) {
      this.healthBar.health = 0;

      this.dead = true;
    }
  };

  move = (x: number, y: number) => {
    Sound.footstep();

    this.drawX = x - this.x;
    this.drawY = y - this.y;
    this.x = x;
    this.y = y;

    for (let i of this.game.level.items) {
      if (i.x === x && i.y === y) {
        if (i instanceof Potion) {
          this.heal(3);
        } else {
          this.inventory.addItem(i);
        }

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

  startTick = () => {};

  finishTick = () => {
    this.flashing = false;

    let totalHealthDiff = this.healthBar.health - this.lastTickHealth;
    this.lastTickHealth = this.healthBar.health; // update last tick health
    if (totalHealthDiff < 0) {
      this.game.level.textParticles.push(
        new TextParticle("" + totalHealthDiff, this.x + 0.5, this.y - 0.5, GameConstants.RED)
      );
    } else if (totalHealthDiff > 0) {
      this.game.level.textParticles.push(
        new TextParticle("+" + totalHealthDiff, this.x + 0.5, this.y - 0.5, GameConstants.GREEN)
      );
    }
  };

  draw = () => {
    this.flashingFrame += 4 / GameConstants.FPS;
    if (!this.dead) {
      if (!this.flashing || Math.floor(this.flashingFrame) % 2 === 0) {
        this.drawX += -0.5 * this.drawX;
        this.drawY += -0.5 * this.drawY;
        Game.drawMob(0, 0, 1, 1, this.x - this.drawX, this.y - this.drawY, 1, 1);
        Game.drawMob(1, 0, 1, 2, this.x - this.drawX, this.y - 1.5 - this.drawY, 1, 2);
      }
    }
  };

  drawTopLayer = () => {
    if (!this.dead) {
      this.healthBar.drawAboveTile(this.x - this.drawX + 0.5, this.y - 0.75 - this.drawY);
    } else {
      Game.ctx.fillStyle = "white";
      let gameOverString = "Game Over.";
      Game.ctx.fillText(
        gameOverString,
        GameConstants.WIDTH / 2 - Game.ctx.measureText(gameOverString).width / 2,
        GameConstants.HEIGHT / 2 - 10
      );
      let refreshString = "[refresh to restart]";
      Game.ctx.fillText(
        refreshString,
        GameConstants.WIDTH / 2 - Game.ctx.measureText(refreshString).width / 2,
        GameConstants.HEIGHT / 2 + 10
      );
    }
    this.inventory.draw();
  };
}
