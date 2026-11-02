export class Random {
    static number(min, max) {
        return Math.random() * (max - min) + min;
    }

    static integer(min, max) {
        return Math.floor(
            Math.random() * (max - min + 1) + min
        );
    }

    static chance(probability) {
        return Math.random() < probability;
    }

    static pick(array) {
        if (!array || array.length === 0) return null;

        return array[
            Math.floor(Math.random() * array.length)
        ];
    }

    static shuffle(array) {
        const result = [...array];

        for (let i = result.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));

            [result[i], result[j]] = [result[j], result[i]];
        }

        return result;
    }

    static boolean() {
        return Math.random() < 0.5;
    }
}