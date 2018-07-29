import { GameConstants } from "./gameConstants";
import { Level } from "./level";
import { Player } from "./player";
import { Door } from "./tile/door";
import { Sound } from "./sound";
import { LevelConstants } from "./levelConstants";
import { LevelGenerator } from "./levelGenerator";

export class Game {
  static ctx: CanvasRenderingContext2D;
  level: Level;
  levels: Array<Level>;
  levelgen: LevelGenerator;
  player: Player;
  static tileset: HTMLImageElement;
  static objset: HTMLImageElement;
  static mobset: HTMLImageElement;
  static itemset: HTMLImageElement;
  static fxset: HTMLImageElement;
  static inventory: HTMLImageElement;
  static tilesetShadow: HTMLImageElement;
  static objsetShadow: HTMLImageElement;
  static mobsetShadow: HTMLImageElement;
  static itemsetShadow: HTMLImageElement;

  // [min, max] inclusive
  static rand = (min: number, max: number): number => {
    if (max < min) return min;
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  static randTable = (table: any[]): any => {
    return table[Game.rand(0, table.length - 1)];
  };

  constructor() {
    window.addEventListener("load", () => {
      Game.ctx = (document.getElementById("gameCanvas") as HTMLCanvasElement).getContext(
        "2d"
      ) as CanvasRenderingContext2D;

      Game.ctx.font = GameConstants.FONT_SIZE + "px PixelFont";
      Game.ctx.textBaseline = "top";

      Game.tileset = new Image();
      Game.tileset.src = "res/tileset.png";
      Game.objset = new Image();
      Game.objset.src = "res/objset.png";
      Game.mobset = new Image();
      Game.mobset.src = "res/mobset.png";
      Game.itemset = new Image();
      Game.itemset.src = "res/itemset.png";
      Game.fxset = new Image();
      Game.fxset.src = "res/fxset.png";
      Game.inventory = new Image();
      Game.inventory.src = "res/inv.png";
      Game.tilesetShadow = new Image();
      Game.tilesetShadow.src = "res/tilesetShadow.png";
      Game.objsetShadow = new Image();
      Game.objsetShadow.src = "res/objsetShadow.png";
      Game.mobsetShadow = new Image();
      Game.mobsetShadow.src = "res/mobsetShadow.png";
      Game.itemsetShadow = new Image();
      Game.itemsetShadow.src = "res/itemsetShadow.png";

      Sound.loadSounds();
      Sound.playMusic(); // loops forever

      this.player = new Player(this, 0, 0);
      this.levels = Array<Level>();
      let levelgen = new LevelGenerator(this);
      this.level = this.levels[0];
      this.level.enterLevel();

      setInterval(this.run, 1000.0 / GameConstants.FPS);
    });
  }

  changeLevel = (newLevel: Level) => {
    this.level.exitLevel();
    this.level = newLevel;
    this.level.enterLevel();
  };

  changeLevelThroughDoor = (door: any) => {
    this.level.exitLevel();
    this.level = door.level;
    this.level.enterLevelThroughDoor(door);
  };

  run = () => {
    this.update();
    this.draw();
  };

  update = () => {
    this.player.update();
    this.level.update();
  };

  draw = () => {
    this.level.draw();
    this.level.drawEntitiesBehindPlayer();
    this.player.draw();
    this.level.drawEntitiesInFrontOfPlayer();
    this.level.drawTopLayer();
    this.player.drawTopLayer();

    // game version
    Game.ctx.globalAlpha = 0.2;
    Game.ctx.fillStyle = LevelConstants.LEVEL_TEXT_COLOR;
    Game.ctx.fillText(
      GameConstants.VERSION,
      GameConstants.WIDTH - Game.ctx.measureText(GameConstants.VERSION).width - 1,
      GameConstants.HEIGHT - (GameConstants.FONT_SIZE - 1)
    );
    Game.ctx.globalAlpha = 1;
  };

  static drawTile = (
    sX: number,
    sY: number,
    sW: number,
    sH: number,
    dX: number,
    dY: number,
    dW: number,
    dH: number,
    shaded = false
  ) => {
    let set = Game.tileset;
    if (shaded) set = Game.tilesetShadow;
    Game.ctx.drawImage(
      set,
      sX * GameConstants.TILESIZE,
      sY * GameConstants.TILESIZE,
      sW * GameConstants.TILESIZE,
      sH * GameConstants.TILESIZE,
      dX * GameConstants.TILESIZE,
      dY * GameConstants.TILESIZE,
      dW * GameConstants.TILESIZE,
      dH * GameConstants.TILESIZE
    );
  };

  static drawObj = (
    sX: number,
    sY: number,
    sW: number,
    sH: number,
    dX: number,
    dY: number,
    dW: number,
    dH: number,
    shaded = false
  ) => {
    let set = Game.objset;
    if (shaded) set = Game.objsetShadow;
    Game.ctx.drawImage(
      set,
      sX * GameConstants.TILESIZE,
      sY * GameConstants.TILESIZE,
      sW * GameConstants.TILESIZE,
      sH * GameConstants.TILESIZE,
      dX * GameConstants.TILESIZE,
      dY * GameConstants.TILESIZE,
      dW * GameConstants.TILESIZE,
      dH * GameConstants.TILESIZE
    );
  };

  static drawMob = (
    sX: number,
    sY: number,
    sW: number,
    sH: number,
    dX: number,
    dY: number,
    dW: number,
    dH: number,
    shaded = false
  ) => {
    let set = Game.mobset;
    if (shaded) set = Game.mobsetShadow;
    Game.ctx.drawImage(
      set,
      sX * GameConstants.TILESIZE,
      sY * GameConstants.TILESIZE,
      sW * GameConstants.TILESIZE,
      sH * GameConstants.TILESIZE,
      dX * GameConstants.TILESIZE,
      dY * GameConstants.TILESIZE,
      dW * GameConstants.TILESIZE,
      dH * GameConstants.TILESIZE
    );
  };

  static drawItem = (
    sX: number,
    sY: number,
    sW: number,
    sH: number,
    dX: number,
    dY: number,
    dW: number,
    dH: number,
    shaded = false
  ) => {
    let set = Game.itemset;
    if (shaded) set = Game.itemsetShadow;
    Game.ctx.drawImage(
      set,
      sX * GameConstants.TILESIZE,
      sY * GameConstants.TILESIZE,
      sW * GameConstants.TILESIZE,
      sH * GameConstants.TILESIZE,
      dX * GameConstants.TILESIZE,
      dY * GameConstants.TILESIZE,
      dW * GameConstants.TILESIZE,
      dH * GameConstants.TILESIZE
    );
  };

  static drawFX = (
    sX: number,
    sY: number,
    sW: number,
    sH: number,
    dX: number,
    dY: number,
    dW: number,
    dH: number
  ) => {
    Game.ctx.drawImage(
      Game.fxset,
      sX * GameConstants.TILESIZE,
      sY * GameConstants.TILESIZE,
      sW * GameConstants.TILESIZE,
      sH * GameConstants.TILESIZE,
      dX * GameConstants.TILESIZE,
      dY * GameConstants.TILESIZE,
      dW * GameConstants.TILESIZE,
      dH * GameConstants.TILESIZE
    );
  };
}

let game = new Game();
