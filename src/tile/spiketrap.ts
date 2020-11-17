import { Player } from "../player";
import { Game } from "../game";
import { Level } from "../level";
import { LevelConstants } from "../levelConstants";
import { Tile } from "./tile";
import { Enemy } from "../enemy/enemy";
import { Crate } from "../enemy/crate";
import { Barrel } from "../enemy/barrel";
import { HitWarning } from "../hitWarning";

export class SpikeTrap extends Tile {
  on: boolean;
  tickCount: number;
  frame: number;

  constructor(level: Level, x: number, y: number, tickCount?: number) {
    super(level, x, y);
    if (tickCount) this.tickCount = tickCount;
    else this.tickCount = 0;
    this.on = false;
    this.frame = 0;
  }

  tick = () => {
    this.tickCount++;
    if (this.tickCount >= 4) this.tickCount = 0;
    this.on = this.tickCount === 0;

    if (this.on) {
      for (const i in this.level.game.players) {
        if (this.level === this.level.game.levels[this.level.game.players[i].levelID] && this.level.game.players[i].x === this.x && this.level.game.players[i].y === this.y)
          this.level.game.players[i].hurt(1);
      }
    }

    if (this.tickCount === 3)
      this.level.hitwarnings.push(new HitWarning(this.level.game, this.x, this.y));
  };

  tickEnd = () => {
    if (this.on) {
      for (const e of this.level.enemies) {
        if (e.x === this.x && e.y === this.y) {
          e.hurt(null, 1);
        }
      }
    }
  };

  onCollideEnemy = (enemy: Enemy) => {
    if (this.on && !(enemy instanceof Crate || enemy instanceof Barrel)) enemy.hurt(null, 1);
  };

  draw = () => {
    Game.drawTile(
      1,
      this.skin,
      1,
      1,
      this.x,
      this.y,
      1,
      1,
      this.level.shadeColor,
      this.shadeAmount()
    );
  };

  t = 0;

  drawUnderPlayer = () => {
    let rumbleOffsetX = 0;
    this.t++;
    if (!this.on && this.tickCount === 3) {
      if (this.t % 4 === 1) rumbleOffsetX = 0.0325;
      if (this.t % 4 === 3) rumbleOffsetX = -0.0325;
    }
    let frames = [0, 1, 2, 3, 3, 4, 2, 0];
    let f = 6 + frames[Math.floor(this.frame)];
    if (this.tickCount === 1 || (this.tickCount === 0 && frames[Math.floor(this.frame)] === 0)) {
      f = 5;
    }
    Game.drawObj(
      f,
      0,
      1,
      2,
      this.x + rumbleOffsetX,
      this.y - 1,
      1,
      2,
      this.level.shadeColor,
      this.shadeAmount()
    );
    if (this.on && this.frame < frames.length - 1) {
      if (frames[Math.floor(this.frame)] < 3) this.frame += 0.4;
      else this.frame += 0.2;
    }
    if (!this.on) this.frame = 0;
  };
}
