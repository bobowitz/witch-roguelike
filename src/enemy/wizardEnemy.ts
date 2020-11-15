import { Enemy } from "./enemy";
import { LevelConstants } from "../levelConstants";
import { Game } from "../game";
import { Level } from "../level";
import { astar } from "../astarclass";
import { Heart } from "../item/heart";
import { Floor } from "../tile/floor";
import { Bones } from "../tile/bones";
import { DeathParticle } from "../particle/deathParticle";
import { WizardTeleportParticle } from "../particle/wizardTeleportParticle";
import { GameConstants } from "../gameConstants";
import { WizardFireball } from "../projectile/wizardFireball";
import { GreenGem } from "../item/greengem";
import { Player } from "../player";
import { Coin } from "../item/coin";
import { BlueGem } from "../item/bluegem";
import { Random } from "../random";
import { Item } from "../item/item";

enum WizardState {
  idle,
  attack,
  justAttacked,
  teleport,
}

export class WizardEnemy extends Enemy {
  ticks: number;
  state: WizardState;
  frame: number;
  seenPlayer: boolean;
  rand: () => number;
  readonly ATTACK_RADIUS = 5;

  constructor(level: Level, game: Game, x: number, y: number, rand: () => number, drop?: Item) {
    super(level, game, x, y);
    this.ticks = 0;
    this.health = 1;
    this.tileX = 6;
    this.tileY = 0;
    this.frame = 0;
    this.state = WizardState.attack;
    this.seenPlayer = false;
    this.deathParticleColor = "#ffffff";
    this.rand = rand;

    if (drop) this.drop = drop;
    else {
      if (this.rand() < 0.02) this.drop = new BlueGem(this.level, this.x, this.y);
      else this.drop = new Coin(this.level, this.x, this.y);
    }
  }

  hit = (): number => {
    return 1;
  };

  withinAttackingRangeOfPlayer = (): boolean => {
    return (
      (this.x - this.game.players[this.game.localPlayerID].x) ** 2 + (this.y - this.game.players[this.game.localPlayerID].y) ** 2 <=
      this.ATTACK_RADIUS ** 2
    );
  };

  shuffle = a => {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(this.rand() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  };

  tick = () => {
    if (!this.dead) {
      //  && this.level.visibilityArray[this.x][this.y] > 0
      if (this.skipNextTurns > 0) {
        this.skipNextTurns--;
        return;
      }
      if (this.seenPlayer || this.seesPlayer()) {
        this.seenPlayer = true;
        switch (this.state) {
          case WizardState.attack:
            this.tileX = 7;
            if (!this.level.levelArray[this.x - 1][this.y].isSolid()) {
              this.level.projectiles.push(new WizardFireball(this, this.x - 1, this.y));
              if (!this.level.levelArray[this.x - 2][this.y].isSolid()) {
                this.level.projectiles.push(new WizardFireball(this, this.x - 2, this.y));
              }
            }
            if (!this.level.levelArray[this.x + 1][this.y].isSolid()) {
              this.level.projectiles.push(new WizardFireball(this, this.x + 1, this.y));
              if (!this.level.levelArray[this.x + 2][this.y].isSolid()) {
                this.level.projectiles.push(new WizardFireball(this, this.x + 2, this.y));
              }
            }
            if (!this.level.levelArray[this.x][this.y - 1].isSolid()) {
              this.level.projectiles.push(new WizardFireball(this, this.x, this.y - 1));
              if (!this.level.levelArray[this.x][this.y - 2].isSolid()) {
                this.level.projectiles.push(new WizardFireball(this, this.x, this.y - 2));
              }
            }
            if (!this.level.levelArray[this.x][this.y + 1].isSolid()) {
              this.level.projectiles.push(new WizardFireball(this, this.x, this.y + 1));
              if (!this.level.levelArray[this.x][this.y + 2].isSolid()) {
                this.level.projectiles.push(new WizardFireball(this, this.x, this.y + 2));
              }
            }
            this.state = WizardState.justAttacked;
            break;
          case WizardState.justAttacked:
            this.tileX = 6;
            this.state = WizardState.idle;
            break;
          case WizardState.teleport:
            let oldX = this.x;
            let oldY = this.y;
            let min = 100000;
            let bestPos;
            let emptyTiles = this.shuffle(this.level.getEmptyTiles());
            let optimalDist = Game.randTable([2, 2, 3, 3, 3, 3, 3], this.rand);
            for (let t of emptyTiles) {
              let newPos = t;
              let dist =
                Math.abs(newPos.x - this.game.players[this.game.localPlayerID].x) + Math.abs(newPos.y - this.game.players[this.game.localPlayerID].y);
              if (Math.abs(dist - optimalDist) < Math.abs(min - optimalDist)) {
                min = dist;
                bestPos = newPos;
              }
            }
            this.tryMove(bestPos.x, bestPos.y);
            this.drawX = this.x - oldX;
            this.drawY = this.y - oldY;
            this.frame = 0; // trigger teleport animation
            this.level.particles.push(new WizardTeleportParticle(oldX, oldY));
            if (this.withinAttackingRangeOfPlayer()) {
              this.state = WizardState.attack;
            } else {
              this.state = WizardState.idle;
            }
            break;
          case WizardState.idle:
            this.state = WizardState.teleport;
            break;
        }
      }
    }
  };

  draw = () => {
    if (!this.dead) {
      if (this.hasShadow)
        Game.drawMob(
          0,
          0,
          1,
          1,
          this.x - this.drawX,
          this.y - this.drawY,
          1,
          1,
          this.level.shadeColor,
          this.shadeAmount()
        );
      if (this.frame >= 0) {
        Game.drawMob(
          Math.floor(this.frame) + 6,
          2,
          1,
          2,
          this.x,
          this.y - 1.5,
          1,
          2,
          this.level.shadeColor,
          this.shadeAmount()
        );
        this.frame += 0.4;
        if (this.frame > 11) this.frame = -1;
      } else {
        Game.drawMob(
          this.tileX,
          this.tileY,
          1,
          2,
          this.x - this.drawX,
          this.y - 1.5 - this.drawY,
          1,
          2,
          this.level.shadeColor,
          this.shadeAmount()
        );
      }
    }
  };

  kill = () => {
    if (this.level.levelArray[this.x][this.y] instanceof Floor) {
      let b = new Bones(this.level, this.x, this.y);
      b.skin = this.level.levelArray[this.x][this.y].skin;
      this.level.levelArray[this.x][this.y] = b;
    }

    this.dead = true;
    this.level.particles.push(new DeathParticle(this.x, this.y));

    this.dropLoot();
  };

  dropLoot = () => {
    this.drop.level = this.level;
    this.drop.x = this.x;
    this.drop.y = this.y;
    this.level.items.push(this.drop);
  };
}
