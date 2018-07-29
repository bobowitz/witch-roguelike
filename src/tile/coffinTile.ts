import { Collidable } from "./collidable";
import { Level } from "../level";
import { Game } from "../game";
import { Tile } from "./tile";

export class CoffinTile extends Collidable {
  subTileY: number; // each coffin is 1x2, this is the sub-tile coordinate

  constructor(level: Level, x: number, y: number, subTileY: number) {
    super(level, x, y);
    this.subTileY = subTileY;
  }

  drawUnderPlayer = () => {
    if (this.subTileY === 0) {
      Game.drawTile(0, 5, 1, 1, this.x - 1, this.y - 1, 1, 1, this.isShaded());
      Game.drawTile(1, 5, 1, 1, this.x, this.y - 1, 1, 1, this.isShaded());
      Game.drawTile(2, 5, 1, 1, this.x + 1, this.y - 1, 1, 1, this.isShaded());
      Game.drawTile(0, 6, 1, 1, this.x - 1, this.y, 1, 1, this.isShaded());
      Game.drawTile(1, 6, 1, 1, this.x, this.y, 1, 1, this.isShaded());
      Game.drawTile(2, 6, 1, 1, this.x + 1, this.y, 1, 1, this.isShaded());
    } else {
      Game.drawTile(0, 7, 1, 1, this.x - 1, this.y, 1, 1, this.isShaded());
      Game.drawTile(1, 7, 1, 1, this.x, this.y, 1, 1, this.isShaded());
      Game.drawTile(2, 7, 1, 1, this.x + 1, this.y, 1, 1, this.isShaded());
    }
  };
}
