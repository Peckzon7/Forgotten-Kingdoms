export class SoundEffects {
    constructor(audioManager) {
        this.audio = audioManager;

        this.effects = {
            sword: null,
            hit: null,
            magic: null,
            footsteps: null,
            door: null,
            levelUp: null,
            item: null,
            monster: null
        };
    }

    register(name, src) {
        this.effects[name] = src;

        this.audio.loadSound(name, src);
    }

    play(name) {
        if (!this.effects[name]) return;

        this.audio.playSound(name);
    }
}