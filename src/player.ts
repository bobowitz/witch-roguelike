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
import { TextParticle } from "./particle/textParticle";
import { DashParticle } from "./particle/dashParticle";
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
import { Chest } from "./enemy/chest";
import { WizardFireball } from "./projectile/wizardFireball";
import { Barrel } from "./enemy/barrel";
import { Wall } from "./tile/wall";

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
  armor: Armor;
  missProb: number;
  sightRadius: number;
  guiHeartFrame: number;

  constructor(game: Game, x: number, y: number) {
    this.game = game;

    this.x = x;
    this.y = y;

    this.map = new Map(game);

    Input.iListener = this.iListener;
    Input.iUpListener = this.iUpListener;
    Input.leftListener = this.leftListener;
    Input.rightListener = this.rightListener;
    Input.mListener = this.map.open;
    Input.mUpListener = this.map.close;
    Input.upListener = this.upListener;
    Input.downListener = this.downListener;

    this.health = 3;
    this.stats = new Stats();
    this.dead = false;
    this.flashing = false;
    this.flashingFrame = 0;
    this.lastTickHealth = this.health;
    this.guiHeartFrame = 0;

    this.equipped = Array<Equippable>();
    this.inventory = new Inventory(game);

    this.missProb = 0.1;

    this.armor = null;

    this.sightRadius = 4; // maybe can be manipulated by items? e.g. better torch
  }

  iListener = () => {
    this.inventory.open();
    //this.game.level.enemies.push(new Crate(this.game.level, this.game, this.x, this.y));
  };
  iUpListener = () => {
    this.inventory.close();
  };
  leftListener = () => {
    if (!this.dead) {
      if (Input.isDown(Input.SPACE)) this.tryDash(-1, 0);
      else this.tryMove(this.x - 1, this.y);
    }
  };
  rightListener = () => {
    if (!this.dead) {
      if (Input.isDown(Input.SPACE)) this.tryDash(1, 0);
      else this.tryMove(this.x + 1, this.y);
    }
  };
  upListener = () => {
    if (!this.dead) {
      if (Input.isDown(Input.SPACE)) this.tryDash(0, -1);
      else this.tryMove(this.x, this.y - 1);
    }
  };
  downListener = () => {
    if (!this.dead) {
      if (Input.isDown(Input.SPACE)) this.tryDash(0, 1);
      else this.tryMove(this.x, this.y + 1);
    }
  };

  hit = (): number => {
    return 1;
  };

  // dash length 2
  tryDash = (dx: number, dy: number) => {
    let startX = this.x;
    let startY = this.y;
    let x = this.x;
    let y = this.y;
    let particleFrameOffset = 4;
    while (x !== startX + 2 * dx || y !== startY + 2 * dy) {
      x += dx;
      y += dy;
      let other = this.game.level.getCollidable(x, y);
      if (other === null) {
      } else if (other instanceof Spike) {
        other.onCollide(this);
      } else {
        break;
      }
      this.game.level.particles.push(new DashParticle(this.x, this.y, particleFrameOffset));
      particleFrameOffset -= 2;
      let breakFlag = false;
      for (let e of this.game.level.enemies) {
        if (e.x === x && e.y === y) {
          let dmg = this.hit();
          e.hurt(this, dmg);
          this.game.level.particles.push(
            new TextParticle("" + dmg, x + 0.5, y - 0.5, GameConstants.HIT_ENEMY_TEXT_COLOR, 5)
          );
          if (e instanceof Chest) {
            breakFlag = true;
            this.game.level.tick();
            break;
          }
        }
      }
      if (breakFlag) break;
      this.dashMove(x, y);
    }
    this.drawX = this.x - startX;
    this.drawY = this.y - startY;
    if (this.x !== startX || this.y !== startY) {
      this.game.level.tick();
      this.game.level.particles.push(new DashParticle(this.x, this.y, particleFrameOffset));
    }
  };

  tryMove = (x: number, y: number) => {
    for (let e of this.game.level.enemies) {
      if (e.x === x && e.y === y) {
        if (e instanceof Crate || e instanceof Barrel) {
          // pushing a crate or barrel
          let oldEnemyX = e.x;
          let oldEnemyY = e.y;
          let dx = x - this.x;
          let dy = y - this.y;
          let nextX = x + dx;
          let nextY = y + dy;
          let foundEnd = false; // end of the train of whatever we're pushing
          let enemyEnd = false; // end of the train is a solid enemy (crate/chest/barrel)
          let pushedEnemies = [];
          while (true) {
            foundEnd = true;
            for (const f of this.game.level.enemies) {
              if (f.x === nextX && f.y === nextY) {
                if (f instanceof Crate || f instanceof Barrel || f instanceof Chest) {
                  enemyEnd = true;
                  foundEnd = true;
                  break;
                }
                foundEnd = false;
                pushedEnemies.push(f);
                break;
              }
            }
            if (foundEnd) break;
            nextX += dx;
            nextY += dy;
          }
          /* if no enemies and there is a wall, no move
          otherwise, push everything, killing last enemy if there is a wall */
          // here, (nextX, nextY) is the position immediately after the end of the train
          if (
            pushedEnemies.length === 0 &&
            (this.game.level.getCollidable(nextX, nextY) !== null || enemyEnd)
          ) {
            return;
          } else {
            for (const f of pushedEnemies) {
              f.x += dx;
              f.y += dy;
              f.drawX = dx;
              f.drawY = dy;
              f.skipNextTurns = 1; // skip next turn, so they don't move while we're pushing them
            }
            if (this.game.level.getCollidable(nextX, nextY) !== null || enemyEnd)
              pushedEnemies[pushedEnemies.length - 1].killNoBones();
            e.x += dx;
            e.y += dy;
            e.drawX = dx;
            e.drawY = dy;
            this.move(x, y);
            this.game.level.tick();
            return;
          }
        } else {
          // if we're trying to hit an enemy, do nothing
          return;
        }
      }
    }
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
  };

  hurt = (damage: number) => {
    if (this.armor !== null && this.armor.health > 0) {
      this.armor.hurt(damage);
    } else {
      this.flashing = true;
      this.health -= damage;
      if (this.health <= 0) {
        this.health = 0;
        this.dead = true;
      }
    }
  };

  dashMove = (x: number, y: number) => {
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

    this.game.level.updateLighting();
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

    this.game.level.updateLighting();
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
    for (const p of this.game.level.projectiles) {
      if (p instanceof WizardFireball) {
        if (this.x === p.x && this.y === p.y) {
          p.hit(this); // let fireball determine if it's in a damage-dealing state rn
        }
      }
    }

    this.flashing = false;

    let totalHealthDiff = this.health - this.lastTickHealth;
    this.lastTickHealth = this.health; // update last tick health
    if (totalHealthDiff < 0) {
      this.flashing = true;
      this.game.level.particles.push(
        new TextParticle("" + totalHealthDiff, this.x + 0.5, this.y - 0.5, GameConstants.RED, 0)
      );
    } else if (totalHealthDiff > 0) {
      this.game.level.particles.push(
        new TextParticle("+" + totalHealthDiff, this.x + 0.5, this.y - 0.5, GameConstants.RED, 0)
      );
    }
  };

  draw = () => {
    this.flashingFrame += 12 / GameConstants.FPS;
    if (!this.dead) {
      Game.drawMob(0, 0, 1, 1, this.x - this.drawX, this.y - this.drawY, 1, 1);
      if (!this.flashing || Math.floor(this.flashingFrame) % 2 === 0) {
        this.drawX += -0.5 * this.drawX;
        this.drawY += -0.5 * this.drawY;
        Game.drawMob(1, 0, 1, 2, this.x - this.drawX, this.y - 1.5 - this.drawY, 1, 2);
      }
    }
  };

  drawTopLayer = () => {
    if (!this.dead) {
      this.guiHeartFrame += 1;
      let FREQ = GameConstants.FPS * 1.5;
      this.guiHeartFrame %= FREQ;
      for (let i = 0; i < this.health; i++) {
        let frame = (this.guiHeartFrame + FREQ) % FREQ >= FREQ - 4 ? 1 : 0;
        Game.drawFX(frame, 2, 1, 1, i, LevelConstants.SCREEN_H - 1, 1, 1);
      }
      if (this.armor) this.armor.drawGUI(this.health);
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
