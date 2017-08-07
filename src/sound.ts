import { Game } from "./game";

export class Sound {
  static footsteps: Array<HTMLAudioElement>;

  static loadSounds = () => {
    Sound.footsteps = new Array<HTMLAudioElement>();
    Sound.footsteps.push(new Audio("res/step1.wav"));
    Sound.footsteps.push(new Audio("res/step2.wav"));
    Sound.footsteps.push(new Audio("res/step3.wav"));
    Sound.footsteps.push(new Audio("res/step4.wav"));
  };

  static footstep = () => {
    let i = Game.rand(0, Sound.footsteps.length - 1);
    Sound.footsteps[i].play();
    Sound.footsteps[i].currentTime = 0;
  };
}
