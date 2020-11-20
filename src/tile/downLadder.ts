import { Player } from "../player";
import { ChatMessage, Game } from "../game";
import { Level } from "../level";
import { BottomDoor } from "./bottomDoor";
import { GameConstants } from "../gameConstants";
import { SkinType, Tile } from "./tile";
import { UpLadder } from "./upLadder";

export class DownLadder extends Tile {
  linkedLevel: Level;
  game: Game;
  isRope = false;

  constructor(level: Level, game: Game, x: number, y: number) {
    super(level, x, y);
    this.game = game;
    this.linkedLevel = null;
  }

  generate = () => {
    // called by Game during transition
    if (!this.linkedLevel) {
      this.linkedLevel = this.game.levelgen.generate(
        this.game,
        this.level.depth + (this.isRope ? 0 : 1),
        this.isRope
      );
      for (let col of this.linkedLevel.levelArray)
        for (let tile of col)
          if (tile instanceof UpLadder && tile.isRope)
            tile.linkedLevel = this.level;
    }
  };

  onCollide = (player: Player) => {
    if (this.isRope) player.levelID = this.game.changeLevelThroughLadder(player, this);
    else {
      let allPlayersHere = true;
      for (const i in this.game.players) {
        if (this.game.levels[this.game.players[i].levelID] !== this.level || this.game.players[i].x !== this.x || this.game.players[i].y !== this.y) {
          allPlayersHere = false;
        }
      }
      if (allPlayersHere) {
        this.generate();
        for (const i in this.game.players) {
          this.game.players[i].levelID = this.game.changeLevelThroughLadder(this.game.players[i], this);
        }
      } else {
        if (player === this.game.players[this.game.localPlayerID]) this.game.chat.push(new ChatMessage('all players must be present'));
      }
    }
  };

  draw = (delta: number) => {
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

  drawAbovePlayer = (delta: number) => { };
}
