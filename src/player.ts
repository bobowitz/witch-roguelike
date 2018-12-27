import { Input } from "./input";
import { GameConstants } from "./gameConstants";
import { Game, LevelState } from "./game";
import { Door } from "./tile/door";
import { BottomDoor } from "./tile/bottomDoor";
import { Trapdoor } from "./tile/trapdoor";
import { Inventory } from "./inventory";
import { LockedDoor } from "./tile/lockedDoor";
import { Sound } from "./sound";
import { TextParticle } from "./particle/textParticle";
import { DashParticle } from "./particle/dashParticle";
import { LevelConstants } from "./levelConstants";
import { Stats } from "./stats";
import { Chest } from "./enemy/chest";
import { Map } from "./map";
import { GenericParticle } from "./particle/genericParticle";
import { SlashParticle } from "./particle/slashParticle";
import { SkullEnemy } from "./enemy/skullEnemy";
import { KnightEnemy } from "./enemy/knightEnemy";
import { HealthBar } from "./healthbar";
import { EmeraldResource } from "./enemy/emeraldResource";
import { Gem } from "./item/gem";
import { ShopScreen } from "./shopScreen";
import { Coal } from "./item/coal";
import { Weapon } from "./weapon/weapon";
import { Dagger } from "./weapon/dagger";
import { Spear } from "./weapon/spear";

enum PlayerDirection {
  DOWN = 0,
  UP = 1,
  RIGHT = 2,
  LEFT = 3,
}

export class Player {
  x: number;
  y: number;
  w: number;
  h: number;
  drawX: number;
  drawY: number;
  frame: number;
  direction: PlayerDirection;
  game: Game;
  flashing: boolean;
  flashingFrame: number;
  health: number;
  maxHealth: number;
  healthBar: HealthBar;
  stats: Stats;
  dead: boolean;
  lastTickHealth: number;
  inventory: Inventory;
  shopScreen: ShopScreen;
  missProb: number;
  sightRadius: number;
  guiHeartFrame: number;
  map: Map;
  weapon: Weapon;

  constructor(game: Game, x: number, y: number) {
    this.game = game;

    this.x = x;
    this.y = y;
    this.w = 1;
    this.h = 1;

    this.frame = 0;

    this.direction = PlayerDirection.UP;

    Input.iListener = this.iListener;
    Input.iUpListener = this.iUpListener;
    Input.leftListener = this.leftListener;
    Input.rightListener = this.rightListener;
    Input.upListener = this.upListener;
    Input.downListener = this.downListener;
    Input.leftSwipeListener = this.leftListener;
    Input.rightSwipeListener = this.rightListener;
    Input.upSwipeListener = this.upListener;
    Input.downSwipeListener = this.downListener;

    this.health = 1;
    this.maxHealth = 1;
    this.healthBar = new HealthBar();
    this.stats = new Stats();
    this.dead = false;
    this.flashing = false;
    this.flashingFrame = 0;
    this.lastTickHealth = this.health;
    this.guiHeartFrame = 0;

    this.inventory = new Inventory(game);
    this.shopScreen = new ShopScreen(game);

    this.missProb = 0.1;

    this.sightRadius = 5; // maybe can be manipulated by items? e.g. better torch

    this.map = new Map(this.game);
    this.weapon = new Spear(this.game);
  }

  iListener = () => {
    this.inventory.open();

    this.shopScreen.close();
  };
  iUpListener = () => {
    //this.inventory.close();
  };
  leftListener = () => {
    if (!this.dead && this.game.levelState === LevelState.IN_LEVEL) {
      if (this.shopScreen.isOpen) this.shopScreen.close();

      /*if (Input.isDown(Input.SPACE)) {
        GenericParticle.spawnCluster(this.game.level, this.x - 1 + 0.5, this.y + 0.5, "#ff00ff");
        this.healthBar.hurt();
        this.game.level.items.push(new Coal(this.game.level, this.x - 1, this.y));
      } else */
      this.tryMove(this.x - 1, this.y);
      this.direction = PlayerDirection.LEFT;
    }
  };
  rightListener = () => {
    if (!this.dead && this.game.levelState === LevelState.IN_LEVEL) {
      //if (Input.isDown(Input.SPACE)) this.tryDash(1, 0);
      //else
      if (this.shopScreen.isOpen) this.shopScreen.close();

      this.tryMove(this.x + 1, this.y);
      this.direction = PlayerDirection.RIGHT;
    }
  };
  upListener = () => {
    if (!this.dead && this.game.levelState === LevelState.IN_LEVEL) {
      //if (Input.isDown(Input.SPACE)) this.tryDash(0, -1);
      //else
      if (this.shopScreen.isOpen) this.shopScreen.close();

      this.tryMove(this.x, this.y - 1);
      this.direction = PlayerDirection.UP;
    }
  };
  downListener = () => {
    if (!this.dead && this.game.levelState === LevelState.IN_LEVEL) {
      //if (Input.isDown(Input.SPACE)) this.tryDash(0, 1);
      //else
      if (this.shopScreen.isOpen) this.shopScreen.close();

      this.tryMove(this.x, this.y + 1);
      this.direction = PlayerDirection.DOWN;
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
      let other = this.game.level.levelArray[x][y];
      if (other.isSolid()) break;
      if (other instanceof Door || other instanceof BottomDoor) {
        this.move(x, y);
        other.onCollide(this);
        return;
      }
      other.onCollide(this);

      this.game.level.particles.push(new DashParticle(this.x, this.y, particleFrameOffset));
      particleFrameOffset -= 2;
      let breakFlag = false;
      for (let e of this.game.level.enemies) {
        if (e.x === x && e.y === y) {
          let dmg = this.hit();
          e.hurt(dmg);
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

  tryCollide = (other: any, newX: number, newY: number) => {
    if (newX >= other.x + other.w || newX + this.w <= other.x) return false;
    if (newY >= other.y + other.h || newY + this.h <= other.y) return false;
    return true;
  };

  tryMove = (x: number, y: number) => {
    if (!this.weapon.weaponMove(x, y)) {
      this.game.level.tick();
      return;
    }

    for (let e of this.game.level.enemies) {
      if (this.tryCollide(e, x, y)) {
        if (e.pushable) {
          // pushing a crate or barrel
          let oldEnemyX = e.x;
          let oldEnemyY = e.y;
          let dx = x - this.x;
          let dy = y - this.y;
          let nextX = x + dx;
          let nextY = y + dy;
          let foundEnd = false; // end of the train of whatever we're pushing
          let enemyEnd = false; // end of the train is a solid enemy (none currently exist)
          let pushedEnemies = [];
          while (true) {
            foundEnd = true;
            for (const f of this.game.level.enemies) {
              if (f.x === nextX && f.y === nextY) {
                if (!f.chainPushable) {
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
            (this.game.level.levelArray[nextX][nextY].canCrushEnemy() || enemyEnd)
          ) {
            if (e.destroyable) {
              e.kill();
              Sound.hit();
              this.drawX = 0.5 * (this.x - e.x);
              this.drawY = 0.5 * (this.y - e.y);
              this.game.level.particles.push(new SlashParticle(e.x, e.y));
              this.game.level.tick();
              this.game.shakeScreen(10 * this.drawX, 10 * this.drawY);
              return;
            }
          } else {
            Sound.push();
            // here pushedEnemies may still be []
            for (const f of pushedEnemies) {
              f.x += dx;
              f.y += dy;
              f.drawX = dx;
              f.drawY = dy;
              f.skipNextTurns = 1; // skip next turn, so they don't move while we're pushing them
            }
            if (this.game.level.levelArray[nextX][nextY].canCrushEnemy() || enemyEnd)
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
          // if we're trying to hit an enemy, check if it's destroyable
          if (!e.dead) {
            if (e.interactable) e.interact();
            return;
          }
        }
      }
    }
    let other = this.game.level.levelArray[x][y];
    if (!other.isSolid()) {
      this.move(x, y);
      other.onCollide(this);
      if (!(other instanceof Door || other instanceof BottomDoor || other instanceof Trapdoor))
        this.game.level.tick();
    } else {
      if (other instanceof LockedDoor) {
        this.drawX = (this.x - x) * 0.5;
        this.drawY = (this.y - y) * 0.5;
        other.unlock(this);
        this.game.level.tick();
      }
    }
  };

  hurt = (damage: number) => {
    Sound.hurt();

    if (this.inventory.getArmor() && this.inventory.getArmor().health > 0) {
      this.inventory.getArmor().hurt(damage);
    } else {
      this.healthBar.hurt();
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
        i.onPickup(this);
      }
    }

    this.game.level.updateLighting();
  };

  doneMoving = (): boolean => {
    let EPSILON = 0.01;
    return Math.abs(this.drawX) < EPSILON && Math.abs(this.drawY) < EPSILON;
  };

  move = (x: number, y: number) => {
    Sound.playerStoneFootstep();

    this.drawX = x - this.x;
    this.drawY = y - this.y;
    this.x = x;
    this.y = y;

    for (let i of this.game.level.items) {
      if (i.x === x && i.y === y) {
        i.onPickup(this);
      }
    }

    this.game.level.updateLighting();
  };

  moveNoSmooth = (x: number, y: number) => {
    // doesn't touch smoothing
    this.x = x;
    this.y = y;
  };

  moveSnap = (x: number, y: number) => {
    // no smoothing
    this.x = x;
    this.y = y;
    this.drawX = 0;
    this.drawY = 0;
  };

  update = () => {};

  finishTick = () => {
    this.inventory.tick();

    this.flashing = false;

    let totalHealthDiff = this.health - this.lastTickHealth;
    this.lastTickHealth = this.health; // update last tick health
    if (totalHealthDiff < 0) {
      this.flashing = true;
    }
  };

  drawPlayerSprite = () => {
    this.frame += 0.1;
    if (this.frame >= 4) this.frame = 0;
    Game.drawMob(
      1 + Math.floor(this.frame),
      8 + this.direction * 2,
      1,
      2,
      this.x - this.drawX,
      this.y - 1.5 - this.drawY,
      1,
      2
    );
    if (this.inventory.getArmor() && this.inventory.getArmor().health > 0) {
      // TODO draw armor
    }
  };

  draw = () => {
    this.flashingFrame += 12 / GameConstants.FPS;
    if (!this.dead) {
      Game.drawMob(0, 0, 1, 1, this.x - this.drawX, this.y - this.drawY, 1, 1);
      if (!this.flashing || Math.floor(this.flashingFrame) % 2 === 0) {
        this.drawX += -0.5 * this.drawX;
        this.drawY += -0.5 * this.drawY;
        this.drawPlayerSprite();
      }
    }
  };

  heartbeat = () => {
    this.guiHeartFrame = 1;
  };

  drawTopLayer = () => {
    this.healthBar.draw(
      this.health,
      this.maxHealth,
      this.x - this.drawX,
      this.y - this.drawY,
      !this.flashing || Math.floor(this.flashingFrame) % 2 === 0
    );
  };

  drawGUI = () => {
    if (!this.dead) {
      this.shopScreen.draw();
      this.inventory.draw();

      if (this.guiHeartFrame > 0) this.guiHeartFrame++;
      if (this.guiHeartFrame > 5) {
        this.guiHeartFrame = 0;
      }
      for (let i = 0; i < this.maxHealth; i++) {
        let frame = this.guiHeartFrame > 0 ? 1 : 0;
        if (i >= Math.floor(this.health)) {
          if (i == Math.floor(this.health) && (this.health * 2) % 2 == 1) {
            // draw half heart

            Game.drawFX(4, 2, 1, 1, i, LevelConstants.ROOM_H - 1, 1, 1);
          } else {
            Game.drawFX(3, 2, 1, 1, i, LevelConstants.ROOM_H - 1, 1, 1);
          }
        } else Game.drawFX(frame, 2, 1, 1, i, LevelConstants.ROOM_H - 1, 1, 1);
      }
      if (this.inventory.getArmor()) this.inventory.getArmor().drawGUI(this.maxHealth);
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
    if (Input.isDown(Input.M)) {
      this.map.draw();
    }
  };
}
