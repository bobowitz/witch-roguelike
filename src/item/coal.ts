import { Item } from "./item";
import { Player } from "../player";
import { Game } from "../game";
import { Level } from "../level";
import { TextParticle } from "../particle/textParticle";
import { GameConstants } from "../gameConstants";

export class Coal extends Item {
  readonly TICKS = 1;
  firstTickCounter: number;
  scaleFactor: number;

  constructor(level: Level, x: number, y: number) {
    super(level, x, y);

    this.tileX = 17;
    this.tileY = 0;

    this.stackable = true;
    this.firstTickCounter = 0;
    this.scaleFactor = 0.2;
  }

  tick = () => {
    if (this.firstTickCounter < this.TICKS) this.firstTickCounter++;
  };

  getDescription = (): string => {
    return "COAL\nA lump of coal.";
  };

  onPickup = (player: Player) => {
    if (this.firstTickCounter < this.TICKS) return;

    if (!this.pickedUp) {
      player.inventory.addItem(this);
      this.level.particles.push(new TextParticle("+1", this.x + 0.5, this.y - 0.5, "#000000", 0));
      this.pickedUp = true;
    }
  };

  draw = () => {
    if (this.firstTickCounter < this.TICKS) return;
    if (this.pickedUp) return;

    if (this.scaleFactor < 1) this.scaleFactor += 0.04;
    else this.scaleFactor = 1;

    Game.drawItem(0, 0, 1, 1, this.x, this.y - 0.25, 1, 1);
    this.frame += (Math.PI * 2) / 60;
    Game.drawItem(
      this.tileX,
      this.tileY,
      1,
      2,
      this.x + this.w * (this.scaleFactor * -0.5 + 0.5),
      this.y + Math.sin(this.frame) * 0.07 - 1.5 + this.h * (this.scaleFactor * -0.5 + 0.5),
      this.w * this.scaleFactor,
      this.h * this.scaleFactor
    );
  };
}
