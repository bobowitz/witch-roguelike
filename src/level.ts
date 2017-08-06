import { Wall } from "./wall";
import { LevelConstants } from "./levelConstants";
import { Floor } from "./floor";
import { Game } from "./game";
import { Collidable } from "./collidable";
import { Door } from "./door";
import { BottomDoor } from "./bottomDoor";
import { WallSide } from "./wallSide";
import { Tile } from "./tile";
import { Trapdoor } from "./trapdoor";
import { KnightEnemy } from "./knightEnemy";
import { Enemy } from "./enemy";

export class Level {
  levelArray: Tile[][];
  enemies: Array<Enemy>;
  game: Game;
  bottomDoorX: number;
  bottomDoorY: number;

  private pointInside(
    x: number,
    y: number,
    rX: number,
    rY: number,
    rW: number,
    rH: number
  ): boolean {
    if (x < rX || x >= rX + rW) return false;
    if (y < rY || y >= rY + rH) return false;
    return true;
  }

  private fixWalls() {
    for (let x = 0; x < LevelConstants.SCREEN_W; x++) {
      for (let y = 0; y < LevelConstants.SCREEN_H; y++) {
        if (this.levelArray[x][y] instanceof Wall) {
          if (this.levelArray[x][y + 1] instanceof Floor) {
            if (this.levelArray[x][y + 2] instanceof Floor)
              this.levelArray[x][y + 1] = new WallSide(x, y + 1);
            else {
              if (this.levelArray[x][y - 1] instanceof Wall)
                this.levelArray[x][y] = new WallSide(x, y);
              else this.levelArray[x][y] = new Floor(x, y);
            }
          }
        }
      }
    }
  }

  constructor(game: Game, previousDoor: Door) {
    // if previousDoor is null, no bottom door
    this.game = game;

    let width = Game.rand(LevelConstants.MIN_LEVEL_W, LevelConstants.MAX_LEVEL_W);
    let height = Game.rand(LevelConstants.MIN_LEVEL_H, LevelConstants.MAX_LEVEL_H);

    this.levelArray = [];
    for (let x = 0; x < LevelConstants.SCREEN_W; x++) {
      this.levelArray[x] = [];
    }

    let roomX = Math.floor(LevelConstants.SCREEN_W / 2 - width / 2);
    let roomY = Math.floor(LevelConstants.SCREEN_H / 2 - height / 2);

    this.bottomDoorX = Math.floor(roomX + width / 2);
    this.bottomDoorY = roomY + height;

    // fill in outside walls
    for (let x = 0; x < LevelConstants.SCREEN_W; x++) {
      for (let y = 0; y < LevelConstants.SCREEN_H; y++) {
        this.levelArray[x][y] = new Wall(x, y, 1);
      }
    }
    // put in floors
    for (let x = 0; x < LevelConstants.SCREEN_W; x++) {
      for (let y = 0; y < LevelConstants.SCREEN_H; y++) {
        if (this.pointInside(x, y, roomX, roomY, width, height)) {
          this.levelArray[x][y] = new Floor(x, y);
        }
      }
    }
    // outer ring walls
    for (let x = 0; x < LevelConstants.SCREEN_W; x++) {
      for (let y = 0; y < LevelConstants.SCREEN_H; y++) {
        if (this.pointInside(x, y, roomX - 1, roomY - 1, width + 2, height + 2)) {
          if (!this.pointInside(x, y, roomX, roomY, width, height)) {
            this.levelArray[x][y] = new Wall(x, y, 0);
          }
        }
      }
    }

    // put some random wall blocks in the room
    let numBlocks = Game.randTable([0, 1, 1, 2, 2, 2, 2, 3, 3]);
    for (let i = 0; i < numBlocks; i++) {
      let blockW = Math.min(Game.randTable([2, 2, 2, 3, 4, 5]), width - 2);
      let blockH = Math.min(blockW + Game.rand(-1, 1), height - 3);

      let x = Game.rand(roomX + 1, roomX + width - blockW - 1);
      let y = Game.rand(roomY + 2, roomY + height - blockH - 2);

      for (let xx = x; xx < x + blockW; xx++) {
        for (let yy = y; yy < y + blockH; yy++) {
          this.levelArray[xx][yy] = new Wall(xx, yy, 0);
        }
      }
    }
    // add "finger" blocks extending from ring walls inward
    let numFingers = Game.randTable([0, 1, 1, 2, 2, 3, 4, 5]);
    let FINGER_LENGTH = 3;
    for (let i = 0; i < numFingers; i++) {
      let x = 0;
      let y = 0;
      let blockW = 0;
      let blockH = 0;
      if (Game.rand(0, 1) === 0) {
        // horizontal
        blockW = Game.rand(1, FINGER_LENGTH);
        blockH = 1;

        if (Game.rand(0, 1) === 0) {
          // left
          x = roomX;
          y = Game.rand(roomY + 2, roomY + height - 3);
          for (let xx = x; xx < x + blockW + 1; xx++) {
            for (let yy = y - 2; yy < y + blockH + 2; yy++) {
              this.levelArray[xx][yy] = new Floor(xx, yy);
            }
          }
          for (let xx = x; xx < x + blockW; xx++) {
            for (let yy = y; yy < y + blockH; yy++) {
              this.levelArray[xx][yy] = new Wall(xx, yy, 0);
            }
          }
        } else {
          x = roomX + width - blockW;
          y = Game.rand(roomY + 2, roomY + height - 3);
          for (let xx = x - 1; xx < x + blockW; xx++) {
            for (let yy = y - 2; yy < y + blockH + 2; yy++) {
              this.levelArray[xx][yy] = new Floor(xx, yy);
            }
          }
          for (let xx = x; xx < x + blockW; xx++) {
            for (let yy = y; yy < y + blockH; yy++) {
              this.levelArray[xx][yy] = new Wall(xx, yy, 0);
            }
          }
        }
      } else {
        blockW = 1;
        blockH = Game.rand(1, FINGER_LENGTH);

        if (Game.rand(0, 1) === 0) {
          // top
          y = roomY;
          x = Game.rand(roomX + 2, roomX + width - 3);
          for (let xx = x - 1; xx < x + blockW + 1; xx++) {
            for (let yy = y + 1; yy < y + blockH + 2; yy++) {
              this.levelArray[xx][yy] = new Floor(xx, yy);
            }
          }
          for (let xx = x; xx < x + blockW; xx++) {
            for (let yy = y; yy < y + blockH; yy++) {
              this.levelArray[xx][yy] = new Wall(xx, yy, 0);
            }
          }
        } else {
          y = roomY + height - blockH;
          x = Game.rand(roomX + 2, roomX + width - 3);
          for (let xx = x - 1; xx < x + blockW + 1; xx++) {
            for (let yy = y - 2; yy < y + blockH; yy++) {
              this.levelArray[xx][yy] = new Floor(xx, yy);
            }
          }
          for (let xx = x; xx < x + blockW; xx++) {
            for (let yy = y; yy < y + blockH; yy++) {
              this.levelArray[xx][yy] = new Wall(xx, yy, 0);
            }
          }
        }
      }
    }

    this.levelArray[this.bottomDoorX][this.bottomDoorY - 1] = new Floor(
      this.bottomDoorX,
      this.bottomDoorY - 1
    );
    if (previousDoor !== null) {
      this.levelArray[this.bottomDoorX][this.bottomDoorY] = new BottomDoor(
        this.game,
        previousDoor,
        this.bottomDoorX,
        this.bottomDoorY
      );
    }

    this.fixWalls();

    // add doors
    let numDoors = Game.randTable([1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 3]);
    for (let i = 0; i < numDoors; i++) {
      let x = 0;
      let y = 0;
      do {
        x = Game.rand(0, LevelConstants.SCREEN_W - 1);
        y = Game.rand(0, LevelConstants.SCREEN_H - 1);
      } while (
        !(this.levelArray[x][y] instanceof WallSide) ||
        this.getTile(x, y) instanceof Door ||
        this.getTile(x - 1, y) instanceof Door ||
        this.getTile(x + 1, y) instanceof Door
      );

      this.levelArray[x][y] = new Door(this.game, this, x, y);
    }

    this.enemies = Array<Enemy>();
    // add enemies
    let numEnemies = Game.randTable([
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      2,
      3,
      4,
      5,
      5,
      5,
      5,
      5,
    ]);
    for (let i = 0; i < numEnemies; i++) {
      let x = 0;
      let y = 0;
      while (!(this.getTile(x, y) instanceof Floor)) {
        x = Game.rand(roomX, roomX + width - 1);
        y = Game.rand(roomY, roomY + height - 1);
      }
      this.enemies.push(new KnightEnemy(this.game, this, x, y));
    }

    // add trapdoors
    let numTrapdoors = Game.randTable([
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      1,
      1,
      1,
      1,
      1,
      1,
      2,
    ]);
    for (let i = 0; i < numTrapdoors; i++) {
      let x = 0;
      let y = 0;
      while (!(this.getTile(x, y) instanceof Floor)) {
        x = Game.rand(roomX, roomX + width - 1);
        y = Game.rand(roomY, roomY + height - 1);
      }
      this.levelArray[x][y] = new Trapdoor(this.game, x, y);
    }

    this.game.player.move(this.bottomDoorX, this.bottomDoorY - 1);
  }

  enterLevel = () => {
    this.game.player.move(this.bottomDoorX, this.bottomDoorY);
  };

  enterLevelThroughDoor = (door: Door) => {
    this.game.player.move(door.x, door.y + 1);
  };

  getCollidable = (x: number, y: number) => {
    for (const col of this.levelArray) {
      for (const tile of col) {
        if (tile instanceof Collidable && tile.x === x && tile.y === y) return tile;
      }
    }
    return null;
  };

  getTile = (x: number, y: number) => {
    for (const col of this.levelArray) {
      for (const tile of col) {
        if (tile !== null && tile.x === x && tile.y === y) return tile;
      }
    }
    return null;
  };

  tick = () => {
    for (const e of this.enemies) {
      e.tick();
    }
  };

  update = () => {
    // update, animations maybe?
  };

  draw = () => {
    for (const col of this.levelArray) {
      for (const tile of col) {
        if (tile !== null) tile.draw();
      }
    }

    for (const e of this.enemies) {
      e.draw();
    }
  };
}
