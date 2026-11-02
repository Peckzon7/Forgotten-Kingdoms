
/**
 * FORGOTTEN KINGDOMS
 * Sistema central de entrada
 */

export class InputManager {
    constructor() {
        this.keys = new Set();
        this.actions = new Map();
        this.enabled = true;

        this.bindings = {
            up: ["w", "arrowup"],
            down: ["s", "arrowdown"],
            left: ["a", "arrowleft"],
            right: ["d", "arrowright"],
            attack: ["j"],
            dodge: ["shift"],
            run: ["control"],
            interact: ["e"],
            inventory: ["i"],
            map: ["m"]
        };

        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);

        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);
    }

    handleKeyDown(event) {
        if (!this.enabled) return;

        const key = event.key.toLowerCase();

        this.keys.add(key);

        if (this.getAllKeys().includes(key)) {
            event.preventDefault();
        }
    }

    handleKeyUp(event) {
        this.keys.delete(event.key.toLowerCase());
    }

    getAllKeys() {
        return Object.values(this.bindings).flat();
    }

    isPressed(action) {
        if (!this.enabled) return false;

        const keys = this.bindings[action] || [];

        return keys.some(key => this.keys.has(key)) ||
            this.actions.get(action) === true;
    }

    setAction(action, pressed) {
        this.actions.set(action, Boolean(pressed));
    }

    getMovement() {
        return {
            x: Number(this.isPressed("right")) -
               Number(this.isPressed("left")),

            y: Number(this.isPressed("down")) -
               Number(this.isPressed("up"))
        };
    }

    setBinding(action, keys) {
        this.bindings[action] = keys.map(key => key.toLowerCase());
    }

    clear() {
        this.keys.clear();
        this.actions.clear();
    }

    setEnabled(value) {
        this.enabled = Boolean(value);

        if (!this.enabled) this.clear();
    }

    destroy() {
        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("keyup", this.handleKeyUp);

        this.clear();
    }
}
