import { Collidable } from "./collidable";
import { Player } from "../player";
import { Game } from "../game";
import { OnCollideTile } from "./onCollideTile";
import { Level } from "../level";
import { OnCollideLayeredTile } from "./onCollideLayeredTile";
import { StairUp } from "./stairUp";

export class StairDown extends OnCollideLayeredTile {
  linkedLevel: Level;

  onCollide = (player: Player) => {
    if (!this.linkedLevel) {
      this.linkedLevel = new Level(this.level.game, this.level.game.levelData, 0);
      this.linkedLevel.playerExitX = 21;
      this.linkedLevel.playerExitY = 10;
      (this.linkedLevel.levelArray[21][10] as StairUp).linkedLevel = this.level;
    }
    player.game.changeLevel(this.linkedLevel);
  };

  draw = () => {
    Game.drawTile(2, 1, 1, 1, this.x, this.y, 1, 1);
    Game.drawTile(15, 0, 1, 1, this.x, this.y, 1, 1);
  };
}
