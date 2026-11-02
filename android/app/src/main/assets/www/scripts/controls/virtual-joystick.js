
/**
 * FORGOTTEN KINGDOMS
 * Joystick virtual para Android
 */

export class VirtualJoystick {
    constructor(element, options = {}) {
        this.element = element;

        this.maxDistance = options.maxDistance || 55;

        this.active = false;
        this.pointerId = null;

        this.center = { x: 0, y: 0 };
        this.position = { x: 0, y: 0 };

        this.direction = { x: 0, y: 0 };

        this.handle = options.handle || null;

        this.handleStart = this.handleStart.bind(this);
        this.handleMove = this.handleMove.bind(this);
        this.handleEnd = this.handleEnd.bind(this);

        element.style.touchAction = "none";

        element.addEventListener("pointerdown", this.handleStart);
        element.addEventListener("pointermove", this.handleMove);
        element.addEventListener("pointerup", this.handleEnd);
        element.addEventListener("pointercancel", this.handleEnd);
    }

    handleStart(event) {
        if (this.active) return;

        event.preventDefault();

        this.active = true;
        this.pointerId = event.pointerId;

        this.element.setPointerCapture(event.pointerId);

        const rect = this.element.getBoundingClientRect();

        this.center = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };

        this.handleMove(event);
    }

    handleMove(event) {
        if (!this.active || event.pointerId !== this.pointerId) {
            return;
        }

        event.preventDefault();

        let dx = event.clientX - this.center.x;
        let dy = event.clientY - this.center.y;

        const distance = Math.hypot(dx, dy);

        if (distance > this.maxDistance) {
            const scale = this.maxDistance / distance;

            dx *= scale;
            dy *= scale;
        }

        this.position = { x: dx, y: dy };

        this.direction = {
            x: dx / this.maxDistance,
            y: dy / this.maxDistance
        };

        if (this.handle) {
            this.handle.style.transform =
                `translate(${dx}px, ${dy}px)`;
        }
    }

    handleEnd(event) {
        if (event.pointerId !== this.pointerId) return;

        this.active = false;
        this.pointerId = null;

        this.position = { x: 0, y: 0 };
        this.direction = { x: 0, y: 0 };

        if (this.handle) {
            this.handle.style.transform = "translate(0px, 0px)";
        }
    }

    getDirection() {
        return { ...this.direction };
    }

    isActive() {
        return this.active;
    }

    destroy() {
        this.element.removeEventListener("pointerdown", this.handleStart);
        this.element.removeEventListener("pointermove", this.handleMove);
        this.element.removeEventListener("pointerup", this.handleEnd);
        this.element.removeEventListener("pointercancel", this.handleEnd);

        this.active = false;
        this.direction = { x: 0, y: 0 };
    }
}
