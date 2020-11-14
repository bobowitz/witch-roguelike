import { Player } from "../player";
import { Game } from "../game";
import { Level } from "../level";
import { BottomDoor } from "./bottomDoor";
import { GameConstants } from "../gameConstants";
import { SkinType, Tile } from "./tile";
import { DownLadder } from "./downLadder";

export class UpLadder extends Tile {
  linkedLadder: DownLadder;
  game: Game;
  isRope = false;

  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, x, y);
    this.game = game;
  }

  onCollide = (player: Player) => {
    player.levelID = this.game.changeLevelThroughLadder(player, this);
  };

  draw = () => {
    let xx = 29;
    let yy = 0;
    if (this.isRope) {
      xx = 16;
      yy = 1;
    }

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
    if (!this.isRope)
      Game.drawTile(
        xx,
        yy,
        1,
        1,
        this.x,
        this.y - 1,
        1,
        1,
        this.level.shadeColor,
        this.shadeAmount()
      );
    Game.drawTile(
      xx,
      yy + 1,
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

  drawAbovePlayer = () => {
    if (this.isRope)
      Game.drawTile(
        16,
        1,
        1,
        1,
        this.x,
        this.y - 1,
        1,
        1,
        this.level.shadeColor,
        this.shadeAmount()
      );
  };
}
