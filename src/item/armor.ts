import { Item } from "./item";
import { Game } from "../game";
import { LevelConstants } from "../levelConstants";
import { Pickup } from "./pickup";
import { Player } from "../player";
import { Level } from "../level";
import { TextParticle } from "../particle/textParticle";
import { GameConstants } from "../gameConstants";

export class Armor extends Pickup {
  level: Level;
  health: number;
  rechargeTurnCounter: number;
  readonly RECHARGE_TURNS = 18;

  constructor(level: Level, x: number, y: number) {
    super(x, y);
    this.level = level;
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
    this.health -= damage;
    if (this.health <= 0) {
      this.health = 0;
      this.rechargeTurnCounter = this.RECHARGE_TURNS;
    }
    this.level.particles.push(
      new TextParticle(
        "" + -damage,
        this.level.game.player.x + 0.5,
        this.level.game.player.y + 0.5,
        GameConstants.ARMOR_GREY
      )
    );
  };

  drawGUI = (playerHealth: number) => {
    if (this.rechargeTurnCounter === -1)
      Game.drawItemNoCull(5, 0, 1, 2, playerHealth, LevelConstants.SCREEN_H - 2, 1, 2);
    else {
      let rechargeProportion = 1 - this.rechargeTurnCounter / this.RECHARGE_TURNS;

      if (rechargeProportion < 0.33) {
        Game.drawItemNoCull(2, 0, 1, 2, playerHealth, LevelConstants.SCREEN_H - 2, 1, 2);
      } else if (rechargeProportion < 0.67) {
        Game.drawItemNoCull(3, 0, 1, 2, playerHealth, LevelConstants.SCREEN_H - 2, 1, 2);
      } else {
        Game.drawItemNoCull(4, 0, 1, 2, playerHealth, LevelConstants.SCREEN_H - 2, 1, 2);
      }
    }
  };

  onPickup = (player: Player) => {
    if (player.armor === null) player.armor = this;
    else {
      player.armor.health = 1;
      player.armor.rechargeTurnCounter = -1;
    }
  };
}
