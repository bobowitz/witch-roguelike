import { Wall } from "./tile/wall";
import { LevelConstants } from "./levelConstants";
import { Floor } from "./tile/floor";
import { Game } from "./game";
import { Collidable } from "./tile/collidable";
import { Door } from "./tile/door";
import { BottomDoor } from "./tile/bottomDoor";
import { WallSide } from "./tile/wallSide";
import { Tile } from "./tile/tile";
import { Trapdoor } from "./tile/trapdoor";
import { KnightEnemy } from "./enemy/knightEnemy";
import { Enemy } from "./enemy/enemy";
import { Chest } from "./tile/chest";
import { Item } from "./item/item";
import { SpawnFloor } from "./tile/spawnfloor";
import { LockedDoor } from "./tile/lockedDoor";
import { Spike } from "./tile/spike";
import { TextParticle } from "./textParticle";
import { GameConstants } from "./gameConstants";
import { SkullEnemy } from "./enemy/skullEnemy";
import { Map } from "./map";

export class Level {
  levelArray: Tile[][];
  enemies: Array<Enemy>;
  items: Array<Item>;
  doors: Array<Door>; // just a reference for mapping, still access through levelArray
  textParticles: Array<TextParticle>;
  game: Game;
  bottomDoorX: number;
  bottomDoorY: number;
  roomX: number;
  roomY: number;
  hasBottomDoor: boolean;
  parentLevel: Level;
  env: number; // which environment is this level?
  name: string;

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
          if (
            this.levelArray[x][y + 1] instanceof Floor ||
            this.levelArray[x][y + 1] instanceof SpawnFloor
          ) {
            if (
              this.levelArray[x][y + 2] instanceof Floor ||
              this.levelArray[x][y + 2] instanceof SpawnFloor
            )
              this.levelArray[x][y + 1] = new WallSide(this, x, y + 1);
            else {
              if (this.levelArray[x][y - 1] instanceof Wall)
                this.levelArray[x][y] = new WallSide(this, x, y);
              else this.levelArray[x][y] = new Floor(this, x, y);
            }
          }
        }
      }
    }
  }

  static randEnv = () => {
    return Game.rand(0, LevelConstants.ENVIRONMENTS - 1);
  };

  constructor(game: Game, previousDoor: Door, deadEnd: boolean, env: number) {
    this.env = env;

    this.items = Array<Item>();
    this.textParticles = Array<TextParticle>();
    this.doors = Array<Door>();

    // if previousDoor is null, no bottom door
    this.hasBottomDoor = true;
    if (previousDoor === null) {
      this.hasBottomDoor = false;
      this.parentLevel = null;
    }
    this.game = game;

    let width = Game.randTable([5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 9, 11, 13]);
    let height = width + Game.rand(-2, 2);
    height = Math.min(height, LevelConstants.MAX_LEVEL_H);
    height = Math.max(height, LevelConstants.MIN_LEVEL_H);

    this.levelArray = [];
    for (let x = 0; x < LevelConstants.SCREEN_W; x++) {
      this.levelArray[x] = [];
    }

    this.roomX = Math.floor(LevelConstants.SCREEN_W / 2 - width / 2);
    this.roomY = Math.floor(LevelConstants.SCREEN_H / 2 - height / 2);

    this.bottomDoorX = Math.floor(this.roomX + width / 2);
    this.bottomDoorY = this.roomY + height;

    // fill in outside walls
    for (let x = 0; x < LevelConstants.SCREEN_W; x++) {
      for (let y = 0; y < LevelConstants.SCREEN_H; y++) {
        this.levelArray[x][y] = new Wall(this, x, y, 1);
      }
    }
    // put in floors
    for (let x = 0; x < LevelConstants.SCREEN_W; x++) {
      for (let y = 0; y < LevelConstants.SCREEN_H; y++) {
        if (this.pointInside(x, y, this.roomX, this.roomY, width, height)) {
          this.levelArray[x][y] = new Floor(this, x, y);
        }
      }
    }
    // outer ring walls
    for (let x = 0; x < LevelConstants.SCREEN_W; x++) {
      for (let y = 0; y < LevelConstants.SCREEN_H; y++) {
        if (this.pointInside(x, y, this.roomX - 1, this.roomY - 1, width + 2, height + 2)) {
          if (!this.pointInside(x, y, this.roomX, this.roomY, width, height)) {
            this.levelArray[x][y] = new Wall(this, x, y, 0);
          }
        }
      }
    }

    // put some random wall blocks in the room
    let numBlocks = Game.randTable([0, 1, 1, 2, 2, 2, 2, 3, 3]);
    for (let i = 0; i < numBlocks; i++) {
      let blockW = Math.min(Game.randTable([2, 2, 2, 5, 7, 9]), width - 2);
      let blockH = Math.min(blockW + Game.rand(-1, 1), height - 3);

      let x = Game.rand(this.roomX + 1, this.roomX + width - blockW - 1);
      let y = Game.rand(this.roomY + 2, this.roomY + height - blockH - 2);

      for (let xx = x; xx < x + blockW; xx++) {
        for (let yy = y; yy < y + blockH; yy++) {
          this.levelArray[xx][yy] = new Wall(this, xx, yy, 0);
        }
      }
    }
    // add "finger" blocks extending from ring walls inward
    let numFingers = Game.randTable([0, 1, 1, 2, 2, 3, 4, 5]);
    if (Game.rand(1, 13) > width) numFingers += width * 0.3;
    let FINGER_LENGTH = height - 3;
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
          x = this.roomX;
          y = Game.rand(this.roomY + 2, this.roomY + height - 3);
          for (let xx = x; xx < x + blockW + 1; xx++) {
            for (let yy = y - 2; yy < y + blockH + 2; yy++) {
              this.levelArray[xx][yy] = new Floor(this, xx, yy);
            }
          }
          for (let xx = x; xx < x + blockW; xx++) {
            for (let yy = y; yy < y + blockH; yy++) {
              this.levelArray[xx][yy] = new Wall(this, xx, yy, 0);
            }
          }
        } else {
          x = this.roomX + width - blockW;
          y = Game.rand(this.roomY + 2, this.roomY + height - 3);
          for (let xx = x - 1; xx < x + blockW; xx++) {
            for (let yy = y - 2; yy < y + blockH + 2; yy++) {
              this.levelArray[xx][yy] = new Floor(this, xx, yy);
            }
          }
          for (let xx = x; xx < x + blockW; xx++) {
            for (let yy = y; yy < y + blockH; yy++) {
              this.levelArray[xx][yy] = new Wall(this, xx, yy, 0);
            }
          }
        }
      } else {
        blockW = 1;
        blockH = Game.rand(1, FINGER_LENGTH);

        if (Game.rand(0, 1) === 0) {
          // top
          y = this.roomY;
          x = Game.rand(this.roomX + 2, this.roomX + width - 3);
          for (let xx = x - 1; xx < x + blockW + 1; xx++) {
            for (let yy = y + 1; yy < y + blockH + 2; yy++) {
              this.levelArray[xx][yy] = new Floor(this, xx, yy);
            }
          }
          for (let xx = x; xx < x + blockW; xx++) {
            for (let yy = y; yy < y + blockH; yy++) {
              this.levelArray[xx][yy] = new Wall(this, xx, yy, 0);
            }
          }
        } else {
          y = this.roomY + height - blockH;
          x = Game.rand(this.roomX + 2, this.roomX + width - 3);
          for (let xx = x - 1; xx < x + blockW + 1; xx++) {
            for (let yy = y - 2; yy < y + blockH; yy++) {
              this.levelArray[xx][yy] = new Floor(this, xx, yy);
            }
          }
          for (let xx = x; xx < x + blockW; xx++) {
            for (let yy = y; yy < y + blockH; yy++) {
              this.levelArray[xx][yy] = new Wall(this, xx, yy, 0);
            }
          }
        }
      }
    }

    this.levelArray[this.bottomDoorX][this.bottomDoorY - 1] = new SpawnFloor(
      this,
      this.bottomDoorX,
      this.bottomDoorY - 1
    );
    if (previousDoor !== null) {
      this.levelArray[this.bottomDoorX][this.bottomDoorY] = new BottomDoor(
        this,
        this.game,
        previousDoor,
        this.bottomDoorX,
        this.bottomDoorY
      );
    }

    this.fixWalls();

    // add trapdoors
    let numTrapdoors = Game.rand(1, 10);
    if (numTrapdoors === 1) {
      numTrapdoors = Game.randTable([1, 1, 1, 1, 1, 1, 2]);
    } else numTrapdoors = 0;
    for (let i = 0; i < numTrapdoors; i++) {
      let x = 0;
      let y = 0;
      while (!(this.getTile(x, y) instanceof Floor)) {
        x = Game.rand(this.roomX, this.roomX + width - 1);
        y = Game.rand(this.roomY, this.roomY + height - 1);
      }
      this.levelArray[x][y] = new Trapdoor(this, this.game, x, y);
    }

    // add doors
    let numDoors = Game.randTable([1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3]);
    if (deadEnd) {
      numDoors = Game.randTable([1, 1, 1, 2, 2]);
      if (Game.rand(1, 2) === 1) numDoors = 0;
    }
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

      // if there are multiple doors, make all but one a dead end
      let d;
      if (numDoors > 0 && i !== 0) {
        if (Game.rand(1, 5) === 1) {
          // locked (90% dead-end as well) door
          d = new LockedDoor(this, x, y);
        } else {
          // regular dead-end door
          d = new Door(this, this.game, x, y, true); // make a new dead end
        }
      } else {
        // otherwise, generate a non-dead end
        d = new Door(this, this.game, x, y, deadEnd); // deadEnd
      }
      this.levelArray[x][y] = d;
      if (!(d instanceof LockedDoor)) this.doors.push(d);
    }
    this.doors.sort((a, b) => a.x - b.x); // sort by x, ascending, so the map makes sense

    // add chests
    let numChests = Game.rand(1, 8);
    if (numChests === 1 || numDoors === 0) {
      // if it's a dead end, at least give them a chest
      numChests = Game.randTable([0, 1, 1, 2, 2, 3, 4]);
      // (but not guaranteed   ---^)
    } else numChests = 0;
    for (let i = 0; i < numChests; i++) {
      let x = 0;
      let y = 0;
      while (!(this.getTile(x, y) instanceof Floor)) {
        x = Game.rand(this.roomX, this.roomX + width - 1);
        y = Game.rand(this.roomY, this.roomY + height - 1);
      }
      this.levelArray[x][y] = new Chest(this, this.game, x, y);
    }

    // add spikes
    let numSpikes = Game.rand(1, 10);
    if (numSpikes === 1) {
      numSpikes = Game.randTable([1, 1, 1, 1, 2, 3]);
    } else numSpikes = 0;
    for (let i = 0; i < numSpikes; i++) {
      let x = 0;
      let y = 0;
      while (!(this.getTile(x, y) instanceof Floor)) {
        x = Game.rand(this.roomX, this.roomX + width - 1);
        y = Game.rand(this.roomY, this.roomY + height - 1);
      }
      this.levelArray[x][y] = new Spike(this, x, y);
    }

    this.enemies = Array<Enemy>();
    // add enemies
    let numEnemies = Game.rand(1, 2);
    if (numEnemies === 1 || width * height > 8 * 8) {
      numEnemies = Game.randTable([1, 2, 2, 3, 3, 4, 4, 4, 4, 5, 5, 5]);
    } else numEnemies = 0;
    for (let i = 0; i < numEnemies; i++) {
      let x = 0;
      let y = 0;
      while (
        !(this.getTile(x, y) instanceof Floor) ||
        (x === this.bottomDoorX && y === this.bottomDoorY) ||
        (x === this.bottomDoorX && y === this.bottomDoorY - 1)
      ) {
        x = Game.rand(this.roomX, this.roomX + width - 1);
        y = Game.rand(this.roomY, this.roomY + height - 1);
      }
      if (Game.rand(1, 2) === 1) this.enemies.push(new KnightEnemy(this, this.game, x, y));
      else this.enemies.push(new SkullEnemy(this, this.game, x, y));
    }

    if (this.hasBottomDoor) {
      let b = this.levelArray[this.bottomDoorX][this.bottomDoorY] as BottomDoor;
      this.parentLevel = b.linkedTopDoor.level;
    }

    this.classify(width, height, numEnemies);
  }

  // name this level
  classify = (width: number, height: number, numEnemies: number) => {
    let numDoors = 0;
    let numTrapdoors = 0;
    let numChests = 0;
    for (const col of this.levelArray) {
      for (const t of col) {
        if (t instanceof Door) numDoors++;
        if (t instanceof Trapdoor) numTrapdoors++;
        if (t instanceof Chest) numChests++;
      }
    }

    this.name = "";

    if (numChests >= 2) this.name = "Treasure";
    else if (numDoors >= 3) this.name = "Passageway";
    else if (numTrapdoors > 0) this.name = "Trick Room";
    else if (Game.rand(1, 10) === 1) {
      if (this.env === 0) {
        let names = ["Dungeon", "Prison", "Sewer"];
        this.name = names[Game.rand(0, names.length - 1)];
      }
      if (this.env === 1) {
        let names = ["Forest", "Grass", "Hills"];
        this.name = names[Game.rand(0, names.length - 1)];
      }
      if (this.env === 2) {
        let names = ["House", "Mansion", "Inn"];
        this.name = names[Game.rand(0, names.length - 1)];
      }
      if (this.env === 3) {
        let names = ["Snow Palace", "Ice Palace", "Freeze", "Ice Kingdom", "Glacier", "Mountain"];
        this.name = names[Game.rand(0, names.length - 1)];
      }
    }

    let adjectiveList = [
      "Abandoned",
      "Deserted",
      "Haunted",
      "Cursed",
      "Ancient",
      "Lonely",
      "Spooky",
    ];
    if (this.name !== "")
      this.name = adjectiveList[Game.rand(0, adjectiveList.length - 1)] + " " + this.name;
  };

  exitLevel = () => {
    this.textParticles.splice(0, this.textParticles.length);
  };

  updateLevelTextColor = () => {
    LevelConstants.LEVEL_TEXT_COLOR = "white";
    if (this.env === 3) LevelConstants.LEVEL_TEXT_COLOR = "black";
  };

  enterLevel = () => {
    this.updateLevelTextColor();
    if (this.hasBottomDoor) {
      this.game.player.moveNoSmooth(this.bottomDoorX, this.bottomDoorY);
    } else this.game.player.moveNoSmooth(this.bottomDoorX, this.bottomDoorY - 1);
  };

  enterLevelThroughDoor = (door: Door) => {
    this.updateLevelTextColor();
    this.game.player.moveNoSmooth(door.x, door.y + 1);
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
    this.game.player.startTick();
    for (const e of this.enemies) {
      e.tick();
    }
    this.enemies = this.enemies.filter(e => !e.dead);
    this.game.player.finishTick();
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
  };

  drawEntitiesBehindPlayer = () => {
    this.enemies.sort((a, b) => a.y - b.y);
    this.items.sort((a, b) => a.y - b.y);

    for (const e of this.enemies) {
      if (e.y <= this.game.player.y) e.draw();
    }
    for (const i of this.items) {
      if (i.y <= this.game.player.y) i.draw();
    }
  };
  drawEntitiesInFrontOfPlayer = () => {
    for (const e of this.enemies) {
      if (e.y > this.game.player.y) e.draw();
    }
    for (const i of this.items) {
      if (i.y > this.game.player.y) i.draw();
    }
  };

  // for stuff rendered on top of the player
  drawTopLayer = () => {
    for (const e of this.enemies) {
      e.drawTopLayer(); // health bars
    }

    this.textParticles = this.textParticles.filter(x => !x.dead);
    for (const p of this.textParticles) {
      p.draw();
    }

    // gui stuff

    // room name
    Game.ctx.fillStyle = LevelConstants.LEVEL_TEXT_COLOR;
    Game.ctx.fillText(
      this.name,
      GameConstants.WIDTH / 2 - Game.ctx.measureText(this.name).width / 2,
      (this.roomY - 2) * GameConstants.TILESIZE
    );
  };
}
