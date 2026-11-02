
/**
 * FORGOTTEN KINGDOMS
 * Sistema de câmera
 */

export class Camera {
    constructor(options = {}) {
        this.x = 0;
        this.y = 0;

        this.zoom = options.zoom || 1;

        this.width = options.width || 800;
        this.height = options.height || 450;

        this.worldWidth = options.worldWidth || 5000;
        this.worldHeight = options.worldHeight || 5000;

        this.smoothing = options.smoothing || 0.08;

        this.target = null;

        this.minZoom = 0.5;
        this.maxZoom = 2.5;
    }

    // Definir personagem acompanhado
    follow(target) {
        this.target = target;
    }

    // Atualizar dimensões da câmera
    resize(width, height) {
        this.width = width;
        this.height = height;
    }

    // Definir tamanho do mundo
    setWorldSize(width, height) {
        this.worldWidth = width;
        this.worldHeight = height;
    }

    // Atualizar zoom
    setZoom(value) {
        this.zoom = Math.max(
            this.minZoom,
            Math.min(this.maxZoom, value)
        );
    }

    // Aproximar a câmera
    zoomIn(amount = 0.1) {
        this.setZoom(this.zoom + amount);
    }

    // Afastar a câmera
    zoomOut(amount = 0.1) {
        this.setZoom(this.zoom - amount);
    }

    // Atualizar posição da câmera
    update() {
        if (!this.target) return;

        const targetX =
            this.target.x + (this.target.width || 0) / 2;

        const targetY =
            this.target.y + (this.target.height || 0) / 2;

        const halfWidth = this.width / (2 * this.zoom);
        const halfHeight = this.height / (2 * this.zoom);

        let desiredX = targetX;
        let desiredY = targetY;

        // Impedir que a câmera ultrapasse o mapa
        if (this.worldWidth > halfWidth * 2) {
            desiredX = Math.max(
                halfWidth,
                Math.min(this.worldWidth - halfWidth, desiredX)
            );
        } else {
            desiredX = this.worldWidth / 2;
        }

        if (this.worldHeight > halfHeight * 2) {
            desiredY = Math.max(
                halfHeight,
                Math.min(this.worldHeight - halfHeight, desiredY)
            );
        } else {
            desiredY = this.worldHeight / 2;
        }

        // Movimento suave
        this.x += (desiredX - this.x) * this.smoothing;
        this.y += (desiredY - this.y) * this.smoothing;
    }

    // Obter posição da câmera
    getPosition() {
        return {
            x: this.x,
            y: this.y,
            zoom: this.zoom
        };
    }

    // Verificar se objeto está visível
    isVisible(object) {
        const margin = 100;

        return (
            object.x + (object.width || 0) >=
                this.x - this.width / (2 * this.zoom) - margin &&

            object.x <=
                this.x + this.width / (2 * this.zoom) + margin &&

            object.y + (object.height || 0) >=
                this.y - this.height / (2 * this.zoom) - margin &&

            object.y <=
                this.y + this.height / (2 * this.zoom) + margin
        );
    }
}
