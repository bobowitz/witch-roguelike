import { Collidable } from "./collidable";
import { Player } from "../player";
import { Game } from "../game";
import { TickCollidable } from "./tickCollidable";
import { Level } from "../level";
import { LevelConstants } from "../levelConstants";
import { SkinType } from "./tile";

export class SpikeTrap extends TickCollidable {
  on: boolean;
  tickCount: number;
  frame: number;
  skin: SkinType;

  constructor(level: Level, x: number, y: number) {
    super(level, x, y);
    this.tickCount = 0;
    this.on = false;
    this.frame = 0;
  }

  tick = () => {
    this.tickCount++;
    if (this.tickCount >= 4) this.tickCount = 0;
    if (this.tickCount === 0) this.on = true;
    else if (this.tickCount === 1) this.on = false;

    if (this.on && this.level.game.player.x === this.x && this.level.game.player.y === this.y)
      this.level.game.player.hurt(1);
  };

  draw = () => {
    Game.drawTile(1, this.skin, 1, 1, this.x, this.y, 1, 1, this.isShaded());
  };

  t = 0;

  drawUnderPlayer = () => {
    let rumbleOffsetX = 0;
    let rumbleOffsetY = 0;
    this.t++;
    if (!this.on && this.tickCount === 3) {
      if (this.t % 4 === 1) rumbleOffsetX = 0.0325;
      if (this.t % 4 === 3) rumbleOffsetX = -0.0325;
    }
    Game.drawObj(
      5 + Math.floor(this.frame),
      0,
      1,
      2,
      this.x + rumbleOffsetX,
      this.y - 1 + rumbleOffsetY,
      1,
      2,
      this.isShaded()
    );
    if (this.on && this.frame < 3) this.frame += 0.4;
    if (!this.on && this.frame != 0) {
      if (this.frame < 3 && this.frame + 0.4 >= 3) this.frame = 0;
      else {
        this.frame += 0.3;
        if (this.frame >= 5) this.frame = 2;
      }
    }
  };
}
