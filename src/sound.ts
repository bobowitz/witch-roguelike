import { Game } from "./game";

export class Sound {
  static playerStoneFootsteps: Array<HTMLAudioElement>;
  static enemyFootsteps: Array<HTMLAudioElement>;
  static hitSound: HTMLAudioElement;
  static enemySpawnSound: HTMLAudioElement;
  static chestSounds: Array<HTMLAudioElement>;
  static coinPickupSounds: Array<HTMLAudioElement>;
  static miningSounds: Array<HTMLAudioElement>;
  static breakRockSound: HTMLAudioElement;
  static powerupSound: HTMLAudioElement;
  static hurtSounds: Array<HTMLAudioElement>;
  static healSound: HTMLAudioElement;
  static music: HTMLAudioElement;

  static loadSounds = () => {
    Sound.playerStoneFootsteps = new Array<HTMLAudioElement>();
    [1, 2, 3].forEach(i =>
      Sound.playerStoneFootsteps.push(new Audio("res/SFX/footsteps/stone/footstep" + i + ".wav"))
    );
    for (let f of Sound.playerStoneFootsteps) f.volume = 1.0;

    Sound.enemyFootsteps = new Array<HTMLAudioElement>();
    [1, 2, 3, 4, 5].forEach(i =>
      Sound.enemyFootsteps.push(new Audio("res/SFX/footsteps/enemy/enemyfootstep" + i + ".wav"))
    );
    for (let f of Sound.enemyFootsteps) f.volume = 1.0;

    Sound.hitSound = new Audio("res/SFX/attacks/hit.wav");
    Sound.hitSound.volume = 1.0;

    Sound.enemySpawnSound = new Audio("res/SFX/attacks/enemyspawn.wav");
    Sound.enemySpawnSound.volume = 1.0;

    Sound.chestSounds = new Array<HTMLAudioElement>();
    [1, 2, 3].forEach(i => Sound.chestSounds.push(new Audio("res/SFX/items/chest" + i + ".wav")));
    for (let f of Sound.chestSounds) f.volume = 1.0;

    Sound.coinPickupSounds = new Array<HTMLAudioElement>();
    [1, 2, 3, 4].forEach(i =>
      Sound.coinPickupSounds.push(new Audio("res/SFX/items/coins" + i + ".wav"))
    );
    for (let f of Sound.coinPickupSounds) f.volume = 1.0;

    Sound.miningSounds = new Array<HTMLAudioElement>();
    [1, 2, 3, 4].forEach(i =>
      Sound.miningSounds.push(new Audio("res/SFX/resources/Pickaxe" + i + ".wav"))
    );
    for (let f of Sound.miningSounds) f.volume = 1.0;

    Sound.hurtSounds = new Array<HTMLAudioElement>();
    [1, 2].forEach(i => Sound.hurtSounds.push(new Audio("res/SFX/attacks/hurt" + i + ".wav")));
    for (let f of Sound.hurtSounds) f.volume = 1.0;

    Sound.breakRockSound = new Audio("res/SFX/resources/rockbreak.wav");
    Sound.breakRockSound.volume = 1.0;

    Sound.powerupSound = new Audio("res/powerup.wav");
    Sound.powerupSound.volume = 0.5;

    Sound.healSound = new Audio("res/heal.wav");
    Sound.healSound.volume = 0.5;

    Sound.music = new Audio("res/bewitched.mp3");
  };

  static playerStoneFootstep = () => {
    let f = Game.randTable(Sound.playerStoneFootsteps);
    f.play();
    f.currentTime = 0;
  };

  static enemyFootstep = () => {
    let f = Game.randTable(Sound.enemyFootsteps);
    f.play();
    f.currentTime = 0;
  };

  static hit = () => {
    Sound.hitSound.play();
    Sound.hitSound.currentTime = 0;
  };

  static hurt = () => {
    let f = Game.randTable(Sound.hurtSounds);
    f.play();
    f.currentTime = 0;
  };

  static enemySpawn = () => {
    Sound.enemySpawnSound.play();
    Sound.enemySpawnSound.currentTime = 0;
  };

  static chest = () => {
    let f = Game.randTable(Sound.chestSounds);
    f.play();
    f.currentTime = 0;
  };

  static pickupCoin = () => {
    let f = Game.randTable(Sound.coinPickupSounds);
    f.play();
    f.currentTime = 0;
  };

  static mine = () => {
    let f = Game.randTable(Sound.miningSounds);
    f.play();
    f.currentTime = 0;
  };

  static breakRock = () => {
    Sound.breakRockSound.play();
    Sound.breakRockSound.currentTime = 0;
  };

  static powerup = () => {
    Sound.powerupSound.play();
    Sound.powerupSound.currentTime = 0;
  };

  static heal = () => {
    Sound.healSound.play();
    Sound.healSound.currentTime = 0;
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
    //Sound.music.play();
  };
}
