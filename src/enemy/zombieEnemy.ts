import { Enemy, EnemyDirection } from "./enemy";
import { Game } from "../game";
import { Level } from "../level";
import { Player } from "../player";
import { HitWarning } from "../hitWarning";
import { GenericParticle } from "../particle/genericParticle";
import { Coin } from "../item/coin";
import { RedGem } from "../item/redgem";
import { Item } from "../item/item";
import { Spear } from "../weapon/spear";
import { DualDagger } from "../weapon/dualdagger";
import { GreenGem } from "../item/greengem";
import { Random } from "../random";

export class ZombieEnemy extends Enemy {
  frame: number;
  ticks: number;
  seenPlayer: boolean;
  aggro: boolean;
  targetPlayer: Player;
  drop: Item;

  constructor(level: Level, game: Game, x: number, y: number, rand: () => number, drop?: Item) {
    super(level, game, x, y);
    this.ticks = 0;
    this.frame = 0;
    this.health = 1;
    this.maxHealth = 1;
    this.tileX = 17;
    this.tileY = 8;
    this.seenPlayer = false;
    this.aggro = false;
    this.deathParticleColor = "#ffffff";

    if (drop) this.drop = drop;
    else {
      let dropProb = Random.rand();
      if (dropProb < 0.005) this.drop = new DualDagger(this.level, 0, 0);
      else if (dropProb < 0.04) this.drop = new GreenGem(this.level, 0, 0);
      else this.drop = new Coin(this.level, 0, 0);
    }
  }

  hit = (): number => {
    return 1;
  };

  hurt = (playerHitBy: Player, damage: number) => {
    if (playerHitBy) {
      this.aggro = true;
      this.targetPlayer = playerHitBy;
      this.facePlayer(playerHitBy);
      if (playerHitBy === this.game.players[this.game.localPlayerID]) this.alertTicks = 2; // this is really 1 tick, it will be decremented immediately in tick()
    }
    this.health -= damage;
    this.healthBar.hurt();
    if (this.health <= 0) {
      this.kill();
    } else {
      GenericParticle.spawnCluster(this.level, this.x + 0.5, this.y + 0.5, this.deathParticleColor);
    }
  };

  tick = () => {
    if (!this.dead) {
      if (this.skipNextTurns > 0) {
        this.skipNextTurns--;
        return;
      }
      this.ticks++;
      if (!this.seenPlayer) {
        let p = this.nearestPlayer();
        if (p !== false) {
          let [distance, player] = p;
          if (distance <= 4) {
            this.targetPlayer = player;
            this.facePlayer(player);
            this.seenPlayer = true;
            if (player === this.game.players[this.game.localPlayerID]) this.alertTicks = 1;
            this.level.hitwarnings.push(new HitWarning(this.game, this.x - 1, this.y));
            this.level.hitwarnings.push(new HitWarning(this.game, this.x + 1, this.y));
            this.level.hitwarnings.push(new HitWarning(this.game, this.x, this.y - 1));
            this.level.hitwarnings.push(new HitWarning(this.game, this.x, this.y + 1));
          }
        }
      }
      else if (this.seenPlayer) {
        if (this.level.playerTicked === this.targetPlayer) {
          this.alertTicks = Math.max(0, this.alertTicks - 1);
          let oldX = this.x;
          let oldY = this.y;
          let moveX = this.x;
          let moveY = this.y;
          if (this.ticks % 2 === 0) { // horizontal preference
            if (this.targetPlayer.x > this.x) moveX++;
            else if (this.targetPlayer.x < this.x) moveX--;
            else if (this.targetPlayer.y > this.y) moveY++;
            else if (this.targetPlayer.y < this.y) moveY--;
          } else { // vertical preference
            if (this.targetPlayer.y > this.y) moveY++;
            else if (this.targetPlayer.y < this.y) moveY--;
            else if (this.targetPlayer.x > this.x) moveX++;
            else if (this.targetPlayer.x < this.x) moveX--;
          }

          let hitPlayer = false;
          for (const i in this.game.players) {
            if (this.game.levels[this.game.players[i].levelID] === this.level && this.game.players[i].x === moveX && this.game.players[i].y === moveY) {
              this.game.players[i].hurt(this.hit());
              this.drawX = 0.5 * (this.x - this.game.players[i].x);
              this.drawY = 0.5 * (this.y - this.game.players[i].y);
              if (this.game.players[i] === this.game.players[this.game.localPlayerID])
                this.game.shakeScreen(10 * this.drawX, 10 * this.drawY);
            }
          }
          if (!hitPlayer) {
            this.tryMove(moveX, moveY);
            this.drawX = this.x - oldX;
            this.drawY = this.y - oldY;
            if (this.x > oldX) this.direction = EnemyDirection.RIGHT;
            else if (this.x < oldX) this.direction = EnemyDirection.LEFT;
            else if (this.y > oldY) this.direction = EnemyDirection.DOWN;
            else if (this.y < oldY) this.direction = EnemyDirection.UP;
          }

          this.level.hitwarnings.push(new HitWarning(this.game, this.x - 1, this.y));
          this.level.hitwarnings.push(new HitWarning(this.game, this.x + 1, this.y));
          this.level.hitwarnings.push(new HitWarning(this.game, this.x, this.y - 1));
          this.level.hitwarnings.push(new HitWarning(this.game, this.x, this.y + 1));
        }

        let targetPlayerOffline = Object.values(this.game.offlinePlayers).indexOf(this.targetPlayer) !== -1;
        if (!this.aggro || targetPlayerOffline) {
          let p = this.nearestPlayer();
          if (p !== false) {
            let [distance, player] = p;
            if (distance <= 4 && (targetPlayerOffline || distance < this.playerDistance(this.targetPlayer))) {
              if (player !== this.targetPlayer) {
                this.targetPlayer = player;
                this.facePlayer(player);
                if (player === this.game.players[this.game.localPlayerID]) this.alertTicks = 1;
                this.level.hitwarnings.push(new HitWarning(this.game, this.x - 1, this.y));
                this.level.hitwarnings.push(new HitWarning(this.game, this.x + 1, this.y));
                this.level.hitwarnings.push(new HitWarning(this.game, this.x, this.y - 1));
                this.level.hitwarnings.push(new HitWarning(this.game, this.x, this.y + 1));
              }
            }
          }
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
        this.tileX + Math.floor(this.frame),
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
    if (!this.seenPlayer) {
      this.drawSleepingZs(delta);
    }
    if (this.alertTicks > 0) {
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
