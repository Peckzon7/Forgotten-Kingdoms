import { Game } from "./game.js";

let game = null;

export function startGame() {
    const canvas =
        document.getElementById("game-canvas") ||
        document.querySelector("[data-game-canvas]");

    if (!canvas) {
        console.error(
            "Forgotten Kingdoms: canvas do jogo não encontrado."
        );

        return null;
    }

    if (game) {
        game.destroy();
    }

    game = new Game(canvas);
    game.start();

    console.log("Forgotten Kingdoms iniciado!");

    return game;
}

export function getGame() {
    return game;
}

if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", () => {
        startGame();
    });
}