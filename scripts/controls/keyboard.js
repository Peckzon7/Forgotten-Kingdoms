
/**
 * FORGOTTEN KINGDOMS
 * Controles de teclado
 */

export class KeyboardController {
    constructor(inputManager) {
        this.input = inputManager;
    }

    getMovement() {
        return this.input.getMovement();
    }

    isMoving() {
        const movement = this.getMovement();

        return movement.x !== 0 || movement.y !== 0;
    }

    isRunning() {
        return this.input.isPressed("run");
    }

    isAttacking() {
        return this.input.isPressed("attack");
    }

    isDodging() {
        return this.input.isPressed("dodge");
    }

    isInteracting() {
        return this.input.isPressed("interact");
    }

    getCommands() {
        return {
            movement: this.getMovement(),
            running: this.isRunning(),
            attacking: this.isAttacking(),
            dodging: this.isDodging(),
            interacting: this.isInteracting()
        };
    }
}
