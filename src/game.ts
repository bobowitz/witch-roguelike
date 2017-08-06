import { GameConstants } from "./gameConstants";
import { Level } from "./level";
import { Player } from "./player";
import { Door } from "./door";

export class Game {
  static ctx: CanvasRenderingContext2D;
  level: Level;
  player: Player;
  static tileset: HTMLImageElement;

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

      Game.tileset = new Image();
      Game.tileset.src = "res/tileset.png";

      this.player = new Player(this, 0, 0);
      this.level = new Level(this, null);

      setInterval(this.run, 1000.0 / GameConstants.FPS);
    });
  }

  changeLevel = (newLevel: Level) => {
    this.level = newLevel;
    this.level.enterLevel();
  };

  changeLevelThroughDoor = (door: Door) => {
    this.level = door.inLevel;
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
    Game.ctx.fillStyle = "#140c1c";
    Game.ctx.fillRect(0, 0, GameConstants.WIDTH, GameConstants.HEIGHT);
    this.level.draw();
    this.player.draw();
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
}

let game = new Game();
