import { Enemy, EnemyDirection } from "./enemy";
import { Game } from "../game";
import { Level } from "../level";
import { astar } from "../astarclass";
import { HitWarning } from "../hitWarning";
import { SpikeTrap } from "../tile/spiketrap";
import { Coin } from "../item/coin";
import { Player } from "../player";
import { DualDagger } from "../weapon/dualdagger";
import { Item } from "../item/item";

export class SlimeEnemy extends Enemy {
  moves: Array<astar.AStarData>;
  ticks: number;
  frame: number;
  seenPlayer: boolean;
  targetPlayer: Player;
  rand: () => number;
  drop: Item;

  constructor(level: Level, game: Game, x: number, y: number, rand: () => number, drop?: Item) {
    super(level, game, x, y);
    this.moves = new Array<astar.AStarData>(); // empty move list
    this.ticks = 0;
    this.frame = 0;
    this.health = 1;
    this.maxHealth = 1;
    this.tileX = 8;
    this.tileY = 4;
    this.seenPlayer = false;
    this.deathParticleColor = "#ffffff";

    this.rand = rand;
    if (drop) this.drop = drop;
    else {
      this.drop = new Coin(this.level, 0, 0);
    }
  }

  hurt = (playerHitBy: Player, damage: number) => {
    if (playerHitBy) this.targetPlayer = playerHitBy;
    this.healthBar.hurt();

    this.health -= damage;
    if (this.health <= 0) this.kill();
    else this.hurtCallback();
  };

  hit = (): number => {
    return 1;
  };

  tick = () => {
    if (!this.dead) {
      if (this.skipNextTurns > 0) {
        this.skipNextTurns--;
        return;
      }
      if (!this.seenPlayer) {
        const result = this.nearestPlayer();
        if (result !== false) {
          let [distance, p] = result;
          if (distance < 4) {
            this.tileX = 9;
            this.tileY = 4;
            this.seenPlayer = true;
            this.targetPlayer = p;
            if (p === this.game.players[this.game.localPlayerID]) this.alert = true;
            this.level.hitwarnings.push(new HitWarning(this.game, this.x - 1, this.y));
            this.level.hitwarnings.push(new HitWarning(this.game, this.x + 1, this.y));
            this.level.hitwarnings.push(new HitWarning(this.game, this.x, this.y - 1));
            this.level.hitwarnings.push(new HitWarning(this.game, this.x, this.y + 1));
          }
        }
      }
      else if (this.seenPlayer && this.level.playerTicked === this.targetPlayer) {
        this.alert = false;
        this.ticks++;
        this.tileX = 9;
        this.tileY = 4;
        if (this.ticks % 2 === 1) {
          this.tileX = 8;
          this.tileY = 4;

          let oldX = this.x;
          let oldY = this.y;
          let disablePositions = Array<astar.Position>();
          for (const e of this.level.enemies) {
            if (e !== this) {
              disablePositions.push({ x: e.x, y: e.y } as astar.Position);
            }
          }
          for (let xx = this.x - 1; xx <= this.x + 1; xx++) {
            for (let yy = this.y - 1; yy <= this.y + 1; yy++) {
              if (
                this.level.levelArray[xx][yy] instanceof SpikeTrap &&
                (this.level.levelArray[xx][yy] as SpikeTrap).on
              ) {
                // don't walk on active spiketraps
                disablePositions.push({ x: xx, y: yy } as astar.Position);
              }
            }
          }
          this.moves = astar.AStar.search(
            this.level.levelArray,
            this,
            this.targetPlayer,
            disablePositions
          );
          if (this.moves.length > 0) {
            let hitPlayer = false;
            for (const i in this.game.players) {
              if (
                this.game.levels[this.game.players[i].levelID] === this.level &&
                this.game.players[i].x === this.moves[0].pos.x &&
                this.game.players[i].y === this.moves[0].pos.y
              ) {
                this.game.players[i].hurt(this.hit());
                this.drawX = 0.5 * (this.x - this.game.players[i].x);
                this.drawY = 0.5 * (this.y - this.game.players[i].y);
                if (this.game.players[i] === this.game.players[this.game.localPlayerID])
                  this.game.shakeScreen(10 * this.drawX, 10 * this.drawY);
                hitPlayer = true;
              }
            }
            if (!hitPlayer) {
              this.tryMove(this.moves[0].pos.x, this.moves[0].pos.y);
              this.drawX = this.x - oldX;
              this.drawY = this.y - oldY;
              if (this.x > oldX) this.direction = EnemyDirection.RIGHT;
              else if (this.x < oldX) this.direction = EnemyDirection.LEFT;
              else if (this.y > oldY) this.direction = EnemyDirection.DOWN;
              else if (this.y < oldY) this.direction = EnemyDirection.UP;
            }
          }
        } else {
          this.level.hitwarnings.push(new HitWarning(this.game, this.x - 1, this.y));
          this.level.hitwarnings.push(new HitWarning(this.game, this.x + 1, this.y));
          this.level.hitwarnings.push(new HitWarning(this.game, this.x, this.y - 1));
          this.level.hitwarnings.push(new HitWarning(this.game, this.x, this.y + 1));
        }
      }
    }
  };

  draw = (delta: number) => {
    if (!this.dead) {
      this.frame += 0.1 * delta;
      if (this.frame >= 4) this.frame = 0;
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
        this.tileY,
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
    if (!this.seenPlayer) {
      this.drawSleepingZs(delta);
    }
    if (this.alert) {
      this.drawExclamation(delta);
    }
  };

  dropLoot = () => {
    this.drop.level = this.level;
    this.drop.x = this.x;
    this.drop.y = this.y;
    this.level.items.push(this.drop);
  };
}
