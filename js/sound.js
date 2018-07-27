"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var game_1 = require("./game");
var Sound = (function () {
    function Sound() {
    }
    return Sound;
}());
Sound.loadSounds = function () {
    Sound.footsteps = new Array();
    Sound.footsteps.push(new Audio("res/step1.wav"));
    Sound.footsteps.push(new Audio("res/step2.wav"));
    Sound.footsteps.push(new Audio("res/step3.wav"));
    Sound.footsteps.push(new Audio("res/step4.wav"));
    for (var _i = 0, _a = Sound.footsteps; _i < _a.length; _i++) {
        var f = _a[_i];
        f.volume = 0.1;
    }
    Sound.powerupSound = new Audio("res/powerup.wav");
    Sound.powerupSound.volume = 0.5;
    Sound.healSound = new Audio("res/heal.wav");
    Sound.healSound.volume = 0.5;
    Sound.music = new Audio("res/bewitched.mp3");
};
Sound.footstep = function () {
    var i = game_1.Game.rand(0, Sound.footsteps.length - 1);
    Sound.footsteps[i].play();
    Sound.footsteps[i].currentTime = 0;
};
Sound.powerup = function () {
    Sound.powerupSound.play();
    Sound.powerupSound.currentTime = 0;
};
Sound.heal = function () {
    Sound.healSound.play();
    Sound.healSound.currentTime = 0;
};
Sound.playMusic = function () {
    Sound.music.addEventListener("ended", function () {
        Sound.music.currentTime = 0;
        Sound.music.play();
    }, false);
    Sound.music.play();
};
exports.Sound = Sound;
//# sourceMappingURL=sound.js.map