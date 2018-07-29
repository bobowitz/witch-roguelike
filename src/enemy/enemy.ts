import { Collidable } from "../tile/collidable";
import { Game } from "../game";
import { Level } from "../level";
import { Bones } from "../tile/bones";
import { LevelConstants } from "../levelConstants";
import { Player } from "../player";
import { DeathParticle } from "../particle/deathParticle";

export enum EnemyDirection {
  DOWN = 0,
  UP = 1,
  RIGHT = 2,
  LEFT = 3,
}

export class Enemy extends Collidable {
  direction: EnemyDirection;
  drawX: number;
  drawY: number;
  dead: boolean;
  game: Game;
  health: number;
  tileX: number;
  tileY: number;
  hasShadow: boolean;
  skipNextTurns: number;
  pushable: boolean; // can the player push this enemy? (true for crates/barrels, false for regular mobs)
  chainPushable: boolean; // can the player pushing another enemy push this enemy? (false for crates/barrels, true for regular mobs)

  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, x, y);
    this.game = game;
    this.drawX = 0;
    this.drawY = 0;
    this.health = 1;
    this.tileX = 0;
    this.tileY = 0;
    this.hasShadow = true;
    this.skipNextTurns = 0;
    this.direction = EnemyDirection.DOWN;
    this.pushable = false;
    this.chainPushable = true;
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
    if (this.game.level.getCollidable(x, y) === null) {
      this.x = x;
      this.y = y;
    }
  };

  hit = (): number => {
    return 0;
  };

  dropXP = () => {
    return 0;
  };

  hurt = (player: Player, damage: number) => {
    this.health -= damage;
    if (this.health <= 0) {
      player.stats.getXP(this.dropXP());
      this.kill();
    }
  };

  kill = () => {
    let b = new Bones(this.level, this.x, this.y);
    b.skin = this.level.levelArray[this.x][this.y].skin;
    this.level.levelArray[this.x][this.y] = b;

    this.dead = true;
    this.level.particles.push(new DeathParticle(this.x, this.y));
  };

  killNoBones = () => {
    this.dead = true;
    this.level.particles.push(new DeathParticle(this.x, this.y));
  };

  isShaded = () => {
    return this.level.visibilityArray[this.x][this.y] <= LevelConstants.VISIBILITY_CUTOFF;
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
  drawTopLayer = () => {};
}
