import { GAME_CONFIG } from "./config.js";

export class GameLoop {
    constructor(update, render) {
        this.updateCallback = update;
        this.renderCallback = render;

        this.running = false;
        this.animationId = null;

        this.lastTime = 0;

        this.frame = this.frame.bind(this);
    }

    start() {
        if (this.running) return;

        this.running = true;
        this.lastTime = 0;

        this.animationId = requestAnimationFrame(this.frame);
    }

    stop() {
        this.running = false;

        if (this.animationId !== null) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    frame(currentTime) {
        if (!this.running) return;

        if (this.lastTime === 0) {
            this.lastTime = currentTime;
        }

        let deltaTime = currentTime - this.lastTime;

        deltaTime = Math.min(
            deltaTime,
            GAME_CONFIG.performance.maxDeltaTime
        );

        this.lastTime = currentTime;

        this.updateCallback(deltaTime);
        this.renderCallback();

        this.animationId = requestAnimationFrame(this.frame);
    }
}