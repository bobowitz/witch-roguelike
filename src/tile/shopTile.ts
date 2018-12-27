import { Player } from "../player";
import { Game } from "../game";
import { Tile } from "./tile";
import { Level } from "../level";

export class ShopTile extends Tile {
  drawX: number;
  drawY: number;

  constructor(level: Level, x: number, y: number, drawX: number, drawY: number) {
    super(level, x, y);

    this.drawX = 26 + drawX;
    this.drawY = drawY;
  }

  isSolid = () => {
    return true;
  };
  canCrushEnemy = (): boolean => {
    return true;
  };

  draw = () => {
    Game.drawTile(this.drawX, this.drawY, 1, 1, this.x, this.y, 1, 1, this.isShaded());
  };
}
