import { Player } from "../player";
import { Game } from "../game";
import { Level } from "../level";
import { BottomDoor } from "./bottomDoor";
import { GameConstants } from "../gameConstants";
import { SkinType, Tile } from "./tile";
import { UpLadder } from "./upLadder";

export class DownLadder extends Tile {
  linkedLadder: UpLadder;
  game: Game;
  isRope = false;

  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, x, y);
    this.game = game;
    this.linkedLadder = null;
  }

  generate = () => {
    // called by Game during transition
    if (!this.linkedLadder) {
      this.linkedLadder = this.game.levelgen.generate(
        this.game,
        this.level.depth + (this.isRope ? 0 : 1),
        "hamburger",
        this.isRope
      );
      this.linkedLadder.linkedLadder = this;
    }
  };

  onCollide = (player: Player) => {
    player.levelID = this.game.changeLevelThroughLadder(this);
  };

  draw = () => {
    let xx = 4;
    if (this.isRope) xx = 16;

    Game.drawTile(
      1,
      this.skin,
      1,
      1,
      this.x,
      this.y,
      1,
      1,
      this.level.shadeColor,
      this.shadeAmount()
    );
    Game.drawTile(
      xx,
      this.skin,
      1,
      1,
      this.x,
      this.y,
      1,
      1,
      this.level.shadeColor,
      this.shadeAmount()
    );
  };

  drawAbovePlayer = () => {};
}
