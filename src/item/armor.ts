import { Item } from "./item";
import { Game } from "../game";
import { LevelConstants } from "../levelConstants";
import { Player } from "../player";
import { Level } from "../level";
import { TextParticle } from "../particle/textParticle";
import { GameConstants } from "../gameConstants";
import { Equippable } from "./equippable";

export class Armor extends Equippable {
  health: number;
  rechargeTurnCounter: number;
  readonly RECHARGE_TURNS = 15;

  constructor(level: Level, x: number, y: number) {
    super(level, x, y);
    this.health = 1;
    this.rechargeTurnCounter = -1;
    this.tileX = 5;
    this.tileY = 0;
  }

  coEquippable = (other: Equippable): boolean => {
    if (other instanceof Armor) return false;
    return true;
  };

  getDescription = (): string => {
    return (
      "ENCHANTED ARMOR\nA magic suit of armor.\nAbsorbs one hit and \nregenerates after " +
      this.RECHARGE_TURNS +
      " turns." +
      (this.equipped ? "\nEQUIPPED" : "")
    );
  };

  tickInInventory = () => {
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
    this.rechargeTurnCounter = this.RECHARGE_TURNS + 1;
    this.level.game.level.particles.push(
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
}
