import { Item } from "./item";
import { Game } from "../game";
import { LevelConstants } from "../levelConstants";

export class Armor extends Item {
  health: number;
  rechargeTurnCounter: number;
  readonly RECHARGE_TURNS = 18;

  constructor(x: number, y: number) {
    super(x, y);
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
  }

  hurt = (damage: number) => {
    this.health -= damage;
    if (this.health <= 0) {
      this.health = 0;
      this.rechargeTurnCounter = this.RECHARGE_TURNS;
    }
  };

  drawGUI = (playerHealth: number) => {
    if (this.rechargeTurnCounter === -1)
      Game.drawItem(5, 0, 1, 2, playerHealth, LevelConstants.SCREEN_H - 2, 1, 2);
    else {
      let rechargeProportion = 1 - (this.rechargeTurnCounter / this.RECHARGE_TURNS);

      if (rechargeProportion < 0.33) {
        Game.drawItem(2, 0, 1, 2, playerHealth, LevelConstants.SCREEN_H - 2, 1, 2);
      } else if (rechargeProportion < 0.67) {
        Game.drawItem(3, 0, 1, 2, playerHealth, LevelConstants.SCREEN_H - 2, 1, 2);
      } else {
        Game.drawItem(4, 0, 1, 2, playerHealth, LevelConstants.SCREEN_H - 2, 1, 2);
      }
    }
  }
}
