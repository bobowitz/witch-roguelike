import { Game } from "../game";
import { Collidable } from "./collidable";
import { Level } from "../level";
import { CollidableLayeredTile } from "./collidableLayeredTile";
import { GameConstants } from "../gameConstants";
import { LevelConstants } from "../levelConstants";

export class Wall extends CollidableLayeredTile {
  type: number;

  constructor(level: Level, x: number, y: number, type: number) {
    super(level, x, y);
    this.type = type;
  }

  draw = () => {
    if (this.y === this.level.height - 1 || this.level.visibilityArray[this.x][this.y + 1] > 0) {
      if (this.type !== 1) Game.drawTile(0, this.level.env, 1, 1, this.x, this.y, 1, 1);
    } else {
      Game.ctx2d.fillStyle = "black";
      Game.ctx2d.fillRect(
        this.x * GameConstants.TILESIZE,
        this.y * GameConstants.TILESIZE,
        GameConstants.TILESIZE,
        GameConstants.TILESIZE
      );
    }
  };

  drawCeiling = () => {
    if (this.level.visibilityArray[this.x][this.y] > 0) {
      if (this.type === 0) {
        Game.drawTile(2, this.level.env, 1, 1, this.x, this.y - 1, 1, 1);
      } else if (this.type === 1) {
        Game.drawTile(5, this.level.env, 1, 1, this.x, this.y - 1, 1, 1);
      } else {
        let tX = this.type % (Game.tileset.width / GameConstants.TILESIZE);
        let tY = Math.floor(this.type / (Game.tileset.width / GameConstants.TILESIZE));
        Game.drawTile(tX, tY, 1, 1, this.x, this.y - 1, 1, 1);
      }
    } else {
      Game.ctx2d.fillStyle = "black";
      Game.ctx2d.fillRect(
        this.x * GameConstants.TILESIZE,
        (this.y - 1) * GameConstants.TILESIZE,
        GameConstants.TILESIZE,
        GameConstants.TILESIZE
      );
    }
  };
}
