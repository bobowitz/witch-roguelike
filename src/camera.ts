import { Game } from "./game";
import { GameConstants } from "./gameConstants";

export class Camera {
  static x: number = 0;
  static y: number = 0;
  static targetX: number = 0;
  static targetY: number = 0;

  static update = () => {
    Camera.x += 0.05 * (Camera.targetX - Camera.x);
    Camera.y += 0.05 * (Camera.targetY - Camera.y);
  };

  static cull = (x: number, y: number, w: number, h: number) => {
    // give a tile coord, returns true if off-screen
    return (
      (x + w) * GameConstants.TILESIZE + Math.floor(-Camera.x * GameConstants.TILESIZE) < 0 ||
      x * GameConstants.TILESIZE + Math.floor(-Camera.x * GameConstants.TILESIZE) >
        GameConstants.WIDTH ||
      (y + h) * GameConstants.TILESIZE + Math.floor(-Camera.y * GameConstants.TILESIZE) < 0 ||
      y * GameConstants.TILESIZE + Math.floor(-Camera.y * GameConstants.TILESIZE) >
        GameConstants.HEIGHT
    );
  };

  static translate = () => {
    Game.ctx.translate(
      Math.floor(-Camera.x * GameConstants.TILESIZE),
      Math.floor(-Camera.y * GameConstants.TILESIZE)
    );
  };
  static translateBack = () => {
    Game.ctx.translate(
      Math.ceil(Camera.x * GameConstants.TILESIZE),
      Math.ceil(Camera.y * GameConstants.TILESIZE)
    );
  };
}
