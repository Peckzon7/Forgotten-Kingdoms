export const MathUtils = {
    clamp(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },

    lerp(start, end, amount) {
        return start + (end - start) * amount;
    },

    distance(x1, y1, x2, y2) {
        return Math.hypot(x2 - x1, y2 - y1);
    },

    random(min, max) {
        return Math.random() * (max - min) + min;
    },

    randomInt(min, max) {
        return Math.floor(
            Math.random() * (max - min + 1) + min
        );
    },

    normalize(x, y) {
        const length = Math.hypot(x, y);

        if (length === 0) {
            return { x: 0, y: 0 };
        }

        return {
            x: x / length,
            y: y / length
        };
    }
};