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

export class SkullEnemy extends Enemy {
  moves: Array<astar.AStarData>;
  ticks: number;
  healthBar: HealthBar;
  seenPlayer: boolean;

  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, game, x, y);
    this.moves = new Array<astar.AStarData>(); // empty move list
    this.ticks = 0;
    this.healthBar = new HealthBar(20);
    this.tileX = 2;
    this.tileY = 0;
    this.seenPlayer = false;
  }

  hit = (): number => {
    let dmg = Game.randTable([4, 5, 5, 5, 5, 5, 5, 6, 7, 8]);
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
      if (this.seenPlayer || this.level.visibilityArray[this.x][this.y] > 0) {
        this.seenPlayer = true;
        let oldX = this.x;
        let oldY = this.y;
        let enemyPositions = new Array<astar.Position>();
        for (const e of this.level.enemies) {
          if (e !== this) {
            enemyPositions.push({ x: e.x, y: e.y });
          }
        }
        this.moves = astar.AStar.search(
          this.level.levelArray,
          this,
          this.game.player,
          enemyPositions
        );
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
  };

  kill = () => {
    this.level.levelArray[this.x][this.y] = new Bones(this.level, this.x, this.y);
    this.dead = true;
    if (Game.rand(1, 2) === 1) this.level.items.push(new Potion(this.x, this.y));
  };
}
