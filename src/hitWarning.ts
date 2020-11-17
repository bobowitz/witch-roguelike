import { Game } from "./game";
import { Drawable } from "./drawable";

export class HitWarning extends Drawable {
  x: number;
  y: number;
  dead: boolean;
  static frame = 0;
  game: Game;

  constructor(game: Game, x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
    this.dead = false;
    this.game = game;
  }

  tick = () => {
    this.dead = true;
  };

  static updateFrame = () => {
    HitWarning.frame += 0.125;
    if (HitWarning.frame >= 4) HitWarning.frame = 0;
  };

  draw = () => {
    if (
      (this.x === this.game.players[this.game.localPlayerID].x && Math.abs(this.y - this.game.players[this.game.localPlayerID].y) <= 1) ||
      (this.y === this.game.players[this.game.localPlayerID].y && Math.abs(this.x - this.game.players[this.game.localPlayerID].x) <= 1)
    )
      Game.drawFX(18 + Math.floor(HitWarning.frame), 6, 1, 1, this.x, this.y, 1, 1);
  };

  drawTopLayer = () => {
    this.drawableY = this.y;
    if (
      (this.x === this.game.players[this.game.localPlayerID].x && Math.abs(this.y - this.game.players[this.game.localPlayerID].y) <= 1) ||
      (this.y === this.game.players[this.game.localPlayerID].y && Math.abs(this.x - this.game.players[this.game.localPlayerID].x) <= 1)
    )
      Game.drawFX(18 + Math.floor(HitWarning.frame), 5, 1, 1, this.x, this.y, 1, 1);
  };
}
