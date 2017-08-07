import { GameConstants } from "./gameConstants";
import { Level } from "./level";
import { Player } from "./player";
import { Door } from "./tile/door";
import { Sound } from "./sound";

export class Game {
  static ctx: CanvasRenderingContext2D;
  level: Level;
  player: Player;
  static tileset: HTMLImageElement;
  static mobset: HTMLImageElement;
  static itemset: HTMLImageElement;

  // [min, max] inclusive
  static rand = (min: number, max: number): number => {
    if (max < min) return min;
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  static randTable = (table: [number]): number => {
    return table[Game.rand(0, table.length - 1)];
  };

  constructor() {
    window.addEventListener("load", () => {
      Game.ctx = (document.getElementById("gameCanvas") as HTMLCanvasElement).getContext(
        "2d"
      ) as CanvasRenderingContext2D;

      Game.ctx.font = "20px PixelFont";
      Game.ctx.textBaseline = "top";

      Game.tileset = new Image();
      Game.tileset.src = "res/tileset.png";
      Game.mobset = new Image();
      Game.mobset.src = "res/mobset.png";
      Game.itemset = new Image();
      Game.itemset.src = "res/itemset.png";

      Sound.loadSounds();

      this.player = new Player(this, 0, 0);
      this.level = new Level(this, null, false, Level.randEnv());
      this.level.enterLevel();

      setInterval(this.run, 1000.0 / GameConstants.FPS);
    });
  }

  changeLevel = (newLevel: Level) => {
    this.level.exitLevel();
    this.level = newLevel;
    this.level.enterLevel();
  };

  changeLevelThroughDoor = (door: Door) => {
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
  };

  static drawTile = (
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
      Game.tileset,
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
    dH: number
  ) => {
    Game.ctx.drawImage(
      Game.mobset,
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
    dH: number
  ) => {
    Game.ctx.drawImage(
      Game.itemset,
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
