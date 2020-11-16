import { GameConstants } from "./gameConstants";
import { Level } from "./level";
import { Player } from "./player";
import { Door } from "./tile/door";
import { Sound } from "./sound";
import { LevelConstants } from "./levelConstants";
import { LevelGenerator } from "./levelGenerator";
import { BottomDoor } from "./tile/bottomDoor";
import { Input, InputEnum } from "./input";
import { DownLadder } from "./tile/downLadder";
import { SideDoor } from "./tile/sidedoor";
import { io } from "socket.io-client";
import { ServerAddress } from "./serverAddress";

export enum LevelState {
  IN_LEVEL,
  TRANSITIONING,
  TRANSITIONING_LADDER,
}

class ChatMessage {
  message: string;
  timestamp: number;
  constructor(message: string) {
    this.message = message;
    this.timestamp = Date.now();
  }
}

export class Game {
  static ctx: CanvasRenderingContext2D;
  static shImg: HTMLCanvasElement;
  static shCtx: CanvasRenderingContext2D;
  prevLevel: Level; // for transitions
  level: Level;
  levels: Array<Level>;
  levelgen: LevelGenerator;
  localPlayerID: number;
  players: Record<number, Player>;
  levelState: LevelState;
  transitionStartTime: number;
  transitionX: number;
  transitionY: number;
  upwardTransition: boolean;
  sideTransition: boolean;
  sideTransitionDirection: number;
  transitioningLadder: any;
  screenShakeX: number;
  screenShakeY: number;
  socket;
  chat: Array<ChatMessage>;
  chatOpen: boolean;
  chatBox: string;
  chatBoxCursor: number;
  static scale;
  static tileset: HTMLImageElement;
  static objset: HTMLImageElement;
  static mobset: HTMLImageElement;
  static itemset: HTMLImageElement;
  static fxset: HTMLImageElement;
  static shopset: HTMLImageElement;
  static tilesetShadow: HTMLImageElement;
  static objsetShadow: HTMLImageElement;
  static mobsetShadow: HTMLImageElement;
  static fontsheet: HTMLImageElement;

  static text_rendering_canvas = null;
  static readonly letters = "abcdefghijklmnopqrstuvwxyz1234567890,.!?:'()%-";
  static readonly letter_widths = [4, 4, 4, 4, 3, 3, 4, 4, 1, 4, 4, 3, 5, 5, 4, 4, 4, 4, 4, 3, 4, 5, 5, 5, 5, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 2, 1, 1, 4, 1, 1, 2, 2, 5, 3];
  static readonly letter_height = 6;
  static letter_positions = [];

  // [min, max] inclusive
  static rand = (min: number, max: number, rand = Math.random): number => {
    if (max < min) return min;
    return Math.floor(rand() * (max - min + 1) + min);
  };

  static randTable = (table: any[], rand = Math.random): any => {
    return table[Game.rand(0, table.length - 1, rand)];
  };

  constructor() {
    window.addEventListener("load", () => {
      this.socket = io(ServerAddress.address, { 'transports': ['websocket'] });
      this.socket.on('welcome', (seed: string, pid: number) => {
        console.log('welcome');

        this.localPlayerID = pid;
        this.players = {};
        this.players[this.localPlayerID] = new Player(this, 0, 0, true);

        this.levels = Array<Level>();
        this.levelgen = new LevelGenerator();
        this.levelgen.setSeed(seed);
        this.levelgen.generate(this, 0);
        this.level = this.levels[0];
        this.level.enterLevel(this.players[this.localPlayerID]);

        this.screenShakeX = 0;
        this.screenShakeY = 0;

        this.levelState = LevelState.IN_LEVEL;

        setInterval(this.run, 1000.0 / GameConstants.FPS);
        this.onResize();
        window.addEventListener("resize", this.onResize);
      });
      this.socket.on('input', (tickPlayerID: number, input: InputEnum) => {
        if (!(tickPlayerID in this.players)) {
          this.players[tickPlayerID] = new Player(this, 0, 0, false);
          this.levels[0].enterLevel(this.players[tickPlayerID]);
        }
        switch (input) {
          case InputEnum.I:
            this.players[tickPlayerID].iListener();
            break;
          case InputEnum.Q:
            this.players[tickPlayerID].qListener();
            break;
          case InputEnum.LEFT:
            this.players[tickPlayerID].leftListener(false);
            break;
          case InputEnum.RIGHT:
            this.players[tickPlayerID].rightListener(false);
            break;
          case InputEnum.UP:
            this.players[tickPlayerID].upListener(false);
            break;
          case InputEnum.DOWN:
            this.players[tickPlayerID].downListener(false);
            break;
          case InputEnum.SPACE:
            this.players[tickPlayerID].spaceListener();
            break;
        }
      });
      this.socket.on('chat message', (message: string) => {
        this.chat.push(new ChatMessage(message));
      });
      this.socket.on('player connected', (connectedPlayerID: number) => {
        // reset all players
        for (const i in this.players) {
          this.players[i] = new Player(this, 0, 0, false);
          this.levels[0].enterLevel(this.players[i]);
        }
        this.players[connectedPlayerID] = new Player(this, 0, 0, false);
        this.levels[0].enterLevel(this.players[connectedPlayerID]);
        this.level = this.levels[0];
      });
      this.socket.on('player disconnected', (disconnectPlayerID: number) => {
        delete this.players[disconnectPlayerID];
      });

      let canvas = document.getElementById("gameCanvas");
      Game.ctx = (canvas as HTMLCanvasElement).getContext("2d", {
        alpha: false,
      }) as CanvasRenderingContext2D;

      this.chat = [];
      this.chatBox = "";
      this.chatBoxCursor = 0;
      this.chatOpen = false;

      Game.ctx.font = GameConstants.SCRIPT_FONT_SIZE + "px Script";
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
      Game.shopset = new Image();
      Game.shopset.src = "res/shopset.png";
      Game.tilesetShadow = new Image();
      Game.tilesetShadow.src = "res/tilesetShadow.png";
      Game.objsetShadow = new Image();
      Game.objsetShadow.src = "res/objsetShadow.png";
      Game.mobsetShadow = new Image();
      Game.mobsetShadow.src = "res/mobsetShadow.png";
      Game.fontsheet = new Image();
      Game.fontsheet.src = "res/font.png";

      Game.scale = 1;

      Sound.loadSounds();
      Sound.playMusic(); // loops forever

      document.addEventListener(
        "touchstart",
        function (e) {
          if (e.target == canvas) {
            e.preventDefault();
          }
        },
        false
      );
      document.addEventListener(
        "touchend",
        function (e) {
          if (e.target == canvas) {
            e.preventDefault();
          }
        },
        false
      );
      document.addEventListener(
        "touchmove",
        function (e) {
          if (e.target == canvas) {
            e.preventDefault();
          }
        },
        false
      );

      document.addEventListener("touchstart", Input.handleTouchStart, { passive: false });
      document.addEventListener("touchmove", Input.handleTouchMove, { passive: false });
      document.addEventListener("touchend", Input.handleTouchEnd, { passive: false });

      Input.keyDownListener = (key: string) => {
        this.keyDownListener(key);
      }
    });
  }

  keyDownListener = (key: string) => {
    if (!this.chatOpen) {
      switch (key.toUpperCase()) {
        case "C":
          this.chatOpen = true;
          break;
        case "A":
        case "ARROWLEFT":
          this.players[this.localPlayerID].inputHandler(InputEnum.LEFT);
          break;
        case "D":
        case "ARROWRIGHT":
          this.players[this.localPlayerID].inputHandler(InputEnum.RIGHT);
          break;
        case "W":
        case "ARROWUP":
          this.players[this.localPlayerID].inputHandler(InputEnum.UP);
          break;
        case "S":
        case "ARROWDOWN":
          this.players[this.localPlayerID].inputHandler(InputEnum.DOWN);
          break;
        case " ":
          this.players[this.localPlayerID].inputHandler(InputEnum.SPACE);
          break;
        case "I":
          this.players[this.localPlayerID].inputHandler(InputEnum.I);
          break;
        case "Q":
          this.players[this.localPlayerID].inputHandler(InputEnum.Q);
          break;
      }
    }
    else {
      if (key.length === 1) {
        this.chatBox = this.chatBox.substring(0, this.chatBoxCursor) + key + this.chatBox.substring(this.chatBoxCursor, this.chatBox.length);
        this.chatBoxCursor += 1;
      }
      else {
        switch (key) {
          case "Backspace":
            this.chatBox = this.chatBox.substring(0, this.chatBoxCursor - 1) + this.chatBox.substring(this.chatBoxCursor, this.chatBox.length);
            this.chatBoxCursor = Math.max(0, this.chatBoxCursor - 1);
            break;
          case "Delete":
            this.chatBox = this.chatBox.substring(0, this.chatBoxCursor) + this.chatBox.substring(this.chatBoxCursor + 1, this.chatBox.length);
            break;
          case "ArrowLeft":
            this.chatBoxCursor = Math.max(0, this.chatBoxCursor - 1);
            break;
          case "ArrowRight":
            this.chatBoxCursor = Math.min(this.chatBox.length, this.chatBoxCursor + 1);
            break;
          case "Enter":
            if (this.chatBox.length > 0)
              this.socket.emit('chat message', this.chatBox);
            this.chatBox = "";
            this.chatBoxCursor = 0;
            this.chatOpen = false;
            break;
          case "Escape":
            this.chatOpen = false;
            break;
        }
      }
    }
  };

  changeLevel = (player: Player, newLevel: Level) => {
    if (this.players[this.localPlayerID] === player) {
      //this.level.exitLevel();
      this.level = newLevel;
    }
    newLevel.enterLevel(player);

    return this.levels.indexOf(newLevel);
  };

  changeLevelThroughLadder = (player: Player, ladder: any) => {
    if (ladder instanceof DownLadder) ladder.generate();

    if (this.players[this.localPlayerID] === player) {
      this.levelState = LevelState.TRANSITIONING_LADDER;
      this.transitionStartTime = Date.now();
      this.transitioningLadder = ladder;
    } else {
      this.level.enterLevelThroughLadder(player, ladder.linkedLadder); // since it's not a local player, don't wait for transition
    }

    return this.levels.indexOf(ladder.linkedLadder.level);
  };

  changeLevelThroughDoor = (player: Player, door: any, side?: number) => {
    if (this.players[this.localPlayerID] === player) {
      this.levelState = LevelState.TRANSITIONING;
      this.transitionStartTime = Date.now();

      this.transitionX = this.players[this.localPlayerID].x;
      this.transitionY = this.players[this.localPlayerID].y;

      this.prevLevel = this.level;
      //this.level.exitLevel();
      this.level = door.level;
      door.level.enterLevelThroughDoor(player, door, side);

      this.transitionX = (this.players[this.localPlayerID].x - this.transitionX) * GameConstants.TILESIZE;
      this.transitionY = (this.players[this.localPlayerID].y - this.transitionY) * GameConstants.TILESIZE;

      this.upwardTransition = false;
      this.sideTransition = false;
      this.sideTransitionDirection = side;
      if (door instanceof SideDoor) this.sideTransition = true;
      else if (door instanceof BottomDoor) this.upwardTransition = true;
    } else {
      door.level.enterLevelThroughDoor(player, door, side);
    }

    return this.levels.indexOf(door.level);
  };

  run = () => {
    this.update();
    this.draw();
  };

  update = () => {
    Input.checkIsTapHold();

    if (
      Input.lastPressTime !== 0 &&
      Date.now() - Input.lastPressTime > GameConstants.KEY_REPEAT_TIME
    ) {
      Input.onKeydown({ repeat: false, code: Input.lastPressKeyCode } as KeyboardEvent);
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

    for (const i in this.players) {
      this.players[i].update();
      this.levels[this.players[i].levelID].update();

      if (this.players[i].dead) {
        for (const j in this.players) {
          this.players[j].dead = true;
        }
      }
    }
  };

  lerp = (a: number, b: number, t: number): number => {
    return (1 - t) * a + t * b;
  };

  onResize = () => {
    let maxWidthScale = Math.floor(window.innerWidth / GameConstants.DEFAULTWIDTH);
    let maxHeightScale = Math.floor(window.innerHeight / GameConstants.DEFAULTHEIGHT);
    Game.scale = Math.min(maxWidthScale, maxHeightScale);
    if (Game.scale === 0) {
      maxWidthScale = window.innerWidth / GameConstants.DEFAULTWIDTH;
      maxHeightScale = window.innerHeight / GameConstants.DEFAULTHEIGHT;
    }
    Game.scale = Math.min(maxWidthScale, maxHeightScale);

    LevelConstants.SCREEN_W = Math.floor(window.innerWidth / Game.scale / GameConstants.TILESIZE);
    LevelConstants.SCREEN_H = Math.floor(window.innerHeight / Game.scale / GameConstants.TILESIZE);
    GameConstants.WIDTH = LevelConstants.SCREEN_W * GameConstants.TILESIZE;
    GameConstants.HEIGHT = LevelConstants.SCREEN_H * GameConstants.TILESIZE;
    Game.ctx.canvas.setAttribute("width", `${GameConstants.WIDTH}`);
    Game.ctx.canvas.setAttribute("height", `${GameConstants.HEIGHT}`);
    Game.ctx.canvas.setAttribute(
      "style",
      `width: ${GameConstants.WIDTH * Game.scale}px; height: ${GameConstants.HEIGHT * Game.scale}px;
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

  static measureText = (text: string): { width: number, height: number } => {
    let w = 0;
    for (const letter of text.toLowerCase()) {
      if (letter === ' ') w += 4;
      else for (let i = 0; i < Game.letters.length; i++) {
        if (Game.letters[i] === letter) {
          w += Game.letter_widths[i] + 1;
        }
      }
    }
    return { width: w, height: Game.letter_height };
  }

  static fillText = (text: string, x: number, y: number, maxWidth?: number) => {
    x = Math.floor(x);
    y = Math.floor(y);

    if (Game.letter_positions.length === 0) {
      // calculate letter positions
      for (let i = 0; i < Game.letter_widths.length; i++) {
        if (i === 0) Game.letter_positions[0] = 0;
        else Game.letter_positions[i] = Game.letter_positions[i - 1] + Game.letter_widths[i - 1] + 2;
      }
    } else {
      let dimensions = Game.measureText(text);
      if (dimensions.width > 0) {
        if (!Game.text_rendering_canvas) Game.text_rendering_canvas = document.createElement('canvas');
        Game.text_rendering_canvas.width = dimensions.width;
        Game.text_rendering_canvas.height = dimensions.height;
        let bx = Game.text_rendering_canvas.getContext('2d');

        let letter_x = 0;
        for (const letter of text.toLowerCase()) {
          if (letter === ' ') letter_x += 4;
          else for (let i = 0; i < Game.letters.length; i++) {
            if (Game.letters[i] === letter) {
              bx.drawImage(Game.fontsheet, Game.letter_positions[i] + 1, 0, Game.letter_widths[i], Game.letter_height, letter_x, 0, Game.letter_widths[i], Game.letter_height);
              letter_x += Game.letter_widths[i] + 1;
            }
          }
        }
        bx.fillStyle = Game.ctx.fillStyle;
        bx.globalCompositeOperation = "source-in";
        bx.fillRect(0, 0, Game.text_rendering_canvas.width, Game.text_rendering_canvas.height);
        Game.ctx.drawImage(Game.text_rendering_canvas, x, y);
      }
    }
  };

  draw = () => {
    Game.ctx.globalAlpha = 1;
    Game.ctx.fillStyle = this.level.shadeColor;
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

      let playerCX = (this.players[this.localPlayerID].x - this.players[this.localPlayerID].drawX + 0.5) * GameConstants.TILESIZE;
      let playerCY = (this.players[this.localPlayerID].y - this.players[this.localPlayerID].drawY + 0.5) * GameConstants.TILESIZE;

      Game.ctx.translate(
        -Math.round(playerCX + playerOffsetX - 0.5 * GameConstants.WIDTH),
        -Math.round(playerCY + playerOffsetY - 0.5 * GameConstants.HEIGHT)
      );

      let extraTileLerp = Math.floor(
        this.lerp(
          (Date.now() - this.transitionStartTime) / LevelConstants.LEVEL_TRANSITION_TIME,
          0,
          GameConstants.TILESIZE
        )
      );

      let newLevelOffsetX = playerOffsetX;
      let newLevelOffsetY = playerOffsetY;

      if (this.sideTransition) {
        if (this.sideTransitionDirection > 0) {
          levelOffsetX += extraTileLerp;
          newLevelOffsetX += extraTileLerp + GameConstants.TILESIZE;
        } else {
          levelOffsetX -= extraTileLerp;
          newLevelOffsetX -= extraTileLerp + GameConstants.TILESIZE;
        }
      } else if (this.upwardTransition) {
        levelOffsetY -= extraTileLerp;
        newLevelOffsetY -= extraTileLerp + GameConstants.TILESIZE;
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
      for (let i in this.players) if (this.prevLevel === this.levels[this.players[i].levelID] && this.players[i] !== this.players[this.localPlayerID]) this.players[i].draw();
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
      for (let i in this.players) if (this.level === this.levels[this.players[i].levelID] && this.players[i] !== this.players[this.localPlayerID]) this.players[i].draw();
      this.level.drawEntitiesInFrontOfPlayer();
      for (let x = this.level.roomX - 1; x <= this.level.roomX + this.level.width; x++) {
        for (let y = this.level.roomY - 1; y <= this.level.roomY + this.level.height; y++) {
          Game.drawFX(ditherFrame, 10, 1, 1, x, y, 1, 1);
        }
      }
      Game.ctx.translate(-newLevelOffsetX, -newLevelOffsetY);

      Game.ctx.translate(playerOffsetX, playerOffsetY);
      this.players[this.localPlayerID].draw();
      Game.ctx.translate(-playerOffsetX, -playerOffsetY);

      Game.ctx.translate(newLevelOffsetX, newLevelOffsetY);
      this.level.drawShade();
      this.level.drawOverShade();
      Game.ctx.translate(-newLevelOffsetX, -newLevelOffsetY);

      Game.ctx.translate(
        Math.round(playerCX + playerOffsetX - 0.5 * GameConstants.WIDTH),
        Math.round(playerCY + playerOffsetY - 0.5 * GameConstants.HEIGHT)
      );

      this.players[this.localPlayerID].drawGUI();
      for (const i in this.players) this.players[i].updateDrawXY();
    } else if (this.levelState === LevelState.TRANSITIONING_LADDER) {
      let playerCX = (this.players[this.localPlayerID].x - this.players[this.localPlayerID].drawX + 0.5) * GameConstants.TILESIZE;
      let playerCY = (this.players[this.localPlayerID].y - this.players[this.localPlayerID].drawY + 0.5) * GameConstants.TILESIZE;

      Game.ctx.translate(
        -Math.round(playerCX - 0.5 * GameConstants.WIDTH),
        -Math.round(playerCY - 0.5 * GameConstants.HEIGHT)
      );

      let deadFrames = 6;
      let ditherFrame = Math.floor(
        ((7 * 2 + deadFrames) * (Date.now() - this.transitionStartTime)) /
        LevelConstants.LEVEL_TRANSITION_TIME_LADDER
      );

      if (ditherFrame < 7) {
        this.level.draw();
        this.level.drawEntitiesBehindPlayer();
        for (let i in this.players) if (this.level === this.levels[this.players[i].levelID]) this.players[i].draw();
        this.level.drawEntitiesInFrontOfPlayer();
        this.level.drawShade();
        this.level.drawOverShade();

        for (let x = this.level.roomX - 1; x <= this.level.roomX + this.level.width; x++) {
          for (let y = this.level.roomY - 1; y <= this.level.roomY + this.level.height; y++) {
            Game.drawFX(7 - ditherFrame, 10, 1, 1, x, y, 1, 1);
          }
        }
      } else if (ditherFrame >= 7 + deadFrames) {
        if (this.transitioningLadder) {
          this.prevLevel = this.level;
          this.level.exitLevel();
          this.level = this.transitioningLadder.linkedLadder.level;

          this.level.enterLevelThroughLadder(this.players[this.localPlayerID], this.transitioningLadder.linkedLadder);
          this.transitioningLadder = null;
        }

        this.level.draw();
        this.level.drawEntitiesBehindPlayer();
        for (let i in this.players) if (this.level === this.levels[this.players[i].levelID]) this.players[i].draw();
        this.level.drawEntitiesInFrontOfPlayer();
        this.level.drawShade();
        this.level.drawOverShade();
        for (let x = this.level.roomX - 1; x <= this.level.roomX + this.level.width; x++) {
          for (let y = this.level.roomY - 1; y <= this.level.roomY + this.level.height; y++) {
            Game.drawFX(ditherFrame - (7 + deadFrames), 10, 1, 1, x, y, 1, 1);
          }
        }
      }
      Game.ctx.translate(
        Math.round(playerCX - 0.5 * GameConstants.WIDTH),
        Math.round(playerCY - 0.5 * GameConstants.HEIGHT)
      );

      this.players[this.localPlayerID].drawGUI();
      for (const i in this.players) this.players[i].updateDrawXY();
    } else {
      this.screenShakeX *= -0.8;
      this.screenShakeY *= -0.8;

      let playerDrawX = this.players[this.localPlayerID].drawX;
      let playerDrawY = this.players[this.localPlayerID].drawY;

      Game.ctx.translate(
        -Math.round(
          (this.players[this.localPlayerID].x - playerDrawX + 0.5) * GameConstants.TILESIZE -
          0.5 * GameConstants.WIDTH -
          this.screenShakeX
        ),
        -Math.round(
          (this.players[this.localPlayerID].y - playerDrawY + 0.5) * GameConstants.TILESIZE -
          0.5 * GameConstants.HEIGHT -
          this.screenShakeY
        )
      );

      this.level.draw();
      this.level.drawEntitiesBehindPlayer();
      for (let i in this.players) if (this.level === this.levels[this.players[i].levelID]) this.players[i].draw();
      this.level.drawEntitiesInFrontOfPlayer();
      this.level.drawShade();
      this.level.drawOverShade();
      this.players[this.localPlayerID].drawTopLayer();

      Game.ctx.translate(
        Math.round(
          (this.players[this.localPlayerID].x - playerDrawX + 0.5) * GameConstants.TILESIZE -
          0.5 * GameConstants.WIDTH -
          this.screenShakeX
        ),
        Math.round(
          (this.players[this.localPlayerID].y - playerDrawY + 0.5) * GameConstants.TILESIZE -
          0.5 * GameConstants.HEIGHT -
          this.screenShakeY
        )
      );

      this.level.drawTopLayer();
      this.players[this.localPlayerID].drawGUI();
      for (const i in this.players) this.players[i].updateDrawXY();
    }

    // draw chat
    let CHAT_X = 10;
    let CHAT_BOTTOM_Y = GameConstants.HEIGHT - Game.letter_height - 14
    let CHAT_OPACITY = 0.5;
    if (this.chatOpen) {
      Game.ctx.fillStyle = "black";
      Game.ctx.globalAlpha = 0.5;
      Game.ctx.fillRect(0, 0, GameConstants.WIDTH, GameConstants.HEIGHT);

      Game.ctx.globalAlpha = 1;
      Game.ctx.fillStyle = "white";
      Game.fillText(this.chatBox, CHAT_X, CHAT_BOTTOM_Y);
      let cursorX = Game.measureText(this.chatBox.substring(0, this.chatBoxCursor)).width;
      Game.ctx.fillRect(CHAT_X + cursorX, CHAT_BOTTOM_Y, 1, Game.letter_height);
    }
    for (let i = 0; i < this.chat.length; i++) {
      Game.ctx.fillStyle = "white";
      let y = CHAT_BOTTOM_Y - (this.chat.length - 1 - i) * (Game.letter_height + 1);
      if (this.chatOpen) y -= Game.letter_height + 1;

      let age = Date.now() - this.chat[i].timestamp;
      if (this.chatOpen) {
        Game.ctx.globalAlpha = 1;
      }
      else {
        if (age <= GameConstants.CHAT_APPEAR_TIME) {
          Game.ctx.globalAlpha = CHAT_OPACITY;
        } else if (age <= GameConstants.CHAT_APPEAR_TIME + GameConstants.CHAT_FADE_TIME) {
          Game.ctx.globalAlpha = CHAT_OPACITY * (1 - ((age - GameConstants.CHAT_APPEAR_TIME) / GameConstants.CHAT_FADE_TIME));
        } else {
          Game.ctx.globalAlpha = 0;
        }
      }
      Game.fillText(this.chat[i].message, CHAT_X, y);
    }

    // game version
    Game.ctx.globalAlpha = 0.1;
    Game.ctx.fillStyle = LevelConstants.LEVEL_TEXT_COLOR;
    Game.ctx.font = GameConstants.SCRIPT_FONT_SIZE + "px Script";
    Game.ctx.textBaseline = "top";
    Game.fillText(
      GameConstants.VERSION,
      GameConstants.WIDTH - Game.measureText(GameConstants.VERSION).width - 1,
      1
    );
    Game.ctx.globalAlpha = 1;
  };

  drawSoftVis1x1 = (
    set: HTMLImageElement,
    sX: number,
    sY: number,
    sW: number,
    sH: number,
    dX: number,
    dY: number,
    levelX: number,
    levelY: number
  ) => {
    if (Game.shImg === undefined) {
      Game.shImg = document.createElement("canvas");
      Game.shCtx = Game.shImg.getContext("2d");
      Game.shImg.width = GameConstants.TILESIZE * 2;
      Game.shImg.height = GameConstants.TILESIZE * 2;
    }

    Game.shCtx.clearRect(0, 0, Game.shImg.width, Game.shImg.height);

    Game.shCtx.globalCompositeOperation = "source-over";
    Game.shCtx.drawImage(
      set,
      Math.round(sX * GameConstants.TILESIZE),
      Math.round(sY * GameConstants.TILESIZE),
      Math.round(sW * GameConstants.TILESIZE),
      Math.round(sH * GameConstants.TILESIZE),
      0,
      0,
      GameConstants.TILESIZE,
      GameConstants.TILESIZE
    );

    Game.shCtx.globalCompositeOperation = "multiply";
    Game.shCtx.fillStyle = "black";
    for (let xx = 0; xx < 1; xx += 0.25) {
      for (let yy = 0; yy < 1; yy += 0.25) {
        Game.shCtx.globalAlpha =
          (1 - xx) *
          (1 - yy) *
          0.25 *
          (this.level.softVis[levelX][levelY] +
            this.level.softVis[levelX - 1][levelY] +
            this.level.softVis[levelX - 1][levelY - 1] +
            this.level.softVis[levelX][levelY - 1]) +
          xx *
          (1 - yy) *
          0.25 *
          (this.level.softVis[levelX + 1][levelY] +
            this.level.softVis[levelX][levelY] +
            this.level.softVis[levelX][levelY - 1] +
            this.level.softVis[levelX + 1][levelY - 1]) +
          (1 - xx) *
          yy *
          0.25 *
          (this.level.softVis[levelX][levelY + 1] +
            this.level.softVis[levelX - 1][levelY + 1] +
            this.level.softVis[levelX - 1][levelY] +
            this.level.softVis[levelX][levelY]) +
          xx *
          yy *
          0.25 *
          (this.level.softVis[levelX + 1][levelY + 1] +
            this.level.softVis[levelX][levelY + 1] +
            this.level.softVis[levelX][levelY] +
            this.level.softVis[levelX + 1][levelY]);
        Game.shCtx.fillRect(
          xx * GameConstants.TILESIZE,
          yy * GameConstants.TILESIZE,
          0.25 * GameConstants.TILESIZE,
          0.25 * GameConstants.TILESIZE
        );
      }
    }
    Game.shCtx.globalAlpha = 1.0;

    Game.shCtx.globalCompositeOperation = "destination-in";
    Game.shCtx.drawImage(
      set,
      Math.round(sX * GameConstants.TILESIZE),
      Math.round(sY * GameConstants.TILESIZE),
      Math.round(sW * GameConstants.TILESIZE),
      Math.round(sH * GameConstants.TILESIZE),
      0,
      0,
      GameConstants.TILESIZE,
      GameConstants.TILESIZE
    );

    Game.ctx.drawImage(
      Game.shImg,
      Math.round(dX * GameConstants.TILESIZE),
      Math.round(dY * GameConstants.TILESIZE)
    );
  };

  static drawHelper = (
    set: HTMLImageElement,
    sX: number,
    sY: number,
    sW: number,
    sH: number,
    dX: number,
    dY: number,
    dW: number,
    dH: number,
    shadeColor = "black",
    shadeOpacity = 0
  ) => {
    if (shadeOpacity > 0) {
      if (Game.shImg === undefined) {
        Game.shImg = document.createElement("canvas");
        Game.shCtx = Game.shImg.getContext("2d");
        Game.shImg.width = GameConstants.TILESIZE * 2;
        Game.shImg.height = GameConstants.TILESIZE * 2;
      }

      Game.shCtx.clearRect(0, 0, Game.shImg.width, Game.shImg.height);

      Game.shCtx.globalCompositeOperation = "source-over";
      Game.shCtx.drawImage(
        set,
        Math.round(sX * GameConstants.TILESIZE),
        Math.round(sY * GameConstants.TILESIZE),
        Math.round(sW * GameConstants.TILESIZE),
        Math.round(sH * GameConstants.TILESIZE),
        0,
        0,
        Math.round(dW * GameConstants.TILESIZE),
        Math.round(dH * GameConstants.TILESIZE)
      );

      Game.shCtx.globalAlpha = shadeOpacity;
      Game.shCtx.fillStyle = shadeColor;
      Game.shCtx.fillRect(0, 0, Game.shImg.width, Game.shImg.height);
      Game.shCtx.globalAlpha = 1.0;

      Game.shCtx.globalCompositeOperation = "destination-in";
      Game.shCtx.drawImage(
        set,
        Math.round(sX * GameConstants.TILESIZE),
        Math.round(sY * GameConstants.TILESIZE),
        Math.round(sW * GameConstants.TILESIZE),
        Math.round(sH * GameConstants.TILESIZE),
        0,
        0,
        Math.round(dW * GameConstants.TILESIZE),
        Math.round(dH * GameConstants.TILESIZE)
      );

      Game.ctx.drawImage(
        Game.shImg,
        Math.round(dX * GameConstants.TILESIZE),
        Math.round(dY * GameConstants.TILESIZE)
      );
    } else {
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
    }
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
    shadeColor = "black",
    shadeOpacity = 0
  ) => {
    //Game.drawHelper(Game.tileset, sX, sY, sW, sH, dX, dY, dW, dH, shadeColor, shadeOpacity);

    Game.ctx.drawImage(
      Game.tileset,
      Math.round(sX * GameConstants.TILESIZE),
      Math.round(sY * GameConstants.TILESIZE),
      Math.round(sW * GameConstants.TILESIZE),
      Math.round(sH * GameConstants.TILESIZE),
      Math.round(dX * GameConstants.TILESIZE),
      Math.round(dY * GameConstants.TILESIZE),
      Math.round(dW * GameConstants.TILESIZE),
      Math.round(dH * GameConstants.TILESIZE)
    );

    Game.ctx.globalAlpha = shadeOpacity;
    Game.ctx.fillStyle = shadeColor;
    Game.ctx.fillRect(
      Math.round(dX * GameConstants.TILESIZE),
      Math.round(dY * GameConstants.TILESIZE),
      Math.round(dW * GameConstants.TILESIZE),
      Math.round(dH * GameConstants.TILESIZE)
    );
    Game.ctx.globalAlpha = 1.0;
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
    shadeColor = "black",
    shadeOpacity = 0
  ) => {
    Game.drawHelper(Game.objset, sX, sY, sW, sH, dX, dY, dW, dH, shadeColor, shadeOpacity);
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
    shadeColor = "black",
    shadeOpacity = 0
  ) => {
    Game.drawHelper(Game.mobset, sX, sY, sW, sH, dX, dY, dW, dH, shadeColor, shadeOpacity);
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
    dH: number,
    shadeColor = "black",
    shadeOpacity = 0
  ) => {
    Game.drawHelper(Game.itemset, sX, sY, sW, sH, dX, dY, dW, dH, shadeColor, shadeOpacity);
  };

  static drawFX = (
    sX: number,
    sY: number,
    sW: number,
    sH: number,
    dX: number,
    dY: number,
    dW: number,
    dH: number,
    shadeColor = "black",
    shadeOpacity = 0
  ) => {
    Game.drawHelper(Game.fxset, sX, sY, sW, sH, dX, dY, dW, dH, shadeColor, shadeOpacity);
  };
}

let game = new Game();
