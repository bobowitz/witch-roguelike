import { Game } from "./game";

export class Sound {
  static footsteps: Array<HTMLAudioElement>;
  static music: HTMLAudioElement;

  static loadSounds = () => {
    Sound.footsteps = new Array<HTMLAudioElement>();
    Sound.footsteps.push(new Audio("res/step1.wav"));
    Sound.footsteps.push(new Audio("res/step2.wav"));
    Sound.footsteps.push(new Audio("res/step3.wav"));
    Sound.footsteps.push(new Audio("res/step4.wav"));
    for (let f of Sound.footsteps) f.volume = 0.1;

    Sound.music = new Audio("res/bewitched.mp3");
  };

  static footstep = () => {
    let i = Game.rand(0, Sound.footsteps.length - 1);
    Sound.footsteps[i].play();
    Sound.footsteps[i].currentTime = 0;
  };

  static playMusic = () => {
    Sound.music.addEventListener(
      "ended",
      () => {
        Sound.music.currentTime = 0;
        Sound.music.play();
      },
      false
    );
    Sound.music.play();
  };
}
