import { Game } from "./game";
import { Level, RoomType } from "./level";
import { Door } from "./tile/door";
import { BottomDoor } from "./tile/bottomDoor";

let ROOM_SIZE = [5, 5, 5, 7, 7, 7, 9, 9, 11, 13];

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
    if (this.y > r.y + r.h || this.y + this.h < r.y) return false;
    return true;
  };

  getPoints = () => {
    return [
      { x: this.x, y: this.y - 1 },
      { x: Math.floor(this.x + this.w / 2), y: this.y - 1 },
      { x: this.x + this.w - 1, y: this.y - 1 },
      { x: this.x, y: this.y + this.h },
      { x: Math.floor(this.x + this.w / 2), y: this.y + this.h },
      { x: this.x + this.w - 1, y: this.y + this.h },
    ];
  };

  getDoors = () => {
    return this.doors;
  };

  generateAroundPoint = (p, dir, r) => {
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

  draw = (ctx: CanvasRenderingContext2D) => {
    Game.ctx.fillRect(this.x, this.y, this.w, this.h);
  };
}

export class LevelGenerator {
  MAX_ROOMS = 15;
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

    switch (Game.rand(1, 12)) {
      case 1:
        type = RoomType.FOUNTAIN;
        if (r.h <= 5) type = this.pickType(r);
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

  addRooms = () => {
    for (let i = 0; i < this.rooms.length; i++) {
      if (!this.rooms[i].doneAdding) {
        let order = [1, 4, 0, 2, 3, 5];

        let points = this.rooms[i].getPoints();

        for (let j = 0; j < order.length; j++) {
          let ind = order[j];
          for (let k = 0; k < 5; k++) {
            let r = new Room();
            r.x = 0;
            r.y = 0;
            let newLevelDoorDir = r.generateAroundPoint(points[ind], ind, this.rooms[i]);
            if (this.noCollisions(r)) {
              // TODO: trapdoors
              let type = this.pickType(r);
              let level = new Level(this.game, r.x, r.y, r.w, r.h, type, 0);
              this.game.levels.push(level);
              let newDoor = level.addDoor(newLevelDoorDir, null);
              this.rooms[i].doors[ind] = this.game.levels[i].addDoor(ind, newDoor);
              newDoor.linkedDoor = this.rooms[i].doors[ind];
              r.doors[newLevelDoorDir] = newDoor;
              this.rooms.push(r);
              if (this.rooms.length >= this.MAX_ROOMS) return;
              break;
            }
          }
        }
        this.rooms[i].doneAdding = true;
      }
    }
  };

  constructor(game: Game) {
    this.game = game;
    let r = new Room();
    r.x = 128;
    r.y = 128;
    r.w = ROOM_SIZE[Math.floor(Math.random() * ROOM_SIZE.length)];
    r.h = ROOM_SIZE[Math.floor(Math.random() * ROOM_SIZE.length)];
    let type = this.pickType(r);
    let level = new Level(this.game, r.x, r.y, r.w, r.h, type, 0);
    this.game.levels.push(level);
    this.rooms.push(r);

    while (this.rooms.length < this.MAX_ROOMS) {
      this.addRooms();
    }

    this.rooms.forEach(r => r.draw());
  }
}
