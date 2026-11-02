
/**
 * FORGOTTEN KINGDOMS
 * Sistema de iluminação
 */

export class LightingManager {
    constructor() {
        this.lights = [];

        this.ambientColor = "#ffffff";
        this.ambientIntensity = 0;

        this.enabled = true;
    }

    // Adicionar fonte de luz
    addLight(options = {}) {
        const light = {
            x: options.x || 0,
            y: options.y || 0,

            radius: options.radius || 150,

            color: options.color || "#ffcc77",

            intensity: options.intensity ?? 1,

            type: options.type || "normal",

            flicker: options.flicker || false
        };

        this.lights.push(light);

        return light;
    }

    // Remover fonte de luz
    removeLight(light) {
        this.lights = this.lights.filter(
            item => item !== light
        );
    }

    // Limpar iluminação
    clearLights() {
        this.lights = [];
    }

    // Definir iluminação ambiente
    setAmbient(color, intensity = 0) {
        this.ambientColor = color;

        this.ambientIntensity = Math.max(
            0,
            Math.min(1, intensity)
        );
    }

    // Configurar período do dia
    setTimeOfDay(time) {
        const periods = {
            morning: {
                color: "#ffe7bd",
                intensity: 0.05
            },

            afternoon: {
                color: "#ffffff",
                intensity: 0
            },

            evening: {
                color: "#e99a70",
                intensity: 0.18
            },

            night: {
                color: "#192344",
                intensity: 0.65
            }
        };

        const period = periods[time];

        if (!period) return;

        this.setAmbient(
            period.color,
            period.intensity
        );
    }

    // Renderizar iluminação
    render(ctx, camera, width, height) {
        if (!this.enabled) return;

        ctx.save();

        // Escurecimento ambiente
        if (this.ambientIntensity > 0) {
            ctx.globalAlpha = this.ambientIntensity;

            ctx.fillStyle = this.ambientColor;

            ctx.fillRect(0, 0, width, height);
        }

        // Fontes de luz
        ctx.globalCompositeOperation = "lighter";

        for (const light of this.lights) {
            const screenX =
                width / 2 +
                (light.x - camera.x) * camera.zoom;

            const screenY =
                height / 2 +
                (light.y - camera.y) * camera.zoom;

            const radius = light.radius * camera.zoom;

            const gradient = ctx.createRadialGradient(
                screenX,
                screenY,
                0,
                screenX,
                screenY,
                radius
            );

            gradient.addColorStop(
                0,
                this.toRGBA(light.color, light.intensity)
            );

            gradient.addColorStop(
                0.4,
                this.toRGBA(light.color, light.intensity * 0.3)
            );

            gradient.addColorStop(
                1,
                this.toRGBA(light.color, 0)
            );

            ctx.fillStyle = gradient;

            ctx.beginPath();

            ctx.arc(
                screenX,
                screenY,
                radius,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }

        ctx.restore();
    }

    // Converter cor para RGBA
    toRGBA(color, alpha) {
        const colors = {
            "#ffcc77": [255, 204, 119],
            "#ffffff": [255, 255, 255],
            "#ffe7bd": [255, 231, 189],
            "#e99a70": [233, 154, 112],
            "#192344": [25, 35, 68]
        };

        const rgb = colors[color] || [255, 255, 255];

        return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${Math.max(0, Math.min(1, alpha))})`;
    }

    // Ativar ou desativar
    setEnabled(value) {
        this.enabled = Boolean(value);
    }
}
