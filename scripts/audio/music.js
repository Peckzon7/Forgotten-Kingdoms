export class Music {
    constructor(audioManager) {
        this.audio = audioManager;
        this.currentMusic = null;
        this.volume = 1;
    }

    play(src, loop = true) {
        if (this.currentMusic === src) return;

        this.stop();

        this.currentMusic = src;

        this.audio.playMusic(src, loop);
    }

    stop() {
        this.audio.stopMusic();
        this.currentMusic = null;
    }

    setVolume(value) {
        this.volume = Math.max(0, Math.min(1, value));

        this.audio.setMusicVolume(this.volume);
    }

    destroy() {
        this.stop();
    }
}