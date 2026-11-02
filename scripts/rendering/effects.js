
/**
 * FORGOTTEN KINGDOMS
 * Sistema de efeitos visuais
 */

export class EffectsManager {
    constructor() {
        this.effects = [];
    }

    add(options = {}) {
        const effect = {
            x: options.x || 0,
            y: options.y || 0,

            velocityX: options.velocityX || 0,
            velocityY: options.velocityY || 0,

            color: options.color || "#ffffff",
            radius: options.radius || 4,

            life: options.life || 1000,
            maxLife: options.life || 1000,

            gravity: options.gravity || 0,

            type: options.type || "particle"
        };

        this.effects.push(effect);

        return effect;
    }

    createMagic(x, y, color = "#9b59ff") {
        for (let i = 0; i < 12; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 0.5 + Math.random() * 2;

            this.add({
                x,
                y,
                velocityX: Math.cos(angle) * speed,
                velocityY: Math.sin(angle) * speed,
                color,
                radius: 2 + Math.random() * 3,
                life: 600 + Math.random() * 500,
                type: "magic"
            });
        }
    }

    createExplosion(x, y, color = "#ff9b38") {
        for (let i = 0; i < 24; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1 + Math.random() * 4;

            this.add({
                x,
                y,
                velocityX: Math.cos(angle) * speed,
                velocityY: Math.sin(angle) * speed,
                color,
                radius: 2 + Math.random() * 4,
                life: 400 + Math.random() * 400,
                gravity: 0.02,
                type: "explosion"
            });
        }
    }

    createSmoke(x, y) {
        this.add({
            x,
            y,
            velocityX: (Math.random() - 0.5) * 0.5,
            velocityY: -0.5,
            color: "#777777",
            radius: 5,
            life: 1200,
            type: "smoke"
        });
    }

    update(deltaTime) {
        const delta = Math.min(deltaTime, 100);

        for (const effect of this.effects) {
            effect.x += effect.velocityX * delta * 0.06;
            effect.y += effect.velocityY * delta * 0.06;

            effect.velocityY += effect.gravity * delta * 0.06;

            effect.life -= delta;
        }

        this.effects = this.effects.filter(
            effect => effect.life > 0
        );
    }

    getEffects() {
        return this.effects.map(effect => ({
            x: effect.x,
            y: effect.y,
            radius: effect.radius,
            color: effect.color,
            opacity: Math.max(0, effect.life / effect.maxLife),
            type: effect.type,
            visible: true
        }));
    }

    clear() {
        this.effects = [];
    }
}
