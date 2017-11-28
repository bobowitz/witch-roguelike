import { Collidable } from "./collidable";
import { Player } from "../player";
import { Game } from "../game";
import { Level } from "../level";

export class Door extends Collidable {
  linkedLevel: Level;
  game: Game;
  deadEnd: boolean;
  goldenKey: boolean;
  distFromStart: number;
  opened: boolean;

  constructor(
    level: Level,
    game: Game,
    x: number,
    y: number,
    deadEnd: boolean,
    goldenKey: boolean,
    distFromStart: number
  ) {
    super(level, x, y);
    this.game = game;
    this.linkedLevel = null;
    this.deadEnd = deadEnd;
    this.goldenKey = goldenKey;
    this.distFromStart = distFromStart;
    this.opened = false;
  }

  onCollide = (player: Player) => {
    this.opened = true;
    if (this.linkedLevel === null)
      this.linkedLevel = new Level(
        this.game,
        this,
        this.deadEnd,
        this.goldenKey,
        this.distFromStart,
        this.level.env
      );
    this.game.changeLevel(this.linkedLevel);
  };

  draw = () => {
    if (this.opened) Game.drawTile(6, this.level.env, 1, 1, this.x, this.y, this.w, this.h);
    else Game.drawTile(3, this.level.env, 1, 1, this.x, this.y, this.w, this.h);
  };
}
