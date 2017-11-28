import { Collidable } from "./collidable";
import { Player } from "../player";
import { Level } from "../level";
import { Game } from "../game";
import { Door } from "./door";
import { Key } from "../item/key";

export class LockedDoor extends Collidable {
  unlock = (player: Player) => {
    let k = player.inventory.hasItem(Key);
    if (k !== null) {
      // remove key
      player.inventory.items = player.inventory.items.filter(x => x !== k);
      let d = new Door(
        this.level,
        this.level.game,
        this.x,
        this.y,
        Game.rand(1, 10) !== 1,
        false,
        0 // doesn't really matter here cause it'll be a dead end
      );
      this.level.levelArray[this.x][this.y] = d; // replace this door in level
      this.level.doors.push(d); // add it to the door list so it can get rendered on the map
      this.level.doors.sort((a, b) => a.x - b.x);
    }
  };

  draw = () => {
    Game.drawTile(16, this.level.env, 1, 1, this.x, this.y, this.w, this.h);
  };
}
