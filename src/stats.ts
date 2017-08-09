import { StatConstants } from "./statconstants";

export class Stats {
  xp: number;
  xpToLevelUp: number;
  level: number;

  constructor() {
    this.xp = 0;
    this.level = 1;
    this.xpToLevelUp = StatConstants.LEVEL_UP_TABLE[this.level - 1];
  }
}
