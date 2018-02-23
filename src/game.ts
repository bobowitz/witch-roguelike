import { GameConstants } from "./gameConstants";
import { Level } from "./level";
import { Player } from "./player";
import { Arch } from "./tile/arch";
import { Sound } from "./sound";
import { LevelConstants } from "./levelConstants";
import { Camera } from "./camera";

export class Game {
  static gl: WebGLRenderingContext;
  static ctx2d: CanvasRenderingContext2D;
  static shaderProgram: WebGLProgram;
  levelData;
  level: Level;
  player: Player;
  static tileset: HTMLImageElement;
  static mobset: HTMLImageElement;
  static itemset: HTMLImageElement;
  static fxset: HTMLImageElement;
  static inventory: HTMLImageElement;
  static textures;
  static positionLocation;
  static positionBuffer;
  static texcoordLocation;
  static texcoordBuffer;
  static matrixLocation;
  static textureLocation;
  static textureMatrixLocation;

  // [min, max] inclusive
  static rand = (min: number, max: number): number => {
    if (max < min) return min;
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  static randTable = (table: any[]): any => {
    return table[Game.rand(0, table.length - 1)];
  };

  createShader = (type, source) => {
    let shader = Game.gl.createShader(type);
    Game.gl.shaderSource(shader, source);
    Game.gl.compileShader(shader);
    let success = Game.gl.getShaderParameter(shader, Game.gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    console.log(Game.gl.getShaderInfoLog(shader));
    Game.gl.deleteShader(shader);
  };

  initGL = () => {
    //<script src="src/shader/shader.frag" id="2d-fragment-shader" type="notjs"></script>

    let shaderScript = document.createElement("script");
    shaderScript.src = "src/shader/shader.frag";

    shaderScript.onload = () => {
      console.log(document.getElementById("2d-fragment-shader"));
    };

    let fragShaderRequest = new XMLHttpRequest();
    fragShaderRequest.onload = () => {
      let vertShaderRequest = new XMLHttpRequest();
      vertShaderRequest.onload = () => {
        this.finishInitGL(vertShaderRequest.responseText, fragShaderRequest.responseText);
      };
      vertShaderRequest.open("GET", "src/shader/shader.vert", true);
      vertShaderRequest.send();
    };
    fragShaderRequest.open("GET", "src/shader/shader.frag", true);
    fragShaderRequest.send();
  };

  finishInitGL = (vertShaderSource: string, fragShaderSource: string) => {
    let vertexShader = this.createShader(Game.gl.VERTEX_SHADER, vertShaderSource);
    let fragmentShader = this.createShader(Game.gl.FRAGMENT_SHADER, fragShaderSource);

    Game.shaderProgram = Game.gl.createProgram();
    Game.gl.attachShader(Game.shaderProgram, vertexShader);
    Game.gl.attachShader(Game.shaderProgram, fragmentShader);
    Game.gl.linkProgram(Game.shaderProgram);
    if (!Game.gl.getProgramParameter(Game.shaderProgram, Game.gl.LINK_STATUS)) {
      console.log(Game.gl.getProgramInfoLog(Game.shaderProgram));
      Game.gl.deleteProgram(Game.shaderProgram);
    }

    // look up where the vertex data needs to go.
    var positionLocation = Game.gl.getAttribLocation(Game.shaderProgram, "a_position");
    var texcoordLocation = Game.gl.getAttribLocation(Game.shaderProgram, "a_texcoord");

    // lookup uniforms
    var matrixLocation = Game.gl.getUniformLocation(Game.shaderProgram, "u_matrix");
    var textureLocation = Game.gl.getUniformLocation(Game.shaderProgram, "u_texture");

    // Create a buffer.
    var positionBuffer = Game.gl.createBuffer();
    Game.gl.bindBuffer(Game.gl.ARRAY_BUFFER, positionBuffer);

    // Put a unit quad in the buffer
    var positions = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
    Game.gl.bufferData(Game.gl.ARRAY_BUFFER, new Float32Array(positions), Game.gl.STATIC_DRAW);

    // Create a buffer for texture coords
    var texcoordBuffer = Game.gl.createBuffer();
    Game.gl.bindBuffer(Game.gl.ARRAY_BUFFER, texcoordBuffer);

    // Put texcoords in the buffer
    var texcoords = [0, 0, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1];
    Game.gl.bufferData(Game.gl.ARRAY_BUFFER, new Float32Array(texcoords), Game.gl.STATIC_DRAW);

    this.resumeInit();
  };

  /* constructor ->
     initGL callbacks to finishInitGL ->
     finishInitGL calls resumeInit ->
     resumeInit callbacks to finishInit ->
     finishInit starts game */
  constructor() {
    window.addEventListener("load", () => {
      let canvas3d = document.getElementById("canvas3d") as HTMLCanvasElement;
      let canvas2d = document.getElementById("canvas2d") as HTMLCanvasElement;
      Game.gl = canvas3d.getContext("webgl") as WebGLRenderingContext;
      Game.ctx2d = canvas2d.getContext("2d") as CanvasRenderingContext2D;

      this.initGL();
    });
  }

  resumeInit = () => {
    Game.ctx2d.font = GameConstants.FONT_SIZE + "px PixelFont";
    Game.ctx2d.textBaseline = "top";

    Game.textures = {};
    let loaded = 0;
    let loadCallback = () => {
      loaded++;
      if (loaded === 5) this.continueInit();
    };
    Game.tileset = new Image();
    Game.tileset.src = "res/castleset.png";
    Game.tileset.onload = loadCallback;
    Game.mobset = new Image();
    Game.mobset.src = "res/mobset.png";
    Game.mobset.onload = loadCallback;
    Game.itemset = new Image();
    Game.itemset.src = "res/itemset.png";
    Game.itemset.onload = loadCallback;
    Game.fxset = new Image();
    Game.fxset.src = "res/fxset.png";
    Game.fxset.onload = loadCallback;
    Game.inventory = new Image();
    Game.inventory.src = "res/inv.png";
    Game.inventory.onload = loadCallback;
  };

  continueInit = () => {
    this.addTexture(Game.tileset);
    this.addTexture(Game.mobset);
    this.addTexture(Game.itemset);
    this.addTexture(Game.fxset);
    this.addTexture(Game.inventory);

    Sound.loadSounds();
    Sound.playMusic(); // loops forever

    let request = new XMLHttpRequest();
    request.onload = () => {
      this.levelData = JSON.parse(request.responseText);
      this.finishInit();
    };
    request.open("GET", "res/castleLevel.json", true);
    request.send();
  };

  finishInit = () => {
    this.player = new Player(this, 0, 0);
    this.level = new Level(this, this.levelData, 0);
    this.level.enterLevel();

    setInterval(this.run, 1000.0 / GameConstants.FPS);
  };

  addTexture = (image: HTMLImageElement) => {
    Game.textures[image.src] = Game.gl.createTexture();
    Game.gl.bindTexture(Game.gl.TEXTURE_2D, Game.textures[image.src]);

    Game.gl.texParameteri(Game.gl.TEXTURE_2D, Game.gl.TEXTURE_WRAP_S, Game.gl.CLAMP_TO_EDGE);
    Game.gl.texParameteri(Game.gl.TEXTURE_2D, Game.gl.TEXTURE_WRAP_T, Game.gl.CLAMP_TO_EDGE);
    Game.gl.texParameteri(Game.gl.TEXTURE_2D, Game.gl.TEXTURE_MIN_FILTER, Game.gl.LINEAR);

    Game.gl.texImage2D(
      Game.gl.TEXTURE_2D,
      0,
      Game.gl.RGBA,
      Game.gl.RGBA,
      Game.gl.UNSIGNED_BYTE,
      image
    );
  };

  changeLevel = (newLevel: Level) => {
    this.level.exitLevel();
    this.level = newLevel;
    this.level.enterLevel();
  };

  changeLevelThroughDoor = (door: Arch) => {
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
    //Game.ctx2d.fillStyle = "black";
    //Game.ctx2d.fillRect(0, 0, GameConstants.WIDTH, GameConstants.HEIGHT);

    Camera.targetX = this.player.x - LevelConstants.SCREEN_W * 0.5 + 0.5;
    Camera.targetY = this.player.y - LevelConstants.SCREEN_H * 0.5 + 0.5;
    Camera.update();
    this.level.draw();
    this.level.drawEntitiesBehindPlayer();
    this.player.draw();
    this.level.drawEntitiesInFrontOfPlayer();
    this.level.drawTopLayer();
    this.player.drawTopLayer();

    // game version
    Game.ctx2d.globalAlpha = 0.2;
    Game.ctx2d.fillStyle = LevelConstants.LEVEL_TEXT_COLOR;
    Game.ctx2d.fillText(
      GameConstants.VERSION,
      GameConstants.WIDTH - Game.ctx2d.measureText(GameConstants.VERSION).width - 1,
      GameConstants.HEIGHT - (GameConstants.FONT_SIZE - 1)
    );
    Game.ctx2d.globalAlpha = 1;
  };

  static drawImageGL = (
    image: HTMLImageElement,
    sX: number,
    sY: number,
    sW: number,
    sH: number,
    dX: number,
    dY: number,
    dW: number,
    dH: number
  ) => {
    let tex = Game.textures[image.src];
    let texWidth = image.width;
    let texHeight = image.height;

    Game.gl.bindTexture(Game.gl.TEXTURE_2D, tex);

    // Tell WebGL to use our shader program pair
    Game.gl.useProgram(Game.shaderProgram);

    // Setup the attributes to pull data from our buffers
    Game.gl.bindBuffer(Game.gl.ARRAY_BUFFER, Game.positionBuffer);
    Game.gl.enableVertexAttribArray(Game.positionLocation);
    Game.gl.vertexAttribPointer(Game.positionLocation, 2, Game.gl.FLOAT, false, 0, 0);
    Game.gl.bindBuffer(Game.gl.ARRAY_BUFFER, Game.texcoordBuffer);
    Game.gl.enableVertexAttribArray(Game.texcoordLocation);
    Game.gl.vertexAttribPointer(Game.texcoordLocation, 2, Game.gl.FLOAT, false, 0, 0);

    // this matirx will convert from pixels to clip space
    var matrix = Game.orthographic(0, Game.gl.canvas.width, Game.gl.canvas.height, 0, -1, 1);

    // this matrix will translate our quad to dX, dY
    matrix = Game.translate(matrix, dX, dY, 0);

    // this matrix will scale our 1 unit quad
    // from 1 unit to texWidth, texHeight units
    matrix = Game.scale(matrix, dW, dH, 1);

    // Set the matrix.
    Game.gl.uniformMatrix4fv(Game.matrixLocation, false, matrix);

    // Because texture coordinates go from 0 to 1
    // and because our texture coordinates are already a unit quad
    // we can select an area of the texture by scaling the unit quad
    // down
    var texMatrix = Game.translation(sX / texWidth, sY / texHeight, 0);
    texMatrix = Game.scale(texMatrix, sW / texWidth, sH / texHeight, 1);

    // Set the texture matrix.
    Game.gl.uniformMatrix4fv(Game.textureMatrixLocation, false, texMatrix);

    // Tell the shader to get the texture from texture unit 0
    Game.gl.uniform1i(Game.textureLocation, 0);

    // draw the quad (2 triangles, 6 vertices)
    Game.gl.drawArrays(Game.gl.TRIANGLES, 0, 6);
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
    if (Camera.cull(dX, dY, dW, dH)) return;
    Game.drawImageGL(
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

  static drawTileNoCull = (
    sX: number,
    sY: number,
    sW: number,
    sH: number,
    dX: number,
    dY: number,
    dW: number,
    dH: number
  ) => {
    Game.drawImageGL(
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
    if (Camera.cull(dX, dY, dW, dH)) return;
    Game.drawImageGL(
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

  static drawMobNoCull = (
    sX: number,
    sY: number,
    sW: number,
    sH: number,
    dX: number,
    dY: number,
    dW: number,
    dH: number
  ) => {
    Game.drawImageGL(
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
    if (Camera.cull(dX, dY, dW, dH)) return;
    Game.drawImageGL(
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

  static drawItemNoCull = (
    sX: number,
    sY: number,
    sW: number,
    sH: number,
    dX: number,
    dY: number,
    dW: number,
    dH: number
  ) => {
    Game.drawImageGL(
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
    if (Camera.cull(dX, dY, dW, dH)) return;
    Game.drawImageGL(
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

  static drawFXNoCull = (
    sX: number,
    sY: number,
    sW: number,
    sH: number,
    dX: number,
    dY: number,
    dW: number,
    dH: number
  ) => {
    Game.drawImageGL(
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

  static scale = function(m, sx, sy, sz, dst?) {
    // This is the optimized verison of
    // return multiply(m, scaling(sx, sy, sz), dst);
    dst = dst || new Float32Array(16);

    dst[0] = sx * m[0 * 4 + 0];
    dst[1] = sx * m[0 * 4 + 1];
    dst[2] = sx * m[0 * 4 + 2];
    dst[3] = sx * m[0 * 4 + 3];
    dst[4] = sy * m[1 * 4 + 0];
    dst[5] = sy * m[1 * 4 + 1];
    dst[6] = sy * m[1 * 4 + 2];
    dst[7] = sy * m[1 * 4 + 3];
    dst[8] = sz * m[2 * 4 + 0];
    dst[9] = sz * m[2 * 4 + 1];
    dst[10] = sz * m[2 * 4 + 2];
    dst[11] = sz * m[2 * 4 + 3];

    if (m !== dst) {
      dst[12] = m[12];
      dst[13] = m[13];
      dst[14] = m[14];
      dst[15] = m[15];
    }

    return dst;
  };

  static translation = function(tx, ty, tz, dst?) {
    dst = dst || new Float32Array(16);

    dst[0] = 1;
    dst[1] = 0;
    dst[2] = 0;
    dst[3] = 0;
    dst[4] = 0;
    dst[5] = 1;
    dst[6] = 0;
    dst[7] = 0;
    dst[8] = 0;
    dst[9] = 0;
    dst[10] = 1;
    dst[11] = 0;
    dst[12] = tx;
    dst[13] = ty;
    dst[14] = tz;
    dst[15] = 1;

    return dst;
  };

  static translate = function(m, tx, ty, tz, dst?) {
    // This is the optimized version of
    // return multiply(m, translation(tx, ty, tz), dst);
    dst = dst || new Float32Array(16);

    var m00 = m[0];
    var m01 = m[1];
    var m02 = m[2];
    var m03 = m[3];
    var m10 = m[1 * 4 + 0];
    var m11 = m[1 * 4 + 1];
    var m12 = m[1 * 4 + 2];
    var m13 = m[1 * 4 + 3];
    var m20 = m[2 * 4 + 0];
    var m21 = m[2 * 4 + 1];
    var m22 = m[2 * 4 + 2];
    var m23 = m[2 * 4 + 3];
    var m30 = m[3 * 4 + 0];
    var m31 = m[3 * 4 + 1];
    var m32 = m[3 * 4 + 2];
    var m33 = m[3 * 4 + 3];

    if (m !== dst) {
      dst[0] = m00;
      dst[1] = m01;
      dst[2] = m02;
      dst[3] = m03;
      dst[4] = m10;
      dst[5] = m11;
      dst[6] = m12;
      dst[7] = m13;
      dst[8] = m20;
      dst[9] = m21;
      dst[10] = m22;
      dst[11] = m23;
    }

    dst[12] = m00 * tx + m10 * ty + m20 * tz + m30;
    dst[13] = m01 * tx + m11 * ty + m21 * tz + m31;
    dst[14] = m02 * tx + m12 * ty + m22 * tz + m32;
    dst[15] = m03 * tx + m13 * ty + m23 * tz + m33;

    return dst;
  };

  static orthographic = function(left, right, bottom, top, near, far, dst?) {
    dst = dst || new Float32Array(16);

    dst[0] = 2 / (right - left);
    dst[1] = 0;
    dst[2] = 0;
    dst[3] = 0;
    dst[4] = 0;
    dst[5] = 2 / (top - bottom);
    dst[6] = 0;
    dst[7] = 0;
    dst[8] = 0;
    dst[9] = 0;
    dst[10] = 2 / (near - far);
    dst[11] = 0;
    dst[12] = (left + right) / (left - right);
    dst[13] = (bottom + top) / (bottom - top);
    dst[14] = (near + far) / (near - far);
    dst[15] = 1;

    return dst;
  };
}

let game = new Game();
