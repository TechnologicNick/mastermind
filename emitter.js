// @ts-check

module.exports = class Emitter {

    constructor() {
        this.callbacks = {};
    }

    /**
     * @param {string | number} eventName
     * @param {(...args: any[]) => void} callback
     */
    on(eventName, callback) {
        (this.callbacks[eventName] ??= []).push(callback);
    }

    /**
     * @param {any} eventName
     * @param {any[]} args
     */
    emit(eventName, ...args) {
        for (const callback of this.callbacks[eventName] ?? []) {
            callback(...args);
        }
    }

}
