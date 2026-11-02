
/**
 * FORGOTTEN KINGDOMS
 * Sistema principal de renderização 2D
 */

export class Renderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.width = 0;
        this.height = 0;

        this.background = "#263b2d";

        this.resize();

        window.addEventListener("resize", () => {
            this.resize();
        });
    }

    // Ajusta o tamanho da tela
    resize() {
        const rect = this.canvas.getBoundingClientRect();

        this.width = rect.width || 800;
        this.height = rect.height || 450;

        const ratio = Math.min(window.devicePixelRatio || 1, 2);

        this.canvas.width = this.width * ratio;
        this.canvas.height = this.height * ratio;

        this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
        this.ctx.imageSmoothingEnabled = false;
    }

    // Limpa a tela
    clear() {
        this.ctx.fillStyle = this.background;

        this.ctx.fillRect(
            0,
            0,
            this.width,
            this.height
        );
    }

    // Renderização principal
    render(scene) {
        this.clear();

        if (!scene) return;

        const camera = scene.camera || {
            x: 0,
            y: 0,
            zoom: 1
        };

        const zoom = Math.max(0.1, camera.zoom || 1);

        this.ctx.save();

        // Aplicação da câmera
        this.ctx.translate(
            this.width / 2,
            this.height / 2
        );

        this.ctx.scale(zoom, zoom);

        this.ctx.translate(
            -camera.x,
            -camera.y
        );

        // Desenhar cenário
        this.drawTiles(scene.tiles || [], camera);

        // Desenhar personagens e criaturas
        this.drawEntities(scene.entities || []);

        // Desenhar efeitos
        this.drawEffects(scene.effects || []);

        this.ctx.restore();
    }

    // Desenhar terrenos e cenários
    drawTiles(tiles, camera = { x: 0, y: 0, zoom: 1 }) {
        const halfW = this.width / (2 * (camera.zoom || 1)) + 64;
        const halfH = this.height / (2 * (camera.zoom || 1)) + 64;
        const minX = camera.x - halfW, maxX = camera.x + halfW;
        const minY = camera.y - halfH, maxY = camera.y + halfH;
        for (const tile of tiles) {
            if (tile.x + (tile.width || 32) < minX || tile.x > maxX || tile.y + (tile.height || 32) < minY || tile.y > maxY) continue;
            if (!tile) continue;

            if (tile.image && tile.image.complete) {
                this.ctx.drawImage(
                    tile.image,
                    tile.x,
                    tile.y,
                    tile.width || 32,
                    tile.height || 32
                );
            } else {
                this.ctx.fillStyle = tile.color || "#426b3b";

                this.ctx.fillRect(
                    tile.x,
                    tile.y,
                    tile.width || 32,
                    tile.height || 32
                );
            }
        }
    }

    // Desenhar personagens, inimigos e dragões
    drawEntities(entities) {
        const ordered = [...entities].sort(
            (a, b) => a.y - b.y
        );

        for (const entity of ordered) {
            if (!entity || entity.visible === false) continue;

            if (entity.image && entity.image.complete) {
                this.ctx.drawImage(
                    entity.image,
                    entity.x,
                    entity.y,
                    entity.width,
                    entity.height
                );
            } else if (entity.type === "kaelen") {
                this.drawKaelen(entity);
            } else {
                this.drawCreature(entity);
            }

            if (entity.healthBar) {
                this.drawHealthBar(entity);
            }
        }
    }

    // Representação provisória de Kaelen
    drawKaelen(player) {
        const ctx = this.ctx;

        ctx.save();

        ctx.translate(player.x, player.y);

        // Sombra
        ctx.fillStyle = "rgba(0,0,0,0.3)";

        ctx.beginPath();
        ctx.ellipse(16, 29, 10, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Pernas
        ctx.fillStyle = "#302b2a";
        ctx.fillRect(9, 21, 6, 8);
        ctx.fillRect(18, 21, 6, 8);

        // Corpo
        ctx.fillStyle = "#315b79";
        ctx.fillRect(8, 12, 16, 11);

        // Braços
        ctx.fillStyle = "#c49a70";
        ctx.fillRect(5, 14, 4, 9);
        ctx.fillRect(23, 14, 4, 9);

        // Cabeça
        ctx.fillStyle = "#d7a77e";
        ctx.fillRect(11, 4, 11, 9);

        // Cabelo
        ctx.fillStyle = "#49352b";
        ctx.fillRect(10, 2, 13, 4);
        ctx.fillRect(9, 5, 3, 4);

        ctx.restore();
    }

    // Representação provisória de criaturas
    drawCreature(entity) {
        const ctx = this.ctx;

        ctx.fillStyle = entity.color || "#995544";

        ctx.fillRect(
            entity.x,
            entity.y,
            entity.width || 24,
            entity.height || 28
        );
    }

    // Barras de vida
    drawHealthBar(entity) {
        const width = entity.width || 24;

        const health = Math.max(0, entity.health || 0);
        const maxHealth = Math.max(1, entity.maxHealth || 1);

        const percentage = Math.min(1, health / maxHealth);

        this.ctx.fillStyle = "#321f1d";

        this.ctx.fillRect(
            entity.x,
            entity.y - 7,
            width,
            4
        );

        this.ctx.fillStyle = "#65ad57";

        this.ctx.fillRect(
            entity.x,
            entity.y - 7,
            width * percentage,
            4
        );
    }

    // Efeitos visuais e mágicos
    drawEffects(effects) {
        for (const effect of effects) {
            if (!effect || effect.visible === false) continue;

            this.ctx.save();

            this.ctx.globalAlpha = effect.opacity ?? 1;
            this.ctx.fillStyle = effect.color || "#f2d27a";

            if (effect.type === "magic") {
                this.ctx.beginPath();

                this.ctx.arc(
                    effect.x,
                    effect.y,
                    effect.radius || 5,
                    0,
                    Math.PI * 2
                );

                this.ctx.fill();
            } else {
                this.ctx.fillRect(
                    effect.x,
                    effect.y,
                    effect.width || 4,
                    effect.height || 4
                );
            }

            this.ctx.restore();
        }
    }

    // Exibir textos na tela
    drawText(text, x, y, color = "#ffffff") {
        this.ctx.save();

        this.ctx.fillStyle = color;
        this.ctx.font = "14px sans-serif";

        this.ctx.fillText(text, x, y);

        this.ctx.restore();
    }

    // Liberar recursos
    destroy() {
        this.canvas = null;
        this.ctx = null;
    }
}
