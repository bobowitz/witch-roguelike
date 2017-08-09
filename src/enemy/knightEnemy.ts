import { Enemy } from "./enemy";
import { LevelConstants } from "../levelConstants";
import { Game } from "../game";
import { Level } from "../level";
import { astar } from "../astarclass";
import { HealthBar } from "../healthbar";
import { Potion } from "../item/potion";
import { Floor } from "../tile/floor";
import { Bones } from "../tile/bones";
import { TextParticle } from "../textParticle";
import { GameConstants } from "../gameConstants";

export class KnightEnemy extends Enemy {
  level: Level;
  moves: Array<astar.AStarData>;
  ticks: number;
  healthBar: HealthBar;

  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, game, x, y);
    this.level = level;
    this.moves = new Array<astar.AStarData>();
    this.ticks = 0;
    this.healthBar = new HealthBar(10);
  }

  hit = (): number => {
    let dmg = Game.randTable([1, 1, 1, 2, 3]);
    if (Game.rand(1, 100) * 0.01 <= this.game.player.missProb) {
      dmg = 0;
      this.level.textParticles.push(
        new TextParticle(
          "miss",
          this.game.player.x + 0.5,
          this.game.player.y - 0.5,
          GameConstants.MISS_COLOR
        )
      );
    }
    return dmg;
  };

  tick = () => {
    if (!this.dead) {
      this.ticks++;
      if (this.ticks % 2 === 0) {
        let oldX = this.x;
        let oldY = this.y;
        this.moves = astar.AStar.search(this.level.levelArray, this, this.game.player);
        if (this.moves.length > 0) {
          if (
            this.game.player.x === this.moves[0].pos.x &&
            this.game.player.y === this.moves[0].pos.y
          ) {
            this.game.player.hurt(this.hit());
          } else {
            this.tryMove(this.moves[0].pos.x, this.moves[0].pos.y);
          }
        }
        this.drawX = this.x - oldX;
        this.drawY = this.y - oldY;
      }
    }

    if (this.healthBar.health <= 0) {
      this.kill();
    }
  };

  hurt = (damage: number) => {
    this.healthBar.hurt(damage);
  };

  kill = () => {
    this.level.levelArray[this.x][this.y] = new Bones(this.level, this.x, this.y);
    this.dead = true;
    if (Game.rand(1, 4) === 1) this.level.items.push(new Potion(this.x, this.y));
    this.x = -10;
    this.y = -10;
  };

  draw = () => {
    if (!this.dead) {
      this.drawX += -0.5 * this.drawX;
      this.drawY += -0.5 * this.drawY;
      Game.drawMob(0, 0, 1, 1, this.x - this.drawX, this.y - this.drawY, 1, 1);
      Game.drawMob(4, 0, 1, 2, this.x - this.drawX, this.y - 1.5 - this.drawY, 1, 2);
    }
  };

  drawTopLayer = () => {
    this.healthBar.drawAboveTile(this.x - this.drawX + 0.5, this.y - 0.75 - this.drawY);
  };
}
