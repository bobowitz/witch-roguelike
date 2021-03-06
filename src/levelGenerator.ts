import { Game } from "./game";
import { Level, RoomType } from "./level";
import { Door } from "./tile/door";
import { BottomDoor } from "./tile/bottomDoor";
import { LevelConstants } from "./levelConstants";

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

  generateAroundPoint = (p, dir, w?, h?) => {
    this.x = 0;
    this.y = 0;
    if (w) {
      this.w = w;
      this.h = h;
    } else {
      this.w = ROOM_SIZE[Math.floor(Math.random() * ROOM_SIZE.length)];
      this.h = ROOM_SIZE[Math.floor(Math.random() * ROOM_SIZE.length)];
    }

    let ind = 1;
    if (dir === 0 || dir === 1 || dir === 2) {
      ind = 3 + Math.floor(Math.random() * 3);
    } else if (dir === 3 || dir === 4 || dir === 5) {
      ind = Math.floor(Math.random() * 3);
    } else if (dir === 6 || dir === 7 || dir === 8) {
      ind = 9 + Math.floor(Math.random() * 3);
    } else {
      ind = 6 + Math.floor(Math.random() * 3);
    }
    let point = this.getPoints()[ind];
    this.x += p.x - point.x;
    this.y += p.y - point.y;

    return ind;
  };
}

export class LevelGenerator {
  rooms = [];
  levels = [];
  upLadder = null;
  game: Game;
  group: number;

  noCollisions = r => {
    for (const room of this.rooms) {
      if (r.collides(room)) {
        return false;
      }
    }
    return true;
  };

  pickType = r => {
    let type = RoomType.DUNGEON;

    switch (Game.rand(1, 9)) {
      case 1:
        type = RoomType.FOUNTAIN;
        if (r.h <= 5 || (r.w > 9 && r.h > 9)) type = this.pickType(r);
        break;
      case 2:
        type = RoomType.COFFIN;
        if (r.w <= 5) type = this.pickType(r);
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

  shuffle = (a: any[]) => {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  };

  addRooms = (thisNode: N, parent: Room, parentLevel: Level) => {
    let order = this.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

    //console.log(thisNode, parent);

    let points;
    if (parent) points = parent.getPoints();
    for (let i = 0; i < order.length; i++) {
      let ind = order[i];
      for (let j = 0; j < 20; j++) {
        let r = new Room();
        r.x = 0;
        r.y = 0;
        let newLevelDoorDir = Game.rand(1, 12);
        if (parent) {
          switch (thisNode.type) {
            case RoomType.ROPECAVE:
            case RoomType.ROPEHOLE:
              newLevelDoorDir = r.generateAroundPoint(points[ind], ind, 3, 4);
              break;
            case RoomType.DUNGEON:
              newLevelDoorDir = r.generateAroundPoint(
                points[ind],
                ind,
                Game.randTable([5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 9, 9, 10]),
                Game.randTable([5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 9, 9, 10])
              );
              break;
            case RoomType.BIGDUNGEON:
              newLevelDoorDir = r.generateAroundPoint(
                points[ind],
                ind,
                Game.randTable([10, 11, 12, 13]),
                Game.randTable([10, 11, 12, 13])
              );
              break;
            case RoomType.BIGCAVE:
              newLevelDoorDir = r.generateAroundPoint(points[ind], ind, 30, 30);
              break;
            case RoomType.UPLADDER:
            case RoomType.DOWNLADDER:
              newLevelDoorDir = r.generateAroundPoint(points[ind], ind, 5, 5);
              break;
            case RoomType.SPAWNER:
              newLevelDoorDir = r.generateAroundPoint(
                points[ind],
                ind,
                Game.randTable([9, 10, 11]),
                Game.randTable([9, 10, 11])
              );
              break;
            case RoomType.PUZZLE:
            case RoomType.COFFIN:
            case RoomType.FOUNTAIN:
              newLevelDoorDir = r.generateAroundPoint(points[ind], ind, 11, 11);
              break;

            case RoomType.SPIKECORRIDOR:
              newLevelDoorDir = r.generateAroundPoint(
                points[ind],
                ind,
                Game.randTable([3, 5]),
                Game.randTable([9, 10, 11])
              );
              break;
            default:
              newLevelDoorDir = r.generateAroundPoint(points[ind], ind);
              break;
          }
        } else {
          r.x = -2;
          r.y = -2;
          r.w = 7; //ROOM_SIZE[Math.floor(Math.random() * ROOM_SIZE.length)];
          r.h = 7; //ROOM_SIZE[Math.floor(Math.random() * ROOM_SIZE.length)];
          if (thisNode.type === RoomType.UPLADDER) {
            r.w = 5;
            r.h = 5;
          } else if (thisNode.type === RoomType.ROPECAVE) {
            r.w = 3;
            r.h = 4;
          }
        }
        if (this.noCollisions(r)) {
          let level = new Level(
            this.game,
            r.x,
            r.y,
            r.w,
            r.h,
            thisNode.type,
            thisNode.difficulty,
            this.group
          );
          if (level.upLadder) this.upLadder = level.upLadder;
          this.levels.push(level);
          if (parentLevel) {
            let newDoor = level.addDoor(newLevelDoorDir, null);
            newDoor.linkedDoor = parentLevel.addDoor(ind, newDoor);
            r.doors[newLevelDoorDir] = newDoor;
          }
          this.rooms.push(r);
          for (const child of thisNode.children) {
            if (!this.addRooms(child, r, level)) return false;
          }
          return true;
        }
      }
    }
    return false;
  };

  generate = (game: Game, depth: number, cave = false) => {
    let d = depth;
    let node;
    if (cave) {
      node = new N(RoomType.ROPECAVE, d, [
        new N(RoomType.BIGCAVE, d, [
          new N(RoomType.CAVE, d, [new N(RoomType.CAVE, d, [])]),
          new N(RoomType.CAVE, d, [new N(RoomType.CAVE, d, [])]),
          new N(RoomType.CAVE, d, [new N(RoomType.CAVE, d, [])]),
          new N(RoomType.CAVE, d, []),
        ]),
      ]);
    } else {
      if (d == 0) {
        node = new N(RoomType.SHOP, d, [new N(RoomType.DOWNLADDER, d, [])]);
      } else {
        node = new N(RoomType.UPLADDER, d, [
          new N(RoomType.DUNGEON, d, [
            new N(RoomType.DUNGEON, d, [
              new N(RoomType.DUNGEON, d, [
                new N(RoomType.DUNGEON, d, [new N(RoomType.TREASURE, d, [])]),
              ]),
            ]),
          ]),
          new N(RoomType.DUNGEON, d, [
            new N(RoomType.DUNGEON, d, [
              new N(RoomType.DUNGEON, d, [
                new N(RoomType.DUNGEON, d, [
                  new N(RoomType.DUNGEON, d, [new N(RoomType.DOWNLADDER, d, [])]),
                ]),
              ]),
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
      this.rooms.splice(0);
      this.levels.splice(0);
      success = this.addRooms(node, null, null);
    } while (!success);

    this.game.levels = this.game.levels.concat(this.levels);

    if (d != 0) {
      return this.upLadder;
    }
  };
}
