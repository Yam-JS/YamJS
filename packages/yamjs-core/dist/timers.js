"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yamInitializeTimers = void 0;
const tasks_1 = require("./tasks");
const baseTimer = (callback, delay, options) => {
    const modifier = delay / 50;
    return tasks_1.yamTickerTasks.add(() => {
        try {
            callback();
        }
        catch (err) {
            console.error('Unhandled timer', err);
        }
    }, modifier, options);
};
const yamSetTimeout = (callback, delay) => baseTimer(callback, delay);
const yamSetInterval = (callback, delay) => baseTimer(() => {
    callback();
}, delay, {
    reset: true,
});
const yamSetImmediate = (callback) => yamSetTimeout(callback, 0);
const yamClearTimeout = (id) => tasks_1.yamTickerTasks.remove(id);
const yamInitializeTimers = () => {
    // @ts-expect-error
    globalThis.setTimeout = yamSetTimeout;
    // @ts-expect-error
    globalThis.setInterval = yamSetInterval;
    // @ts-expect-error
    globalThis.setImmediate = yamSetImmediate;
    // @ts-ignore
    globalThis.clearTimeout = yamClearTimeout;
    // @ts-ignore
    globalThis.clearInterval = yamClearTimeout;
};
exports.yamInitializeTimers = yamInitializeTimers;
