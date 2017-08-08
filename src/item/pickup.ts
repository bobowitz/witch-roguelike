import { Item } from "./item";
import { Player } from "../player";

export class Pickup extends Item {
  onPickup = (player: Player) => {};
}
