import { Collidable } from "./collidable";
import { Player } from "../player";
import { Game } from "../game";
import { TickCollidable } from "./tickCollidable";
import { Level } from "../level";
import { LevelConstants } from "../levelConstants";

export class SpikeTrap extends TickCollidable {
  on: boolean;
  frame: number;

  constructor(level: Level, x: number, y: number) {
    super(level, x, y);
    this.on = false;
    this.frame = 0;
  }

  tick = () => {
    this.on = !this.on;
  };

  onCollide = (player: Player) => {
    if (!this.on) player.hurt(1); // player moves before tick, so we check if the spikes are off
  };

  draw = () => {
    let darkOffset =
      this.level.visibilityArray[this.x][this.y] <= LevelConstants.VISIBILITY_CUTOFF ? 2 : 0;
    Game.drawTile(1, 0, 1, 1, this.x, this.y, 1, 1);
    Game.drawMob(18 + Math.floor(this.frame), darkOffset, 1, 2, this.x, this.y - 1, 1, 2);
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
