import { Player } from "../player";
import { Tile } from "./tile";
import { Level } from "../level";
import { Collidable } from "./collidable";
import { OnCollideTile } from "./onCollideTile";

export class OnCollideLayeredTile extends OnCollideTile {
  onCollide = (player: Player) => {};
  drawCeiling = () => {};
}
