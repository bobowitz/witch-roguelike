import { Game } from "./game";
import { GameConstants } from "./gameConstants";
import { Door } from "./tile/door";
import { BottomDoor } from "./tile/bottomDoor";
import { RoomType } from "./level";
import { SideDoor } from "./tile/sidedoor";

// class MapRoom {
//   x: number;
//   y: number;
//   w: number;
//   h: number;
//   isCurrent: boolean;

//   constructor() {
//     this.parent = null;
//     this.children = Array<TreeNode>();
//     this.width = 0;
//     this.isCurrent = false;
//     this.unopened = false;
//   }
// }

export class Map {
  game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  draw = () => {
    let SCALE = 1;

    let startLevel = this.game.levels[0];

    Game.ctx.globalAlpha = 0.5;
    Game.ctx.fillStyle = "white";
    Game.ctx.fillRect(0, 0, GameConstants.WIDTH, GameConstants.HEIGHT);

    Game.ctx.translate(0.5 * GameConstants.WIDTH, 0.5 * GameConstants.HEIGHT);

    /*Game.ctx.translate(
      startLevel.x + Math.floor(startLevel.width / 2),
      startLevel.y + Math.floor(startLevel.height / 2)
    );
    Game.ctx.scale(SCALE, SCALE);
    Game.ctx.translate(
      -(startLevel.x + Math.floor(startLevel.width / 2)),
      -(startLevel.y + Math.floor(startLevel.height / 2))
    );*/

    Game.ctx.globalAlpha = 1;
    for (const level of this.game.levels) {
      if (this.game.level.group === level.group) {
        Game.ctx.fillStyle = "black";
        if (level.type === RoomType.UPLADDER) Game.ctx.fillStyle = "#101460";
        if (level.type === RoomType.DOWNLADDER) Game.ctx.fillStyle = "#601410";
        if (!level.entered) Game.ctx.fillStyle = "#606060";
        Game.ctx.fillRect(level.x, level.y + 1, level.width, level.height - 1);
        //console.log(level.doors);
        for (const door of level.doors) {
          Game.ctx.fillStyle = "black";
          if (!level.entered) Game.ctx.fillStyle = "#606060";

          //Game.ctx.fillStyle = "#0085ff";
          Game.ctx.fillRect(level.x - level.roomX + door.x, level.y - level.roomY + door.y, 1, 1);
        }
      }
    }
    Game.ctx.fillStyle = GameConstants.RED;
    Game.ctx.fillRect(
      this.game.level.x - this.game.level.roomX + this.game.player.x,
      this.game.level.y - this.game.level.roomY + this.game.player.y,
      1,
      1
    );
    Game.ctx.setTransform(1, 0, 0, 1, 0, 0);
  };
}
