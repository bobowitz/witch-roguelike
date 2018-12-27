import { Projectile } from "./projectile";
import { Game } from "../game";
import { WizardEnemy } from "../enemy/wizardEnemy";
import { Player } from "../player";
import { Enemy } from "../enemy/enemy";
import { Level } from "../level";
import { GenericParticle } from "../particle/genericParticle";
import { Sound } from "../sound";

export class EnemySpawnAnimation extends Projectile {
  readonly ANIM_COUNT = 3;

  level: Level;
  enemy: Enemy;
  frame: number;
  knockbackX: number;
  knockbackY: number;
  f: number[];
  xx: number[];
  yy: number[];

  constructor(
    level: Level,
    enemy: Enemy,
    x: number,
    y: number,
    knockbackX: number,
    knockbackY: number
  ) {
    super(x, y);
    this.level = level;
    this.enemy = enemy;
    this.frame = 0;

    this.f = [];
    this.xx = [];
    this.yy = [];
    for (let i = 0; i < this.ANIM_COUNT; i++) {
      this.f[i] = this.xx[i] = Math.random() * 6.28;
      this.yy[i] = Math.random() * 8 - 8;
    }

    this.knockbackX = knockbackX;
    this.knockbackY = knockbackY;
  }

  tick = () => {
    Sound.enemySpawn();

    this.dead = true;
    this.enemy.skipNextTurns = 1;
    this.level.enemies.push(this.enemy);
    if (this.level.game.player.x === this.x && this.level.game.player.y === this.y) {
      this.level.game.player.hurt(0.5);
      this.level.game.player.move(this.knockbackX, this.knockbackY);
    }
    GenericParticle.spawnCluster(this.level, this.x + 0.5, this.y + 0.5, "#ffffff");
    GenericParticle.spawnCluster(this.level, this.x + 0.5, this.y + 0.5, "#ffffff");
  };

  draw = () => {
    this.frame += 0.25;
    if (this.frame >= 8) this.frame = 0;
    for (let i = 0; i < this.ANIM_COUNT; i++) {
      let offsetX = 4 * Math.sin(this.frame + this.xx[i]);
      Game.drawFX(
        Math.floor(this.frame),
        26,
        1,
        2,
        this.x + Math.round(offsetX) / 16.0,
        this.y - 1 + Math.round(this.yy[i]) / 16.0,
        1,
        2
      );
    }
    this.level.particles.push(
      new GenericParticle(
        this.level,
        this.x + 0.5 + Math.random() * 0.05 - 0.025,
        this.y + 0.5 + Math.random() * 0.05 - 0.025,
        Math.random() * 0.5,
        Math.random() * 0.5,
        0.025 * (Math.random() * 2 - 1),
        0.025 * (Math.random() * 2 - 1),
        0.2 * (Math.random() - 1),
        "#ffffff",
        0
      )
    );
    //Game.drawFX(18 + Math.floor(HitWarning.frame), 6, 1, 1, this.x, this.y, 1, 1);
  };
}
