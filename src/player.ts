import { Input } from "./input";
import { GameConstants } from "./gameConstants";
import { Game } from "./game";
import { Door } from "./tile/door";
import { BottomDoor } from "./tile/bottomDoor";
import { Trapdoor } from "./tile/trapdoor";
import { Floor } from "./tile/floor";
import { Inventory } from "./inventory";
import { LockedDoor } from "./tile/lockedDoor";
import { Sound } from "./sound";
import { Heart } from "./item/heart";
import { Spike } from "./tile/spike";
import { TextParticle } from "./textParticle";
import { Armor } from "./item/armor";
import { Item } from "./item/item";
import { Equippable } from "./item/equippable";
import { LevelConstants } from "./levelConstants";
import { Map } from "./map";
import { Pickup } from "./item/pickup";
import { Crate } from "./enemy/crate";
import { Stats } from "./stats";
import { GoldenDoor } from "./tile/goldenDoor";
import { UnlockedGoldenDoor } from "./tile/unlockedGoldenDoor";

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
  health: number;
  stats: Stats;
  dead: boolean;
  lastTickHealth: number;
  inventory: Inventory;
  equipped: Array<Equippable>;
  map: Map;
  missProb: number;
  sightRadius: number;

  constructor(game: Game, x: number, y: number) {
    this.game = game;

    this.x = x;
    this.y = y;

    Input.spaceListener = this.spaceListener;
    Input.spaceUpListener = this.spaceUpListener;
    Input.leftListener = this.leftListener;
    Input.rightListener = this.rightListener;
    Input.upListener = this.upListener;
    Input.downListener = this.downListener;

    this.health = 1;
    this.stats = new Stats();
    this.dead = false;
    this.flashing = false;
    this.flashingFrame = 0;
    this.lastTickHealth = this.health;

    this.equipped = Array<Equippable>();
    this.inventory = new Inventory(game);

    this.map = new Map(game);

    this.missProb = 0.1;

    this.sightRadius = 4; // maybe can be manipulated by items? e.g. better torch
  }

  spaceListener = () => {
    // dev tools: chest spawning
    // this.game.level.levelArray[this.x][this.y] = new Chest(
    //   this.game.level,
    //   this.game,
    //   this.x,
    //   this.y
    // );
    this.map.open();
  };
  spaceUpListener = () => {
    this.map.close();
  };
  leftListener = () => {
    if (this.map.isOpen) {
      this.map.leftListener();
    } else if (!this.dead) this.tryMove(this.x - 1, this.y);
  };
  rightListener = () => {
    if (this.map.isOpen) {
      this.map.rightListener();
    } else if (!this.dead) this.tryMove(this.x + 1, this.y);
  };
  upListener = () => {
    if (this.map.isOpen) {
      this.map.upListener();
    } else if (!this.dead) this.tryMove(this.x, this.y - 1);
  };
  downListener = () => {
    if (this.map.isOpen) {
      this.map.downListener();
    } else if (!this.dead) this.tryMove(this.x, this.y + 1);
  };

  hit = (): number => {
    return 1;
  };

  tryMove = (x: number, y: number) => {
    let hitEnemy = false;
    for (let e of this.game.level.enemies) {
      if (e.x === x && e.y === y) {
        let dmg = this.hit();
        e.hurt(this, dmg);
        this.game.level.textParticles.push(
          new TextParticle("" + dmg, x + 0.5, y - 0.5, GameConstants.HIT_ENEMY_TEXT_COLOR, 5)
        );
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
        } else if (other instanceof UnlockedGoldenDoor) {
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
        } else if (other instanceof GoldenDoor) {
          if (x - this.x === 0) {
            this.drawX = (this.x - x) * 0.5;
            this.drawY = (this.y - y) * 0.5;
            other.unlock(this);
            this.game.level.tick();
          }
        } else if (other instanceof BottomDoor || other instanceof Trapdoor) {
          this.move(x, y);
          other.onCollide(this);
        } else if (other instanceof Spike) {
          this.move(x, y);
          other.onCollide(this);
          this.game.level.tick();
        }
      }
    }
  };

  hurt = (damage: number) => {
    let armor = null;
    for (const i of this.inventory.items) {
      if (i instanceof Armor) {
        armor = i;
        break;
      }
    }
    if (armor !== null && armor.health > 0) {
      let totalDamage = 0;
      armor.hurt(damage);
    } else {
      this.flashing = true;
      this.health -= damage;
      if (this.health <= 0) {
        this.health = 0;
        this.dead = true;
      }
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
        if (i instanceof Pickup) {
          i.onPickup(this);
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

  update = () => { };

  startTick = () => { };

  finishTick = () => {
    this.flashing = false;

    let totalHealthDiff = this.health - this.lastTickHealth;
    this.lastTickHealth = this.health; // update last tick health
    if (totalHealthDiff < 0) {
      this.game.level.textParticles.push(
        new TextParticle("" + totalHealthDiff, this.x + 0.5, this.y - 0.5, GameConstants.RED, 0)
      );
    }
    else if (totalHealthDiff > 0) {
      this.game.level.textParticles.push(
        new TextParticle("+" + totalHealthDiff, this.x + 0.5, this.y - 0.5, GameConstants.RED, 0)
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
      for (let i = 0; i < this.health; i++) {
        Game.drawItem(8, 0, 1, 2, i, LevelConstants.SCREEN_H - 2, 1, 2);
      }
      for (const i of this.inventory.items) {
        if (i instanceof Armor)
          i.drawGUI(this.health);
      }
      // this.stats.drawGUI(); TODO
    } else {
      Game.ctx.fillStyle = LevelConstants.LEVEL_TEXT_COLOR;
      let gameOverString = "Game Over.";
      Game.ctx.fillText(
        gameOverString,
        GameConstants.WIDTH / 2 - Game.ctx.measureText(gameOverString).width / 2,
        GameConstants.HEIGHT / 2
      );
      let refreshString = "[refresh to restart]";
      Game.ctx.fillText(
        refreshString,
        GameConstants.WIDTH / 2 - Game.ctx.measureText(refreshString).width / 2,
        GameConstants.HEIGHT / 2 + GameConstants.FONT_SIZE
      );
    }
    this.inventory.draw();

    this.map.draw();
  };
}
