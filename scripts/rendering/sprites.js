
/**
 * FORGOTTEN KINGDOMS
 * Gerenciador de sprites
 */

export class SpriteManager {
    constructor() {
        this.sprites = new Map();
    }

    // Carregar uma imagem
    load(name, path) {
        return new Promise((resolve, reject) => {
            const image = new Image();

            image.onload = () => {
                this.sprites.set(name, image);
                resolve(image);
            };

            image.onerror = () => {
                reject(new Error(`Erro ao carregar sprite: ${path}`));
            };

            image.src = path;
        });
    }

    // Carregar vários sprites
    async loadAll(resources) {
        const results = await Promise.allSettled(
            Object.entries(resources).map(([name, path]) =>
                this.load(name, path)
            )
        );

        return results;
    }

    // Obter sprite
    get(name) {
        return this.sprites.get(name) || null;
    }

    // Verificar se existe
    has(name) {
        return this.sprites.has(name);
    }

    // Desenhar sprite
    draw(ctx, name, x, y, width, height) {
        const image = this.get(name);

        if (!image) return false;

        ctx.drawImage(image, x, y, width, height);

        return true;
    }

    // Desenhar parte de uma spritesheet
    drawFrame(ctx, name, frame, x, y, width, height) {
        const image = this.get(name);

        if (!image) return false;

        const frameWidth = frame.width;
        const frameHeight = frame.height;

        ctx.drawImage(
            image,
            frame.column * frameWidth,
            frame.row * frameHeight,
            frameWidth,
            frameHeight,
            x,
            y,
            width,
            height
        );

        return true;
    }

    // Remover sprite
    remove(name) {
        this.sprites.delete(name);
    }

    // Limpar todos
    clear() {
        this.sprites.clear();
    }
}
