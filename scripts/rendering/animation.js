
/**
 * FORGOTTEN KINGDOMS
 * Sistema de animações
 */

export class Animation {
    constructor(options = {}) {
        this.frames = options.frames || [];
        this.frameDuration = options.frameDuration || 120;

        this.currentFrame = 0;
        this.elapsed = 0;

        this.loop = options.loop ?? true;
        this.playing = false;
        this.finished = false;
    }

    play() {
        this.playing = true;
        this.finished = false;
    }

    pause() {
        this.playing = false;
    }

    reset() {
        this.currentFrame = 0;
        this.elapsed = 0;
        this.finished = false;
    }

    stop() {
        this.pause();
        this.reset();
    }

    update(deltaTime) {
        if (!this.playing || this.finished || this.frames.length === 0) {
            return;
        }

        this.elapsed += deltaTime;

        while (this.elapsed >= this.frameDuration) {
            this.elapsed -= this.frameDuration;
            this.currentFrame++;

            if (this.currentFrame >= this.frames.length) {
                if (this.loop) {
                    this.currentFrame = 0;
                } else {
                    this.currentFrame = this.frames.length - 1;
                    this.finished = true;
                    this.playing = false;
                    break;
                }
            }
        }
    }

    getFrame() {
        return this.frames[this.currentFrame] || null;
    }

    isFinished() {
        return this.finished;
    }
}

/**
 * Gerenciador de animações
 */
export class AnimationManager {
    constructor() {
        this.animations = new Map();
        this.activeAnimation = null;
    }

    add(name, animation) {
        this.animations.set(name, animation);
    }

    play(name, restart = false) {
        const animation = this.animations.get(name);

        if (!animation) return;

        if (this.activeAnimation !== animation || restart) {
            if (this.activeAnimation) {
                this.activeAnimation.stop();
            }

            this.activeAnimation = animation;
            animation.reset();
        }

        animation.play();
    }

    update(deltaTime) {
        if (this.activeAnimation) {
            this.activeAnimation.update(deltaTime);
        }
    }

    getCurrentFrame() {
        return this.activeAnimation?.getFrame() || null;
    }

    stop() {
        if (this.activeAnimation) {
            this.activeAnimation.stop();
            this.activeAnimation = null;
        }
    }
}
