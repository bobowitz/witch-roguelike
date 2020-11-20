import { Game } from "./game";
import { Level, RoomType } from "./level";
import { Door } from "./tile/door";
import { BottomDoor } from "./tile/bottomDoor";
import { LevelConstants } from "./levelConstants";
import { Random } from "./random"
import { DownLadder } from "./tile/downLadder";

let ROOM_SIZE = [3, 3, 4, 4, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8, 8, 13];

class N {
  // Node
  type: RoomType;
  difficulty: number;
  children: N[];

  constructor(type: RoomType, difficulty: number, children: N[]) {
    this.type = type;
    this.difficulty = difficulty;
    this.children = children;
  }
}

class Room {
  x: number;
  y: number;
  w: number;
  h: number;
  doneAdding: boolean;
  doors: Array<any>;

  constructor() {
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.doneAdding = false;
    this.doors = [null, null, null, null, null, null];
  }

  collides = r => {
    if (this.x > r.x + r.w || this.x + this.w < r.x) return false;
    if (this.y >= r.y + r.h || this.y + this.h <= r.y) return false;
    return true;
  };

  getPoints = () => {
    return [
      { x: this.x, y: this.y },
      { x: Math.floor(this.x + this.w / 2), y: this.y },
      { x: this.x + this.w - 1, y: this.y },
      { x: this.x, y: this.y + this.h },
      { x: Math.floor(this.x + this.w / 2), y: this.y + this.h },
      { x: this.x + this.w - 1, y: this.y + this.h },
      { x: this.x - 1, y: this.y + 1 },
      { x: this.x - 1, y: Math.floor(this.y + this.h / 2) },
      { x: this.x - 1, y: this.y + this.h - 1 },
      { x: this.x + this.w, y: this.y + 1 },
      { x: this.x + this.w, y: Math.floor(this.y + this.h / 2) },
      { x: this.x + this.w, y: this.y + this.h - 1 },
    ];
  };

  getDoors = () => {
    return this.doors;
  };

  generateAroundPoint = (rand, p, dir, w?, h?,) => {
    this.x = 0;
    this.y = 0;
    if (w) {
      this.w = w;
      this.h = h;
    } else {
      this.w = ROOM_SIZE[Math.floor(rand() * ROOM_SIZE.length)];
      this.h = ROOM_SIZE[Math.floor(rand() * ROOM_SIZE.length)];
    }

    let ind = 1;
    if (dir === 0 || dir === 1 || dir === 2) {
      ind = 3 + Math.floor(rand() * 3);
    } else if (dir === 3 || dir === 4 || dir === 5) {
      ind = Math.floor(rand() * 3);
    } else if (dir === 6 || dir === 7 || dir === 8) {
      ind = 9 + Math.floor(rand() * 3);
    } else {
      ind = 6 + Math.floor(rand() * 3);
    }
    let point = this.getPoints()[ind];
    this.x += p.x - point.x;
    this.y += p.y - point.y;

    return ind;
  };
}

export class LevelGenerator {
  game: Game;
  seed: number;
  group: number;
  depthReached = 0;
  currentFloorFirstLevelID = 0;

  noCollisions = (r, rooms) => {
    for (const room of rooms) {
      if (r.collides(room)) {
        return false;
      }
    }
    return true;
  };

  pickType = (r: Room, rand: () => number) => {
    let type = RoomType.DUNGEON;

    switch (Game.rand(1, 9, rand)) {
      case 1:
        type = RoomType.FOUNTAIN;
        if (r.h <= 5 || (r.w > 9 && r.h > 9)) type = this.pickType(r, rand);
        break;
      case 2:
        type = RoomType.COFFIN;
        if (r.w <= 5) type = this.pickType(r, rand);
        break;
      case 3:
        type = RoomType.TREASURE;
        break;
      case 4:
      case 5:
        type = RoomType.GRASS;
        break;
    }
    return type;
  };

  shuffle = (a: any[], rand: () => number) => {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(rand() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  };

  addRooms = (levels: Array<Level>, rooms: Array<Room>, thisNode: N, parent: Room, parentLevel: Level, rand: () => number) => {
    let order = this.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], rand);

    //console.log(thisNode, parent);

    let points;
    if (parent) points = parent.getPoints();
    for (let i = 0; i < order.length; i++) {
      let ind = order[i];
      for (let j = 0; j < 20; j++) {
        let r = new Room();
        r.x = 0;
        r.y = 0;
        let newLevelDoorDir = Game.rand(1, 12, rand);
        if (parent) {
          switch (thisNode.type) {
            case RoomType.ROPECAVE:
            case RoomType.ROPEHOLE:
              newLevelDoorDir = r.generateAroundPoint(rand, points[ind], ind, 3, 4);
              break;
            case RoomType.DUNGEON:
              newLevelDoorDir = r.generateAroundPoint(
                rand,
                points[ind],
                ind,
                Game.randTable([5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 9, 9, 10], rand),
                Game.randTable([5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 9, 9, 10], rand)
              );
              break;
            case RoomType.BIGDUNGEON:
              newLevelDoorDir = r.generateAroundPoint(
                rand,
                points[ind],
                ind,
                Game.randTable([10, 11, 12, 13], rand),
                Game.randTable([10, 11, 12, 13], rand)
              );
              break;
            case RoomType.BIGCAVE:
              newLevelDoorDir = r.generateAroundPoint(rand, points[ind], ind, 15, 15);
              break;
            case RoomType.UPLADDER:
            case RoomType.DOWNLADDER:
              newLevelDoorDir = r.generateAroundPoint(rand, points[ind], ind, 5, 5);
              break;
            case RoomType.SPAWNER:
              newLevelDoorDir = r.generateAroundPoint(
                rand,
                points[ind],
                ind,
                Game.randTable([9, 10, 11], rand),
                Game.randTable([9, 10, 11], rand)
              );
              break;
            case RoomType.PUZZLE:
            case RoomType.COFFIN:
            case RoomType.FOUNTAIN:
              newLevelDoorDir = r.generateAroundPoint(rand, points[ind], ind, 11, 11);
              break;

            case RoomType.SPIKECORRIDOR:
              newLevelDoorDir = r.generateAroundPoint(
                rand,
                points[ind],
                ind,
                Game.randTable([3, 5], rand),
                Game.randTable([9, 10, 11], rand)
              );
              break;
            default:
              newLevelDoorDir = r.generateAroundPoint(rand, points[ind], ind);
              break;
          }
        } else {
          r.x = -2;
          r.y = -2;
          r.w = 7;
          r.h = 7;
          if (thisNode.type === RoomType.UPLADDER) {
            r.w = 5;
            r.h = 5;
          } else if (thisNode.type === RoomType.ROPECAVE) {
            r.w = 3;
            r.h = 4;
          }
        }
        if (this.noCollisions(r, rooms)) {
          let level = new Level(
            this.game,
            r.x,
            r.y,
            r.w,
            r.h,
            thisNode.type,
            thisNode.difficulty,
            this.group,
            rand
          );
          levels.push(level);
          if (parentLevel) {
            let newDoor = level.addDoor(newLevelDoorDir, null);
            newDoor.linkedDoor = parentLevel.addDoor(ind, newDoor);
            r.doors[newLevelDoorDir] = newDoor;
          }
          rooms.push(r);
          for (const child of thisNode.children) {
            if (!this.addRooms(levels, rooms, child, r, level, rand)) return false;
          }
          return true;
        }
      }
    }
    return false;
  };

  setSeed = (seed: number) => {
    this.seed = seed;
  };

  generate = (game: Game, depth: number, cave = false): Level => {
    console.assert(cave || this.depthReached === 0 || depth === this.depthReached + 1);
    this.depthReached = depth;

    Random.setState(this.seed + depth);

    let levels = [];
    let rooms = [];

    let d = depth;
    let node;
    if (cave) {
      node = new N(RoomType.ROPECAVE, d, [
        new N(RoomType.BIGCAVE, d, [
          new N(RoomType.CAVE, d, [new N(RoomType.CAVE, d, [])]),
          new N(RoomType.CAVE, d, []),
          new N(RoomType.CAVE, d, []),
        ]),
      ]);
    } else {
      if (d == 0) {
        node = new N(RoomType.SHOP, d, [new N(RoomType.DOWNLADDER, d, [])]);
      } else {
        node = new N(RoomType.UPLADDER, d, [
          new N(RoomType.SHOP, d, []),
          new N(RoomType.DUNGEON, d, [
            new N(RoomType.DUNGEON, d, [
              new N(RoomType.DUNGEON, d, [new N(RoomType.TREASURE, d, [])]),
            ]),
          ]),
          new N(RoomType.DUNGEON, d, [
            new N(RoomType.DUNGEON, d, [
              new N(RoomType.DUNGEON, d, [new N(RoomType.TREASURE, d, [])]),
            ]),
          ]),
          new N(RoomType.DUNGEON, d, [
            new N(RoomType.DUNGEON, d, [
              new N(RoomType.DUNGEON, d, [new N(RoomType.DOWNLADDER, d, [])]),
            ]),
          ]),
          new N(RoomType.ROPEHOLE, d, []),
        ]);
      }
    }
    /*  new N(RoomType.DUNGEON, d, [
        new N(RoomType.COFFIN, d, [])
      ]),
      new N(RoomType.PUZZLE, d, [
        new N(RoomType.SPIKECORRIDOR, d, [
          new N(RoomType.TREASURE, d, [])
        ])
      ]),
      new N(RoomType.DUNGEON, d, [
        new N(RoomType.DUNGEON, d, [
          new N(RoomType.DUNGEON, d, [
            new N(RoomType.FOUNTAIN, d, [
              new N(RoomType.DUNGEON, d, [
                new N(RoomType.SPIKECORRIDOR, d, [
                  new N(RoomType.KEYROOM, d, [])
                ]),
              ]),
              new N(RoomType.TREASURE, d, []),
            ]),
          ]),
          new N(RoomType.GRASS, d, [
            new N(RoomType.GRASS, d, [
              new N(RoomType.TREASURE, d, [])
            ])
          ]),
        ]),
      ]),
    ]);*/

    this.game = game;

    if (this.game.levels.length > 0)
      this.group = this.game.levels[this.game.levels.length - 1].group + 1;
    else this.group = 0;

    let success = false;
    do {
      rooms = [];
      levels = [];
      success = this.addRooms(levels, rooms, node, null, null, Random.rand);
    } while (!success);

    let numExistingLevels = this.game.levels.length;
    if (!cave) this.currentFloorFirstLevelID = numExistingLevels;
    this.game.levels = this.game.levels.concat(levels);
    console.log('added ' + levels.length + (cave ? ' cave' : '') + ' levels');

    for (let i = numExistingLevels; i < numExistingLevels + levels.length; i++) {
      let found = false;
      if (this.game.levels[i].type === RoomType.ROPEHOLE) {
        for (let col of this.game.levels[i].levelArray) {
          for (let tile of col) {
            if (tile instanceof DownLadder && tile.isRope) {
              tile.generate();
              found = true;
            }
          }
        }
      }
      if (found) break;
    }

    console.log('game.levels.length = ' + this.game.levels.length);

    return levels[0];
  };

  generateFirstNFloors = (game, numFloors) => {
    this.generate(game, 0, false);
    for (let i = 0; i < numFloors; i++) {
      let found = false;
      for (let j = this.game.levels.length - 1; j >= 0; j--) {

        if (this.game.levels[j].type === RoomType.DOWNLADDER) {
          for (let col of this.game.levels[j].levelArray) {
            for (let tile of col) {
              if (tile instanceof DownLadder) {
                tile.generate();
                found = true;
              }
            }
          }
        }

        if (found) break;
      }
    }
  }
}
