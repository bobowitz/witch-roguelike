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
import { Chest } from "./enemy/chest";
import { Item } from "./item/item";
import { GoldenKey } from "./item/goldenKey";
import { SpawnFloor } from "./tile/spawnfloor";
import { LockedDoor } from "./tile/lockedDoor";
import { GoldenDoor } from "./tile/goldenDoor";
import { Spike } from "./tile/spike";
import { GameConstants } from "./gameConstants";
import { SkullEnemy } from "./enemy/skullEnemy";
import { Map } from "./map";
import { Barrel } from "./enemy/barrel";
import { Crate } from "./enemy/crate";
import { Input } from "./input";
import { Armor } from "./item/armor";
import { Particle } from "./particle";

export class Level {
  levelArray: Tile[][];
  visibilityArray: number[][]; // visibility is 0, 1, or 2 (0 = black, 2 = fully lit)
  enemies: Array<Enemy>;
  items: Array<Item>;
  doors: Array<Door>; // just a reference for mapping, still access through levelArray
  particles: Array<Particle>;
  game: Game;
  bottomDoorX: number;
  bottomDoorY: number;
  roomX: number;
  roomY: number;
  width: number;
  height: number;
  hasBottomDoor: boolean;
  goldenKeyRoom: boolean;
  distFromStart: number;
  parentLevel: Level;
  env: number; // which environment is this level?
  difficulty: number;
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

  private buildEmptyRoom() {
    // fill in outside walls
    for (let x = 0; x < LevelConstants.SCREEN_W; x++) {
      for (let y = 0; y < LevelConstants.SCREEN_H; y++) {
        this.levelArray[x][y] = new Wall(this, x, y, 1);
      }
    }
    // put in floors
    for (let x = 0; x < LevelConstants.SCREEN_W; x++) {
      for (let y = 0; y < LevelConstants.SCREEN_H; y++) {
        if (this.pointInside(x, y, this.roomX, this.roomY, this.width, this.height)) {
          this.levelArray[x][y] = new Floor(this, x, y);
        }
      }
    }
    // outer ring walls
    for (let x = 0; x < LevelConstants.SCREEN_W; x++) {
      for (let y = 0; y < LevelConstants.SCREEN_H; y++) {
        if (
          this.pointInside(x, y, this.roomX - 1, this.roomY - 1, this.width + 2, this.height + 2)
        ) {
          if (!this.pointInside(x, y, this.roomX, this.roomY, this.width, this.height)) {
            this.levelArray[x][y] = new Wall(this, x, y, 0);
          }
        }
      }
    }
  }

  private addWallBlocks() {
    // put some random wall blocks in the room
    let numBlocks = Game.randTable([0, 1, 1, 2, 2, 2, 2, 3, 3]);
    for (let i = 0; i < numBlocks; i++) {
      let blockW = Math.min(Game.randTable([2, 2, 2, 5, 7, 9]), this.width - 2);
      let blockH = Math.min(blockW + Game.rand(-1, 1), this.height - 3);

      let x = Game.rand(this.roomX + 1, this.roomX + this.width - blockW - 1);
      let y = Game.rand(this.roomY + 2, this.roomY + this.height - blockH - 2);

      for (let xx = x; xx < x + blockW; xx++) {
        for (let yy = y; yy < y + blockH; yy++) {
          this.levelArray[xx][yy] = new Wall(this, xx, yy, 0);
        }
      }
    }
  }

  private addFingers() {
    // add "finger" blocks extending from ring walls inward
    let numFingers = Game.randTable([0, 1, 1, 2, 2, 3, 4, 5]);
    if (Game.rand(1, 13) > this.width) numFingers += this.width * 0.3;
    let FINGER_LENGTH = this.height - 3;
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
          y = Game.rand(this.roomY + 2, this.roomY + this.height - 3);
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
          x = this.roomX + this.width - blockW;
          y = Game.rand(this.roomY + 2, this.roomY + this.height - 3);
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
          x = Game.rand(this.roomX + 2, this.roomX + this.width - 3);
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
          y = this.roomY + this.height - blockH;
          x = Game.rand(this.roomX + 2, this.roomX + this.width - 3);
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
  }

  private addTrapdoors(): number {
    // add trapdoors
    let numTrapdoors = Game.rand(1, 10);
    if (numTrapdoors === 1) {
      numTrapdoors = Game.randTable([1, 1, 1, 1, 1, 1, 2]);
    } else numTrapdoors = 0;
    for (let i = 0; i < numTrapdoors; i++) {
      let x = 0;
      let y = 0;
      while (!(this.getTile(x, y) instanceof Floor)) {
        x = Game.rand(this.roomX, this.roomX + this.width - 1);
        y = Game.rand(this.roomY, this.roomY + this.height - 1);
      }
      this.levelArray[x][y] = new Trapdoor(this, this.game, x, y);
    }

    return numTrapdoors;
  }

  private addDoors(deadEnd: boolean, goldenKey: boolean): number {
    // add doors
    let numDoors = Game.randTable([1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 3]);
    if (deadEnd) {
      numDoors = Game.randTable([1, 1, 1, 2, 2]);
      if (Game.rand(1, 2) === 1) numDoors = 0;
    }
    if (!this.hasBottomDoor) {
      // first level has a regular door and a golden door
      numDoors = 2;
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
      if (!this.hasBottomDoor && i == 1) {
        d = new GoldenDoor(this, x, y);
      } else if (numDoors > 0 && i !== 0) {
        if (Game.rand(1, 5) === 1) {
          // locked (90% dead-end as well) door
          d = new LockedDoor(this, x, y);
        } else {
          // regular dead-end door
          d = new Door(this, this.game, x, y, true, false, this.distFromStart + 1); // make a new dead end
        }
      } else {
        // otherwise, generate a non-dead end (will eventually end with golden key)
        d = new Door(this, this.game, x, y, deadEnd, goldenKey, this.distFromStart + 1); // deadEnd
      }
      this.levelArray[x][y] = d;
      if (!(d instanceof LockedDoor) && !(d instanceof GoldenDoor)) this.doors.push(d);
    }
    this.doors.sort((a, b) => a.x - b.x); // sort by x, ascending, so the map makes sense

    return numDoors;
  }

  private addChests(numDoors: number): number {
    // add chests
    let numChests = Game.rand(1, 8);
    if (numChests === 1 || numDoors === 0) {
      // if it's a dead end, at least give them a chest
      numChests = Game.randTable([0, 1, 1, 2, 3, 4, 5, 6]);
      // (but not guaranteed   ---^)
    } else numChests = 0;
    for (let i = 0; i < numChests; i++) {
      let x = 0;
      let y = 0;
      while (
        !(this.getTile(x, y) instanceof Floor) ||
        this.enemies.filter(e => e.x === x && e.y === y).length > 0 // don't overlap other enemies!
      ) {
        x = Game.rand(this.roomX, this.roomX + this.width - 1);
        y = Game.rand(this.roomY, this.roomY + this.height - 1);
      }
      this.enemies.push(new Chest(this, this.game, x, y));
    }

    return numChests;
  }

  private addSpikes(): number {
    // add spikes
    let numSpikes = Game.rand(1, 10);
    if (numSpikes === 1) {
      numSpikes = Game.randTable([1, 1, 1, 1, 2, 3]);
    } else numSpikes = 0;
    for (let i = 0; i < numSpikes; i++) {
      let x = 0;
      let y = 0;
      while (!(this.getTile(x, y) instanceof Floor)) {
        x = Game.rand(this.roomX, this.roomX + this.width - 1);
        y = Game.rand(this.roomY, this.roomY + this.height - 1);
      }
      this.levelArray[x][y] = new Spike(this, x, y);
    }

    return numSpikes;
  }

  private addEnemies(): number {
    // add enemies
    let emptyTileCount = 0;
    for (let x = 0; x < LevelConstants.SCREEN_W; x++) {
      for (let y = 0; y < LevelConstants.SCREEN_H; y++) {
        if (this.getCollidable(x, y) === null) {
          emptyTileCount++;
        }
      }
    }
    let numEnemies =
      emptyTileCount /
      5; /*Game.rand(1, 2);
    if (numEnemies === 1 || this.width * this.height > 8 * 8) {
      numEnemies = Game.randTable([1, 2, 2, 3, 3, 3, 4, 4, 4]);
    } else numEnemies = 0;*/
    for (let i = 0; i < numEnemies; i++) {
      let x = 0;
      let y = 0;
      while (
        !(this.getTile(x, y) instanceof Floor) ||
        this.enemies.some(e => e.x === x && e.y === y) || // don't overlap other enemies!
        (x === this.bottomDoorX && y === this.bottomDoorY) ||
        (x === this.bottomDoorX && y === this.bottomDoorY - 1)
      ) {
        x = Game.rand(this.roomX, this.roomX + this.width - 1);
        y = Game.rand(this.roomY, this.roomY + this.height - 1);
      }
      switch (this.difficulty === 1 ? 1 : Game.rand(1, 2)) {
        case 1:
          this.enemies.push(new KnightEnemy(this, this.game, x, y));
          break;
        case 2:
          this.enemies.push(new SkullEnemy(this, this.game, x, y));
          break;
      }
    }

    return numEnemies;
  }

  private addObstacles(): number {
    // add crates/barrels
    let numObstacles = Game.rand(1, 2);
    if (numObstacles === 1 || this.width * this.height > 8 * 8) {
      numObstacles = Game.randTable([1, 1, 1, 2, 2, 3, 3]);
    } else numObstacles = 0;
    for (let i = 0; i < numObstacles; i++) {
      let x = 0;
      let y = 0;
      while (
        !(this.getTile(x, y) instanceof Floor) ||
        this.enemies.filter(e => e.x === x && e.y === y).length > 0 || // don't overlap other enemies!
        (x === this.bottomDoorX && y === this.bottomDoorY) ||
        (x === this.bottomDoorX && y === this.bottomDoorY - 1)
      ) {
        x = Game.rand(this.roomX, this.roomX + this.width - 1);
        y = Game.rand(this.roomY, this.roomY + this.height - 1);
      }
      switch (Game.rand(1, 2)) {
        case 1:
          this.enemies.push(new Crate(this, this.game, x, y));
          break;
        case 2:
          this.enemies.push(new Barrel(this, this.game, x, y));
          break;
      }
    }

    return numObstacles;
  }

  static randEnv = () => {
    return Game.rand(0, LevelConstants.ENVIRONMENTS - 1);
  };

  constructor(
    game: Game,
    previousDoor: Door,
    deadEnd: boolean,
    goldenKey: boolean,
    distFromStart: number,
    env: number,
    difficulty: number
  ) {
    // smooth lighting handler
    Input.sListener = () => {
      // LevelConstants.SMOOTH_LIGHTING = !LevelConstants.SMOOTH_LIGHTING;
      this.updateLighting();
    };

    this.difficulty = difficulty;

    this.distFromStart = distFromStart;
    this.env = env;

    this.items = Array<Item>();
    this.particles = Array<Particle>();
    this.doors = Array<Door>();
    this.enemies = Array<Enemy>();

    // if previousDoor is null, no bottom door
    this.hasBottomDoor = true;
    if (previousDoor === null) {
      this.hasBottomDoor = false;
      this.parentLevel = null;
    }
    this.game = game;

    this.width = Game.randTable([5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 9, 11, 13]);
    this.height = this.width + Game.rand(-2, 2);
    this.height = Math.min(this.height, LevelConstants.MAX_LEVEL_H);
    this.height = Math.max(this.height, LevelConstants.MIN_LEVEL_H);

    this.levelArray = [];
    for (let x = 0; x < LevelConstants.SCREEN_W; x++) {
      this.levelArray[x] = [];
    }
    this.visibilityArray = [];
    for (let x = 0; x < LevelConstants.SCREEN_W; x++) {
      this.visibilityArray[x] = [];
      for (let y = 0; y < LevelConstants.SCREEN_H; y++) {
        this.visibilityArray[x][y] = 0;
      }
    }

    this.roomX = Math.floor(LevelConstants.SCREEN_W / 2 - this.width / 2);
    this.roomY = Math.floor(LevelConstants.SCREEN_H / 2 - this.height / 2);

    this.bottomDoorX = Math.floor(this.roomX + this.width / 2);
    this.bottomDoorY = this.roomY + this.height;

    this.buildEmptyRoom();
    this.goldenKeyRoom = false;
    if (goldenKey && distFromStart > 4 && Game.rand(1, 5) === 1) {
      // if it's a golden key room
      this.items.push(
        new GoldenKey(
          Math.floor(this.roomX + this.width / 2),
          Math.floor(this.roomY + this.height / 2)
        )
      );
      this.goldenKeyRoom = true;
    } else {
      // otherwise, generate a normal room
      this.addWallBlocks();
      this.addFingers();
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

    let numTrapdoors = 0,
      numDoors = 0,
      numChests = 0,
      numSpikes = 0,
      numEnemies = 0,
      numObstacles = 0;
    if (!this.goldenKeyRoom) {
      /* add trapdoors back in after we figure out how they're gonna work */
      numTrapdoors = 0; // this.addTrapdoors();
      numDoors = this.addDoors(deadEnd, goldenKey);
      numChests = this.addChests(numDoors);
      numSpikes = this.addSpikes();
      numEnemies = this.addEnemies();
      numObstacles = this.addObstacles();
    }
    this.classify(numDoors, numTrapdoors, numChests, numEnemies, this.goldenKeyRoom);

    if (this.hasBottomDoor) {
      let b = this.levelArray[this.bottomDoorX][this.bottomDoorY] as BottomDoor;
      this.parentLevel = b.linkedTopDoor.level;
    }
  }

  // name this level
  classify = (
    numDoors: number,
    numTrapdoors: number,
    numChests: number,
    numEnemies: number,
    goldenKeyRoom: boolean
  ) => {
    this.name = "";

    if (goldenKeyRoom) this.name = "Key Room";
    else if (numChests >= 2) this.name = "Treasure";
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
    if (this.name !== "" && !goldenKeyRoom)
      this.name = adjectiveList[Game.rand(0, adjectiveList.length - 1)] + " " + this.name;
  };

  exitLevel = () => {
    this.particles.splice(0, this.particles.length);
  };

  updateLevelTextColor = () => {
    LevelConstants.LEVEL_TEXT_COLOR = "white";
    // no more color backgrounds:
    // if (this.env === 3) LevelConstants.LEVEL_TEXT_COLOR = "black";
  };

  enterLevel = () => {
    this.updateLevelTextColor();
    this.game.player.moveNoSmooth(this.bottomDoorX, this.bottomDoorY - 1);

    this.updateLighting();
  };

  enterLevelThroughDoor = (door: Door) => {
    this.updateLevelTextColor();
    this.game.player.moveNoSmooth(door.x, door.y + 1);

    this.updateLighting();
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

  updateLighting = () => {
    let oldVisibilityArray = [];
    for (let x = 0; x < this.levelArray.length; x++) {
      oldVisibilityArray[x] = [];
      for (let y = 0; y < this.levelArray[0].length; y++) {
        oldVisibilityArray[x][y] = this.visibilityArray[x][y] !== 0;
        this.visibilityArray[x][y] = 0;
      }
    }
    for (let i = 0; i < 360; i += LevelConstants.LIGHTING_ANGLE_STEP) {
      this.castShadowsAtAngle(i, this.game.player.sightRadius);
    }
    if (LevelConstants.SMOOTH_LIGHTING)
      this.visibilityArray = this.blur3x3(this.visibilityArray, [[1, 2, 1], [2, 8, 2], [1, 2, 1]]);

    for (let x = 0; x < this.visibilityArray.length; x++) {
      for (let y = 0; y < this.visibilityArray[0].length; y++) {
        this.visibilityArray[x][y] = Math.floor(this.visibilityArray[x][y]);
        if (this.visibilityArray[x][y] === 0 && oldVisibilityArray[x][y]) {
          this.visibilityArray[x][y] = LevelConstants.MIN_VISIBILITY; // once a tile has been viewed, it won't go below MIN_VISIBILITY
        }
      }
    }
  };

  castShadowsAtAngle = (angle: number, radius: number) => {
    let dx = Math.cos(angle * Math.PI / 180);
    let dy = Math.sin(angle * Math.PI / 180);
    let px = this.game.player.x + 0.5;
    let py = this.game.player.y + 0.5;
    let returnVal = 0;
    let i = 0;
    let hitWall = false; // flag for if we already hit a wall. we'll keep scanning and see if there's more walls. if so, light them up!
    for (; i < radius; i++) {
      let tile = this.levelArray[Math.floor(px)][Math.floor(py)];
      if (tile instanceof Wall && tile.type === 1) {
        return returnVal;
      }

      if (!(tile instanceof Wall) && hitWall) {
        // fun's over, we hit something that wasn't a wall
        return returnVal;
      }

      if (tile instanceof Wall || tile instanceof WallSide) {
        if (!hitWall) returnVal = i;
        hitWall = true;
      }

      this.visibilityArray[Math.floor(px)][Math.floor(py)] += LevelConstants.VISIBILITY_STEP;
      this.visibilityArray[Math.floor(px)][Math.floor(py)] = Math.min(
        this.visibilityArray[Math.floor(px)][Math.floor(py)],
        2
      );

      // crates and chests can block visibility too!
      for (const e of this.enemies) {
        if (
          (e instanceof Crate || e instanceof Chest) &&
          e.x === Math.floor(px) &&
          e.y === Math.floor(py)
        ) {
          if (!hitWall) returnVal = i;
          hitWall = true;
        }
      }

      px += dx;
      py += dy;
    }
    return returnVal;
  };

  blur3x3 = (array: Array<Array<number>>, weights: Array<Array<number>>): Array<Array<number>> => {
    let blurredArray = [];
    for (let x = 0; x < array.length; x++) {
      blurredArray[x] = [];
      for (let y = 0; y < array[0].length; y++) {
        if (array[x][y] === 0) {
          blurredArray[x][y] = 0;
          continue;
        }
        let total = 0;
        let totalWeights = 0;
        for (let xx = -1; xx <= 1; xx++) {
          for (let yy = -1; yy <= 1; yy++) {
            if (x + xx >= 0 && x + xx < array.length && y + yy >= 0 && y + yy < array[0].length) {
              total += array[x + xx][y + yy] * weights[xx + 1][yy + 1];
              totalWeights += weights[xx + 1][yy + 1];
            }
          }
        }
        blurredArray[x][y] = total / totalWeights;
      }
    }
    return blurredArray;
  };

  tick = () => {
    this.game.player.startTick();
    if (this.game.player.armor) this.game.player.armor.tick();
    for (const e of this.enemies) {
      e.tick();
    }
    this.enemies = this.enemies.filter(e => !e.dead);
    this.game.player.finishTick();
    this.updateLighting();
  };

  update = () => {
    // update, animations maybe?
  };

  draw = () => {
    for (let x = 0; x < this.levelArray.length; x++) {
      for (let y = 0; y < this.levelArray[0].length; y++) {
        this.levelArray[x][y].draw();

        // fill in shadows too
        switch (this.visibilityArray[x][y]) {
          case 0:
            Game.ctx.globalAlpha = 1;
            break;
          case 1:
            Game.ctx.globalAlpha = 0.6;
            break;
          case 2:
            Game.ctx.globalAlpha = 0;
            break;
        }
        Game.ctx.fillStyle = "black";
        Game.ctx.fillRect(
          x * GameConstants.TILESIZE,
          y * GameConstants.TILESIZE,
          GameConstants.TILESIZE,
          GameConstants.TILESIZE
        );
        Game.ctx.globalAlpha = 1;
      }
    }
  };

  drawEntitiesBehindPlayer = () => {
    this.enemies.sort((a, b) => a.y - b.y);
    this.items.sort((a, b) => a.y - b.y);

    for (const e of this.enemies) {
      if (e.y <= this.game.player.y && this.visibilityArray[e.x][e.y] > 0) e.draw();
    }
    for (const i of this.items) {
      if (i.y <= this.game.player.y && this.visibilityArray[i.x][i.y] > 0) i.draw();
    }
  };
  drawEntitiesInFrontOfPlayer = () => {
    for (const e of this.enemies) {
      if (e.y > this.game.player.y && this.visibilityArray[e.x][e.y] > 0) e.draw();
    }
    for (const i of this.items) {
      if (i.y > this.game.player.y && this.visibilityArray[i.x][i.y] > 0) i.draw();
    }
  };

  // for stuff rendered on top of the player
  drawTopLayer = () => {
    for (const e of this.enemies) {
      e.drawTopLayer(); // health bars
    }

    this.particles = this.particles.filter(x => !x.dead);
    for (const p of this.particles) {
      p.draw();
    }

    // gui stuff

    // room name
    Game.ctx.fillStyle = LevelConstants.LEVEL_TEXT_COLOR;
    Game.ctx.fillText(
      this.name,
      GameConstants.WIDTH / 2 - Game.ctx.measureText(this.name).width / 2,
      (this.roomY - 1) * GameConstants.TILESIZE - (GameConstants.FONT_SIZE - 1)
    );
  };
}
