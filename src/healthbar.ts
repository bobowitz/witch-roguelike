import { Game } from "./game";

export class HealthBar {
  static draw = (hearts: number, maxHearts: number, x: number, y: number) => {
    let fullHearts = Math.floor(hearts);

    let halfHearts = Math.ceil(hearts - fullHearts);

    let emptyHearts = maxHearts - fullHearts - halfHearts;

    // I wouldn't normally use magic numbers here, but these are hardcoded based on the tileset
    //   (which isn't really parameterizable)
    let width = (9.0 / 16.0) * maxHearts - 1.0 / 16.0;
    let xx = -width / 2;
    for (let i = 0; i < maxHearts; i++) {
      Game.drawFX(0, 24, 0.5, 0.5, x - width / 2, y - 1.5625, 0.5, 0.5);
      xx += 9.0 / 16.0;
    }
  };
}
