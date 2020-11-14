import { Enemy, EnemyDirection } from "./enemy";
import { Game } from "../game";
import { Level } from "../level";
import { astar } from "../astarclass";
import { HitWarning } from "../projectile/hitWarning";
import { SpikeTrap } from "../tile/spiketrap";
import { Coin } from "../item/coin";

export class KnightEnemy extends Enemy {
  moves: Array<astar.AStarData>;
  ticks: number;
  frame: number;
  seenPlayer: boolean;

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
      if (this.seenPlayer || this.seesPlayer()) {
        if (this.ticks % 2 === 0) {
          this.tileX = 4;
          this.tileY = 0;
          // visible to player, chase them

          // now that we've seen the player, we can keep chasing them even if we lose line of sight
          this.seenPlayer = true;
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
            this.game.player,
            disablePositions
          );
          if (this.moves.length > 0) {
            if (
              this.game.player.x === this.moves[0].pos.x &&
              this.game.player.y === this.moves[0].pos.y
            ) {
              this.game.player.hurt(this.hit());
              this.drawX = 0.5 * (this.x - this.game.player.x);
              this.drawY = 0.5 * (this.y - this.game.player.y);
              this.game.shakeScreen(10 * this.drawX, 10 * this.drawY);
            } else {
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
      if (this.doneMoving() && this.game.player.doneMoving()) this.facePlayer();
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
