import { Item } from "./item";
import { Game } from "../game";
import { LevelConstants } from "../levelConstants";
import { Pickup } from "./pickup";
import { Player } from "../player";
import { Level } from "../level";
import { TextParticle } from "../particle/textParticle";
import { GameConstants } from "../gameConstants";

export class Armor extends Pickup {
  health: number;
  rechargeTurnCounter: number;
  readonly RECHARGE_TURNS = 18;
  game: Game;

  constructor(game: Game, x: number, y: number) {
    super(x, y);
    this.game = game;
    this.health = 1;
    this.rechargeTurnCounter = -1;
    this.tileX = 5;
    this.tileY = 0;
  }

  tick = () => {
    if (this.rechargeTurnCounter > 0) {
      this.rechargeTurnCounter--;
      if (this.rechargeTurnCounter === 0) {
        this.rechargeTurnCounter = -1;
        this.health = 1;
      }
    }
  };

  hurt = (damage: number) => {
    if (this.health <= 0) return;
    this.health -= damage;
    this.rechargeTurnCounter = this.RECHARGE_TURNS;
    this.game.level.particles.push(
      new TextParticle(
        "" + -damage,
        this.game.player.x + 0.5,
        this.game.player.y + 0.5,
        GameConstants.ARMOR_GREY
      )
    );
  };

  drawGUI = (playerHealth: number) => {
    if (this.rechargeTurnCounter === -1)
      Game.drawItem(5, 0, 1, 2, playerHealth, LevelConstants.SCREEN_H - 2, 1, 2);
    else {
      let rechargeProportion = 1 - this.rechargeTurnCounter / this.RECHARGE_TURNS;

      if (rechargeProportion < 0.33) {
        Game.drawItem(2, 0, 1, 2, playerHealth, LevelConstants.SCREEN_H - 2, 1, 2);
      } else if (rechargeProportion < 0.67) {
        Game.drawItem(3, 0, 1, 2, playerHealth, LevelConstants.SCREEN_H - 2, 1, 2);
      } else {
        Game.drawItem(4, 0, 1, 2, playerHealth, LevelConstants.SCREEN_H - 2, 1, 2);
      }
    }
  };

  onPickup = (player: Player) => {
    if (!player.armor) player.armor = this;
    else {
      player.armor.health = 1;
      player.armor.rechargeTurnCounter = -1;
    }
  };
}
