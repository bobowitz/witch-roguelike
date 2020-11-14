import { Input, InputEnum } from "./input";
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
import { Chest } from "./enemy/chest";
import { Map } from "./map";
import { SlashParticle } from "./particle/slashParticle";
import { HealthBar } from "./healthbar";
import { VendingMachine } from "./enemy/vendingMachine";
import { SideDoor } from "./tile/sidedoor";

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
  levelID: number; // which room we're in (level[levelID])
  flashing: boolean;
  flashingFrame: number;
  health: number;
  maxHealth: number;
  healthBar: HealthBar;
  dead: boolean;
  lastTickHealth: number;
  inventory: Inventory;
  missProb: number;
  sightRadius: number;
  defaultSightRadius: number;
  guiHeartFrame: number;
  map: Map;
  openVendingMachine: VendingMachine;
  isLocalPlayer: boolean;

  constructor(game: Game, x: number, y: number, isLocalPlayer: boolean) {
    this.game = game;

    this.levelID = 0;

    this.x = x;
    this.y = y;
    this.w = 1;
    this.h = 1;

    this.frame = 0;

    this.direction = PlayerDirection.UP;

    this.isLocalPlayer = isLocalPlayer;
    if (isLocalPlayer) {
      Input.iListener = () => this.inputHandler(InputEnum.I);
      Input.qListener = () => this.inputHandler(InputEnum.Q);
      Input.leftListener = () => this.inputHandler(InputEnum.LEFT);
      Input.rightListener = () => this.inputHandler(InputEnum.RIGHT);
      Input.upListener = () => this.inputHandler(InputEnum.UP);
      Input.downListener = () => this.inputHandler(InputEnum.DOWN);
      Input.spaceListener = () => this.inputHandler(InputEnum.SPACE);
      //Input.leftSwipeListener = () => this.inputHandler(InputEnum.I);
      //Input.rightSwipeListener = () => this.inputHandler(InputEnum.I);
      //Input.upSwipeListener = () => this.inputHandler(InputEnum.I);
      //Input.downSwipeListener = () => this.inputHandler(InputEnum.I);
      //Input.tapListener = () => this.inputHandler(InputEnum.I);
    }

    this.health = 2;
    this.maxHealth = 2;
    this.healthBar = new HealthBar();
    this.dead = false;
    this.flashing = false;
    this.flashingFrame = 0;
    this.lastTickHealth = this.health;
    this.guiHeartFrame = 0;

    this.inventory = new Inventory(game, this);

    this.missProb = 0.1;

    this.defaultSightRadius = 6;
    this.sightRadius = this.defaultSightRadius;

    this.map = new Map(this.game);
  }

  inputHandler = (input: InputEnum) => {
    switch(input) {
      case InputEnum.I:
        this.game.socket.emit('input', this.game.localPlayerID, input);
        this.iListener();
        break;
      case InputEnum.Q:
        this.game.socket.emit('input', this.game.localPlayerID, input);
        this.qListener();
        break;
      case InputEnum.LEFT:
        if (this.leftListener(true)) this.game.socket.emit('input', this.game.localPlayerID, input);
        break;
      case InputEnum.RIGHT:
        if (this.rightListener(true)) this.game.socket.emit('input', this.game.localPlayerID, input);
        break;
      case InputEnum.UP:
        if (this.upListener(true)) this.game.socket.emit('input', this.game.localPlayerID, input);
        break;
      case InputEnum.DOWN:
        if (this.downListener(true)) this.game.socket.emit('input', this.game.localPlayerID, input);
        break;
      case InputEnum.SPACE:
        this.game.socket.emit('input', this.game.localPlayerID, input);
        this.spaceListener();
        break;
    }
  };

  tapListener = () => {
    this.inventory.open();
  };
  iListener = () => {
    this.inventory.open();
  };
  qListener = () => {
    if (this.inventory.isOpen) {
      this.inventory.drop();
    }
  };
  leftListener = (isLocal: boolean): boolean => {
    if (this.inventory.isOpen) {
      this.inventory.left();
      return true;
    }
    if (!this.dead && (!isLocal || this.game.levelState === LevelState.IN_LEVEL)) {
      this.left();
      return true;
    }

    return false;
  };
  rightListener = (isLocal: boolean): boolean => {
    if (this.inventory.isOpen) {
      this.inventory.right();
      return true;
    }
    if (!this.dead && (!isLocal || this.game.levelState === LevelState.IN_LEVEL)) {
      this.right();
      return true;
    }

    return false;
  };
  upListener = (isLocal: boolean): boolean => {
    if (this.inventory.isOpen) {
      this.inventory.up();
      return true;
    }
    if (!this.dead && (!isLocal || this.game.levelState === LevelState.IN_LEVEL)) {
      this.up();
      return true;
    }

    return false;
  };
  downListener = (isLocal: boolean): boolean => {
    if (this.inventory.isOpen) {
      this.inventory.down();
      return true;
    }
    if (!this.dead && (!isLocal || this.game.levelState === LevelState.IN_LEVEL)) {
      this.down();
      return true;
    }

    return false;
  };
  spaceListener = () => {
    if (this.inventory.isOpen) {
      this.inventory.space();
      return;
    }
    if (this.openVendingMachine) {
      this.openVendingMachine.space();
    }
  };
  left = () => {
    this.tryMove(this.x - 1, this.y);
    this.direction = PlayerDirection.LEFT;
  };
  right = () => {
    this.tryMove(this.x + 1, this.y);
    this.direction = PlayerDirection.RIGHT;
  };
  up = () => {
    this.tryMove(this.x, this.y - 1);
    this.direction = PlayerDirection.UP;
  };
  down = () => {
    this.tryMove(this.x, this.y + 1);
    this.direction = PlayerDirection.DOWN;
  };

  hit = (): number => {
    return 1;
  };

  tryCollide = (other: any, newX: number, newY: number) => {
    if (newX >= other.x + other.w || newX + this.w <= other.x) return false;
    if (newY >= other.y + other.h || newY + this.h <= other.y) return false;
    return true;
  };

  tryMove = (x: number, y: number) => {
    // TODO don't move if hit by enemy
    this.game.levels[this.levelID].catchUp();

    if (this.dead) return;

    if (this.inventory.hasWeapon() && !this.inventory.getWeapon().weaponMove(x, y)) {
      return;
    }

    for (let e of this.game.levels[this.levelID].enemies) {
      if (this.tryCollide(e, x, y)) {
        if (e.pushable) {
          // pushing a crate or barrel
          let dx = x - this.x;
          let dy = y - this.y;
          let nextX = x + dx;
          let nextY = y + dy;
          let foundEnd = false; // end of the train of whatever we're pushing
          let enemyEnd = false; // end of the train is a solid enemy (i.e. potted plant)
          let pushedEnemies = [];
          while (true) {
            foundEnd = true;
            for (const f of this.game.levels[this.levelID].enemies) {
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
            (this.game.levels[this.levelID].levelArray[nextX][nextY].canCrushEnemy() || enemyEnd)
          ) {
            if (e.destroyable) {
              e.kill();
              if (this.game.levels[this.levelID] === this.game.level) Sound.hit();
              this.drawX = 0.5 * (this.x - e.x);
              this.drawY = 0.5 * (this.y - e.y);
              this.game.levels[this.levelID].particles.push(new SlashParticle(e.x, e.y));
              this.game.levels[this.levelID].tick(this);
              this.game.shakeScreen(10 * this.drawX, 10 * this.drawY);
              return;
            }
          } else {
            if (this.game.levels[this.levelID] === this.game.level) Sound.push();
            // here pushedEnemies may still be []
            for (const f of pushedEnemies) {
              f.x += dx;
              f.y += dy;
              f.drawX = dx;
              f.drawY = dy;
              f.skipNextTurns = 1; // skip next turn, so they don't move while we're pushing them
            }
            if (this.game.levels[this.levelID].levelArray[nextX][nextY].canCrushEnemy() || enemyEnd)
              pushedEnemies[pushedEnemies.length - 1].killNoBones();
            e.x += dx;
            e.y += dy;
            e.drawX = dx;
            e.drawY = dy;
            this.move(x, y);
            this.game.levels[this.levelID].tick(this);
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
    let other = this.game.levels[this.levelID].levelArray[x][y];
    if (!other.isSolid()) {
      this.move(x, y);
      other.onCollide(this);
      if (
        !(
          other instanceof Door ||
          other instanceof BottomDoor ||
          other instanceof Trapdoor ||
          other instanceof SideDoor
        )
      )
        this.game.levels[this.levelID].tick(this);
    } else {
      if (other instanceof LockedDoor) {
        this.drawX = (this.x - x) * 0.5;
        this.drawY = (this.y - y) * 0.5;
        other.unlock(this);
        this.game.levels[this.levelID].tick(this);
      }
    }
  };

  hurt = (damage: number) => {
    if (this.game.levels[this.levelID] === this.game.level) Sound.hurt();

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

    for (let i of this.game.levels[this.levelID].items) {
      if (i.x === x && i.y === y) {
        i.onPickup(this);
      }
    }

    this.game.levels[this.levelID].updateLighting();
  };

  doneMoving = (): boolean => {
    let EPSILON = 0.01;
    return Math.abs(this.drawX) < EPSILON && Math.abs(this.drawY) < EPSILON;
  };

  move = (x: number, y: number) => {
    if (this.game.levels[this.levelID] === this.game.level) Sound.playerStoneFootstep();

    if (this.openVendingMachine) this.openVendingMachine.close();

    this.drawX = x - this.x;
    this.drawY = y - this.y;
    this.x = x;
    this.y = y;

    for (let i of this.game.levels[this.levelID].items) {
      if (i.x === x && i.y === y) {
        i.onPickup(this);
      }
    }

    this.game.levels[this.levelID].updateLighting();
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

            Game.drawFX(4, 2, 1, 1, i, LevelConstants.SCREEN_H - 1, 1, 1);
          } else {
            Game.drawFX(3, 2, 1, 1, i, LevelConstants.SCREEN_H - 1, 1, 1);
          }
        } else Game.drawFX(frame, 2, 1, 1, i, LevelConstants.SCREEN_H - 1, 1, 1);
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
    if (Input.isDown(Input.M) || Input.isTapHold) {
      this.map.draw();
    }
  };

  updateDrawXY = () => {
    this.drawX += -0.5 * this.drawX;
    this.drawY += -0.5 * this.drawY;
  };
}
