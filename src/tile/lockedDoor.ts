import { Player } from "../player";
import { Level } from "../level";
import { Game } from "../game";
import { Door } from "./door";
import { Key } from "../item/key";
import { Tile } from "./tile";

export class LockedDoor extends Tile {
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

  isSolid = (): boolean => {
    return true;
  };
  canCrushEnemy = (): boolean => {
    return true;
  };
  isOpaque = (): boolean => {
    return true;
  };

  draw = () => {
    Game.drawTile(
      17,
      this.skin,
      1,
      1,
      this.x,
      this.y,
      1,
      1,
      this.level.shadeColor,
      this.shadeAmount()
    );
  };
}
