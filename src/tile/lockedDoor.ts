import { Collidable } from "./collidable";
import { Player } from "../player";
import { Level } from "../level";
import { Game } from "../game";
import { Door } from "./door";
import { Key } from "../item/key";

export class LockedDoor extends Collidable {
  unlockedDoor: Door;

  unlock = (player: Player) => {
    let k = player.inventory.hasItem(Key);
    if (k !== null) {
      // remove key
      player.inventory.items = player.inventory.items.filter(x => x !== k);
      this.level.levelArray[this.x][this.y] = this.unlockedDoor; // replace this door in level
      this.level.doors.push(this.unlockedDoor); // add it to the door list so it can get rendered on the map
    }
  };

  draw = () => {
    Game.drawTile(17, this.skin, 1, 1, this.x, this.y, this.w, this.h, this.isShaded());
  };
}
