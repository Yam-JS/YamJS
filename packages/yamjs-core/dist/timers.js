"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeTimers = void 0;
const errors_1 = require("./errors");
const tasks_1 = require("./tasks");
const baseTimer = (callback, delay, options) => {
    const modifier = delay / 50;
    return tasks_1.tickerTasks.add((0, errors_1.createCatchAndLogUnhandledErrorHandler)(callback, 'Unhandled timer'), modifier, options);
};
const setTimeout = (callback, delay) => baseTimer(callback, delay);
const setInterval = (callback, delay) => baseTimer(callback, delay, {
    reset: true,
});
const setImmediate = (callback) => setTimeout(callback, 0);
const clearTimeout = (id) => tasks_1.tickerTasks.remove(id);
const initializeTimers = () => {
    // @ts-expect-error
    globalThis.setTimeout = setTimeout;
    // @ts-expect-error
    globalThis.setInterval = setInterval;
    // @ts-expect-error
    globalThis.setImmediate = setImmediate;
    // @ts-ignore
    globalThis.clearTimeout = clearTimeout;
    // @ts-ignore
    globalThis.clearInterval = clearTimeout;
};
exports.initializeTimers = initializeTimers;
