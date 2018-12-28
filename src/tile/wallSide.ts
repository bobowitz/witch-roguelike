import { Game } from "../game";
import { Tile } from "./tile";

export class WallSide extends Tile {
  isSolid = (): boolean => {
    return true;
  };
  canCrushEnemy = (): boolean => {
    return true;
  };
  isOpaque = (): boolean => {
    return false;
  };

  draw = () => {
    Game.drawTile(0, this.skin, 1, 1, this.x, this.y, 1, 1, "black", this.shadeAmount());
  };
}
