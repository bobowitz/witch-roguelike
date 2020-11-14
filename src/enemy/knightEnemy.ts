import { Enemy, EnemyDirection } from "./enemy";
import { Game } from "../game";
import { Level } from "../level";
import { astar } from "../astarclass";
import { HitWarning } from "../projectile/hitWarning";
import { SpikeTrap } from "../tile/spiketrap";
import { Coin } from "../item/coin";
import { Player } from "../player";

export class KnightEnemy extends Enemy {
  moves: Array<astar.AStarData>;
  ticks: number;
  frame: number;
  seenPlayer: boolean;
  targetPlayer: Player;

  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, game, x, y);
    this.moves = new Array<astar.AStarData>(); // empty move list
    this.ticks = 0;
    this.frame = 0;
    this.health = 2;
    this.maxHealth = 2;
    this.tileX = 9;
    this.tileY = 8;
    this.seenPlayer = false;
    this.deathParticleColor = "#ffffff";
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
      this.ticks++;
      this.tileX = 9;
      this.tileY = 8;
      if (!this.seenPlayer) {
        const result = this.nearestPlayer();
        if (result !== false) {
          let [distance, p] = result;
          if (distance < 4) {
            this.seenPlayer = true;
            this.targetPlayer = p;
          }
        }
      }
      if (this.seenPlayer) {
        if (this.ticks % 2 === 0) {
          this.tileX = 4;
          this.tileY = 0;

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
          this.level.projectiles.push(new HitWarning(this.game, this.x - 1, this.y));
          this.level.projectiles.push(new HitWarning(this.game, this.x + 1, this.y));
          this.level.projectiles.push(new HitWarning(this.game, this.x, this.y - 1));
          this.level.projectiles.push(new HitWarning(this.game, this.x, this.y + 1));
        }
      }
    }
  };

  draw = () => {
    if (!this.dead) {
      this.frame += 0.1;
      if (this.frame >= 4) this.frame = 0;
      if (this.doneMoving() && this.game.players[this.game.localPlayerID].doneMoving()) this.facePlayer();
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
        this.tileX + (this.tileX === 4 ? 0 : Math.floor(this.frame)),
        this.tileY + this.direction * 2,
        1,
        2,
        this.x - this.drawX,
        this.y - 1.5 - this.drawY + (this.tileX === 4 ? 0.1875 : 0),
        1,
        2,
        this.level.shadeColor,
        this.shadeAmount()
      );
    }
  };

  dropLoot = () => {
    this.level.items.push(new Coin(this.level, this.x, this.y));
  };
}
