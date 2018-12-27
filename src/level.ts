import { Wall } from "./tile/wall";
import { LevelConstants } from "./levelConstants";
import { Floor } from "./tile/floor";
import { Game, LevelState } from "./game";
import { Door } from "./tile/door";
import { BottomDoor } from "./tile/bottomDoor";
import { WallSide } from "./tile/wallSide";
import { Tile, SkinType } from "./tile/tile";
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
import { FountainTile } from "./tile/fountainTile";
import { CoffinTile } from "./tile/coffinTile";
import { PottedPlant } from "./enemy/pottedPlant";
import { InsideLevelDoor } from "./tile/insideLevelDoor";
import { Button } from "./tile/button";
import { HitWarning } from "./projectile/hitWarning";
import { UpLadder } from "./tile/upLadder";
import { DownLadder } from "./tile/downLadder";
import { CoalResource } from "./enemy/coalResource";
import { GoldResource } from "./enemy/goldResource";
import { EmeraldResource } from "./enemy/emeraldResource";
import { Chasm } from "./tile/chasm";
import { Spawner } from "./enemy/spawner";
import { ShopTable } from "./enemy/shopTable";

export enum RoomType {
  DUNGEON,
  BIGDUNGEON,
  TREASURE,
  FOUNTAIN,
  COFFIN,
  GRASS,
  PUZZLE,
  KEYROOM,
  CHESSBOARD,
  MAZE,
  CORRIDOR,
  SPIKECORRIDOR,
  UPLADDER,
  DOWNLADDER,
  SHOP,
  CAVE,
  SPAWNER,
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
  softVisibilityArray: number[][];
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
  depth: number;
  name: string;
  turn: TurnState;
  playerTurnTime: number;
  skin: SkinType;
  entered: boolean; // has the player entered this level
  upLadder: UpLadder;

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
      let blockW = Math.min(
        Game.randTable([2, 2, 2, 2, 2, 2, 3, 3, 3, 4, 5, 6, 7, 9]),
        this.width - 2
      );
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

  private addChasms() {
    // add chasms
    let w = Game.rand(2, 4);
    let h = Game.rand(2, 4);
    let xmin = this.roomX + 1;
    let xmax = this.roomX + this.width - w - 1;
    let ymin = this.roomY + 2;
    let ymax = this.roomY + this.height - h - 1;
    if (xmax < xmin || ymax < ymin) return;
    let x = Game.rand(xmin, xmax);
    let y = Game.rand(ymin, ymax);

    for (let xx = x - 1; xx < x + w + 1; xx++) {
      for (let yy = y - 1; yy < y + h + 1; yy++) {
        // add a floor border
        if (xx === x - 1 || xx === x + w || yy === y - 1 || yy === y + h)
          this.levelArray[xx][yy] = new Floor(this, xx, yy);
        else
          this.levelArray[xx][yy] = new Chasm(
            this,
            xx,
            yy,
            xx === x,
            xx === x + w - 1,
            yy === y,
            yy === y + h - 1
          );
      }
    }
  }

  private addChests(numChests: number) {
    // add chests
    let tiles = this.getEmptyMiddleTiles();
    for (let i = 0; i < numChests; i++) {
      let t, x, y;
      if (tiles.length == 0) return;
      t = tiles.splice(Game.rand(0, tiles.length - 1), 1)[0];
      x = t.x;
      y = t.y;
      this.enemies.push(new Chest(this, this.game, x, y));
    }
  }

  private addSpikeTraps(numSpikes: number) {
    // add spikes
    let tiles = this.getEmptyMiddleTiles();
    for (let i = 0; i < numSpikes; i++) {
      let t = tiles.splice(Game.rand(0, tiles.length - 1), 1)[0];
      if (tiles.length == 0) return;
      let x = t.x;
      let y = t.y;

      this.levelArray[x][y] = new SpikeTrap(this, x, y);
    }
  }

  private addSpikes(numSpikes: number) {
    // add spikes
    let tiles = this.getEmptyMiddleTiles();
    for (let i = 0; i < numSpikes; i++) {
      let t = tiles.splice(Game.rand(0, tiles.length - 1), 1)[0];
      if (tiles.length == 0) return;
      let x = t.x;
      let y = t.y;

      this.levelArray[x][y] = new Spike(this, x, y);
    }
  }

  private addEnemies(numEnemies: number) {
    let tiles = this.getEmptyMiddleTiles();
    for (let i = 0; i < numEnemies; i++) {
      let t = tiles.splice(Game.rand(0, tiles.length - 1), 1)[0];
      if (tiles.length == 0) return;
      let x = t.x;
      let y = t.y;
      if (this.depth !== 0) {
        let d = Game.rand(1, Math.min(3, this.depth));
        switch (d) {
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
    }
  }

  private addObstacles(numObstacles: number) {
    // add crates/barrels
    let tiles = this.getEmptyMiddleTiles();
    for (let i = 0; i < numObstacles; i++) {
      let t = tiles.splice(Game.rand(0, tiles.length - 1), 1)[0];
      if (tiles.length == 0) return;
      let x = t.x;
      let y = t.y;
      switch (Game.rand(1, 2)) {
        case 1:
          this.enemies.push(new Crate(this, this.game, x, y));
          break;
        case 2:
          this.enemies.push(new Barrel(this, this.game, x, y));
          break;
      }
    }
  }

  private addPlants(numPlants: number) {
    let tiles = this.getEmptyMiddleTiles();
    for (let i = 0; i < numPlants; i++) {
      let t = tiles.splice(Game.rand(0, tiles.length - 1), 1)[0];
      if (tiles.length == 0) return;
      let x = t.x;
      let y = t.y;

      this.enemies.push(new PottedPlant(this, this.game, x, y));
    }
  }

  private addResources(numResources: number) {
    let tiles = this.getEmptyMiddleTiles();
    for (let i = 0; i < numResources; i++) {
      let t = tiles.splice(Game.rand(0, tiles.length - 1), 1)[0];
      if (tiles.length == 0) return;
      let x = t.x;
      let y = t.y;

      let r = Game.rand(0, 150);
      if (r <= 150 - this.depth ** 3) this.enemies.push(new CoalResource(this, this.game, x, y));
      else if (r <= 150 - Math.max(0, this.depth - 5) ** 3)
        this.enemies.push(new GoldResource(this, this.game, x, y));
      else this.enemies.push(new EmeraldResource(this, this.game, x, y));
    }
  }

  generateDungeon = () => {
    this.skin = SkinType.DUNGEON;

    let factor = Game.rand(1, 36);

    this.buildEmptyRoom();
    if (factor < 30) this.addWallBlocks();
    if (factor < 26) this.addFingers();
    if (factor % 4 === 0) this.addChasms();
    this.fixWalls();

    if (factor % 3 === 0) this.addPlants(Game.randTable([0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 4]));
    if (factor > 15) this.addSpikeTraps(Game.randTable([0, 0, 0, 1, 1, 2, 5]));
    let numEmptyTiles = this.getEmptyTiles().length;
    let numEnemies = Math.ceil(
      numEmptyTiles * (this.depth * 0.5 + 0.5) * Game.randTable([0, 0, 0.05, 0.05, 0.06, 0.07, 0.1])
    );
    this.addEnemies(numEnemies);
    if (numEnemies > 0) this.addObstacles(numEnemies / Game.rand(1, 2));
    else this.addObstacles(Game.randTable([0, 0, 1, 1, 2, 3, 5]));
  };
  generateBigDungeon = () => {
    this.skin = SkinType.DUNGEON;

    this.buildEmptyRoom();
    if (Game.rand(1, 4) === 1) this.addChasms();
    this.fixWalls();

    if (Game.rand(1, 4) === 1) this.addPlants(Game.randTable([0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 4]));
    if (Game.rand(1, 3) === 1) this.addSpikeTraps(Game.randTable([3, 5, 7, 8]));
    let numEmptyTiles = this.getEmptyTiles().length;
    let numEnemies = Math.ceil(
      numEmptyTiles * (this.depth * 0.5 + 0.5) * Game.randTable([0.05, 0.05, 0.06, 0.07, 0.1])
    );
    this.addEnemies(numEnemies);
    if (numEnemies > 0) this.addObstacles(numEnemies / Game.rand(1, 2));
    else this.addObstacles(Game.randTable([0, 0, 1, 1, 2, 3, 5]));
  };
  generateSpawner = () => {
    this.skin = SkinType.DUNGEON;

    this.buildEmptyRoom();
    this.fixWalls();

    this.enemies.push(
      new Spawner(
        this,
        this.game,
        Math.floor(this.roomX + this.width / 2),
        Math.floor(this.roomY + this.height / 2)
      )
    );
  };
  generateKeyRoom = () => {
    this.skin = SkinType.DUNGEON;

    this.buildEmptyRoom();
    this.fixWalls();

    this.items.push(
      new GoldenKey(
        this,
        Math.floor(this.roomX + this.width / 2),
        Math.floor(this.roomY + this.height / 2)
      )
    );
  };
  generateFountain = () => {
    this.skin = SkinType.DUNGEON;

    this.buildEmptyRoom();
    this.fixWalls();

    let centerX = Math.floor(this.roomX + this.width / 2);
    let centerY = Math.floor(this.roomY + this.height / 2);
    for (let x = centerX - 1; x <= centerX + 1; x++) {
      for (let y = centerY - 1; y <= centerY + 1; y++) {
        this.levelArray[x][y] = new FountainTile(this, x, y, x - (centerX - 1), y - (centerY - 1));
      }
    }

    this.addPlants(Game.randTable([0, 0, 1, 2]));
  };
  placeCoffin = (x: number, y: number) => {
    this.levelArray[x][y] = new CoffinTile(this, x, y, 0);
    this.levelArray[x][y + 1] = new CoffinTile(this, x, y + 1, 1);
  };
  generateCoffin = () => {
    this.skin = SkinType.DUNGEON;

    this.buildEmptyRoom();
    this.fixWalls();

    this.placeCoffin(
      Math.floor(this.roomX + this.width / 2 - 2),
      Math.floor(this.roomY + this.height / 2)
    );
    this.placeCoffin(
      Math.floor(this.roomX + this.width / 2),
      Math.floor(this.roomY + this.height / 2)
    );
    this.placeCoffin(
      Math.floor(this.roomX + this.width / 2) + 2,
      Math.floor(this.roomY + this.height / 2)
    );
  };
  generatePuzzle = () => {
    this.skin = SkinType.DUNGEON;

    this.buildEmptyRoom();

    let d;

    for (let x = this.roomX; x < this.roomX + this.width; x++) {
      let y = this.roomY + Math.floor(this.height / 2);
      if (x === this.roomX + Math.floor(this.width / 2)) {
        d = new InsideLevelDoor(this, this.game, x, y + 1);
        this.levelArray[x][y + 1] = d;
      } else {
        this.levelArray[x][y] = new Wall(this, x, y, 0);
      }
    }

    let x = Game.rand(this.roomX, this.roomX + this.width - 1);
    let y = Game.rand(this.roomY + Math.floor(this.height / 2) + 3, this.roomY + this.height - 2);

    this.levelArray[x][y] = new Button(this, x, y, d);

    let crateTiles = this.getEmptyMiddleTiles().filter(
      t =>
        t.x >= this.roomX + 1 &&
        t.x <= this.roomX + this.width - 2 &&
        t.y >= this.roomY + Math.floor(this.height / 2) + 3 &&
        t.y <= this.roomY + this.height - 2
    );
    let numCrates = Game.randTable([1, 2, 2, 3, 4]);

    for (let i = 0; i < numCrates; i++) {
      let t = crateTiles.splice(Game.rand(0, crateTiles.length - 1), 1)[0];

      this.enemies.push(new Crate(this, this.game, t.x, t.y));
    }
    this.fixWalls();
    this.addPlants(Game.randTable([0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 4]));
  };
  generateSpikeCorridor = () => {
    this.skin = SkinType.DUNGEON;

    this.buildEmptyRoom();

    for (let x = this.roomX; x < this.roomX + this.width; x++) {
      for (let y = this.roomY + 1; y < this.roomY + this.height - 1; y++) {
        this.levelArray[x][y] = new SpikeTrap(this, x, y, Game.rand(0, 3));
      }
    }

    this.addEnemies(5);

    this.fixWalls();
  };
  generateTreasure = () => {
    this.skin = SkinType.DUNGEON;

    this.buildEmptyRoom();
    this.addWallBlocks();
    this.fixWalls();

    this.addChests(Game.randTable([3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 6]));
    this.addPlants(Game.randTable([0, 1, 2, 4, 5, 6]));
  };
  generateChessboard = () => {
    this.skin = SkinType.DUNGEON;

    this.buildEmptyRoom();
    this.fixWalls();
  };
  generateCave = () => {
    this.skin = SkinType.CAVE;

    let factor = Game.rand(1, 36);

    this.buildEmptyRoom();
    if (factor < 30) this.addWallBlocks();
    if (factor < 26) this.addFingers();
    if (factor % 4 === 0) this.addChasms();
    this.fixWalls();

    if (factor > 15) this.addSpikeTraps(Game.randTable([0, 0, 0, 1, 1, 2, 5]));
    let numEmptyTiles = this.getEmptyTiles().length;
    let numEnemies = Math.ceil(
      numEmptyTiles * (this.depth * 0.5 + 0.5) * Game.randTable([0, 0.07, 0.08, 0.09, 0.1, 0.15])
    );
    //if (Game.rand(1, 100) > numEmptyTiles) numEnemies = 0;
    this.addEnemies(numEnemies);
    this.addResources(Game.randTable([1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9, 10, 11, 12]));
  };
  generateUpLadder = () => {
    this.skin = SkinType.DUNGEON;

    this.buildEmptyRoom();
    this.fixWalls();

    let cX = Math.floor(this.roomX + this.width / 2);
    let cY = Math.floor(this.roomY + this.height / 2);
    this.upLadder = new UpLadder(this, this.game, cX, cY);
    this.levelArray[cX][cY] = this.upLadder;
  };
  generateDownLadder = () => {
    this.skin = SkinType.DUNGEON;

    this.buildEmptyRoom();
    this.fixWalls();

    let cX = Math.floor(this.roomX + this.width / 2);
    let cY = Math.floor(this.roomY + this.height / 2);
    this.levelArray[cX][cY] = new DownLadder(this, this.game, cX, cY);
  };
  generateShop = () => {
    this.skin = SkinType.DUNGEON;

    this.buildEmptyRoom();
    this.fixWalls();

    let cX = Math.floor(this.roomX + this.width / 2 - 1);
    let cY = Math.floor(this.roomY + this.height / 2);
    this.enemies.push(new ShopTable(this, this.game, cX, cY));
  };

  constructor(
    game: Game,
    x: number,
    y: number,
    w: number,
    h: number,
    type: RoomType,
    difficulty: number
  ) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.type = type;
    this.depth = difficulty;

    this.entered = false;
    this.turn = TurnState.playerTurn;
    this.playerTurnTime = Date.now();

    this.items = Array<Item>();
    this.projectiles = Array<Projectile>();
    this.particles = Array<Particle>();
    this.doors = Array<Door>();
    this.enemies = Array<Enemy>();

    this.levelArray = [];
    for (let x = 0; x < LevelConstants.SCREEN_W; x++) {
      this.levelArray[x] = [];
    }
    this.visibilityArray = [];
    this.softVisibilityArray = [];
    for (let x = 0; x < LevelConstants.SCREEN_W; x++) {
      this.visibilityArray[x] = [];
      this.softVisibilityArray[x] = [];
      for (let y = 0; y < LevelConstants.SCREEN_H; y++) {
        this.visibilityArray[x][y] = 0;
        this.softVisibilityArray[x][y] = 0;
      }
    }

    this.roomX = Math.floor(LevelConstants.SCREEN_W / 2 - this.width / 2);
    this.roomY = Math.floor(LevelConstants.SCREEN_H / 2 - this.height / 2);

    this.upLadder = null;

    this.name = "";
    switch (this.type) {
      case RoomType.DUNGEON:
        this.generateDungeon();
        break;
      case RoomType.BIGDUNGEON:
        this.generateBigDungeon();
        break;
      case RoomType.FOUNTAIN:
        this.generateFountain();
        break;
      case RoomType.COFFIN:
        this.generateCoffin();
        break;
      case RoomType.PUZZLE:
        this.generatePuzzle();
        break;
      case RoomType.SPIKECORRIDOR:
        this.generateSpikeCorridor();
        break;
      case RoomType.TREASURE:
        this.generateTreasure();
        break;
      case RoomType.CHESSBOARD: // TODO
        this.generateChessboard();
        break;
      case RoomType.KEYROOM:
        this.generateKeyRoom();
        break;
      case RoomType.GRASS:
        this.generateDungeon();
        break;
      case RoomType.CAVE:
        this.generateCave();
        break;
      case RoomType.UPLADDER:
        this.generateUpLadder();
        this.name = "FLOOR " + -this.depth;
        break;
      case RoomType.DOWNLADDER:
        this.generateDownLadder();
        this.name = "FLOOR " + -this.depth;
        break;
      case RoomType.SHOP:
        /* shop rates:
         * 10 coal for an gold coin
         * 1 gold for 10 coins
         * 1 emerald for 100 coins
         *
         * shop items:
         * 1 empty heart   4 ^ (maxHealth + maxHealth ^ 1.05 ^ maxHealth - 2.05) coins
         * fill all hearts  1 coin
         * better torch    5 ^ (torchLevel + 1.05 ^ torchLevel - 2.05) coins
         * weapons
         */

        this.generateShop();
        break;
      case RoomType.SPAWNER:
        this.generateSpawner();
    }
  }

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
        this.levelArray[this.roomX][this.roomY + this.height] = new Floor(
          this,
          this.roomX,
          this.roomY + this.height
        );
        d = new BottomDoor(this, this.game, this.roomX, this.roomY + this.height + 1, link);
        break;
      case 4:
        this.levelArray[this.roomX + Math.floor(this.width / 2)][
          this.roomY + this.height
        ] = new Floor(this, this.roomX + Math.floor(this.width / 2), this.roomY + this.height);
        d = new BottomDoor(
          this,
          this.game,
          this.roomX + Math.floor(this.width / 2),
          this.roomY + this.height + 1,
          link
        );
        break;
      case 5:
        this.levelArray[this.roomX + this.width - 1][this.roomY + this.height] = new Floor(
          this,
          this.roomX + this.width - 1,
          this.roomY + this.height
        );
        d = new BottomDoor(
          this,
          this.game,
          this.roomX + this.width - 1,
          this.roomY + this.height + 1,
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
    this.game.player.moveSnap(
      this.roomX + Math.floor(this.width / 2),
      this.roomY + this.height - 1
    );

    this.updateLighting();
    this.entered = true;
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
    this.entered = true;
  };

  enterLevelThroughLadder = (ladder: any) => {
    this.updateLevelTextColor();

    this.game.player.moveSnap(ladder.x, ladder.y + 1);

    this.updateLighting();
    this.entered = true;
  };

  // doesn't include top row or bottom row, as to not block doors
  getEmptyMiddleTiles = (): Tile[] => {
    let returnVal: Tile[] = [];
    for (let x = this.roomX; x < this.roomX + this.width; x++) {
      for (let y = this.roomY + 2; y < this.roomY + this.height - 1; y++) {
        if (!this.levelArray[x][y].isSolid() && !(this.levelArray[x][y] instanceof SpikeTrap)) {
          returnVal.push(this.levelArray[x][y]);
        }
      }
    }
    for (const e of this.enemies) {
      returnVal = returnVal.filter(t => t.x !== e.x || t.y !== e.y);
    }
    return returnVal;
  };

  // includes top row and bottom row
  getEmptyTiles = (): Tile[] => {
    let returnVal: Tile[] = [];
    for (let x = this.roomX; x < this.roomX + this.width; x++) {
      for (let y = this.roomY + 1; y < this.roomY + this.height; y++) {
        if (!this.levelArray[x][y].isSolid() && !(this.levelArray[x][y] instanceof SpikeTrap)) {
          returnVal.push(this.levelArray[x][y]);
        }
      }
    }
    for (const e of this.enemies) {
      returnVal = returnVal.filter(t => t.x !== e.x || t.y !== e.y);
    }
    return returnVal;
  };

  getTile = (x: number, y: number) => {
    for (const col of this.levelArray) {
      for (const tile of col) {
        if (tile !== null && tile.x === x && tile.y === y) return tile;
      }
    }
    return null;
  };

  fadeLighting = () => {
    for (let x = 0; x < this.levelArray.length; x++) {
      for (let y = 0; y < this.levelArray[0].length; y++) {
        if (this.softVisibilityArray[x][y] < this.visibilityArray[x][y])
          this.softVisibilityArray[x][y] += 0.1;
        else if (this.softVisibilityArray[x][y] > this.visibilityArray[x][y])
          this.softVisibilityArray[x][y] -= 0.05;
        if (this.softVisibilityArray[x][y] < 0.1) this.softVisibilityArray[x][y] = 0;
      }
    }
  };

  updateLighting = () => {
    let oldVisibilityArray = [];
    for (let x = 0; x < this.levelArray.length; x++) {
      oldVisibilityArray[x] = [];
      for (let y = 0; y < this.levelArray[0].length; y++) {
        oldVisibilityArray[x][y] = this.visibilityArray[x][y];
        this.visibilityArray[x][y] = 0;
        //if (this.visibilityArray[x][y] > LevelConstants.MIN_VISIBILITY)
        //  this.visibilityArray[x][y] = 0;
      }
    }
    for (let i = 0; i < 360; i += LevelConstants.LIGHTING_ANGLE_STEP) {
      this.castShadowsAtAngle(i, this.game.player.sightRadius - this.depth);
    }
    if (LevelConstants.SMOOTH_LIGHTING)
      this.visibilityArray = this.blur3x3(this.visibilityArray, [[1, 2, 1], [2, 8, 2], [1, 2, 1]]);

    /*for (let x = 0; x < this.visibilityArray.length; x++) {
      for (let y = 0; y < this.visibilityArray[0].length; y++) {
        if (this.visibilityArray[x][y] < oldVisibilityArray[x][y]) {
          this.visibilityArray[x][y] = Math.min(
            oldVisibilityArray[x][y],
            LevelConstants.MIN_VISIBILITY
          );
        }
      }
    }*/
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
      if (
        Math.floor(px) < 0 ||
        Math.floor(px) >= this.levelArray.length ||
        Math.floor(py) < 0 ||
        Math.floor(py) >= this.levelArray[0].length
      )
        return; // we're outside the level
      let tile = this.levelArray[Math.floor(px)][Math.floor(py)];
      if (tile instanceof Wall && tile.type === 1) {
        return returnVal;
      }

      if (!(tile instanceof Wall) && hitWall) {
        // fun's over, we hit something that wasn't a wall
        return returnVal;
      }

      if (tile.isOpaque()) {
        if (!hitWall) returnVal = i;
        hitWall = true;
      }
      this.visibilityArray[Math.floor(px)][Math.floor(py)] = 2; //Math.min(2 - (2 / radius) * i, 2);

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
    if (this.turn === TurnState.computerTurn) this.computerTurn(); // player skipped computer's turn, catch up

    this.enemies = this.enemies.filter(e => !e.dead);
    this.updateLighting();

    for (let x = 0; x < this.levelArray.length; x++) {
      for (let y = 0; y < this.levelArray[0].length; y++) {
        this.levelArray[x][y].tick();
      }
    }

    this.turn = TurnState.computerTurn;
    this.playerTurnTime = Date.now();
  };

  update = () => {
    if (this.turn == TurnState.computerTurn) {
      if (Date.now() - this.playerTurnTime >= LevelConstants.COMPUTER_TURN_DELAY) {
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
    for (const i of this.items) {
      i.tick();
    }

    for (const p of this.projectiles) {
      if (this.levelArray[p.x][p.y].isSolid()) p.dead = true;
      if (p.x === this.game.player.x && p.y === this.game.player.y) {
        p.hitPlayer(this.game.player);
      }
      for (const e of this.enemies) {
        if (p.x === e.x && p.y === e.y) {
          p.hitEnemy(e);
        }
      }
    }

    for (let x = 0; x < this.levelArray.length; x++) {
      for (let y = 0; y < this.levelArray[0].length; y++) {
        this.levelArray[x][y].tickEnd();
      }
    }

    this.game.player.finishTick();
    this.turn = TurnState.playerTurn;
  };

  /* TODO fix turn skipping bug
  
  computerTurnDelayed = () => {
    // take computer turn
    for (const p of this.projectiles) {
      p.tickDelayAnim();
    }
    for (const e of this.enemies) {
      e.tickDelayAnim();
    }
    for (const i of this.items) {
      i.tickDelayAnim();
    }

    this.turn = TurnState.playerTurn; // now it's the player's turn
  };*/

  draw = () => {
    HitWarning.updateFrame();

    this.fadeLighting();

    for (let x = this.roomX - 1; x < this.roomX + this.width + 1; x++) {
      for (let y = this.roomY - 1; y < this.roomY + this.height + 1; y++) {
        if (this.softVisibilityArray[x][y] > 0) this.levelArray[x][y].draw();
      }
    }
  };

  drawEntitiesBehindPlayer = () => {
    for (let x = 0; x < this.levelArray.length; x++) {
      for (let y = 0; y < this.levelArray[0].length; y++) {
        if (this.softVisibilityArray[x][y] > 0) this.levelArray[x][y].drawUnderPlayer();
      }
    }

    this.enemies.sort((a, b) => a.y - b.y);
    this.items.sort((a, b) => a.y - b.y);

    for (const p of this.particles) {
      p.drawBehind();
    }

    this.projectiles = this.projectiles.filter(p => !p.dead);
    for (const p of this.projectiles) {
      p.draw();
    }

    for (const i of this.items) {
      if (i.y <= this.game.player.y) i.draw();
    }
    for (const e of this.enemies) {
      if (e.y <= this.game.player.y) e.draw();
    }
  };
  drawEntitiesInFrontOfPlayer = () => {
    for (let x = 0; x < this.levelArray.length; x++) {
      for (let y = 0; y < this.levelArray[0].length; y++) {
        if (this.softVisibilityArray[x][y] > 0) this.levelArray[x][y].drawAbovePlayer();
      }
    }

    for (const i of this.items) {
      if (i.y > this.game.player.y) i.draw();
    }
    for (const e of this.enemies) {
      if (e.y > this.game.player.y) e.draw();
    }

    for (const e of this.enemies) {
      e.drawTopLayer(); // health bars
    }

    this.particles = this.particles.filter(x => !x.dead);
    for (const p of this.particles) {
      p.draw();
    }

    // D I T H E R E D     S H A D I N G
    for (let x = this.roomX - 1; x < this.roomX + this.width + 1; x++) {
      for (let y = this.roomY - 1; y < this.roomY + this.height + 1; y++) {
        let frame = Math.round(
          6 * (this.softVisibilityArray[x][y] / LevelConstants.MIN_VISIBILITY)
        );
        Game.drawFX(frame, 10, 1, 1, x, y, 1, 1);
      }
    }

    for (const i of this.items) {
      if (i.y <= this.game.player.y) i.drawTopLayer();
    }

    // draw over dithered shading
    for (let x = 0; x < this.levelArray.length; x++) {
      for (let y = 0; y < this.levelArray[0].length; y++) {
        this.levelArray[x][y].drawAboveShading();
      }
    }
  };

  // for stuff rendered on top of the player
  drawTopLayer = () => {
    // gui stuff

    // room name
    let old = Game.ctx.font;
    Game.ctx.font = GameConstants.BIG_FONT_SIZE + "px PixelFont";
    Game.ctx.fillStyle = LevelConstants.LEVEL_TEXT_COLOR;
    Game.ctx.fillText(
      this.name,
      GameConstants.WIDTH / 2 - Game.ctx.measureText(this.name).width / 2,
      (this.roomY - 1) * GameConstants.TILESIZE - (GameConstants.FONT_SIZE - 1)
    );
    Game.ctx.font = old;
  };
}
