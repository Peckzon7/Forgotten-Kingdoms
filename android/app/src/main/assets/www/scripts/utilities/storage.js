export class Storage {
    static prefix = "forgotten_kingdoms_";

    static save(key, data) {
        try {
            const value = JSON.stringify(data);

            localStorage.setItem(
                this.prefix + key,
                value
            );

            return true;
        } catch (error) {
            console.error("Erro ao salvar:", error);
            return false;
        }
    }

    static load(key, fallback = null) {
        try {
            const value = localStorage.getItem(
                this.prefix + key
            );

            if (value === null) {
                return fallback;
            }

            return JSON.parse(value);
        } catch (error) {
            console.error("Erro ao carregar:", error);
            return fallback;
        }
    }

    static remove(key) {
        localStorage.removeItem(this.prefix + key);
    }

    static exists(key) {
        return localStorage.getItem(
            this.prefix + key
        ) !== null;
    }

    static clear() {
        const keys = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            if (key?.startsWith(this.prefix)) {
                keys.push(key);
            }
        }

        keys.forEach(key => localStorage.removeItem(key));
    }
}