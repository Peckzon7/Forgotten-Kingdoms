export const GAME_CONFIG = Object.freeze({
    title: "Forgotten Kingdoms",

    screen: {
        width: 960,
        height: 540
    },

    world: {
        width: 5000,
        height: 5000,
        tileSize: 32
    },

    player: {
        startX: 2500,
        startY: 2500,
        width: 32,
        height: 40,
        speed: 180,
        maxHealth: 100,
        maxMana: 100
    },

    camera: {
        zoom: 1,
        smoothing: 0.12
    },

    performance: {
        maxDeltaTime: 50
    }
});
export const AUDIO_CONFIG = Object.freeze({ enabled: true, masterVolume: 0.8, musicVolume: 0.55, sfxVolume: 0.8 });
