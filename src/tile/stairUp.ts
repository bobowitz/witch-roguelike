import { Collidable } from "./collidable";
import { Player } from "../player";
import { Game } from "../game";
import { OnCollideTile } from "./onCollideTile";
import { Level } from "../level";
import { OnCollideLayeredTile } from "./onCollideLayeredTile";
import { StairDown } from "./stairDown";

export class StairUp extends OnCollideLayeredTile {
  linkedLevel: Level;

  onCollide = (player: Player) => {
    if (!this.linkedLevel) {
      this.linkedLevel = new Level(this.level.game, this.level.game.levelData, 0);
      this.linkedLevel.playerExitX = 16;
      this.linkedLevel.playerExitY = 11;
      (this.linkedLevel.levelArray[16][11] as StairDown).linkedLevel = this.level;
    }
    player.game.changeLevel(this.linkedLevel);
  };

  draw = () => {
    Game.drawTile(14, 0, 1, 1, this.x, this.y, 1, 1);
    if (this.level.game.player.y >= this.y) Game.drawTile(15, 0, 1, 1, this.x, this.y - 1, 1, 1);
  };
  drawCeiling = () => {
    if (this.level.game.player.y < this.y) Game.drawTile(15, 0, 1, 1, this.x, this.y - 1, 1, 1);
  };
}
