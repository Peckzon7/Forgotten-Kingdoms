
/**
 * FORGOTTEN KINGDOMS
 * Sistema de reconhecimento de toques
 */

export class TouchController {
    constructor(element) {
        this.element = element;

        this.touches = new Map();
        this.buttons = new Map();

        this.handleStart = this.handleStart.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.handleEnd = this.handleEnd.bind(this);

        element.addEventListener(
            "pointerdown", this.handleStart
        );

        element.addEventListener(
            "pointermove", this.handleMove
        );

        element.addEventListener(
            "pointerup", this.handleEnd
        );

        element.addEventListener(
            "pointercancel", this.handleEnd
        );
    }

    handleStart(event) {
        this.element.setPointerCapture?.(event.pointerId);

        this.touches.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY
        });
    }

    handleMove(event) {
        if (!this.touches.has(event.pointerId)) return;

        this.touches.set(event.pointerId, {
            x: event.clientX,
            y: event.clientY
        });
    }

    handleEnd(event) {
        this.touches.delete(event.pointerId);
    }

    registerButton(name, element) {
        const press = event => {
            event.preventDefault();
            this.buttons.set(name, true);
        };

        const release = () => {
            this.buttons.set(name, false);
        };

        element.addEventListener("pointerdown", press);
        element.addEventListener("pointerup", release);
        element.addEventListener("pointercancel", release);
        element.addEventListener("lostpointercapture", release);

        element.addEventListener("pointerleave", event => {
            if (event.buttons === 0) release();
        });
    }

    isPressed(name) {
        return this.buttons.get(name) === true;
    }

    getTouches() {
        return Array.from(this.touches.values());
    }

    destroy() {
        this.element.removeEventListener(
            "pointerdown", this.handleStart
        );

        this.element.removeEventListener(
            "pointermove", this.handleMove
        );

        this.element.removeEventListener(
            "pointerup", this.handleEnd
        );

        this.element.removeEventListener(
            "pointercancel", this.handleEnd
        );

        this.touches.clear();
        this.buttons.clear();
    }
}
