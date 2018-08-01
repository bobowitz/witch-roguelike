import { Game } from "./game";
import { Level, RoomType } from "./level";
import { Door } from "./tile/door";
import { BottomDoor } from "./tile/bottomDoor";
import { LevelConstants } from "./levelConstants";

let ROOM_SIZE = [5, 5, 7, 7, 9, 11, 11, 11, 13, 13];

class N {
  // Node
  type: RoomType;
  children: N[];

  constructor(type: RoomType, children: N[]) {
    this.type = type;
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
    ];
  };

  getDoors = () => {
    return this.doors;
  };

  generateAroundPoint = (p, dir) => {
    this.x = 0;
    this.y = 0;
    this.w = ROOM_SIZE[Math.floor(Math.random() * ROOM_SIZE.length)];
    this.h = ROOM_SIZE[Math.floor(Math.random() * ROOM_SIZE.length)];

    let ind = 1;
    if (dir === 0 || dir === 1 || dir === 2) {
      ind = 3 + Math.floor(Math.random() * 3);
    } else {
      ind = Math.floor(Math.random() * 3);
    }
    let point = this.getPoints()[ind];
    this.x += p.x - point.x;
    this.y += p.y - point.y;

    return ind;
  };
}

export class LevelGenerator {
  rooms = [];
  game: Game;

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
    let order = this.shuffle([0, 1, 2, 3, 4, 5]);

    //console.log(thisNode, parent);

    let points;
    if (parent) points = parent.getPoints();
    for (let i = 0; i < order.length; i++) {
      let ind = order[i];
      for (let j = 0; j < 20; j++) {
        let r = new Room();
        r.x = 0;
        r.y = 0;
        let newLevelDoorDir = Game.rand(1, 6);
        if (parent) newLevelDoorDir = r.generateAroundPoint(points[ind], ind);
        else {
          r.x = 128;
          r.y = 128;
          r.w = ROOM_SIZE[Math.floor(Math.random() * ROOM_SIZE.length)];
          r.h = ROOM_SIZE[Math.floor(Math.random() * ROOM_SIZE.length)];
        }
        if (this.noCollisions(r)) {
          let level = new Level(this.game, r.x, r.y, r.w, r.h, thisNode.type, 0);
          this.game.levels.push(level);
          if (parentLevel) {
            let newDoor = level.addDoor(newLevelDoorDir, null);
            parentLevel.doors[ind] = parentLevel.addDoor(ind, newDoor);
            newDoor.linkedDoor = parentLevel.doors[ind];
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

  constructor(game: Game) {
    // prettier-ignore
    let node = new N(RoomType.DUNGEON, [
      new N(RoomType.DUNGEON, [
        new N(RoomType.COFFIN, [])
      ]),
      new N(RoomType.DUNGEON, [
        new N(RoomType.DUNGEON, [
          new N(RoomType.DUNGEON, [
            new N(RoomType.FOUNTAIN, [
              new N(RoomType.DUNGEON, [
                new N(RoomType.DUNGEON, [
                  new N(RoomType.KEYROOM, [])
                ]),
              ]),
            ]),
          ]),
          new N(RoomType.GRASS, [
            new N(RoomType.GRASS, [])
          ]),
        ]),
      ]),
    ]);

    this.game = game;

    let success = false;
    do {
      this.rooms.splice(0);
      this.game.levels.splice(0);
      success = this.addRooms(node, null, null);
    } while (!success);
  }
}
