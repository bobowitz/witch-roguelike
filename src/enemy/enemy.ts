import { Game } from "../game";
import { Level } from "../level";
import { Bones } from "../tile/bones";
import { LevelConstants } from "../levelConstants";
import { Player } from "../player";
import { DeathParticle } from "../particle/deathParticle";
import { Floor } from "../tile/floor";
import { GenericParticle } from "../particle/genericParticle";
import { HealthBar } from "../healthbar";

export enum EnemyDirection {
  DOWN = 0,
  UP = 1,
  RIGHT = 2,
  LEFT = 3,
}

export class Enemy {
  level: Level;
  x: number;
  y: number;
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
  deathParticleColor: string;
  healthBar: HealthBar;

  constructor(level: Level, game: Game, x: number, y: number) {
    this.level = level;
    this.x = x;
    this.y = y;
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
    this.deathParticleColor = "#ff00ff";
    this.healthBar = new HealthBar();
  }

  tryMove = (x: number, y: number) => {
    for (const e of this.level.enemies) {
      if (e !== this && e.x === x && e.y === y) {
        return;
      }
    }
    if (this.game.player.x === x && this.game.player.y === y) {
      return;
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

  hurtCallback = () => {};

  hurt = (damage: number) => {
    this.hurtCallback();
    this.healthBar.hurt();

    this.health -= damage;
    if (this.health <= 0) {
      this.kill();
    }
  };

  dropLoot = () => {};

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

  isShaded = () => {
    return this.level.softVisibilityArray[this.x][this.y] <= LevelConstants.SHADED_TILE_CUTOFF;
  };

  doneMoving = (): boolean => {
    let EPSILON = 0.01;
    return Math.abs(this.drawX) < EPSILON && Math.abs(this.drawY) < EPSILON;
  };

  facePlayer = () => {
    let dx = this.game.player.x - this.x;
    let dy = this.game.player.y - this.y;
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
      this.drawX += -0.5 * this.drawX;
      this.drawY += -0.5 * this.drawY;
      if (this.hasShadow)
        Game.drawMob(0, 0, 1, 1, this.x - this.drawX, this.y - this.drawY, 1, 1, this.isShaded());
      Game.drawMob(
        this.tileX,
        this.tileY + this.direction * 2,
        1,
        2,
        this.x - this.drawX,
        this.y - 1.5 - this.drawY,
        1,
        2,
        this.isShaded()
      );
    }
  };
  tick = () => {};
  drawTopLayer = () => {
    this.healthBar.draw(this.health, this.maxHealth, this.x, this.y, true);
  };
}
