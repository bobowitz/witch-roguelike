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
import { WizardEnemy } from "./enemy/wizardEnemy";
import { SkullEnemy } from "./enemy/skullEnemy";
import { Barrel } from "./enemy/barrel";
import { Crate } from "./enemy/crate";
import { Input } from "./input";
import { Armor } from "./item/armor";
import { Particle } from "./particle/particle";
import { Projectile } from "./projectile/projectile";
import { SpikeTrap } from "./tile/spiketrap";
import { TickCollidable } from "./tile/tickCollidable";

export enum RoomType {
  DUNGEON,
  KEYROOM,
  CHESSROOM,
  PUZZLEROOM,
}

export enum TurnState {
  playerTurn,
  computerTurn,
}

// LevelGenerator -> Level()
// Level.generate()

export class Level {
  x: number;
  y: number;
  levelArray: Tile[][];
  visibilityArray: number[][]; // visibility is 0, 1, or 2 (0 = black, 2 = fully lit)
  enemies: Array<Enemy>;
  items: Array<Item>;
  doors: Array<any>; // (Door | BottomDoor) just a reference for mapping, still access through levelArray
  projectiles: Array<Projectile>;
  particles: Array<Particle>;
  game: Game;
  roomX: number;
  roomY: number;
  width: number;
  height: number;
  type: RoomType;
  env: number; // which environment is this level?
  difficulty: number;
  name: string;
  turn: TurnState;

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
    for (let x = this.roomX; x < this.roomX + this.width; x++) {
      this.levelArray[x][this.roomY + 1] = new Floor(this, x, this.roomY + 1);
      this.levelArray[x][this.roomY + this.height - 1] = new Floor(
        this,
        x,
        this.roomY + this.height - 1
      );
    }
    // fixWalls performs these changes:

    // Wall     Wall
    // Floor -> WallSide
    // Floor    Floor

    // Wall     Wall
    // Wall  -> WallSide
    // Floor    Floor
    // Wall     Wall

    // Floor    Floor
    // Wall  -> Floor
    // Floor    Floor
    // Wall     Wall

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
    for (let i = 0; i < numFingers; i++) {
      let x = 0;
      let y = 0;
      let blockW = 0;
      let blockH = 0;
      if (Game.rand(0, 1) === 0) {
        // horizontal
        blockW = Game.rand(1, this.width - 1);
        blockH = 1;

        if (Game.rand(0, 1) === 0) {
          // left
          x = this.roomX;
          y = Game.rand(this.roomY + 2, this.roomY + this.height - blockH - 2);
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
          y = Game.rand(this.roomY + 2, this.roomY + this.height - blockH - 2);
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
        blockH = Game.rand(1, this.height - 4);

        if (Game.rand(0, 1) === 0) {
          // top
          y = this.roomY + 2;
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
          y = this.roomY + this.height - blockH - 1;
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
        y = Game.rand(this.roomY + 2, this.roomY + this.height - 2);
      }
      this.levelArray[x][y] = new Trapdoor(this, this.game, x, y);
    }

    return numTrapdoors;
  }

  private addChests(): number {
    // add chests
    let numChests = Game.rand(1, 8);
    if (numChests === 1) {
      numChests = Game.randTable([0, 1, 1, 2, 3, 4, 5, 6]);
    } else numChests = 0;
    for (let i = 0; i < numChests; i++) {
      let x = 0;
      let y = 0;
      while (
        !(this.getTile(x, y) instanceof Floor) ||
        this.enemies.filter(e => e.x === x && e.y === y).length > 0 // don't overlap other enemies!
      ) {
        x = Game.rand(this.roomX, this.roomX + this.width - 1);
        y = Game.rand(this.roomY + 2, this.roomY + this.height - 2);
      }
      this.enemies.push(new Chest(this, this.game, x, y));
    }

    return numChests;
  }

  private addSpikes(): number {
    // add spikes
    let numSpikes = 1; //Game.rand(1, 10);
    if (numSpikes === 1) {
      numSpikes = Game.randTable([1, 1, 1, 1, 2, 3]);
    } else numSpikes = 0;
    for (let i = 0; i < numSpikes; i++) {
      let x = 0;
      let y = 0;
      while (!(this.getTile(x, y) instanceof Floor)) {
        x = Game.rand(this.roomX, this.roomX + this.width - 1);
        y = Game.rand(this.roomY + 2, this.roomY + this.height - 2);
      }
      this.levelArray[x][y] = new SpikeTrap(this, x, y);
    }

    return numSpikes;
  }

  private addEnemies(): number {
    let numEnemies = (this.getEmptyTiles().length - this.width * 2) / 16;
    for (let i = 0; i < numEnemies; i++) {
      let x = 0;
      let y = 0;
      let tries = 0;
      while (
        !(this.getTile(x, y) instanceof Floor) ||
        this.enemies.some(e => e.x === x && e.y === y) // don't overlap other enemies!
      ) {
        x = Game.rand(this.roomX, this.roomX + this.width - 1);
        y = Game.rand(this.roomY + 2, this.roomY + this.height - 2);
        tries++;
        if (tries > 100) return;
      }
      switch (Game.rand(1, 3)) {
        case 1:
          this.enemies.push(new KnightEnemy(this, this.game, x, y));
          break;
        case 2:
          this.enemies.push(new SkullEnemy(this, this.game, x, y));
          break;
        case 3:
          this.enemies.push(new WizardEnemy(this, this.game, x, y));
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
        this.enemies.filter(e => e.x === x && e.y === y).length > 0 // don't overlap other enemies!
      ) {
        x = Game.rand(this.roomX, this.roomX + this.width - 1);
        y = Game.rand(this.roomY + 2, this.roomY + this.height - 2);
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
    x: number,
    y: number,
    w: number,
    h: number,
    type: RoomType,
    env: number,
    difficulty: number
  ) {
    this.difficulty = difficulty;

    this.x = x;
    this.y = y;

    this.type = type;
    this.env = env;

    this.turn = TurnState.playerTurn;

    this.items = Array<Item>();
    this.projectiles = Array<Projectile>();
    this.particles = Array<Particle>();
    this.doors = Array<Door>();
    this.enemies = Array<Enemy>();

    // if previousDoor is null, no bottom door
    this.game = game;

    this.width = w;
    this.height = h;

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

    this.buildEmptyRoom();
    if (this.type == RoomType.KEYROOM) {
      // if it's a golden key room
      this.items.push(
        new GoldenKey(
          Math.floor(this.roomX + this.width / 2),
          Math.floor(this.roomY + this.height / 2)
        )
      );
    } else {
      // otherwise, generate a normal room
      this.addWallBlocks();
      this.addFingers();
    }

    this.fixWalls();

    let numTrapdoors = 0,
      numChests = 0,
      numSpikes = 0,
      numEnemies = 0,
      numObstacles = 0;
    /* add trapdoors back in after we figure out how they're gonna work */
    numTrapdoors = 0; // this.addTrapdoors();
    //numChests = this.addChests();
    //numSpikes = this.addSpikes();
    //numEnemies = this.addEnemies();
    //numObstacles = this.addObstacles();
    this.getEmptyTiles();
    this.classify(numTrapdoors, numChests, numEnemies, type);
  }

  // name this level
  classify = (numTrapdoors: number, numChests: number, numEnemies: number, type: RoomType) => {
    this.name = "";

    if (type === RoomType.KEYROOM) this.name = "Key Room";
    else if (numChests >= 2) this.name = "Treasure";
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

  addDoor = (location: number, link: any) => {
    let d;
    switch (location) {
      case 0:
        d = new Door(this, this.game, this.roomX, this.roomY, link);
        break;
      case 1:
        d = new Door(this, this.game, this.roomX + Math.floor(this.width / 2), this.roomY, link);
        break;
      case 2:
        d = new Door(this, this.game, this.roomX + this.width - 1, this.roomY, link);
        break;
      case 3:
        d = new BottomDoor(this, this.game, this.roomX, this.roomY + this.height, link);
        break;
      case 4:
        d = new BottomDoor(
          this,
          this.game,
          this.roomX + Math.floor(this.width / 2),
          this.roomY + this.height,
          link
        );
        break;
      case 5:
        d = new BottomDoor(
          this,
          this.game,
          this.roomX + this.width - 1,
          this.roomY + this.height,
          link
        );
        break;
    }
    this.doors.push(d);
    this.levelArray[d.x][d.y] = d;

    return d;
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
    this.game.player.moveNoSmooth(
      this.roomX + Math.floor(this.width / 2),
      this.roomY + this.height - 1
    );

    this.updateLighting();
  };

  enterLevelThroughDoor = (door: any) => {
    this.updateLevelTextColor();
    if (door instanceof Door) {
      (door as Door).opened = true;
      this.game.player.moveNoSmooth(door.x, door.y + 1);
    } else {
      this.game.player.moveNoSmooth(door.x, door.y - 1);
    }

    this.updateLighting();
  };

  getEmptyTiles = (): Tile[] => {
    let returnVal: Tile[] = [];
    for (let x = this.roomX; x < this.roomX + this.width; x++) {
      for (let y = this.roomY + 2; y < this.roomY + this.height - 1; y++) {
        if (this.getCollidable(x, y) === null) {
          if (this.levelArray[x][y] instanceof Floor)
            (this.levelArray[x][y] as Floor).highlight = true;
          returnVal.push(this.levelArray[x][y]);
        }
      }
    }
    return returnVal;
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
    let dx = Math.cos((angle * Math.PI) / 180);
    let dy = Math.sin((angle * Math.PI) / 180);
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
    console.log(this.game.player.x, this.game.player.y, this);
    if (this.turn === TurnState.computerTurn) this.computerTurn(); // player skipped computer's turn, catch up

    for (let x = 0; x < this.levelArray.length; x++) {
      for (let y = 0; y < this.levelArray[0].length; y++) {
        if (this.levelArray[x][y] instanceof TickCollidable) {
          (this.levelArray[x][y] as TickCollidable).tick();
        }
      }
    }

    this.game.player.startTick();
    if (this.game.player.armor) this.game.player.armor.tick();
    this.enemies = this.enemies.filter(e => !e.dead);
    this.updateLighting();

    this.turn = TurnState.computerTurn;
  };

  update = () => {
    if (this.turn == TurnState.computerTurn) {
      if (this.game.player.doneMoving()) {
        this.computerTurn();
      }
    }
  };

  computerTurn = () => {
    // take computer turn
    for (const p of this.projectiles) {
      p.tick();
    }
    for (const e of this.enemies) {
      e.tick();
    }

    for (const p of this.projectiles) {
      if (this.getCollidable(p.x, p.y) !== null) p.dead = true;
      if (p.x === this.game.player.x && p.y === this.game.player.y) {
        p.hitPlayer(this.game.player);
      }
      for (const e of this.enemies) {
        if (p.x === e.x && p.y === e.y) {
          p.hitEnemy(e);
        }
      }
    }
    this.game.player.finishTick();
    this.turn = TurnState.playerTurn; // now it's the player's turn
  };

  nextLevelRendering = () => {
    for (const door of this.doors) {
      if (door instanceof Door) {
        Game.ctx.translate(door.x - door.linkedDoor.x, door.y - door.linkedDoor.y);
      } else {
        Game.ctx.translate(door.x - door.linkedDoor.x, door.y - door.linkedDoor.y);
      }

      door.level.draw();

      if (door instanceof Door) {
        Game.ctx.translate(-door.x + door.linkedDoor.x, -door.y + door.linkedDoor.y);
      } else {
        Game.ctx.translate(-door.x + door.linkedDoor.x, -door.y + door.linkedDoor.y);
      }
    }
  };

  draw = () => {
    for (let x = 0; x < this.levelArray.length; x++) {
      for (let y = 0; y < this.levelArray[0].length; y++) {
        if (this.visibilityArray[x][y] > 0) this.levelArray[x][y].draw();

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

    for (const p of this.particles) {
      p.drawBehind();
    }

    this.projectiles = this.projectiles.filter(p => !p.dead);
    for (const p of this.projectiles) {
      p.draw();
    }

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
