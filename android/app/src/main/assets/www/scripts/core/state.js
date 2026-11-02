import { GAME_CONFIG } from "./config.js";

export function createInitialState() {
    return {
        running: false,

        player: {
            type: "kaelen",

            x: GAME_CONFIG.player.startX,
            y: GAME_CONFIG.player.startY,

            width: GAME_CONFIG.player.width,
            height: GAME_CONFIG.player.height,

            speed: GAME_CONFIG.player.speed,

            health: GAME_CONFIG.player.maxHealth,
            maxHealth: GAME_CONFIG.player.maxHealth,

            mana: GAME_CONFIG.player.maxMana,
            maxMana: GAME_CONFIG.player.maxMana,

            direction: "down",
            moving: false
        },

        camera: {
            x: 0,
            y: 0
        },

        world: {
            tiles: [],
            entities: [],
            effects: []
        },

        progress: {
            currentQuest: null,
            completedQuests: [],
            discoveredLocations: []
        },

        inventory: [],

        equipment: {
            weapon: null,
            shield: null,
            helmet: null,
            armor: null,
            boots: null,
            accessories: []
        },

        flags: {
            paused: false,
            dialogueActive: false,
            combatActive: false
        }
    };
}