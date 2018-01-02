import { StatConstants } from "./statconstants";
import { Game } from "./game";
import { GameConstants } from "./gameConstants";
import { LevelConstants } from "./levelConstants";

export class Stats {
  xp: number;
  xpToLevelUp: number;
  level: number;

  constructor() {
    this.xp = 0;
    this.level = 1;
    this.xpToLevelUp = StatConstants.LEVEL_UP_TABLE[this.level - 1];
  }

  getLevel = (xp: number) => {
    for (let i = 0; i < StatConstants.LEVELS; i++) {
      if (xp < StatConstants.LEVEL_UP_TABLE[i]) return i + 1;
    }
    return StatConstants.LEVELS;
  }

  getXP = (amount: number) => {
    this.xp += amount;
    this.level = this.getLevel(this.xp);
    if (this.xp > this.xpToLevelUp) { // level up
      console.log("level up!");
    }
    this.xpToLevelUp = StatConstants.LEVEL_UP_TABLE[this.level - 1];
  }

  drawGUI = () => {
    Game.ctx.fillStyle = GameConstants.OUTLINE;
    Game.ctx.fillRect(
      1,
      GameConstants.HEIGHT - 30,
      GameConstants.WIDTH - 2,
      14
    );
    Game.ctx.fillStyle = GameConstants.RED;
    Game.ctx.fillRect(2, GameConstants.HEIGHT - 29, GameConstants.WIDTH - 4, 12);

    Game.ctx.fillStyle = GameConstants.GREEN;
    Game.ctx.fillRect(
      2, GameConstants.HEIGHT - 29, Math.floor((this.xp / this.xpToLevelUp) * (GameConstants.WIDTH - 4)), 12
    );

    Game.ctx.fillStyle = LevelConstants.LEVEL_TEXT_COLOR;
    Game.ctx.fillText("" + this.xp + "/" + this.xpToLevelUp, 3, GameConstants.HEIGHT - (GameConstants.FONT_SIZE - 1) - 15);

    Game.ctx.fillText(
      "Level " + this.level,
      GameConstants.WIDTH - Game.ctx.measureText(GameConstants.VERSION).width + 1,
      GameConstants.HEIGHT - (GameConstants.FONT_SIZE - 1) - 15
    );
  }
}
