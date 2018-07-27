import { Player } from "../player";
import { Tile } from "./tile";
import { Level } from "../level";
import { Collidable } from "./collidable";

export class TickCollidable extends Collidable {
  tick = () => {};
}
