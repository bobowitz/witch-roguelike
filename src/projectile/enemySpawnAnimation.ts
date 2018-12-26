import { Projectile } from "./projectile";
import { Game } from "../game";
import { WizardEnemy } from "../enemy/wizardEnemy";
import { Player } from "../player";
import { Enemy } from "../enemy/enemy";
import { Level } from "../level";
import { GenericParticle } from "../particle/genericParticle";

export class EnemySpawnAnimation extends Projectile {
  level: Level;
  enemy: Enemy;
  frame: number;
  knockbackX: number;
  knockbackY: number;

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

    this.knockbackX = knockbackX;
    this.knockbackY = knockbackY;
  }

  tick = () => {
    this.dead = true;
    this.enemy.skipNextTurns = 1;
    this.level.enemies.push(this.enemy);
    if (this.level.game.player.x === this.x && this.level.game.player.y === this.y) {
      this.level.game.player.hurt(1);
      this.level.game.player.move(this.knockbackX, this.knockbackY);
    }
    GenericParticle.spawnCluster(this.level, this.x + 0.5, this.y + 0.5, "#ffffff");
  };

  draw = () => {
    this.frame += 0.25;
    if (this.frame >= 8) this.frame = 0;
    Game.drawFX(Math.floor(this.frame), 26, 1, 2, this.x, this.y - 1, 1, 2);
    //GenericParticle.spawnCluster(this.level, this.x + 0.5, this.y + 0.5, "#000000");
    //Game.drawFX(18 + Math.floor(HitWarning.frame), 6, 1, 1, this.x, this.y, 1, 1);
  };
}
