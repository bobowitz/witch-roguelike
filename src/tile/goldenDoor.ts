import { Collidable } from "./collidable";
import { Player } from "../player";
import { Level } from "../level";
import { Game } from "../game";
import { Door } from "./door";
import { Key } from "../item/key";
import { GoldenKey } from "../item/goldenKey";
import { UnlockedGoldenDoor } from "./unlockedGoldenDoor";

export class GoldenDoor extends Collidable {
  unlock = (player: Player) => {
    let k = player.inventory.hasItem(GoldenKey);
    if (k !== null) {
      // remove key
      player.inventory.items = player.inventory.items.filter(x => x !== k);
      let d = new UnlockedGoldenDoor(this.level, this.level.game, this.x, this.y);
      this.level.levelArray[this.x][this.y] = d; // replace this door in level
    }
  };

  draw = () => {
    Game.drawTile(18, 0, 1, 1, this.x, this.y, this.w, this.h, this.isShaded());
  };
}
