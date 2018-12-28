import { Player } from "../player";
import { Game } from "../game";
import { Level } from "../level";
import { BottomDoor } from "./bottomDoor";
import { GameConstants } from "../gameConstants";
import { SkinType, Tile } from "./tile";

export class InsideLevelDoor extends Tile {
  game: Game;
  opened: boolean;

  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, x, y);
    this.game = game;
    this.opened = false;
  }

  isSolid = (): boolean => {
    return !this.opened;
  };
  canCrushEnemy = (): boolean => {
    return !this.opened;
  };
  isOpaque = (): boolean => {
    return !this.opened;
  };

  draw = () => {
    Game.drawTile(1, 0, 1, 1, this.x, this.y, 1, 1, "black", this.shadeAmount());
    if (this.opened) Game.drawTile(15, 1, 1, 1, this.x, this.y, 1, 1, "black", this.shadeAmount());
    else Game.drawTile(3, this.skin, 1, 1, this.x, this.y, 1, 1, "black", this.shadeAmount());
  };

  drawAbovePlayer = () => {
    if (!this.opened) Game.drawTile(13, 0, 1, 1, this.x, this.y - 1, 1, 1, "black", this.shadeAmount());
    else Game.drawTile(14, 0, 1, 1, this.x, this.y - 1, 1, 1, "black", this.shadeAmount());
  };
}
