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
import { VendingMachine } from "./enemy/vendingMachine";
import { WallSideTorch } from "./tile/wallSideTorch";
import { LightSource } from "./lightSource";
import { ChargeEnemy } from "./enemy/chargeEnemy";
import { Shotgun } from "./weapon/shotgun";
import { Heart } from "./item/heart";
import { Spear } from "./weapon/spear";
import { SideDoor } from "./tile/sidedoor";
import { Drawable } from "./drawable";
import { Player } from "./player";

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
  BIGCAVE,
  CAVE,
  SPAWNER,
  ROPEHOLE,
  ROPECAVE,
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
  softVis: number[][]; // this is the one we use for drawing (includes smoothing)
  vis: number[][]; // visibility is 0, 1, or 2 (0 = black, 2 = fully lit)
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
  group: number;
  name: string;
  message: string;
  turn: TurnState;
  playerTurnTime: number;
  playerTicked: Player;
  skin: SkinType;
  entered: boolean; // has the player entered this level
  upLadder: UpLadder;
  lightSources: Array<LightSource>;
  shadeColor = "black";

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

  tileInside = (tileX: number, tileY: number): boolean => {
    return this.pointInside(tileX, tileY, this.roomX, this.roomY, this.width, this.height);
  };

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

    for (let x = 0; x < this.levelArray.length; x++) {
      for (let y = 0; y < this.levelArray[0].length; y++) {
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
    for (let x = 0; x < this.width + 6; x++) {
      for (let y = 0; y < this.height + 6; y++) {
        this.levelArray[x][y] = new Wall(this, x, y, 1);
      }
    }
    // put in floors
    for (let x = 0; x < this.width + 6; x++) {
      for (let y = 0; y < this.height + 6; y++) {
        if (this.pointInside(x, y, this.roomX, this.roomY, this.width, this.height)) {
          this.levelArray[x][y] = new Floor(this, x, y);
        }
      }
    }
    // outer ring walls
    for (let x = 0; x < this.width + 6; x++) {
      for (let y = 0; y < this.height + 6; y++) {
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

  private addWallBlocks(rand: () => number) {
    // put some random wall blocks in the room
    let numBlocks = Game.randTable([0, 1, 1, 2, 2, 2, 2, 3, 3], rand);
    for (let i = 0; i < numBlocks; i++) {
      let blockW = Math.min(
        Game.randTable([2, 2, 2, 2, 2, 2, 3, 3, 3, 4, 5, 6, 7, 9], rand),
        this.width - 2
      );
      let blockH = Math.min(blockW + Game.rand(-1, 1, rand), this.height - 3);

      let x = Game.rand(this.roomX + 1, this.roomX + this.width - blockW - 2, rand);
      let y = Game.rand(this.roomY + 2, this.roomY + this.height - blockH - 2, rand);

      for (let xx = x; xx < x + blockW; xx++) {
        for (let yy = y; yy < y + blockH; yy++) {
          this.levelArray[xx][yy] = new Wall(this, xx, yy, 0);
        }
      }
    }
  }

  private addFingers(rand: () => number) {
    // add "finger" blocks extending from ring walls inward
    let numFingers = Game.randTable([0, 1, 1, 2, 2, 3, 4, 5], rand);
    if (Game.rand(1, 13, rand) > this.width) numFingers += this.width * 0.3;
    for (let i = 0; i < numFingers; i++) {
      let x = 0;
      let y = 0;
      let blockW = 0;
      let blockH = 0;
      if (Game.rand(0, 1, rand) === 0) {
        // horizontal
        blockW = Game.rand(1, this.width - 1, rand);
        blockH = 1;

        if (Game.rand(0, 1, rand) === 0) {
          // left
          x = this.roomX;
          y = Game.rand(this.roomY + 2, this.roomY + this.height - blockH - 2, rand);
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
          y = Game.rand(this.roomY + 2, this.roomY + this.height - blockH - 2, rand);
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
        blockH = Game.rand(1, this.height - 4, rand);

        if (Game.rand(0, 1, rand) === 0) {
          // top
          y = this.roomY + 2;
          x = Game.rand(this.roomX + 2, this.roomX + this.width - 3, rand);
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
          x = Game.rand(this.roomX + 2, this.roomX + this.width - 3, rand);
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

  private addTorches(numTorches: number, rand: () => number) {
    let walls = [];
    for (let xx = 0; xx < this.levelArray.length; xx++) {
      for (let yy = 0; yy < this.levelArray[0].length; yy++) {
        if (this.levelArray[xx][yy] instanceof WallSide) {
          walls.push(this.levelArray[xx][yy]);
        }
      }
    }
    for (let i = 0; i < numTorches; i++) {
      let t, x, y;
      if (walls.length == 0) return;
      t = walls.splice(Game.rand(0, walls.length - 1, rand), 1)[0];
      x = t.x;
      y = t.y;
      this.levelArray[x][y] = new WallSideTorch(this, x, y);
    }
  }

  private addChasms(rand: () => number) {
    // add chasms
    let w = Game.rand(2, 4, rand);
    let h = Game.rand(2, 4, rand);
    let xmin = this.roomX + 1;
    let xmax = this.roomX + this.width - w - 1;
    let ymin = this.roomY + 2;
    let ymax = this.roomY + this.height - h - 1;
    if (xmax < xmin || ymax < ymin) return;
    let x = Game.rand(xmin, xmax, rand);
    let y = Game.rand(ymin, ymax, rand);

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

  private addChests(numChests: number, rand: () => number) {
    // add chests
    let tiles = this.getEmptyMiddleTiles();
    for (let i = 0; i < numChests; i++) {
      let t, x, y;
      if (tiles.length == 0) return;
      t = tiles.splice(Game.rand(0, tiles.length - 1, rand), 1)[0];
      x = t.x;
      y = t.y;
      this.enemies.push(new Chest(this, this.game, x, y, rand));
    }
  }

  private addSpikeTraps(numSpikes: number, rand: () => number) {
    // add spikes
    let tiles = this.getEmptyMiddleTiles();
    for (let i = 0; i < numSpikes; i++) {
      let t = tiles.splice(Game.rand(0, tiles.length - 1, rand), 1)[0];
      if (tiles.length == 0) return;
      let x = t.x;
      let y = t.y;

      this.levelArray[x][y] = new SpikeTrap(this, x, y);
    }
  }

  private addSpikes(numSpikes: number, rand: () => number) {
    // add spikes
    let tiles = this.getEmptyMiddleTiles();
    for (let i = 0; i < numSpikes; i++) {
      let t = tiles.splice(Game.rand(0, tiles.length - 1, rand), 1)[0];
      if (tiles.length == 0) return;
      let x = t.x;
      let y = t.y;

      this.levelArray[x][y] = new Spike(this, x, y);
    }
  }

  private addEnemies(numEnemies: number, rand: () => number) {
    let tiles = this.getEmptyMiddleTiles();
    for (let i = 0; i < numEnemies; i++) {
      let t = tiles.splice(Game.rand(0, tiles.length - 1, rand), 1)[0];
      if (tiles.length == 0) return;
      let x = t.x;
      let y = t.y;
      if (this.depth !== 0) {
        let d = Math.min(this.depth, Game.randTable([1, 1, 1, 2, 2, 2, 4, 4], rand));
        switch (d) {
          case 1:
            this.enemies.push(new KnightEnemy(this, this.game, x, y));
            break;
          case 2:
            let s = new SkullEnemy(this, this.game, x, y, rand);
            s.skipNextTurns = 1;
            this.enemies.push(s);
            break;
          case 3:
            this.enemies.push(new WizardEnemy(this, this.game, x, y, rand));
            break;
          case 4:
            this.enemies.push(new Spawner(this, this.game, x, y, rand));
            break;
          case 5:
            this.enemies.push(new ChargeEnemy(this, this.game, x, y));
            break;
        }
      }
    }
  }

  private addObstacles(numObstacles: number, rand: () => number) {
    // add crates/barrels
    let tiles = this.getEmptyMiddleTiles();
    for (let i = 0; i < numObstacles; i++) {
      let t = tiles.splice(Game.rand(0, tiles.length - 1, rand), 1)[0];
      if (tiles.length == 0) return;
      let x = t.x;
      let y = t.y;
      switch (Game.randTable([1, 1, 2], rand)) {
        case 1:
          this.enemies.push(new Crate(this, this.game, x, y));
          break;
        case 2:
          this.enemies.push(new Barrel(this, this.game, x, y));
          break;
      }
    }
  }

  private addPlants(numPlants: number, rand: () => number) {
    let tiles = this.getEmptyMiddleTiles();
    for (let i = 0; i < numPlants; i++) {
      let t = tiles.splice(Game.rand(0, tiles.length - 1, rand), 1)[0];
      if (tiles.length == 0) return;
      let x = t.x;
      let y = t.y;

      this.enemies.push(new PottedPlant(this, this.game, x, y));
    }
  }

  private addResources(numResources: number, rand: () => number) {
    let tiles = this.getEmptyMiddleTiles();
    for (let i = 0; i < numResources; i++) {
      let t = tiles.splice(Game.rand(0, tiles.length - 1, rand), 1)[0];
      if (tiles.length == 0) return;
      let x = t.x;
      let y = t.y;

      let r = rand();
      if (r <= (10 - this.depth ** 3) / 10)
        this.enemies.push(new CoalResource(this, this.game, x, y));
      else if (r <= (10 - (this.depth - 2) ** 3) / 10)
        this.enemies.push(new GoldResource(this, this.game, x, y));
      else this.enemies.push(new EmeraldResource(this, this.game, x, y));
    }
  }

  generateDungeon = (rand: () => number) => {
    this.skin = SkinType.DUNGEON;

    let factor = Game.rand(1, 36, rand);

    this.buildEmptyRoom();
    if (factor < 30) this.addWallBlocks(rand);
    if (factor < 26) this.addFingers(rand);
    if (factor % 4 === 0) this.addChasms(rand);
    this.fixWalls();
    this.addTorches(Game.randTable([0, 0, 0, 1, 1, 2, 2, 3, 4], rand), rand);

    if (factor % 3 === 0) this.addPlants(Game.randTable([0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 4], rand), rand);
    if (factor > 15) this.addSpikeTraps(Game.randTable([0, 0, 0, 1, 1, 2, 5], rand), rand);
    let numEmptyTiles = this.getEmptyTiles().length;
    let numEnemies = Math.ceil(
      numEmptyTiles * (this.depth * 0.25 + 0.5) * Game.randTable([0.01, 0.05, 0.05, 0.06, 0.07, 0.1], rand)
    );
    this.addEnemies(numEnemies, rand);
    if (numEnemies > 0) this.addObstacles(numEnemies / Game.rand(1, 2, rand), rand);
    else this.addObstacles(Game.randTable([0, 0, 1, 1, 2, 3, 5], rand), rand);
  };
  generateBigDungeon = (rand: () => number) => {
    this.skin = SkinType.DUNGEON;

    this.buildEmptyRoom();
    if (Game.rand(1, 4, rand) === 1) this.addChasms(rand);
    this.fixWalls();
    this.addTorches(Game.randTable([0, 0, 0, 1, 1, 2, 2, 3, 4], rand), rand);

    if (Game.rand(1, 4, rand) === 1) this.addPlants(Game.randTable([0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 4], rand), rand);
    if (Game.rand(1, 3, rand) === 1) this.addSpikeTraps(Game.randTable([3, 5, 7, 8], rand), rand);
    let numEmptyTiles = this.getEmptyTiles().length;
    let numEnemies = Math.ceil(
      numEmptyTiles * (this.depth * 0.5 + 0.5) * Game.randTable([0.05, 0.05, 0.06, 0.07, 0.1], rand)
    );
    this.addEnemies(numEnemies, rand);
    if (numEnemies > 0) this.addObstacles(numEnemies / Game.rand(1, 2, rand), rand);
    else this.addObstacles(Game.randTable([0, 0, 1, 1, 2, 3, 5], rand), rand);
  };
  generateSpawner = (rand: () => number) => {
    this.skin = SkinType.DUNGEON;

    this.buildEmptyRoom();
    this.fixWalls();
    this.addTorches(Game.randTable([0, 0, 0, 1, 1, 2, 2, 3, 4], rand), rand);

    this.enemies.push(
      new Spawner(
        this,
        this.game,
        Math.floor(this.roomX + this.width / 2),
        Math.floor(this.roomY + this.height / 2),
        rand
      )
    );
  };
  generateKeyRoom = (rand: () => number) => {
    this.skin = SkinType.DUNGEON;

    this.buildEmptyRoom();
    this.fixWalls();
    this.addTorches(Game.randTable([0, 0, 0, 1, 1, 2, 2, 3, 4], rand), rand);

    this.items.push(
      new GoldenKey(
        this,
        Math.floor(this.roomX + this.width / 2),
        Math.floor(this.roomY + this.height / 2)
      )
    );
  };
  generateFountain = (rand: () => number) => {
    this.skin = SkinType.DUNGEON;

    this.buildEmptyRoom();
    this.fixWalls();
    this.addTorches(Game.randTable([0, 0, 0, 1, 1, 2, 2, 3, 4], rand), rand);

    let centerX = Math.floor(this.roomX + this.width / 2);
    let centerY = Math.floor(this.roomY + this.height / 2);
    for (let x = centerX - 1; x <= centerX + 1; x++) {
      for (let y = centerY - 1; y <= centerY + 1; y++) {
        this.levelArray[x][y] = new FountainTile(this, x, y, x - (centerX - 1), y - (centerY - 1));
      }
    }

    this.addPlants(Game.randTable([0, 0, 1, 2], rand), rand);
  };
  placeCoffin = (x: number, y: number) => {
    this.levelArray[x][y] = new CoffinTile(this, x, y, 0);
    this.levelArray[x][y + 1] = new CoffinTile(this, x, y + 1, 1);
  };
  generateCoffin = (rand: () => number) => {
    this.skin = SkinType.DUNGEON;

    this.buildEmptyRoom();
    this.fixWalls();
    this.addTorches(Game.randTable([0, 0, 0, 1, 1, 2, 2, 3, 4], rand), rand);

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
  generatePuzzle = (rand: () => number) => {
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

    let x = Game.rand(this.roomX, this.roomX + this.width - 1, rand);
    let y = Game.rand(this.roomY + Math.floor(this.height / 2) + 3, this.roomY + this.height - 2, rand);

    this.levelArray[x][y] = new Button(this, x, y, d);

    let crateTiles = this.getEmptyMiddleTiles().filter(
      t =>
        t.x >= this.roomX + 1 &&
        t.x <= this.roomX + this.width - 2 &&
        t.y >= this.roomY + Math.floor(this.height / 2) + 3 &&
        t.y <= this.roomY + this.height - 2
    );
    let numCrates = Game.randTable([1, 2, 2, 3, 4], rand);

    for (let i = 0; i < numCrates; i++) {
      let t = crateTiles.splice(Game.rand(0, crateTiles.length - 1, rand), 1)[0];

      this.enemies.push(new Crate(this, this.game, t.x, t.y));
    }
    this.fixWalls();
    this.addPlants(Game.randTable([0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 4], rand), rand);
  };
  generateSpikeCorridor = (rand: () => number) => {
    this.skin = SkinType.DUNGEON;

    this.buildEmptyRoom();

    for (let x = this.roomX; x < this.roomX + this.width; x++) {
      for (let y = this.roomY + 1; y < this.roomY + this.height - 1; y++) {
        this.levelArray[x][y] = new SpikeTrap(this, x, y, Game.rand(0, 3, rand));
      }
    }

    this.fixWalls();
    this.addTorches(Game.randTable([0, 0, 0, 1, 1, 2, 2, 3, 4], rand), rand);
  };
  generateTreasure = (rand: () => number) => {
    this.skin = SkinType.DUNGEON;

    this.buildEmptyRoom();
    this.addWallBlocks(rand);
    this.fixWalls();
    this.addTorches(Game.randTable([0, 1, 1, 2, 2, 3, 4], rand), rand);

    this.addChests(Game.randTable([3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 6], rand), rand);
    this.addPlants(Game.randTable([0, 1, 2, 4, 5, 6], rand), rand);
  };
  generateChessboard = (rand: () => number) => {
    this.skin = SkinType.DUNGEON;

    this.buildEmptyRoom();
    this.fixWalls();
  };
  generateCave = (rand: () => number) => {
    this.skin = SkinType.CAVE;

    let factor = Game.rand(1, 36, rand);

    this.buildEmptyRoom();
    if (factor < 30) this.addWallBlocks(rand);
    if (factor < 26) this.addFingers(rand);
    if (factor % 4 === 0) this.addChasms(rand);
    this.fixWalls();

    if (factor > 15) this.addSpikeTraps(Game.randTable([0, 0, 0, 1, 1, 2, 5], rand), rand);
    let numEmptyTiles = this.getEmptyTiles().length;
    let numEnemies = Math.ceil(
      numEmptyTiles * (this.depth * 0.2 + 0.5) * Game.randTable([0.03, 0.04, 0.06, 0.07, 0.08], rand)
    );
    this.addEnemies(numEnemies, rand);
    this.addResources(Game.randTable([1, 2, 2, 3, 4, 4, 5, 6, 6, 7, 7, 7, 8, 8, 9, 10, 11, 12], rand), rand);
  };
  generateUpLadder = (rand: () => number) => {
    this.skin = SkinType.DUNGEON;

    this.buildEmptyRoom();
    this.fixWalls();
    this.addTorches(Game.randTable([0, 0, 0, 1, 1, 2, 2], rand), rand);

    let cX = Math.floor(this.roomX + this.width / 2);
    let cY = Math.floor(this.roomY + this.height / 2);
    this.upLadder = new UpLadder(this, this.game, cX, cY);
    this.levelArray[cX][cY] = this.upLadder;
  };
  generateDownLadder = (rand: () => number) => {
    this.skin = SkinType.DUNGEON;

    this.buildEmptyRoom();
    this.fixWalls();
    this.addTorches(Game.randTable([0, 0, 0, 1, 1, 2, 2], rand), rand);

    let cX = Math.floor(this.roomX + this.width / 2);
    let cY = Math.floor(this.roomY + this.height / 2);
    this.levelArray[cX][cY] = new DownLadder(this, this.game, cX, cY);
  };
  generateRopeHole = (rand: () => number) => {
    this.skin = SkinType.DUNGEON;

    this.buildEmptyRoom();
    this.fixWalls();
    this.addTorches(Game.randTable([0, 0, 0, 1, 1, 2, 2], rand), rand);

    let cX = Math.floor(this.roomX + this.width / 2);
    let cY = Math.floor(this.roomY + this.height / 2);
    let d = new DownLadder(this, this.game, cX, cY);
    d.isRope = true;
    this.levelArray[cX][cY] = d;
  };
  generateRopeCave = (rand: () => number) => {
    this.skin = SkinType.CAVE;

    this.buildEmptyRoom();
    this.fixWalls();

    let cX = Math.floor(this.roomX + this.width / 2);
    let cY = Math.floor(this.roomY + this.height / 2);
    this.upLadder = new UpLadder(this, this.game, cX, cY);
    this.upLadder.isRope = true;
    this.levelArray[cX][cY] = this.upLadder;
  };
  generateShop = (rand: () => number) => {
    this.skin = SkinType.DUNGEON;

    this.buildEmptyRoom();
    this.fixWalls();
    this.addTorches(2, rand);

    let cX = Math.floor(this.roomX + this.width / 2);
    let cY = Math.floor(this.roomY + this.height / 2);
    this.enemies.push(new VendingMachine(this, this.game, cX - 2, cY - 1, new Shotgun(this, 0, 0), rand));
    this.enemies.push(new VendingMachine(this, this.game, cX + 2, cY - 1, new Heart(this, 0, 0), rand));
    this.enemies.push(new VendingMachine(this, this.game, cX - 2, cY + 2, new Armor(this, 0, 0), rand));
    this.enemies.push(new VendingMachine(this, this.game, cX + 2, cY + 2, new Spear(this, 0, 0), rand));
  };

  constructor(
    game: Game,
    x: number,
    y: number,
    w: number,
    h: number,
    type: RoomType,
    difficulty: number,
    group: number,
    rand = Math.random
  ) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.type = type;
    this.depth = difficulty;
    this.group = group;

    this.entered = false;
    this.turn = TurnState.playerTurn;
    this.playerTurnTime = Date.now();

    this.items = Array<Item>();
    this.projectiles = Array<Projectile>();
    this.particles = Array<Particle>();
    this.doors = Array<Door>();
    this.enemies = Array<Enemy>();
    this.lightSources = Array<LightSource>();

    this.levelArray = [];
    for (let x = 0; x < w + 6; x++) {
      this.levelArray[x] = [];
    }
    this.vis = [];
    this.softVis = [];
    for (let x = 0; x < w + 6; x++) {
      this.vis[x] = [];
      this.softVis[x] = [];
      for (let y = 0; y < h + 6; y++) {
        this.vis[x][y] = 1;
        this.softVis[x][y] = 1;
      }
    }

    this.roomX = 2; //Math.floor(- this.width / 2);
    this.roomY = 2; //Math.floor(- this.height / 2);

    this.upLadder = null;

    this.name = "";
    switch (this.type) {
      case RoomType.DUNGEON:
        this.generateDungeon(rand);
        break;
      case RoomType.BIGDUNGEON:
        this.generateBigDungeon(rand);
        break;
      case RoomType.FOUNTAIN:
        this.generateFountain(rand);
        break;
      case RoomType.COFFIN:
        this.generateCoffin(rand);
        break;
      case RoomType.PUZZLE:
        this.generatePuzzle(rand);
        break;
      case RoomType.SPIKECORRIDOR:
        this.generateSpikeCorridor(rand);
        break;
      case RoomType.TREASURE:
        this.generateTreasure(rand);
        break;
      case RoomType.CHESSBOARD: // TODO
        this.generateChessboard(rand);
        break;
      case RoomType.KEYROOM:
        this.generateKeyRoom(rand);
        break;
      case RoomType.GRASS:
        this.generateDungeon(rand);
        break;
      case RoomType.BIGCAVE:
        this.generateCave(rand);
      case RoomType.CAVE:
        this.generateCave(rand);
        break;
      case RoomType.UPLADDER:
        this.generateUpLadder(rand);
        this.name = "FLOOR " + -this.depth;
        break;
      case RoomType.DOWNLADDER:
        this.generateDownLadder(rand);
        this.name = "FLOOR " + -this.depth;
        break;
      case RoomType.ROPEHOLE:
        this.generateRopeHole(rand);
        break;
      case RoomType.ROPECAVE:
        this.generateRopeCave(rand);
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

        this.generateShop(rand);
        break;
      case RoomType.SPAWNER:
        this.generateSpawner(rand);
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
        d = new BottomDoor(this, this.game, this.roomX, this.roomY + this.height, link);
        break;
      case 4:
        this.levelArray[this.roomX + Math.floor(this.width / 2)][
          this.roomY + this.height
        ] = new Floor(this, this.roomX + Math.floor(this.width / 2), this.roomY + this.height);
        d = new BottomDoor(
          this,
          this.game,
          this.roomX + Math.floor(this.width / 2),
          this.roomY + this.height,
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
          this.roomY + this.height,
          link
        );
        break;
      case 6:
        this.levelArray[this.roomX][this.roomY + 1] = new Floor(this, this.roomX, this.roomY + 1);
        d = new SideDoor(this, this.game, this.roomX - 1, this.roomY + 1, link);
        break;
      case 7:
        this.levelArray[this.roomX][this.roomY + Math.floor(this.height / 2)] = new Floor(
          this,
          this.roomX,
          this.roomY + Math.floor(this.height / 2)
        );
        d = new SideDoor(
          this,
          this.game,
          this.roomX - 1,
          this.roomY + Math.floor(this.height / 2),
          link
        );
        break;
      case 8:
        this.levelArray[this.roomX][this.roomY + this.height - 1] = new Floor(
          this,
          this.roomX,
          this.roomY + this.height - 1
        );
        d = new SideDoor(this, this.game, this.roomX - 1, this.roomY + this.height - 1, link);
        break;
      case 9:
        this.levelArray[this.roomX + this.width - 1][this.roomY + 1] = new Floor(
          this,
          this.roomX + this.width - 1,
          this.roomY + 1
        );
        d = new SideDoor(this, this.game, this.roomX + this.width, this.roomY + 1, link);
        break;
      case 10:
        this.levelArray[this.roomX + this.width - 1][
          this.roomY + Math.floor(this.height / 2)
        ] = new Floor(this, this.roomX + this.width - 1, this.roomY + Math.floor(this.height / 2));
        d = new SideDoor(
          this,
          this.game,
          this.roomX + this.width,
          this.roomY + Math.floor(this.height / 2),
          link
        );
        break;
      case 11:
        this.levelArray[this.roomX + this.width - 1][this.roomY + this.height - 1] = new Floor(
          this,
          this.roomX + this.width - 1,
          this.roomY + this.height - 1
        );
        d = new SideDoor(
          this,
          this.game,
          this.roomX + this.width,
          this.roomY + this.height - 1,
          link
        );
        break;
    }
    this.doors.push(d);
    if (this.levelArray[d.x] == undefined) {
      console.log('UNDEFINED at ' + d.x + ' levelArray.length was ' + this.levelArray.length);
      console.log('location ' + location);
      console.log(this.roomX, this.roomY);
      console.log(this.width, this.height);
    }
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

  enterLevel = (player: Player) => {
    this.updateLevelTextColor();
    player.moveSnap(
      this.roomX + Math.floor(this.width / 2),
      this.roomY + this.height - 1
    );

    this.updateLighting();
    this.entered = true;
    this.message = this.name;
  };

  enterLevelThroughDoor = (player: Player, door: any, side?: number) => {
    this.updateLevelTextColor();
    if (door instanceof Door) {
      (door as Door).opened = true;
      player.moveNoSmooth(door.x, door.y + 1);
    } else if (door instanceof BottomDoor) {
      player.moveNoSmooth(door.x, door.y - 1);
    } else if (door instanceof SideDoor) {
      player.moveNoSmooth(door.x + side, door.y);
    }

    this.updateLighting();
    this.entered = true;
    this.message = this.name;
  };

  enterLevelThroughLadder = (player: Player, ladder: any) => {
    this.updateLevelTextColor();

    player.moveSnap(ladder.x, ladder.y + 1);

    this.updateLighting();
    this.entered = true;
    this.message = this.name;
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
        if (Math.abs(this.softVis[x][y] - this.vis[x][y]) >= 0.02) {
          if (this.softVis[x][y] < this.vis[x][y]) this.softVis[x][y] += 0.02;
          else if (this.softVis[x][y] > this.vis[x][y]) this.softVis[x][y] -= 0.02;
        }
        //if (this.softVis[x][y] < 0.05) this.softVis[x][y] = 0;
      }
    }
  };

  updateLighting = () => {
    let oldVis = [];
    for (let x = 0; x < this.levelArray.length; x++) {
      oldVis[x] = [];
      for (let y = 0; y < this.levelArray[0].length; y++) {
        oldVis[x][y] = this.vis[x][y];
        this.vis[x][y] = 1;
        //if (this.visibilityArray[x][y] > LevelConstants.MIN_VISIBILITY)
        //  this.visibilityArray[x][y] = 0;
      }
    }
    for (let i = 0; i < 360; i += LevelConstants.LIGHTING_ANGLE_STEP) {
      this.castShadowsAtAngle(
        i,
        this.game.players[this.game.localPlayerID].x + 0.5,
        this.game.players[this.game.localPlayerID].y + 0.5,
        this.game.players[this.game.localPlayerID].sightRadius - this.depth
      );
    }
    for (const l of this.lightSources) {
      for (let i = 0; i < 360; i += LevelConstants.LIGHTING_ANGLE_STEP) {
        this.castShadowsAtAngle(i, l.x, l.y, l.r);
      }
    }
    if (LevelConstants.SMOOTH_LIGHTING)
      this.vis = this.blur3x3(this.vis, [[1, 2, 1], [2, 8, 2], [1, 2, 1]]);

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

  castShadowsAtAngle = (angle: number, px: number, py: number, radius: number) => {
    let dx = Math.cos((angle * Math.PI) / 180);
    let dy = Math.sin((angle * Math.PI) / 180);
    for (let i = 0; i < radius; i++) {
      if (
        Math.floor(px) < 0 ||
        Math.floor(px) >= this.levelArray.length ||
        Math.floor(py) < 0 ||
        Math.floor(py) >= this.levelArray[0].length
      )
        return; // we're outside the level
      let tile = this.levelArray[Math.floor(px)][Math.floor(py)];
      if (tile.isOpaque() || (tile instanceof Wall && tile.type === 1)) {
        return;
      }

      this.vis[Math.floor(px)][Math.floor(py)] = Math.min(
        this.vis[Math.floor(px)][Math.floor(py)],
        Math.min(i / radius, 1)
      );

      px += dx;
      py += dy;
    }
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

  catchUp = () => {
    if (this.turn === TurnState.computerTurn) this.computerTurn(); // player skipped computer's turn, catch up
  };

  tick = (player: Player) => {
    this.enemies = this.enemies.filter(e => !e.dead);
    this.updateLighting();

    for (const p of this.projectiles) {
      p.tick();
    }

    for (let x = 0; x < this.levelArray.length; x++) {
      for (let y = 0; y < this.levelArray[0].length; y++) {
        this.levelArray[x][y].tick();
      }
    }

    this.turn = TurnState.computerTurn;
    this.playerTurnTime = Date.now();
    this.playerTicked = player;
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
    for (const e of this.enemies) {
      e.tick();
    }
    for (const i of this.items) {
      i.tick();
    }

    for (const p of this.projectiles) {
      if (this.levelArray[p.x][p.y].isSolid()) p.dead = true;
      for (const i in this.game.players) {
        if (p.x === this.game.players[i].x && p.y === this.game.players[i].y) {
          p.hitPlayer(this.game.players[i]);
        }
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

    this.playerTicked.finishTick();
    this.turn = TurnState.playerTurn;
  };

  draw = () => {
    HitWarning.updateFrame();

    this.fadeLighting();

    for (let x = this.roomX - 1; x < this.roomX + this.width + 1; x++) {
      for (let y = this.roomY - 1; y < this.roomY + this.height + 1; y++) {
        if (this.softVis[x][y] < 1) this.levelArray[x][y].draw();
      }
    }
  };

  drawEntitiesBehindPlayer = () => {
    for (let x = 0; x < this.levelArray.length; x++) {
      for (let y = 0; y < this.levelArray[0].length; y++) {
        if (this.softVis[x][y] < 1) this.levelArray[x][y].drawUnderPlayer();
      }
    }

    this.projectiles = this.projectiles.filter(p => !p.dead);
    this.particles = this.particles.filter(p => !p.dead);

    let drawables = new Array<Drawable>();
    drawables = drawables.concat(this.enemies, this.projectiles, this.particles, this.items);
    drawables.sort((a, b) => {
      if (a.drawableY - b.drawableY === 0) {
        if (a instanceof Enemy) {
          return 1;
        } else if (b instanceof Enemy) {
          return -1;
        } else return 0;
      } else {
        return a.drawableY - b.drawableY;
      }
    });

    for (const d of drawables) {
      if (d.drawableY <= this.game.players[this.game.localPlayerID].y) d.draw();
    }
  };
  drawEntitiesInFrontOfPlayer = () => {
    for (let x = 0; x < this.levelArray.length; x++) {
      for (let y = 0; y < this.levelArray[0].length; y++) {
        if (this.softVis[x][y] < 1) this.levelArray[x][y].drawAbovePlayer();
      }
    }

    let drawables = new Array<Drawable>();
    drawables = drawables.concat(this.enemies, this.projectiles, this.particles, this.items);
    drawables.sort((a, b) => {
      if (a.drawableY - b.drawableY === 0) {
        if (a instanceof Enemy) {
          return 1;
        } else if (b instanceof Enemy) {
          return -1;
        } else return 0;
      } else {
        return a.drawableY - b.drawableY;
      }
    });

    for (const d of drawables) {
      if (d.drawableY > this.game.players[this.game.localPlayerID].y) d.draw();
    }

    for (const i of this.items) {
      i.drawTopLayer();
    }
  };

  drawShade = () => {
    let shadingAlpha = Math.max(0, Math.min(0.8, (2 * this.depth) / this.game.players[this.game.localPlayerID].sightRadius));
    Game.ctx.globalAlpha = shadingAlpha;
    //Game.ctx.fillStyle = "#400a0e";
    Game.ctx.fillStyle = this.shadeColor;
    Game.ctx.fillRect(
      (this.roomX - LevelConstants.SCREEN_W) * GameConstants.TILESIZE,
      (this.roomY - LevelConstants.SCREEN_H) * GameConstants.TILESIZE,
      (this.width + 2 * LevelConstants.SCREEN_W) * GameConstants.TILESIZE,
      (this.height + 2 * LevelConstants.SCREEN_H) * GameConstants.TILESIZE
    );
    Game.ctx.globalAlpha = 1.0;
    Game.ctx.globalCompositeOperation = "source-over";
  };

  drawOverShade = () => {
    for (const e of this.enemies) {
      e.drawTopLayer(); // health bars
    }

    for (const p of this.projectiles) {
      p.drawTopLayer();
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
    Game.ctx.font = GameConstants.SCRIPT_FONT_SIZE + "px Script";
    Game.ctx.fillStyle = LevelConstants.LEVEL_TEXT_COLOR;
    Game.fillText(
      this.message,
      GameConstants.WIDTH / 2 - Game.measureText(this.name).width / 2,
      5
    );
    Game.ctx.font = old;
  };
}
