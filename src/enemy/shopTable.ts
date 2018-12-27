import { Player } from "../player";
import { Game } from "../game";
import { Level } from "../level";
import { Enemy } from "./enemy";

export class ShopTable extends Enemy {
  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, game, x, y);

    this.w = 2;

    this.destroyable = false;
    this.pushable = false;
    this.chainPushable = false;
    this.interactable = true;
  }

  interact = () => {
    this.game.player.shopScreen.open();
  };

  draw = () => {
    Game.drawTile(26, 0, 2, 2, this.x, this.y - 1, 2, 2, this.isShaded());
  };
}
