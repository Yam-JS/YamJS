"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initialize = void 0;
const errors_1 = require("./errors");
const reload_1 = require("./reload");
const tasks_1 = require("./tasks");
const ticker_1 = require("./ticker");
const timers_1 = require("./timers");
let isInitialized = false;
const initialize = () => {
    console.log('Initializing YamJS...', isInitialized);
    if (isInitialized)
        return;
    ticker_1.ticker.start();
    tasks_1.tickerTasks.initialize();
    (0, timers_1.initializeTimers)();
    reload_1.reloadHandler.initialize();
    Yam.instance.setLoggerFn((error) => (0, errors_1.logError)(error));
    isInitialized = true;
};
exports.initialize = initialize;
if (Yam.getConfig().initialize) {
    (0, exports.initialize)();
}
