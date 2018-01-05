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

  constructor(game: Game, env: number) {
    this.env = env;

    this.items = Array<Item>();
    this.projectiles = Array<Projectile>();
    this.particles = Array<Particle>();
    this.enemies = Array<Enemy>();

    let canvas = document.createElement("canvas");
    canvas.width = Game.levelImage.width;
    canvas.height = Game.levelImage.height;
    canvas
      .getContext("2d")
      .drawImage(Game.levelImage, 0, 0, Game.levelImage.width, Game.levelImage.height);
    let data = canvas
      .getContext("2d")
      .getImageData(0, 0, Game.levelImage.width, Game.levelImage.height).data;

    this.width = Game.levelImage.width;
    this.height = Game.levelImage.height;

    this.game = game;
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

    for (let y = 0; y < Game.levelImage.height; y++) {
      for (let x = 0; x < Game.levelImage.width; x++) {
        let r = data[(x + y * Game.levelImage.width) * 4];
        let g = data[(x + y * Game.levelImage.width) * 4 + 1];
        let b = data[(x + y * Game.levelImage.width) * 4 + 2];

        this.levelArray[x][y] = null;
        if (r === 0 && g === 0 && b === 0) {
          this.levelArray[x][y] = new Wall(this, x, y, 0);
        }
        if (r === 32 && g === 0 && b === 32) {
          this.levelArray[x][y] = new Wall(this, x, y, 1);
        }
        if (r === 128 && g === 64 && b === 0) {
          this.levelArray[x][y] = new Arch(this, x, y);
        }
        if (r === 128 && g === 64 && b === 64) {
          this.levelArray[x][y] = new SideArch(this, x, y);
        }
        if (r === 255 && g === 255 && b === 0) {
          this.levelArray[x][y] = new Floor(this, x, y);
          this.enemies.push(new Chest(this, this.game, x, y));
        }
        if (r === 255 && g === 255 && b === 128) {
          this.levelArray[x][y] = new Floor(this, x, y);
          this.enemies.push(new Chest(this, this.game, x, y, new GoldenKey(x, y)));
        }
        if (r === 255 && g === 0 && b === 0) {
          this.levelArray[x][y] = new Floor(this, x, y);
          this.enemies.push(new KnightEnemy(this, this.game, x, y));
        }
        if (r === 0 && g === 255 && b === 128) {
          this.levelArray[x][y] = new Floor(this, x, y);
          this.enemies.push(new SkullEnemy(this, this.game, x, y));
        }
        if (r === 0 && g === 0 && b === 255) {
          this.levelArray[x][y] = new Floor(this, x, y);
          this.enemies.push(new WizardEnemy(this, this.game, x, y));
        }
        if (r === 255 && g === 64 && b === 0) {
          this.levelArray[x][y] = new Floor(this, x, y);
          this.enemies.push(new Crate(this, this.game, x, y));
        }
        if (r === 255 && g === 255 && b === 255) {
          this.levelArray[x][y] = new Floor(this, x, y);
        }
        if (r === 0 && g === 128 && b === 255) {
          this.levelArray[x][y] = new Floor(this, x, y);
          this.game.player.moveNoSmooth(x, y);
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

  castShadowsAtAngle = (angle: number, radius: number) => {
    let dx = Math.cos(angle * Math.PI / 180);
    let dy = Math.sin(angle * Math.PI / 180);
    let px = this.game.player.x + 0.5;
    let py = this.game.player.y + 0.5;
    let returnVal = 0;
    let i = 0;
    let hitWall = false; // flag for if we already hit a wall. we'll keep scanning and see if there's more walls. if so, light them up!
    this.visibilityArray[Math.floor(px)][Math.floor(py)] += LevelConstants.VISIBILITY_STEP;
    this.visibilityArray[Math.floor(px)][Math.floor(py)] = Math.min(
      this.visibilityArray[Math.floor(px)][Math.floor(py)],
      2
    );
    for (; i < radius; i++) {
      px += dx;
      py += dy;
      let tile = this.levelArray[Math.floor(px)][Math.floor(py)];
      if (tile instanceof Wall && tile.type === 1) {
        return returnVal;
      }

      if (!(tile instanceof Wall) && hitWall) {
        // fun's over, we hit something that wasn't a wall
        return returnVal;
      }

      if (tile instanceof Wall) {
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
          if (!(this.levelArray[x][y] instanceof Wall)) {
            continue;
          }
          (this.levelArray[x][y] as Wall).drawCeiling();
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
