import { Enemy, EnemyDirection } from "./enemy";
import { LevelConstants } from "../levelConstants";
import { Game } from "../game";
import { Level } from "../level";
import { astar } from "../astarclass";
import { Heart } from "../item/heart";
import { Floor } from "../tile/floor";
import { Bones } from "../tile/bones";
import { DeathParticle } from "../particle/deathParticle";
import { GameConstants } from "../gameConstants";
import { HitWarning } from "../projectile/hitWarning";
import { Gem } from "../item/gem";
import { SpikeTrap } from "../tile/spiketrap";
import { SkullEnemy } from "./skullEnemy";
import { EnemySpawnAnimation } from "../projectile/enemySpawnAnimation";

export class Spawner extends Enemy {
  ticks: number;
  seenPlayer: boolean;

  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, game, x, y);
    this.ticks = 0;
    this.health = 6;
    this.tileX = 6;
    this.tileY = 4;
    this.seenPlayer = true;
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
      this.tileX = 6;
      if (this.seenPlayer || this.level.softVisibilityArray[this.x][this.y] > 0) {
        if (this.ticks % 4 === 0) {
          this.tileX = 7;

          this.seenPlayer = true;

          let positions = [[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]];
          let position = Game.randTable(positions);
          let spawnX = this.x + position[0];
          let spawnY = this.y + position[1];
          let knockbackX = this.x + position[0] * 2;
          let knockbackY = this.y + position[1] * 2;

          let skeleton = new SkullEnemy(this.level, this.game, spawnX, spawnY);
          this.level.projectiles.push(
            new EnemySpawnAnimation(this.level, skeleton, spawnX, spawnY, knockbackX, knockbackY)
          );
        }
      }
      this.ticks++;
    }
  };

  dropLoot = () => {
    this.game.level.items.push(new Gem(this.level, this.x, this.y));
  };
}
