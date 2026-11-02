import { AUDIO_CONFIG } from "../core/config.js";

export class AudioManager {
    constructor() {
        this.enabled = AUDIO_CONFIG.enabled;

        this.masterVolume = AUDIO_CONFIG.masterVolume;
        this.musicVolume = AUDIO_CONFIG.musicVolume;
        this.sfxVolume = AUDIO_CONFIG.sfxVolume;

        this.sounds = new Map();
        this.currentMusic = null;
    }

    loadSound(name, src) {
        const audio = new Audio(src);

        audio.preload = "auto";

        this.sounds.set(name, audio);

        return audio;
    }

    playSound(name) {
        if (!this.enabled) return;

        const sound = this.sounds.get(name);

        if (!sound) return;

        const audio = sound.cloneNode();

        audio.volume = Math.min(
            1,
            this.masterVolume * this.sfxVolume
        );

        audio.play().catch(() => {});
    }

    playMusic(src, loop = true) {
        this.stopMusic();

        if (!this.enabled) return;

        const music = new Audio(src);

        music.loop = loop;

        music.volume = Math.min(
            1,
            this.masterVolume * this.musicVolume
        );

        this.currentMusic = music;

        music.play().catch(() => {});
    }

    stopMusic() {
        if (!this.currentMusic) return;

        this.currentMusic.pause();
        this.currentMusic.currentTime = 0;

        this.currentMusic = null;
    }

    setMasterVolume(value) {
        this.masterVolume = this.clamp(value);
        this.updateMusicVolume();
    }

    setMusicVolume(value) {
        this.musicVolume = this.clamp(value);
        this.updateMusicVolume();
    }

    setSfxVolume(value) {
        this.sfxVolume = this.clamp(value);
    }

    updateMusicVolume() {
        if (!this.currentMusic) return;

        this.currentMusic.volume =
            this.masterVolume * this.musicVolume;
    }

    toggleAudio(enabled) {
        this.enabled = enabled;

        if (!enabled) {
            this.stopMusic();
        }
    }

    clamp(value) {
        return Math.max(0, Math.min(1, Number(value) || 0));
    }

    destroy() {
        this.stopMusic();
        this.sounds.clear();
    }
}