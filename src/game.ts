import { GameConstants } from "./gameConstants";
import { Level } from "./level";
import { Player } from "./player";
import { Door } from "./tile/door";
import { Sound } from "./sound";
import { LevelConstants } from "./levelConstants";
import { LevelGenerator } from "./levelGenerator";
import { BottomDoor } from "./tile/bottomDoor";
import { Input } from "./input";

export enum LevelState {
  IN_LEVEL,
  TRANSITIONING,
  TRANSITIONING_LADDER,
}

export class Game {
  static ctx: CanvasRenderingContext2D;
  prevLevel: Level; // for transitions
  level: Level;
  levels: Array<Level>;
  levelgen: LevelGenerator;
  player: Player;
  levelState: LevelState;
  transitionStartTime: number;
  transitionX: number;
  transitionY: number;
  upwardTransition: boolean;
  transitioningLadder: any;
  screenShakeX: number;
  screenShakeY: number;
  static tileset: HTMLImageElement;
  static objset: HTMLImageElement;
  static mobset: HTMLImageElement;
  static itemset: HTMLImageElement;
  static fxset: HTMLImageElement;
  static inventory: HTMLImageElement;
  static shopset: HTMLImageElement;
  static tilesetShadow: HTMLImageElement;
  static objsetShadow: HTMLImageElement;
  static mobsetShadow: HTMLImageElement;

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
      Game.inventory.src = "res/inventory.png";
      Game.shopset = new Image();
      Game.shopset.src = "res/shopset.png";
      Game.tilesetShadow = new Image();
      Game.tilesetShadow.src = "res/tilesetShadow.png";
      Game.objsetShadow = new Image();
      Game.objsetShadow.src = "res/objsetShadow.png";
      Game.mobsetShadow = new Image();
      Game.mobsetShadow.src = "res/mobsetShadow.png";

      Sound.loadSounds();
      Sound.playMusic(); // loops forever

      this.player = new Player(this, 0, 0);
      this.levels = Array<Level>();
      this.levelgen = new LevelGenerator();
      this.levelgen.generate(this, 0);
      this.level = this.levels[0];
      this.level.enterLevel();

      this.levelState = LevelState.IN_LEVEL;

      setInterval(this.run, 1000.0 / GameConstants.FPS);
      this.onResize();
      window.addEventListener("resize", this.onResize);
    });
  }

  changeLevel = (newLevel: Level) => {
    this.level.exitLevel();
    this.level = newLevel;
    this.level.enterLevel();
  };

  changeLevelThroughLadder = (ladder: any) => {
    this.levelState = LevelState.TRANSITIONING_LADDER;
    this.transitionStartTime = Date.now();

    this.prevLevel = this.level;
    this.level.exitLevel();
    this.level = ladder.level;
    this.transitioningLadder = ladder;
  };

  changeLevelThroughDoor = (door: any) => {
    this.levelState = LevelState.TRANSITIONING;
    this.transitionStartTime = Date.now();

    this.transitionX = this.player.x;
    this.transitionY = this.player.y;

    this.prevLevel = this.level;
    this.level.exitLevel();
    this.level = door.level;
    this.level.enterLevelThroughDoor(door);

    this.transitionX = (this.player.x - this.transitionX) * GameConstants.TILESIZE;
    this.transitionY = (this.player.y - this.transitionY) * GameConstants.TILESIZE;

    this.upwardTransition = false;
    if (door instanceof BottomDoor) this.upwardTransition = true;
  };

  run = () => {
    this.update();
    this.draw();
  };

  update = () => {
    if (
      Input.lastPressTime !== 0 &&
      Date.now() - Input.lastPressTime > GameConstants.KEY_REPEAT_TIME
    ) {
      Input.onKeydown({ repeat: false, keyCode: Input.lastPressKeyCode } as KeyboardEvent);
    }

    if (this.levelState === LevelState.TRANSITIONING) {
      if (Date.now() - this.transitionStartTime >= LevelConstants.LEVEL_TRANSITION_TIME) {
        this.levelState = LevelState.IN_LEVEL;
      }
    }
    if (this.levelState === LevelState.TRANSITIONING_LADDER) {
      if (Date.now() - this.transitionStartTime >= LevelConstants.LEVEL_TRANSITION_TIME_LADDER) {
        this.levelState = LevelState.IN_LEVEL;
      }
    }

    this.player.update();
    this.level.update();
  };

  lerp = (a: number, b: number, t: number): number => {
    return (1 - t) * a + t * b;
  };

  onResize = () => {
    let maxWidthScale = Math.floor(window.innerWidth / GameConstants.WIDTH);
    let maxHeightScale = Math.floor(window.innerHeight / GameConstants.HEIGHT);
    let scale = Math.min(maxWidthScale, maxHeightScale);
    Game.ctx.canvas.setAttribute(
      "style",
      `width: ${GameConstants.WIDTH * scale}px; height: ${GameConstants.HEIGHT * scale}px;
    display: block;
    margin: 0 auto;
  
    image-rendering: optimizeSpeed; /* Older versions of FF          */
    image-rendering: -moz-crisp-edges; /* FF 6.0+                       */
    image-rendering: -webkit-optimize-contrast; /* Safari                        */
    image-rendering: -o-crisp-edges; /* OS X & Windows Opera (12.02+) */
    image-rendering: pixelated; /* Awesome future-browsers       */
  
    -ms-interpolation-mode: nearest-neighbor;`
    );
    //Game.ctx.canvas.width = window.innerWidth;
    //Game.ctx.canvas.height = window.innerHeight;
  };

  shakeScreen = (shakeX: number, shakeY: number) => {
    this.screenShakeX = shakeX;
    this.screenShakeY = shakeY;
  };

  draw = () => {
    Game.ctx.globalAlpha = 1;
    Game.ctx.fillStyle = "black";
    Game.ctx.fillRect(0, 0, GameConstants.WIDTH, GameConstants.HEIGHT);

    if (this.levelState === LevelState.TRANSITIONING) {
      let levelOffsetX = Math.floor(
        this.lerp(
          (Date.now() - this.transitionStartTime) / LevelConstants.LEVEL_TRANSITION_TIME,
          0,
          -this.transitionX
        )
      );
      let levelOffsetY = Math.floor(
        this.lerp(
          (Date.now() - this.transitionStartTime) / LevelConstants.LEVEL_TRANSITION_TIME,
          0,
          -this.transitionY
        )
      );
      let playerOffsetX = levelOffsetX - this.transitionX;
      let playerOffsetY = levelOffsetY - this.transitionY;

      let extraTileLerp = Math.floor(
        this.lerp(
          (Date.now() - this.transitionStartTime) / LevelConstants.LEVEL_TRANSITION_TIME,
          0,
          GameConstants.TILESIZE
        )
      );

      let newLevelOffsetX = playerOffsetX;
      let newLevelOffsetY = playerOffsetY;

      if (this.upwardTransition) {
        levelOffsetY -= extraTileLerp;
        newLevelOffsetY += -extraTileLerp - GameConstants.TILESIZE;
      } else {
        levelOffsetY += extraTileLerp;
        newLevelOffsetY += extraTileLerp + GameConstants.TILESIZE;
      }

      let ditherFrame = Math.floor(
        (7 * (Date.now() - this.transitionStartTime)) / LevelConstants.LEVEL_TRANSITION_TIME
      );

      Game.ctx.translate(levelOffsetX, levelOffsetY);
      this.prevLevel.draw();
      this.prevLevel.drawEntitiesBehindPlayer();
      Game.ctx.translate(-levelOffsetX, -levelOffsetY);
      Game.ctx.translate(levelOffsetX, levelOffsetY);
      this.prevLevel.drawEntitiesInFrontOfPlayer();
      for (
        let x = this.prevLevel.roomX - 1;
        x <= this.prevLevel.roomX + this.prevLevel.width;
        x++
      ) {
        for (
          let y = this.prevLevel.roomY - 1;
          y <= this.prevLevel.roomY + this.prevLevel.height;
          y++
        ) {
          Game.drawFX(7 - ditherFrame, 10, 1, 1, x, y, 1, 1);
        }
      }
      Game.ctx.translate(-levelOffsetX, -levelOffsetY);

      Game.ctx.translate(newLevelOffsetX, newLevelOffsetY);
      this.level.draw();
      this.level.drawEntitiesBehindPlayer();
      this.level.drawEntitiesInFrontOfPlayer();
      for (let x = this.level.roomX - 1; x <= this.level.roomX + this.level.width; x++) {
        for (let y = this.level.roomY - 1; y <= this.level.roomY + this.level.height; y++) {
          Game.drawFX(ditherFrame, 10, 1, 1, x, y, 1, 1);
        }
      }
      Game.ctx.translate(-newLevelOffsetX, -newLevelOffsetY);

      Game.ctx.translate(playerOffsetX, playerOffsetY);
      this.player.draw();
      Game.ctx.translate(-playerOffsetX, -playerOffsetY);

      this.player.drawGUI();
    } else if (this.levelState === LevelState.TRANSITIONING_LADDER) {
      let deadFrames = 6;
      let ditherFrame = Math.floor(
        ((7 * 2 + deadFrames) * (Date.now() - this.transitionStartTime)) /
          LevelConstants.LEVEL_TRANSITION_TIME_LADDER
      );

      if (ditherFrame < 7) {
        this.prevLevel.draw();
        this.prevLevel.drawEntitiesBehindPlayer();
        this.player.draw();
        this.prevLevel.drawEntitiesInFrontOfPlayer();

        for (
          let x = this.prevLevel.roomX - 1;
          x <= this.prevLevel.roomX + this.prevLevel.width;
          x++
        ) {
          for (
            let y = this.prevLevel.roomY - 1;
            y <= this.prevLevel.roomY + this.prevLevel.height;
            y++
          ) {
            Game.drawFX(7 - ditherFrame, 10, 1, 1, x, y, 1, 1);
          }
        }
      } else if (ditherFrame >= 7 + deadFrames) {
        if (this.transitioningLadder) {
          this.level.enterLevelThroughLadder(this.transitioningLadder);
          this.transitioningLadder = null;
        }

        this.level.draw();
        this.level.drawEntitiesBehindPlayer();
        this.player.draw();
        this.level.drawEntitiesInFrontOfPlayer();
        for (let x = this.level.roomX - 1; x <= this.level.roomX + this.level.width; x++) {
          for (let y = this.level.roomY - 1; y <= this.level.roomY + this.level.height; y++) {
            Game.drawFX(ditherFrame - (7 + deadFrames), 10, 1, 1, x, y, 1, 1);
          }
        }
      }
      this.player.drawGUI();
    } else {
      this.screenShakeX *= -0.8;
      this.screenShakeY *= -0.8;

      Game.ctx.translate(Math.round(this.screenShakeX), Math.round(this.screenShakeY));

      this.level.draw();
      this.level.drawEntitiesBehindPlayer();
      this.player.draw();
      this.level.drawEntitiesInFrontOfPlayer();

      Game.ctx.translate(-Math.round(this.screenShakeX), -Math.round(this.screenShakeY));

      this.level.drawTopLayer();
      this.player.drawTopLayer();
      this.player.drawGUI();
    }

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
    //if (shaded) set = Game.tilesetShadow;
    Game.ctx.drawImage(
      set,
      Math.round(sX * GameConstants.TILESIZE),
      Math.round(sY * GameConstants.TILESIZE),
      Math.round(sW * GameConstants.TILESIZE),
      Math.round(sH * GameConstants.TILESIZE),
      Math.round(dX * GameConstants.TILESIZE),
      Math.round(dY * GameConstants.TILESIZE),
      Math.round(dW * GameConstants.TILESIZE),
      Math.round(dH * GameConstants.TILESIZE)
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
    //if (shaded) set = Game.objsetShadow;
    Game.ctx.drawImage(
      set,
      Math.round(sX * GameConstants.TILESIZE),
      Math.round(sY * GameConstants.TILESIZE),
      Math.round(sW * GameConstants.TILESIZE),
      Math.round(sH * GameConstants.TILESIZE),
      Math.round(dX * GameConstants.TILESIZE),
      Math.round(dY * GameConstants.TILESIZE),
      Math.round(dW * GameConstants.TILESIZE),
      Math.round(dH * GameConstants.TILESIZE)
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
    //if (shaded) set = Game.mobsetShadow;
    Game.ctx.drawImage(
      set,
      Math.round(sX * GameConstants.TILESIZE),
      Math.round(sY * GameConstants.TILESIZE),
      Math.round(sW * GameConstants.TILESIZE),
      Math.round(sH * GameConstants.TILESIZE),
      Math.round(dX * GameConstants.TILESIZE),
      Math.round(dY * GameConstants.TILESIZE),
      Math.round(dW * GameConstants.TILESIZE),
      Math.round(dH * GameConstants.TILESIZE)
    );
  };

  static drawShop = (
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
      Game.shopset,
      Math.round(sX * GameConstants.TILESIZE),
      Math.round(sY * GameConstants.TILESIZE),
      Math.round(sW * GameConstants.TILESIZE),
      Math.round(sH * GameConstants.TILESIZE),
      Math.round(dX * GameConstants.TILESIZE),
      Math.round(dY * GameConstants.TILESIZE),
      Math.round(dW * GameConstants.TILESIZE),
      Math.round(dH * GameConstants.TILESIZE)
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
      Math.round(sX * GameConstants.TILESIZE),
      Math.round(sY * GameConstants.TILESIZE),
      Math.round(sW * GameConstants.TILESIZE),
      Math.round(sH * GameConstants.TILESIZE),
      Math.round(dX * GameConstants.TILESIZE),
      Math.round(dY * GameConstants.TILESIZE),
      Math.round(dW * GameConstants.TILESIZE),
      Math.round(dH * GameConstants.TILESIZE)
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
      Math.round(sX * GameConstants.TILESIZE),
      Math.round(sY * GameConstants.TILESIZE),
      Math.round(sW * GameConstants.TILESIZE),
      Math.round(sH * GameConstants.TILESIZE),
      Math.round(dX * GameConstants.TILESIZE),
      Math.round(dY * GameConstants.TILESIZE),
      Math.round(dW * GameConstants.TILESIZE),
      Math.round(dH * GameConstants.TILESIZE)
    );
  };
}

let game = new Game();
