"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.yamInitialize = void 0;
const reload_1 = require("./reload");
const tasks_1 = require("./tasks");
const ticker_1 = require("./ticker");
const timers_1 = require("./timers");
let isInitialized = false;
const yamInitialize = () => {
    console.log('Initializing YamJS...', isInitialized);
    if (isInitialized)
        return;
    ticker_1.yamTicker.start();
    tasks_1.yamTickerTasks.initialize();
    (0, timers_1.yamInitializeTimers)();
    reload_1.yamReloadHandler.initialize();
    isInitialized = true;
};
exports.yamInitialize = yamInitialize;
if (Yam.getConfig().initialize) {
    (0, exports.yamInitialize)();
}
