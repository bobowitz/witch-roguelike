import { Wall } from "./tile/wall";
import { LevelConstants } from "./levelConstants";
import { Floor } from "./tile/floor";
import { Game } from "./game";
import { Collidable } from "./tile/collidable";
import { Tile } from "./tile/tile";
import { KnightEnemy } from "./enemy/knightEnemy";
import { Enemy } from "./enemy/enemy";
import { Chest } from "./enemy/chest";
import { Item } from "./item/item";
import { GoldenKey } from "./item/goldenKey";
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
import { Arch } from "./tile/arch";
import { SideArch } from "./tile/sideArch";
import { Camera } from "./camera";
import { Bones } from "./tile/bones";
import { DoorLeft } from "./tile/doorLeft";
import { DoorRight } from "./tile/doorRight";
import { Door } from "./tile/door";
import { SideDoor } from "./tile/sideDoor";
import { LayeredTile } from "./tile/layeredTile";
import { CollidableLayeredTile } from "./tile/collidableLayeredTile";

export class Level {
  levelArray: Tile[][];
  visibilityArray: number[][]; // visibility is 0, 1, or 2 (0 = black, 2 = fully lit)
  enemies: Enemy[];
  items: Item[];
  projectiles: Projectile[];
  particles: Particle[];
  game: Game;
  width: number;
  height: number;
  env: number; // which environment is this level?

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

  static randEnv = () => {
    return Game.rand(0, LevelConstants.ENVIRONMENTS - 1);
  };

  private tilegidToTileset = (levelData, gid: number) => {
    for (let i = 0; i < levelData.tilesets.length; i++) {
      if (
        gid >= levelData.tilesets[i].firstgid &&
        (i === levelData.tilesets.length - 1 || gid < levelData.tilesets[i + 1].firstgid)
      ) {
        // if the tile is in the GID range of the ith tileset
        return levelData.tilesets[i];
      }
    }
    return null;
  };

  constructor(game: Game, levelData, env: number) {
    this.game = game;
    this.env = env;

    this.items = Array<Item>();
    this.projectiles = Array<Projectile>();
    this.particles = Array<Particle>();
    this.enemies = Array<Enemy>();

    this.width = levelData.width;
    this.height = levelData.height;

    this.levelArray = [];
    for (let x = 0; x < this.width; x++) {
      this.levelArray[x] = [];
    }
    this.visibilityArray = [];
    for (let x = 0; x < this.width; x++) {
      this.visibilityArray[x] = [];
      for (let y = 0; y < this.height; y++) {
        this.visibilityArray[x][y] = 0;
      }
    }

    let baseLayer = levelData.layers[0].data;
    let enemyLayer = levelData.layers[1].data;
    let itemLayer = levelData.layers[2].data;
    for (let y = 0; y < levelData.height; y++) {
      for (let x = 0; x < levelData.width; x++) {
        /*
        chest
        chest w golden key
        knight
        skull
        wizard
        crate
        player
        */

        // tileID = tile index on tileset + firstGID offset
        // figure out what tileset it's on based on ID range, then subtract out firstGID
        // then run through a case statement to create proper tile

        let tilegid = baseLayer[y * levelData.width + x];
        let tileSourceSet = this.tilegidToTileset(levelData, tilegid);

        if (tileSourceSet !== null) {
          switch (tilegid - tileSourceSet.firstgid) {
            case 1:
              this.levelArray[x][y] = new Floor(this, x, y);
              break;
            case 2:
              this.levelArray[x][y + 1] = new Wall(this, x, y + 1, 0);
              break;
            case 5:
              this.levelArray[x][y + 1] = new Wall(this, x, y + 1, 1);
              break;
            case 11:
              this.levelArray[x][y] = new Spike(this, x, y);
              break;
            case 14:
              //this.levelArray[x][y] = new StairUp(this, x, y);
              break;
            case 16:
              this.levelArray[x][y] = new SideArch(this, x, y);
              break;
            case 17:
              this.levelArray[x][y] = new Arch(this, x, y);
              break;
            case 20:
              this.levelArray[x][y + 1] = new DoorLeft(this, x, y + 1);
              break;
            case 52:
              this.levelArray[x][y] = new Door(this, x, y);
              break;
            case 25:
              this.levelArray[x][y + 1] = new SideDoor(this, x, y + 1);
              break;
            case 22:
              this.levelArray[x][y + 1] = new DoorRight(this, x, y + 1);
              break;
          }
        }
        if (!this.levelArray[x][y]) {
          this.levelArray[x][y] = new Floor(this, x, y);
        }

        let mobgid = enemyLayer[y * levelData.width + x];
        let mobSourceSet = this.tilegidToTileset(levelData, mobgid);

        if (mobSourceSet !== null) {
          switch (mobgid - mobSourceSet.firstgid) {
            case 33:
              this.game.player.moveNoSmooth(x, y);
              break;
            case 34:
              this.enemies.push(new SkullEnemy(this, this.game, x, y));
              break;
            case 36:
              this.enemies.push(new KnightEnemy(this, this.game, x, y));
              break;
            case 38:
              this.enemies.push(new WizardEnemy(this, this.game, x, y));
              break;
            case 45:
              this.enemies.push(new Crate(this, this.game, x, y));
              break;
            case 46:
              this.enemies.push(new Barrel(this, this.game, x, y));
              break;
            case 49:
              this.enemies.push(new Chest(this, this.game, x, y));
              break;
          }
        }

        let itemgid = itemLayer[y * levelData.width + x];
        let itemSourceSet = this.tilegidToTileset(levelData, itemgid);

        if (itemSourceSet !== null) {
          switch (itemgid - itemSourceSet.firstgid) {
            case 38:
              this.enemies.push(new Chest(this, this.game, x, y, new GoldenKey(x, y)));
              break;
          }
        }
      }
    }
  }

  exitLevel = () => {
    this.particles.splice(0, this.particles.length);
  };

  updateLevelTextColor = () => {
    LevelConstants.LEVEL_TEXT_COLOR = "white";
    // no more color backgrounds:
    // if (this.env === 3) LevelConstants.LEVEL_TEXT_COLOR = "black";
  };

  dropBonesAt = (x: number, y: number) => {
    if (
      this.levelArray[x][y] instanceof Floor &&
      !(this.levelArray[x][y] instanceof Arch || this.levelArray[x][y] instanceof SideArch)
    ) {
      this.levelArray[x][y] = new Bones(this, x, y);
    }
  };

  enterLevel = () => {
    this.updateLevelTextColor();

    this.updateLighting();

    Camera.x = this.game.player.x - LevelConstants.SCREEN_W * 0.5 + 0.5;
    Camera.y = this.game.player.y - LevelConstants.SCREEN_H * 0.5 + 0.5;
  };

  //TODO: stairs n stuff (w/r/t entering level)

  enterLevelThroughDoor = (door: Arch) => {
    this.updateLevelTextColor();
    this.game.player.moveNoSmooth(door.x, door.y + 1);

    this.updateLighting();
  };

  getEmptyTiles = (): Tile[] => {
    let returnVal: Tile[] = [];
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (this.getCollidable(x, y) === null) {
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

    for (let x = 0; x < this.visibilityArray.length; x++) {
      for (let y = 0; y < this.visibilityArray[0].length; y++) {
        this.visibilityArray[x][y] = Math.floor(this.visibilityArray[x][y]);
        if (this.visibilityArray[x][y] === 0 && oldVisibilityArray[x][y]) {
          this.visibilityArray[x][y] = LevelConstants.MIN_VISIBILITY; // once a tile has been viewed, it won't go below MIN_VISIBILITY
        }
      }
    }
  };

  cosTable = [];
  sinTable = [];

  castShadowsAtAngle = (angle: number, radius: number) => {
    if (this.cosTable.length === 0) {
      for (let i = 0; i < 360; i++) {
        this.cosTable[i] = Math.cos(i * Math.PI / 180);
        this.sinTable[i] = Math.sin(i * Math.PI / 180);
      }
    }

    let dx = this.cosTable[angle];
    let dy = this.sinTable[angle];
    let px = this.game.player.x + 0.5;
    let py = this.game.player.y + 0.5;
    let returnVal = 0;
    let i = 0;
    this.visibilityArray[Math.floor(px)][Math.floor(py)] += LevelConstants.VISIBILITY_STEP;
    this.visibilityArray[Math.floor(px)][Math.floor(py)] = Math.min(
      this.visibilityArray[Math.floor(px)][Math.floor(py)],
      2
    );
    for (; i < radius; i++) {
      px += dx;
      py += dy;
      let tile = this.levelArray[Math.floor(px)][Math.floor(py)];

      this.visibilityArray[Math.floor(px)][Math.floor(py)] += LevelConstants.VISIBILITY_STEP;
      this.visibilityArray[Math.floor(px)][Math.floor(py)] = Math.min(
        this.visibilityArray[Math.floor(px)][Math.floor(py)],
        2
      );

      if (
        tile instanceof Wall ||
        tile instanceof DoorLeft ||
        tile instanceof DoorRight ||
        tile instanceof Door
      ) {
        return returnVal;
      }
    }
    return returnVal;
  };

  tick = () => {
    this.game.player.startTick();
    if (this.game.player.armor) this.game.player.armor.tick();
    for (const p of this.projectiles) {
      p.tick();
    }
    for (const e of this.enemies) {
      e.tick();
    }
    this.enemies = this.enemies.filter(e => !e.dead);
    this.game.player.finishTick();
    this.updateLighting();
  };

  update = () => {
    //
  };

  draw = () => {
    Camera.translate();
    for (let x = 0; x < this.levelArray.length; x++) {
      for (let y = 0; y < this.levelArray[0].length; y++) {
        if (this.levelArray[x][y] !== null) {
          this.levelArray[x][y].draw();
        }

        if (Camera.cull(x, y, 1, 1)) continue;

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
    Camera.translateBack();
  };

  drawEntitiesBehindPlayer = () => {
    this.enemies.sort((a, b) => a.y - b.y);
    this.items.sort((a, b) => a.y - b.y);

    Camera.translate();

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
    Camera.translateBack();
  };
  drawEntitiesInFrontOfPlayer = () => {
    Camera.translate();
    for (const e of this.enemies) {
      if (e.y > this.game.player.y && this.visibilityArray[e.x][e.y] > 0) e.draw();
    }
    for (const i of this.items) {
      if (i.y > this.game.player.y && this.visibilityArray[i.x][i.y] > 0) i.draw();
    }
    for (let x = 0; x < this.levelArray.length; x++) {
      for (let y = 0; y < this.levelArray[0].length; y++) {
        if (this.levelArray[x][y] !== null) {
          if (this.levelArray[x][y] instanceof LayeredTile) {
            (this.levelArray[x][y] as LayeredTile).drawCeiling();
          } else if (this.levelArray[x][y] instanceof CollidableLayeredTile) {
            (this.levelArray[x][y] as CollidableLayeredTile).drawCeiling();
          } else {
            continue;
          }
        }

        if (Camera.cull(x, y, 1, 1)) continue;

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
    Camera.translateBack();
  };

  // for stuff rendered on top of the player
  drawTopLayer = () => {
    Camera.translate();
    for (const e of this.enemies) {
      e.drawTopLayer(); // health bars
    }

    for (let x = 0; x < this.levelArray.length; x++) {
      for (let y = 0; y < this.levelArray[0].length; y++) {
        if (this.levelArray[x][y] !== null) this.levelArray[x][y].drawTopLayer();
      }
    }

    this.particles = this.particles.filter(x => !x.dead);
    for (const p of this.particles) {
      p.draw();
    }
    Camera.translateBack();

    // gui stuff
  };
}
