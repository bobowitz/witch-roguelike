import { Item } from "./item";
import { Player } from "../player";
import { Game } from "../game";
import { Sound } from "../sound";
import { Level } from "../level";

export class Usable extends Item {
  onUse = (player: Player) => {
    player.health = Math.min(player.maxHealth, player.health + 1);
    if (player.game.levels[player.levelID] === player.game.level) Sound.heal();
  };
}
