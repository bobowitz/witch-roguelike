import { Game } from "./game";
import { GameConstants } from "./gameConstants";
import { RoomType } from "./level";

export class Map {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  draw = (delta: number) => {
    if (GameConstants.ALPHA_ENABLED) Game.ctx.globalAlpha = 0.5;
    Game.ctx.fillStyle = "white";
    Game.ctx.fillRect(0, 0, GameConstants.WIDTH, GameConstants.HEIGHT);

    Game.ctx.translate(0.5 * GameConstants.WIDTH - this.game.level.roomX - Math.floor(0.5 * this.game.level.width), 0.5 * GameConstants.HEIGHT - this.game.level.roomY - Math.floor(0.5 * this.game.level.height));

    Game.ctx.globalAlpha = 1;
    for (const level of this.game.levels) {
      if (this.game.level.mapGroup === level.mapGroup && level.entered) {
        Game.ctx.fillStyle = "black";
        if (level.type === RoomType.UPLADDER) Game.ctx.fillStyle = "#101460";
        if (level.type === RoomType.DOWNLADDER) Game.ctx.fillStyle = "#601410";
        Game.ctx.fillRect(level.roomX + 1, level.roomY + 1, level.width - 2, level.height - 2);

        for (const door of level.doors) {
          Game.ctx.fillStyle = "black";
          Game.ctx.fillRect(door.x, door.y, 1, 1);
        }
      }
    }
    Game.ctx.fillStyle = GameConstants.RED;
    for (const i in this.game.players) {
      if (this.game.levels[this.game.players[i].levelID].mapGroup === this.game.level.mapGroup) {
        Game.ctx.fillRect(this.game.players[i].x, this.game.players[i].y, 1, 1);
      }
    }
    Game.ctx.setTransform(1, 0, 0, 1, 0, 0);
  };
}
