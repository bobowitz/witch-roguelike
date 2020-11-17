import { Game } from "../game";
import { Level } from "../level";
import { Bones } from "../tile/bones";
import { LevelConstants } from "../levelConstants";
import { Player } from "../player";
import { DeathParticle } from "../particle/deathParticle";
import { Floor } from "../tile/floor";
import { GenericParticle } from "../particle/genericParticle";
import { HealthBar } from "../healthbar";
import { Drawable } from "../drawable";
import { Item } from "../item/item";
import { GameConstants } from "../gameConstants";

export enum EnemyDirection {
  DOWN = 0,
  UP = 1,
  RIGHT = 2,
  LEFT = 3,
}

export class Enemy extends Drawable {
  level: Level;
  x: number;
  y: number;
  w: number;
  h: number;
  direction: EnemyDirection;
  drawX: number;
  drawY: number;
  dead: boolean;
  game: Game;
  health: number;
  maxHealth: number;
  tileX: number;
  tileY: number;
  hasShadow: boolean;
  skipNextTurns: number;
  //TODO: change these to functions? for enemies that switch states
  destroyable: boolean; // can the player destroy this enemy?
  pushable: boolean; // can the player push this enemy? (true for crates/barrels, false for regular mobs)
  chainPushable: boolean; // can the player pushing another enemy push this enemy? (default true)
  interactable: boolean; // can the player interact
  deathParticleColor: string;
  healthBar: HealthBar;
  drop: Item;
  sleepingZFrame = 0;
  alert: boolean;
  exclamationFrame: number;

  constructor(level: Level, game: Game, x: number, y: number) {
    super();

    this.level = level;
    this.x = x;
    this.y = y;
    this.w = 1;
    this.h = 1;
    this.game = game;
    this.drawX = 0;
    this.drawY = 0;
    this.health = 1;
    this.maxHealth = 1;
    this.tileX = 0;
    this.tileY = 0;
    this.hasShadow = true;
    this.skipNextTurns = 0;
    this.direction = EnemyDirection.DOWN;
    this.destroyable = true;
    this.pushable = false;
    this.chainPushable = true;
    this.interactable = false;
    this.deathParticleColor = "#ff00ff";
    this.healthBar = new HealthBar();
    this.alert = false;
    this.exclamationFrame = 0;
  }

  tryMove = (x: number, y: number) => {
    for (const e of this.level.enemies) {
      if (e !== this && e.x === x && e.y === y) {
        return;
      }
    }
    for (const i in this.game.players) {
      if (this.game.players[i].x === x && this.game.players[i].y === y) {
        return;
      }
    }
    if (!this.level.levelArray[x][y].isSolid()) {
      this.level.levelArray[x][y].onCollideEnemy(this);
      this.x = x;
      this.y = y;
    }
  };

  hit = (): number => {
    return 0;
  };

  hurtCallback = () => { };

  hurt = (playerHitBy: Player, damage: number) => {
    this.healthBar.hurt();

    this.health -= damage;
    if (this.health <= 0) this.kill();
    else this.hurtCallback();
  };

  interact = (player: Player) => { };

  dropLoot = () => { };

  kill = () => {
    if (this.level.levelArray[this.x][this.y] instanceof Floor) {
      let b = new Bones(this.level, this.x, this.y);
      b.skin = this.level.levelArray[this.x][this.y].skin;
      this.level.levelArray[this.x][this.y] = b;
    }

    this.dead = true;
    GenericParticle.spawnCluster(this.level, this.x + 0.5, this.y + 0.5, this.deathParticleColor);
    this.level.particles.push(new DeathParticle(this.x, this.y));

    this.dropLoot();
  };

  killNoBones = () => {
    this.dead = true;
    GenericParticle.spawnCluster(this.level, this.x + 0.5, this.y + 0.5, this.deathParticleColor);
    this.level.particles.push(new DeathParticle(this.x, this.y));
  };

  shadeAmount = () => {
    return this.level.softVis[this.x][this.y];
  };

  doneMoving = (): boolean => {
    let EPSILON = 0.01;
    return Math.abs(this.drawX) < EPSILON && Math.abs(this.drawY) < EPSILON;
  };

  nearestPlayer = (): [number, Player] | false => {
    const maxDistance = 138291380921; // pulled this straight outta my ass
    let closestDistance = maxDistance;
    let closestPlayer = null;
    for (const i in this.game.players) {
      if (this.game.levels[this.game.players[i].levelID] === this.level) {
        let distance = Math.max(Math.abs(this.x - this.game.players[i].x), Math.abs(this.y - this.game.players[i].y));
        if (distance < closestDistance) {
          closestDistance = distance;
          closestPlayer = this.game.players[i];
        }
      }
    }

    if (closestDistance === maxDistance)
      return false;
    else
      return [closestDistance, closestPlayer];
  };

  seesPlayer = (): boolean => {
    let RADIUS = 4;
    return (
      Math.abs(this.x - this.game.players[this.game.localPlayerID].x) <= RADIUS &&
      Math.abs(this.y - this.game.players[this.game.localPlayerID].y) <= RADIUS
    );
  };

  facePlayer = () => {
    let dx = this.game.players[this.game.localPlayerID].x - this.x;
    let dy = this.game.players[this.game.localPlayerID].y - this.y;
    if (Math.abs(dx) === Math.abs(dy)) {
      // just moved, already facing player
    } else if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) this.direction = EnemyDirection.RIGHT;
      if (dx < 0) this.direction = EnemyDirection.LEFT;
    } else {
      if (dy > 0) this.direction = EnemyDirection.DOWN;
      if (dy < 0) this.direction = EnemyDirection.UP;
    }
  };

  draw = () => {
    if (!this.dead) {
      if (this.hasShadow)
        Game.drawMob(
          0,
          0,
          1,
          1,
          this.x - this.drawX,
          this.y - this.drawY,
          1,
          1,
          this.level.shadeColor,
          this.shadeAmount()
        );
      Game.drawMob(
        this.tileX,
        this.tileY + this.direction * 2,
        1,
        2,
        this.x - this.drawX,
        this.y - 1.5 - this.drawY,
        1,
        2,
        this.level.shadeColor,
        this.shadeAmount()
      );
    }
  };
  tick = () => { };
  drawTopLayer = () => {
    this.drawableY = this.y - this.drawY;

    this.healthBar.draw(this.health, this.maxHealth, this.x, this.y, true);
    this.drawX += -0.5 * this.drawX;
    this.drawY += -0.5 * this.drawY;
  };

  drawSleepingZs = () => {
    this.sleepingZFrame++;

    let numZs = 2;
    let t = (this.sleepingZFrame) * 0.01; // 0 <= t < 1
    t -= Math.floor(t);
    //let whichway = Math.floor(this.sleepingZFrame * 0.02 / numZs) % 2;
    for (let off = numZs - 1; off >= 0; off--) {
      let yoff = (t + off) * 7;
      let alpha = Math.min(1 - (t + off) / numZs, 2 * (t + off) / numZs);

      let xoff = 0;
      //if (off !== 1 && t > 0.5) xoff = 1;
      //if (off === 1 && t > 0.5) xoff = -1;
      //if (whichway === 1) xoff *= -1;

      let width = Game.measureText('Z').width;
      Game.ctx.globalAlpha = alpha;
      Game.fillTextOutline(
        'Z',
        (this.x + 0.5) * GameConstants.TILESIZE - width / 2 + xoff,
        (this.y - 0.75) * GameConstants.TILESIZE - yoff,
        GameConstants.OUTLINE,
        "white"
      );
      Game.ctx.globalAlpha = 1;
    }
  }

  drawExclamation = () => {
    this.exclamationFrame++;

    let yoff: number | false = 0;
    let yoffs: Array<number | false> = [0, -1, -2, -3, -5, -7, -4];
    if (this.exclamationFrame > yoffs.length) yoff = yoffs[yoffs.length - 1];
    else yoff = yoffs[this.exclamationFrame];

    let width = Game.measureText('!').width;
    Game.ctx.globalAlpha = 1;
    if (yoff !== false) {
      Game.fillTextOutline(
        '!',
        (this.x + 0.5) * GameConstants.TILESIZE - width / 2,
        (this.y - 0.75) * GameConstants.TILESIZE + yoff,
        GameConstants.OUTLINE,
        GameConstants.WARNING_RED
      );
    }
  }
}
