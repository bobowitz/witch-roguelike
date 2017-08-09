import { Input } from "./input";
import { GameConstants } from "./gameConstants";
import { Game } from "./game";
import { Door } from "./tile/door";
import { BottomDoor } from "./tile/bottomDoor";
import { Trapdoor } from "./tile/trapdoor";
import { HealthBar } from "./healthbar";
import { Chest } from "./tile/chest";
import { Floor } from "./tile/floor";
import { Inventory } from "./inventory";
import { LockedDoor } from "./tile/lockedDoor";
import { Sound } from "./sound";
import { Potion } from "./item/potion";
import { Spike } from "./tile/spike";
import { TextParticle } from "./textParticle";
import { Armor } from "./item/armor";
import { Item } from "./item/item";
import { Equippable } from "./item/equippable";
import { Helmet } from "./item/helmet";
import { LevelConstants } from "./levelConstants";
import { Map } from "./map";
import { Pickup } from "./item/pickup";
import { Crate } from "./enemy/crate";

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
  equipped: Array<Equippable>;
  map: Map;
  missProb: number;

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

    this.healthBar = new HealthBar(50);
    this.dead = false;
    this.flashing = false;
    this.flashingFrame = 0;
    this.lastTickHealth = this.healthBar.health;

    this.equipped = Array<Equippable>();
    this.inventory = new Inventory(game);

    this.map = new Map(game);

    this.missProb = 0.1;
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
    return Game.randTable([3, 4, 5, 5, 5, 5, 5, 5, 5, 5, 6, 7, 8, 9, 10]);
  };

  tryMove = (x: number, y: number) => {
    let hitEnemy = false;
    for (let e of this.game.level.enemies) {
      if (e.x === x && e.y === y) {
        let dmg = this.hit();
        e.hurt(dmg);
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
          this.game.level.tick();
        } else if (other instanceof Spike) {
          this.move(x, y);
          other.onCollide(this);
          this.game.level.tick();
        }
      }
    }
  };

  buffHealth = (amount: number) => {
    this.healthBar.fullHealth += amount;
    //this.healthBar.health += amount;

    this.game.level.textParticles.push(
      new TextParticle("+" + amount, this.x + 0.5, this.y - 0.5, GameConstants.HEALTH_BUFF_COLOR, 0)
    );

    Sound.powerup();
  };

  heal = (amount: number) => {
    this.healthBar.heal(amount);

    Sound.heal();
  };

  hurt = (damage: number) => {
    let allArmor = Array<Armor | Helmet>();
    for (const e of this.equipped) {
      if (e instanceof Armor || e instanceof Helmet) {
        allArmor.push(e);
      }
    }
    if (allArmor.length > 0) {
      let totalDamage = 0;
      let avgDamage = damage / allArmor.length;
      for (let i = 0; i < allArmor.length; i++) {
        allArmor[i].hurt(Math.round((i + 1) * avgDamage - totalDamage));
        totalDamage += Math.round(avgDamage - totalDamage);
      }
    } else {
      this.flashing = true;
      this.healthBar.hurt(damage);
      if (this.healthBar.health <= 0) {
        this.healthBar.health = 0;

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

  update = () => {};

  startTick = () => {};

  finishTick = () => {
    this.flashing = false;

    let totalHealthDiff = this.healthBar.health - this.lastTickHealth;
    this.lastTickHealth = this.healthBar.health; // update last tick health
    if (totalHealthDiff < 0) {
      this.game.level.textParticles.push(
        new TextParticle("" + totalHealthDiff, this.x + 0.5, this.y - 0.5, GameConstants.RED, 0)
      );
    } else if (totalHealthDiff > 0) {
      this.game.level.textParticles.push(
        new TextParticle("+" + totalHealthDiff, this.x + 0.5, this.y - 0.5, GameConstants.GREEN, 0)
      );
    } else {
      // if no health changes, check for health changes (we don't want them to overlap, health changes have priority)

      let totalArmorDiff = 0;
      this.missProb = 0.1; // check this here too
      for (const e of this.equipped) {
        if (e instanceof Armor || e instanceof Helmet) {
          totalArmorDiff += e.health - e.lastTickHealth;
          e.lastTickHealth = e.health;
          this.missProb += 0.1; // for each equipped piece of armor, increase missProb by .1
        }
      }
      if (totalArmorDiff < 0) {
        this.game.level.textParticles.push(
          new TextParticle(
            "" + totalArmorDiff,
            this.x + 0.5,
            this.y - 0.5,
            GameConstants.ARMOR_GREY
          )
        );
      } else if (totalArmorDiff > 0) {
        this.game.level.textParticles.push(
          new TextParticle(
            "+" + totalArmorDiff,
            this.x + 0.5,
            this.y - 0.5,
            GameConstants.ARMOR_GREY
          )
        );
      }
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
        for (const e of this.equipped) {
          if (e instanceof Armor || e instanceof Helmet)
            e.drawEquipped(this.x - this.drawX, this.y - this.drawY);
        }
      }
    }
  };

  drawTopLayer = () => {
    if (!this.dead) {
      this.healthBar.drawAboveTile(this.x - this.drawX + 0.5, this.y - 0.75 - this.drawY);
      Game.ctx.fillStyle = LevelConstants.LEVEL_TEXT_COLOR;
      let healthArmorString = this.healthBar.health + "/" + this.healthBar.fullHealth;
      let totalArmor = 0;
      for (const e of this.equipped) {
        if (e instanceof Armor || e instanceof Helmet) {
          totalArmor += e.health;
        }
      }
      healthArmorString += totalArmor === 0 ? "" : "+" + totalArmor + " armor";
      Game.ctx.fillText(healthArmorString, 3, GameConstants.HEIGHT - 20);
    } else {
      Game.ctx.fillStyle = LevelConstants.LEVEL_TEXT_COLOR;
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

    this.map.draw();
  };
}
